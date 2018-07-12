<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\ChatEvent as ChatEvent;

class ChatController extends Controller
{
    function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        return view('chat');
    }

    public function send(Request $request)
    {
        event(new ChatEvent($request->get('message'), \Auth::user()));
        $this->saveToSession($request);
        return $request->all();
    }

    public function saveToSession(Request $request)
    {
        session()->put('chat', $request->chat);
    }

    public function getOldMessage()
    {
        return session('chat');
    }

    public function deleteSession(Request $request)
    {
        if (!session()->has($request->get('sessionName'))) {

            return response()->json(['code'=>404, 'msg'=>'Something wrong happened'], 404);

        }

        session()->forget($request->get('sessionName'));
    }
}
