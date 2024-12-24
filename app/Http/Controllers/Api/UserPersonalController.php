<?php

namespace App\Http\Controllers\Api;

use App\Models\UserPersonal;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserPersonalController extends Controller
{
    public function regist(Request $request)
    {
        try{
            $validated = $request->validate([
                'user_id' => ['required', 'string', 'unique:user_table'],
                'password' => ['required', 'string', 'min:7'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:user_table'],
                'phone' => ['required', 'string', 'max:255'],
                'birthday' => ['required', 'date'],
                'gender' => ['required', 'in:0,1,2'], 
                'address' => ['required', 'string', 'max:255'],
                'country' => ['required', 'string', 'max:255'],
                'role' => ['required','in:0,1'],
            ]);
        }catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('バリデーションエラー:', $e->errors());
            return response()->json(['errors' => $e->errors()], 400);
        }

        $userImage = null;
        if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
            $userImage = $request->file('avatar')->store('public/image/userImage');
            $userImage = str_replace('public/', '', $userImage);
        }

        try{
            $user = new UserPersonal();
            $user->user_id = $validated['user_id'];
            $user->password = Hash::make($validated['password']);
            $user->email = $validated['email'];
            $user->phone_number = $validated['phone'];
            $user->user_image = $userImage;
            $user->birthday = $validated['birthday'];
            $user->gender = $validated['gender'];
            $user->location = $validated['address'];
            $user->country = $validated['country'];
            $user->state = true;
            $user->role = $validated['role'];
            $user->save();
        }catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('ユーザー登録エラー:', $e->errors());
            return response()->json(['errors' => $e->errors()], 400);
        }

        return response()->json([
            'message' => 'ユーザーが登録されました。',
            'user' => $user,
        ], 201);
    }
    public function login(Request $request) {
        $request->validate([
            'user_id' => 'required|string',
            'password' => 'required|string',
        ]);


        $user = UserPersonal::where('user_id', $request->user_id)->first();

        if ($user && Hash::check($request->password, $user->password)) {

            Auth::login($user);

            return response()->json(['message' => 'ログイン成功'], 200);
        }

        return response()->json(['message' => '認証失敗'], 401);
    }
}
