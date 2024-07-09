import { createRouter, createWebHashHistory } from "vue-router"
import Login from '../components/Login.vue'
import Usuario from "../components/Usuarios.vue"
import Home from '../components/Home.vue'
import Menu from "../components/Menu.vue"




const routes = [

    {
        path: "/", name: "login", component: Login
    },

    {
        path: "/home", component: Home, children: [
            { path: "/menu", component: Menu }, 
            { path: "/usuario", component: Usuario },
            
        ]
    },


];

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})