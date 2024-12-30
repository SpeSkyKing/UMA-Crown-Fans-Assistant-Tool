<?php

namespace App\Http\Controllers\Api;

use App\Models\UserPersonal;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class UserPersonalController extends Controller
{
    public function regist(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_name' => ['required', 'string', 'unique:user_table'],
                'password' => ['required', 'string', 'min:7'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:user_table'],
                'phone' => ['required', 'string', 'max:255'],
                'birthday' => ['required', 'date'],
                'gender' => ['required', 'in:0,1,2'], 
                'address' => ['required', 'string', 'max:255'],
                'country' => ['required', 'string', 'max:255'],
                'role' => ['required','in:0,1'],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('バリデーションエラー:', $e->errors());
            return response()->json(['errors' => $e->errors()], 400);
        }

        $userImage = null;
        if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
            $userImage = $request->file('avatar')->store('public/image/userImage');
            $userImage = str_replace('public/', '', $userImage);
        }

        try {
            $user = new UserPersonal();
            $user->user_id = UserPersonal::max('user_id') + 1 ?: 1;
            $user->user_name = $validated['user_name'];
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
        } catch (\Exception $e) {
            Log::error('ユーザー登録エラー:', $e->getMessage());
            return response()->json(['error' => 'ユーザー登録エラー'], 500);
        }

        return response()->json([
            'message' => 'ユーザーが登録されました。',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request) 
    {
        $request->validate([
            'user_name' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = UserPersonal::where('user_name', $request->user_name)->first();

        if ($user && Hash::check($request->password, $user->password)) {

            $token = $user->createToken('UMA-Crown-Fans-Assistant-Tool')->plainTextToken;

            return response()->json([
                'message' => 'ログイン成功',
                'token' => $token,
            ], 200);
        }

        return response()->json(['message' => '認証失敗'], 401);
    }

    public function logout(Request $request)
    {
        Auth::user()->tokens->each(function ($token) {
            $token->delete();
        });

        return response()->json(['message' => 'ログアウトしました']);
    }

    public function getUserData(Request $request)
    {
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

        return response()->json(['data' => $user]);
    }
}
