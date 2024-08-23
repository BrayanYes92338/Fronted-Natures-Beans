import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuario.js";


export const useProcesoStore = defineStore('proceso', () => {
    let loading = ref(false);
    let procesos = ref([]);
    const useUsuario = useUsuarioStore();
    const listarProcesos = async () => {
        try {
            loading.value = true;
            const response = await axios.get('api/proceso/listar', {
                headers: {
                    token: useUsuario.token
                }
            })
            procesos.value = response.data;
            return response;
        } catch (error) {
            console.error(' Error al obtener lista de Procesos:', error)
            throw error
        } finally {
            loading.value = false;
        }
    }
    const postProcesos = async (data) => {
        try {
            loading.value = true;
            let res = await axios.post('api/proceso/agregar', data, {
                headers: {
                    token: useUsuario.token
                }
            })
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


    const putProcesos = async (id, data) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/proceso/editar/${id}`, data, {
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
    return { listarProcesos, postProcesos, putProcesos, loading, procesos }

}, {
    persist: true
})