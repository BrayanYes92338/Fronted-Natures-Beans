import { defineStore } from "pinia";
import { ref } from "vue";
import { Notify } from "quasar";
import { useUsuarioStore } from "./usuario.js";
import axios from "axios";

export const useProveedorStore = defineStore("proveedor",()=>{
    let loading = ref(false);
    let proveedor = ref({})
    const useUsuario = useUsuarioStore();

 const listarProveedor= async () => {
    try{
        loading.value = true;
        let res = await axios.get("api/proveedor/listar", {
            headers: {
                token: useUsuario.token
            }
        })
        proveedor.value = res.data;
        return res;
    } catch (error){
        console.error('Error al obtener la lista de proveedores', error);
        throw error;
    } finally {
        loading.value = false;
    } 
    }

    const listarProveedorActivo = async () => {
        try {
            loading.value = true
            let res = await axios.get("api/proveedor/activos", {
                headers: {
                    token: useUsuario.token
                }
            })
            proveedor.value = res.data;
            return res;

        } catch (error) {
            console.error('Error al obtener la lista de proveedores activos', error);
            throw error;

        } finally {
            loading.value = false
        }
    }  

    const listarProveedorInactivo = async () => {
        try {
            loading.value = true
            let res = await axios.get("api/proveedor/inactivos", {
                headers: {
                    token: useUsuario.token
                }
            })
            proveedor.value = res.data;
            return res;

        } catch (error) {
            console.error('Error al obtener la lista de proveedores inactivos', error);
            throw error;

        } finally {
            loading.value = false
        }
    } 

 const postProveedor = async (data) => {
    try {
        loading.value = true;
        let res = await axios.post("api/proveedor/agregar", data, {
            headers: {
                token: useUsuario.token
            }
        })
        return res;
    } catch (error){
        loading.value = true
        console.log(error);
        Notify.create({
            type: "negative",
            message: error.res.data.errors[0].msg,
        });
    }finally{
        loading.value = false;
    }
}

const putProveedor = async (id, data) => {
    try {
        loading.value = true;
        let r = await axios.put(`api/proveedor/editar/${id}`, data, {
            headers: {
                token: useUsuario.token
            }
        });
        return r;
    } catch (error){
        loading.value = true
        console.log(error);
        Notify.create({
            type: "negative",
            message: error.res.data.errors[0].msg,
        });
    }finally{
        loading.value = false;
    }
};

const putProveedorActivo = async (id) => {
    try {
        loading.value = true;
        let r = await axios.put(`api/proveedor/activar/${id}`, {}, {
            headers: {
                token: useUsuario.token
            }
        })
        return r;

    } catch (error){
        loading.value = true
        console.log(error);
        Notify.create({
            type: "negative",
            message: error.res.data.errors[0].msg,
        });
    }finally{
        loading.value = false;
    }
}
const putProveedorInactivo = async (id) => {
    try {
        loading.value = true;
        let r = await axios.put(`api/proveedor/desactivar/${id}`, {}, {
            headers: {
                token: useUsuario.token
            }
        })
        return r;

    } catch (error){
        loading.value = true
        console.log(error);
        Notify.create({
            type: "negative",
            message: error.res.data.errors[0].msg,
        });
    }finally{
        loading.value = false;
    }
}

return { listarProveedor, listarProveedorActivo, listarProveedorInactivo, postProveedor, putProveedor, putProveedorActivo, putProveedorInactivo, loading, proveedor }

},

{
    persist: true,
},
)

