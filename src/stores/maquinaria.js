import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuario.js";


export const useMaquinariaStore = defineStore('riego', () => {
    let loading = ref(false);
    let maquinaria = ref([]);
    const useUsuario = useUsuarioStore();
    const listarMaquinaria = async () => {
        try {
            loading.value = true;
            const response = await axios.get('api/maquinariaHerramientas/listar', {
                headers: {
                    token: useUsuario.token
                }
            })
            maquinaria.value = response.data;
            return response;
        } catch (error) {
            console.error(' Error al obtener lista de elaboracion susatrato:', error)
            throw error
        } finally {
            loading.value = false;
        }
    }
    const postMaquinaria= async (data) => {
        try {
            loading.value = true;
            let res = await axios.post('api/maquinariaHerramientas/agregar', data, {
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


    const putMaquinaria= async (id, data) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/maquinariaHerramientas/editar/${id}`, data, {
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
    return { listarMaquinaria, postMaquinaria, putMaquinaria, loading, maquinaria }

}, {
    persist: true
})