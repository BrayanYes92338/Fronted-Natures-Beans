import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuario.js";

export const useMaquinariaStore = defineStore('maquinaria', () => {  // Cambio del nombre del store a 'maquinaria'
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
            });
            maquinaria.value = response.data;
            return response;
        } catch (error) {
            console.error('Error al obtener lista de maquinaria:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const postMaquinaria = async (data) => {
        try {
            loading.value = true;
            let res = await axios.post('api/maquinariaHerramientas/agregar', data, {
                headers: {
                    token: useUsuario.token
                }
            });
            return res;
        } catch (error) {
            loading.value = false;  // Corregido: loading.value debe ser false en caso de error
            console.log(error);
            Notify.create({
                type: "negative",
                message: error.response?.data?.errors?.[0]?.msg || 'Error inesperado al agregar maquinaria.',
            });
            throw error;  // Lanzar el error para manejarlo en donde se llama la función
        } finally {
            loading.value = false;
        }
    };

    const putMaquinaria = async (id, data) => {
        try {
            loading.value = true;
            let res = await axios.put(`api/maquinariaHerramientas/editar/${id}`, data, {
                headers: {
                    token: useUsuario.token
                }
            });
            return res;
        } catch (error) {
            loading.value = false;  // Corregido: loading.value debe ser false en caso de error
            console.log(error);
            Notify.create({
                type: "negative",
                message: error.response?.data?.errors?.[0]?.msg || 'Error inesperado al editar maquinaria.',
            });
            throw error;
        } finally {
            loading.value = false;
        }
    };

    return { listarMaquinaria, postMaquinaria, putMaquinaria, loading, maquinaria };

}, {
    persist: true
});
