import { createApp } from 'vue'
import { Quasar, Notify } from 'quasar'
import {router} from "./routes/routes.js"
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
import axios from "axios";
import Swal from 'sweetalert2';
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import App from './App.vue'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'
import './style.css'


//  <----Sitio para poner link generado de Glith ---->

axios.defaults.baseURL = "https://humble-intriguing-spinach.glitch.me"

// <----Sitio para poner link local---->
// axios.defaults.baseURL = "http://localhost:4500/"

let requestsPending = 0;

axios.interceptors.request.use((request) => {
  requestsPending++;

  if (requestsPending === 1) {
    Swal.fire({
      html: `
        <div class="my-custom-loading-content">
          <div class="imagen"></div>
          <div class="loading-text">Cargando...</div>
        </div>
      `,
      showConfirmButton: false,
      customClass: {
        popup: 'my-custom-popup'
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      

    });
  }

  return request;
});


axios.interceptors.response.use(
  function (response) {
    requestsPending--;

    if (requestsPending === 0) {
      Swal.close();
    }

    return response;
  },
  function (error) {
    requestsPending--;

    if (requestsPending === 0) {
      Swal.close();
    }

    if (error.response.status === 401) {
      router.push('/');
    }

    return Promise.reject(error);
  }
);

const myApp = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

myApp.use(router)
myApp.use(pinia)

myApp.use(FloatingVue)

myApp.use(Quasar,  {
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