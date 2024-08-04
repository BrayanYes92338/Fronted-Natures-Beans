import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuario.js";


export const useClimaStore = defineStore('clima', () => {
    let loading = ref(false);
    let climas = ref([]);
    const useUsuario = useUsuarioStore();
    const listarClimas = async () => {
        try {
            loading.value = true;
            const response = await axios.get('api/clima/listar', {
                headers: {
                    token: useUsuario.token
                }
            })
            climas.value = response.data;
            return response;
        } catch (error) {
            console.error(' Error al obtener lista de Climas:', error)
            throw error
        } finally {
            loading.value = false;
        }
    }
    const postClimas = async (data) => {
        try {
            loading.value = true;
            let res = await axios.post('api/clima/agregar', data, {
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

    return { listarClimas, postClimas, loading, climas }

}, {
    persist: true
})