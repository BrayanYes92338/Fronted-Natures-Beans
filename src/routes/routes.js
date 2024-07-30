import { createRouter, createWebHashHistory } from "vue-router";
import { useUsuarioStore } from '../stores/usuario';
import Login from '../components/Login.vue';
import Usuario from "../components/Usuarios.vue";
import Home from '../components/Home.vue';
import Menu from "../components/Menu.vue";
import Finca from "../components/Finca.vue"

const auth = (to, from, next) => {
    if (checkAuth()) {
        const userUsuario = useUsuarioStore();
        const rol = userUsuario.user.rol;
        console.log(rol);

        if (to.meta && to.meta.roles && !to.meta.roles.includes(rol)) {
            return next({ name: 'login' });
        }
        next();
    } else {
        return next({ name: 'login' });
    }
};


const checkAuth = () => {
    const useUsuario = useUsuarioStore();
    const token = useUsuario.token;
    console.log(token);
    if (!token) return false;
    return true;
};

const routes = [
    {
        path: "/", name: "login", component: Login
    },
    {
        path: "/home", component: Home, beforeEnter: auth, children: [
            { path: "/menu", component: Menu, beforeEnter: auth},
            { path: "/usuario", component: Usuario, beforeEnter: auth, meta: { roles: ['ADMIN'] } },
            { path: "/finca", component: Finca, beforeEnter: auth, meta: { roles: ['ADMIN', 'GESTOR'] } }
        ]
    },
];

export const router = createRouter({
    history: createWebHashHistory(),
    routes
});
