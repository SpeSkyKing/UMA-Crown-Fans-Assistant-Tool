<?php

namespace App\Http\Controllers\Api;

use App\Models\UserPersonal;
use App\Models\UserHistory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Common\UmamusumeLog;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Jenssegers\Agent\Agent;
use Carbon\Carbon;

//レース関連のデータを取得するコントローラー
class UserPersonalController extends Controller
{
    //ログ記載用オブジェクト
    private UmamusumeLog $umamusumeLoger;
    
    //ログ属性用変数
    private string $logAttribute; 

    public function __construct()
    {
        $this->umamusumeLoger = new UmamusumeLog();
    }

    //ユーザーを登録するAPI
    // 引数 Request
    // 戻り値 JsonResponse
    public function regist( Request $request) : JsonResponse
    {
        $this->logAttribute = 'regist';

        $this->umamusumeLoger->logwrite(msg: 'start',attribute: $this->logAttribute);

        try {
            $validated = $request->validate([
                'userName' => ['required', 'string'],
                'password' => ['required', 'string', 'min:7'],
                'email' => ['nullable','string', 'email', 'max:255'],
                'phone' => ['nullable','string', 'max:255'],
                'birthday' => ['nullable','date'],
                'gender' => ['required', 'in:0,1,2'], 
                'address' => ['nullable','string', 'max:255'],
                'country' => ['nullable','string', 'max:255'],
                'role' => ['required','in:0,1'],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            $this->umamusumeLoger->logwrite(msg: 'error',attribute:$this->logAttribute.':'.$e);
            return response()->json(['errors' => $e->errors()], 400);
        }

        $userImage = null;

        if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
            $userImage = $request->file('avatar')->storeAs('image/userImage', $request->file('avatar')->hashName(), 'public');
        }

        try {
            $user = new UserPersonal();
            $user->user_id = UserPersonal::max('user_id') + 1 ?: 1;
            $user->user_name = $validated['userName'];
            $user->password = Hash::make($validated['password']);
            $user->email = $validated['email'];
            $user->phone_number = $validated['phone'];
            $user->user_image = basename(path: $userImage);
            $user->birthday = $validated['birthday'];
            $user->gender = $validated['gender'];
            $user->location = $validated['address'];
            $user->country = $validated['country'];
            $user->state = true;
            $user->role = $validated['role'];
            $user->save();
        } catch (\Exception $e) {
            $this->umamusumeLoger->logwrite(msg: 'error',attribute:$this->logAttribute.':'.$e);
            $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);
            return response()->json(['error' => 'ユーザー登録エラー'], 500);
        }

        $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);

        return response()->json([
            'message' => 'ユーザーが登録されました。',
            'user' => $user,
        ], 201);
    }

    //ログインのためのAPI
    // 引数 Request
    // 戻り値 JsonResponse
    public function login( Request $request) : JsonResponse
    {
        $this->logAttribute = 'login';

        $this->umamusumeLoger->logwrite(msg: 'start',attribute: $this->logAttribute);

        $request->validate([
            'userName' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = UserPersonal::where('user_name', $request->userName)->first();

        if(is_null(value: $user)){
            return response()->json(['message' => 'ユーザーが見つかりません。'], 401);
        }

        if ($user && Hash::check($request->password, $user->password)) {

            $token = $user->createToken('UMA-Crown-Fans-Assistant-Tool')->plainTextToken;

            try{
                $agent = new Agent();
                $loginIp = request()->ip();
                $userHistory = new UserHistory();
                $userHistory->user_id = $user->user_id;
                $userHistory->login_date = Carbon::now()->toDateString();
                $userHistory->login_time = Carbon::now()->toTimeString();
                $userHistory->login_ip = $loginIp;
                $userHistory->login_os = $agent->platform();
                $userHistory->login_browser = $agent->browser();
                $userHistory->login_device = $agent->isDesktop() ? 'Desktop' : ($agent->isTablet() ? 'Tablet' : ($agent->isMobile() ? 'Mobile' : 'Unknown'));
                $userHistory->login_rendering_engine = $agent->getUserAgent(); 
                
                $userHistory->save();
            } catch (\Exception $e) {
                $this->umamusumeLoger->logwrite(msg: 'error',attribute:$this->logAttribute.':'.$e);
                $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);
                return response()->json(['error' => 'ユーザー履歴登録エラー'], 500);
            }

            $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);

            return response()->json([
                'message' => 'ログイン成功',
                'token' => $token,
            ], 200);
        }else{
            $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);
            return response()->json(['message' => 'パスワードが違います。'], 401);
        }
    }

    //ログアウトのためのAPI
    // 引数
    // 戻り値 JsonResponse
    public function logout() : JsonResponse
    {
        $this->logAttribute = 'logout';

        $this->umamusumeLoger->logwrite(msg: 'start',attribute: $this->logAttribute);

        Auth::user()->tokens->each(function ($token): void {
            $token->delete();
        });

        $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);

        return response()->json(['message' => 'ログアウトしました']);
    }

    //ログイン中のユーザー情報を取得するAPI
    // 引数
    // 戻り値 JsonResponse
    public function getUserData() : JsonResponse
    {
        $this->logAttribute = 'getUserData';

        $this->umamusumeLoger->logwrite(msg: 'start',attribute: $this->logAttribute);

        $user = Auth::user()->only([
            'user_name',
            'email',
            'phone_number',
            'user_image',
            'birthday',
            'gender',
            'location',
            'country',
            'state',
            'role'
        ]);;

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $this->umamusumeLoger->logwrite(msg: 'end',attribute: $this->logAttribute);

        return response()->json(['data' => $user]);
    }
}
