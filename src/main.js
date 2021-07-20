import {createApp} from 'vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import './registerServiceWorker'
import { io } from 'socket.io-client';

const app = createApp(App)

app.use(vuetify)
app.config.globalProperties.$socket = io(process.env.VUE_APP_URL)

app.mount('#app')