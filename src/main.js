import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import { io } from 'socket.io-client';

const app = createApp(App)

app.config.globalProperties.$socket = io(process.env.VUE_APP_URL)

app.mount('#app')
