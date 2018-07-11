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
        return $request->all();
    }
}
