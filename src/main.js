import { createApp } from 'vue'
import { Quasar, Notify } from 'quasar'
import {router} from "./routes/routes.js"
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
import axios from 'axios'
import Swal from 'sweetalert2'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import App from './App.vue'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

axios.defaults.baseURL = "http://localhost:4500/"

const myApp = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

myApp.use(router)
myApp.use(pinia)

myApp.use(FloatingVue)

myApp.use(Quasar, {
  plugins: { Notify },
  config: {
    notify: {
      position: 'top',
      timeout: 2500,
      textColor: 'white',
      actions: [{ icon: 'close', color: 'white' }],
      color:"red"
    },
  }, 
})


myApp.mount('#app')