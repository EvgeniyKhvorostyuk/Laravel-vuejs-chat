<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('chat', 'ChatController@index')->name('chat.index');
Route::post('send', 'ChatController@send')->name('chat.send');
Route::post('/saveToSession', 'ChatController@saveToSession')->name('chat.saveToSession');
Route::post('/deleteSession', 'ChatController@deleteSession')->name('chat.deleteSession');
Route::match(['get', 'post'], '/getOldMessage', 'ChatController@getOldMessage')->name('chat.getOldMessage');

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
