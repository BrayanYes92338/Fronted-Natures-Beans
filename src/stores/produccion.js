import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuario.js";


export const useProduccionStore = defineStore('produccion', () => {
    let loading = ref(false);
    let producciones = ref([]);
    const useUsuario = useUsuarioStore();
    
    const listarProduccion = async () => {
        try {
            loading.value = true;
            const response = await axios.get('api/produccion/listar', {
                headers: {
                    token: useUsuario.token
                }
            })
            producciones.value = response.data;
            return response;
        } catch (error) {
            console.error(' Error al obtener lista de Produccion:', error)
            throw error
        } finally {
            loading.value = false;
        }
    }
    const postProduccion = async (data) => {
        try {
            loading.value = true;
            let res = await axios.post('api/produccion/agregar', data, {
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


    const putProduccion = async (id, data) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/produccion/editar/${id}`, data, {
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
    return { listarProduccion, postProduccion, putProduccion, loading, producciones }

}, {
    persist: true
})