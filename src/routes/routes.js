import { createRouter, createWebHashHistory } from "vue-router";
import { useUsuarioStore } from '../stores/usuario';
import Login from '../components/Login.vue';
import Usuario from "../components/Usuarios.vue";
import Home from '../components/Home.vue';
import Menu from "../components/Menu.vue";
import Finca from "../components/Finca.vue";
import Proveedor from "../components/Proveedor.vue";
import Clima from "../components/Clima.vue";
import Empleado from "../components/Empleado.vue";
import Parcela from "../components/Parcelas.vue";
import Cultivo from "../components/Cultivo.vue";
import Riego from "../components/Riego.vue";
import Produccion from "../components/Produccion.vue";
import Comprador from "../components/Comprador.vue";
import Proceso from "../components/Proceso.vue";
import Insumo from "../components/Insumo.vue";
import CambioContra from "../components/CambioContra.vue";
import ElaboracionSustrato from "../components/ElaboracionSustrato.vue";
import Maquinaria from "../components/Maquinaria.vue";
import ControlPlaga from "../components/ControlPlaga.vue";







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
    { path: "/", name: "login", component: Login },
    {
        path: "/home", component: Home, beforeEnter: auth, children: [
            { path: "/menu", component: Menu, beforeEnter: auth },
            { path: "/usuario", component: Usuario, beforeEnter: auth, meta: { roles: ['ADMIN', 'GESTOR'] } },
            { path: "/finca", component: Finca, beforeEnter: auth, meta: { roles: ['ADMIN', 'GESTOR'] } },
            { path: "/proveedor", component: Proveedor, beforeEnter: auth, meta: { roles: ['ADMIN', 'GESTOR'] } },
            { path: "/clima", component: Clima, beforeEnter: auth, meta: { roles: ['ADMIN', 'GESTOR'] } },
            { path: "/empleado", component: Empleado, beforeEnter: auth, meta: { roles: ['ADMIN', 'GESTOR'] }},
            { path: "/parcela", component: Parcela, beforeEnter: auth, meta: { roles: ['ADMIN', 'GESTOR'] } },
            { path: "/cultivo", component: Cultivo, beforeEnter: auth, meta: { roles: ['ADMIN', 'GESTOR'] } },
            { path: "/riego", component: Riego, beforeEnter: auth, meta: { roles: ['ADMIN', 'GESTOR'] } },
            { path: "/produccion", component: Produccion, beforeEnter: auth, meta: { roles: ['ADMIN', 'GESTOR'] } },
            { path: "/comprador", component: Comprador, beforeEnter: auth, meta: { roles: ['ADMIN', 'GESTOR'] } },
            { path: "/proceso", component: Proceso, beforeEnter: auth, meta: { roles: ['ADMIN', 'GESTOR'] } },
            { path: "/elaboracionSustrato", component: ElaboracionSustrato, beforeEnter: auth, meta: { roles: ['ADMIN', 'GESTOR'] } },
            { path: "/maquinaria", component: Maquinaria, beforeEnter: auth, meta: { roles: ['ADMIN', 'GESTOR'] } },
            { path: "/controlPlaga", component: ControlPlaga, beforeEnter: auth, meta: { roles: ['ADMIN', 'GESTOR'] } },
            {path: "/insumo", component: Insumo, beforeEnter: auth, meta: { roles: ['ADMIN', 'GESTOR'] } }
        ]   

    },
    { path: "/actualizar", component: CambioContra } 
];

export const router = createRouter({
    history: createWebHashHistory(),
    routes
});
