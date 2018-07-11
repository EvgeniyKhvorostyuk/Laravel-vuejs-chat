<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="{{asset('css/app.css')}}">
    <style>
        .list-group {
            overflow-y: auto;
            height: 200px;
        }
    </style>
    <title>Document</title>
</head>
<body>
    
    <div class="container">
        <div class="row" id="app">
            <div class="offset-4 col-4">
                <li class="list-group-item active">Chat room</li>
                <ul class="list-group" v-chat-scroll>
                    <message v-for="value in chat.message" :key="value.id" color="warning">@{{value}}</message>
                </ul>
                <input type="text" class="form-control" placeholder="Type something" v-model="message" @keyup.enter="send">
            </div>
        </div>
    </div>

    <script type="text/javascript" src=" {{asset('js/app.js')}} "></script>
</body>
</html>