require('./bootstrap');

window.Vue = require('vue');
import Vue from 'vue';
import VueChatScroll from 'vue-chat-scroll';
Vue.use(VueChatScroll);

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
                    message: this.message
                }).then(response => {

                    console.log(response);
                    this.message = '';

                }).catch(error => {
                    console.log(error);
                });

            }
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
        Echo.private('chat').listen('ChatEvent', (e) => {
            this.chat.message.push(e.message);
            this.chat.user.push(e.user);
            this.chat.color.push('warning');
            this.chat.time.push(this.getTime());
        })
        .listenForWhisper('typing', (e) => {
            if (e.data != '') {
                this.typing = 'typing...';
            } else {
                this.typing = '';
            }
        })

        Echo.join('chat').here((users) => {
            this.usersNumber = users.length;
        })
        .joining((user) => {
            this.usersNumber  ++;
        })
        .leaving((user) => {
            this.usersNumber --;
        })
    }
});
