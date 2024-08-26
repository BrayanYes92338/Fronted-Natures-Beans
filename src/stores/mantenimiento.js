import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuario.js";


export const useMantenimientoStore = defineStore('riego', () => {
    let loading = ref(false);
    let mantenimiento = ref([]);
    const useUsuario = useUsuarioStore();

    const listarMaquinaria = async () => {
        try {
            loading.value = true;
            const response = await axios.get('api/maquinariaHerramientas/listar', {
                headers: {
                    token: useUsuario.token
                }
            })
            mantenimiento.value = response.data;
            return response;
        } catch (error) {
            console.error(' Error al obtener lista de elaboracion susatrato:', error)
            throw error
        } finally {
            loading.value = false;
        }
    }
    const listarMantenimiento= async () => {
        try {
            loading.value = true;
            const response = await axios.get('api/mantenimiento/listar', {
                headers: {
                    token: useUsuario.token
                }
            })
            mantenimiento.value = response.data;
            return response;
        } catch (error) {
            console.error(' Error al obtener lista de elaboracion susatrato:', error)
            throw error
        } finally {
            loading.value = false;
        }
    }
    const postMantenimiento= async (data) => {
        try {
            loading.value = true;
            let res = await axios.post('api/mantenimiento/agregar', data, {
                headers: {
                    token: useUsuario.token
                }
            })
            console.log(data);
            
            return res;
        } catch (error) {
            loading.value = true
            console.log(error);
            Notify.create({
                type: "negative",
                message: error.response.data.errors[0].msg,
            });
        } finally {
            loading.value = false;
        }
    }

    const listarMantenimientoActivos = async () => {
        try {
            loading.value = true
            let res = await axios.get("api/mantenimiento/activos", {
                headers: {
                    token: useUsuario.token
                }
            })
            mantenimiento.value = res.data;
            return res;

        } catch (error) {
            console.error('Error al obtener la lista de proveedores activos', error);
            throw error;

        } finally {
            loading.value = false
        }
    }  

    const listarMantenimientoInactivos = async () => {
        try {
            loading.value = true
            let res = await axios.get("api/mantenimiento/inactivos", {
                headers: {
                    token: useUsuario.token
                }
            })
            mantenimiento.value = res.data;
            
            return res;

        } catch (error) {
            console.error('Error al obtener la lista de proveedores inactivos', error);
            throw error;

        } finally {
            loading.value = false
        }
    } 
    const putMantenimiento= async (id, data) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/mantenimiento/editar/${id}`, data, {
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
    
const putMantenimientoActivo = async (id) => {
    try {
        loading.value = true;
        let r = await axios.put(`api/mantenimiento/activar/${id}`, {}, {
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
const putMantenimientoInactivo = async (id) => {
    try {
        loading.value = true;
        let r = await axios.put(`api/mantenimiento/desactivar/${id}`, {}, {
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
    return { listarMaquinaria,listarMantenimiento,listarMantenimientoActivos,listarMantenimientoInactivos, postMantenimiento, putMantenimiento,putMantenimientoActivo,putMantenimientoInactivo, loading, mantenimiento }

}, {
    persist: true
})