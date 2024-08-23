import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuario.js";


export const useControlPlagaStore = defineStore('control', () => {
    let loading = ref(false);
    let ControlPlaga = ref([]);
    const useUsuario = useUsuarioStore();
    const listarControlPlaga= async () => {
        try {
            loading.value = true;
            const response = await axios.get('api/controlPlaga/listar', {
                headers: {
                    token: useUsuario.token
                }
            })
            ControlPlaga.value = response.data;
            return response;
        } catch (error) {
            console.error(' Error al obtener lista de ControlPlaga:', error)
            throw error
        } finally {
            loading.value = false;
        }
    }
    const postcontrolPlaga = async (data) => {
        try {
            loading.value = true;
            let res = await axios.post('api/controlPlaga/agregar', data, {
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
                message:"error",
            });
        } finally {
            loading.value = false;
        }
    }


    const putcontrolPlaga = async (id, data) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/controlPlaga/editar/${id}`, data, {
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
    return { listarControlPlaga, postcontrolPlaga, putcontrolPlaga, loading, ControlPlaga }

}, {
    persist: true
})