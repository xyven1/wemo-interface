import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import { io } from 'socket.io-client';

const app = createApp(App)

app.config.globalProperties.$socket = io('http://10.200.10.195:3000')

app.mount('#app')
