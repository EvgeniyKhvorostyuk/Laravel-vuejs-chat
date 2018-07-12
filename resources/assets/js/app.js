require('./bootstrap');

window.Vue = require('vue');

import Vue from 'vue'

// for autoscroll
import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)

// for notifications
import Toaster from 'v-toaster'
import 'v-toaster/dist/v-toaster.css'
Vue.use(Toaster, {timeout: 5000})

Vue.component('message', require('./components/message.vue'));

const app = new Vue({
    el: '#app',
    data: {
        message: '',
        chat: {
            message: [],
            user: [],
            color: [],
            time: []
        },
        typing: '',
        usersNumber: 0
    },
    methods: {
        send() {
            if (this.message.length != 0) {
                this.chat.message.push(this.message);
                this.chat.color.push('success');
                this.chat.user.push({name: 'you'});
                this.chat.time.push(this.getTime());

                axios.post('/send', {
                    message: this.message,
                    chat: this.chat
                }).then(response => {

                    console.log(response);
                    this.message = '';

                }).catch(error => {
                    console.log(error);
                });

            }
        },
        getOldMessages() {
            axios.post('/getOldMessage')
            .then(response => {
                console.log(response);
                if (response.data != '') {
                    this.chat = response.data;
                }
            })
            .catch(error => {
                console.log(error);
            });
        },
        deleteSession() {
            axios.post('deleteSession', {
                sessionName: 'chat'
            })
            .then(response => {
                this.chat = {
                    message: [],
                    user: [],
                    color: [],
                    time: []
                }
                this.$toaster.info('Chat history has been cleared')
            })
            .catch(error => {
                this.$toaster.error(error.response.data.msg);
            });
        },
        getTime() {
            let time = new Date();
            return time.getHours()+':'+time.getMinutes();
        }
    },
    watch: {
        message() {
            Echo.private('chat').whisper('typing', {
                data: this.message
            });
        }
    },
    mounted() {
        this.getOldMessages();
        Echo.private('chat').listen('ChatEvent', (e) => {
            this.chat.message.push(e.message);
            this.chat.user.push(e.user);
            this.chat.color.push('warning');
            this.chat.time.push(this.getTime());

            axios.post('/saveToSession', {
                chat: this.chat
            })
            .then(response => {})
            .catch(error => {
                console.log(error);
            });
        })
        .listenForWhisper('typing', (e) => {
            if (e.data != '') {
                this.typing = 'typing...';
            } else {
                this.typing = '';
            }
        });
        Echo.join('chat').here((users) => {
            this.usersNumber = users.length;
        })
        .joining((user) => {
            this.usersNumber++;
            this.$toaster.success(user.name+' is joined the chat room');
        })
        .leaving((user) => {
            this.usersNumber--;
            this.$toaster.warning(user.name+' has leaved the chat room');
        });
    }
});
