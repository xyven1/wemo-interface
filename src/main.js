import {createApp} from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import { io } from 'socket.io-client';
import Vue3TouchEvents from 'vue3-touch-events'

const app = createApp(App)

app.use(Vue3TouchEvents)
app.config.globalProperties.$socket = io(process.env.VUE_APP_URL)

app.mount('#app')