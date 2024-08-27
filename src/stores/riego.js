import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuario.js";

export const useRiegoStore = defineStore('riego', () => {
    let loading = ref(false);
    let riegos = ref([]);
    const useUsuario = useUsuarioStore();

    const listarRiegos = async () => {
        try {
            loading.value = true;
            const response = await axios.get('api/riego/listar', {
                headers: {
                    token: useUsuario.token
                }
            });
            riegos.value = response.data;
            return response;
        } catch (error) {
            console.error('Error al obtener lista de Riegos:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const postRiegos = async (data) => {
        try {
            loading.value = true;
            let res = await axios.post('api/riego/agregar', data, {
                headers: {
                    token: useUsuario.token
                }
            });
            return res;
        } catch (error) {
            loading.value = false;  // Asegurar que se desactiva el loading en caso de error
            console.log(error);
            Notify.create({
                type: "negative",
                message: error.response?.data?.errors?.[0]?.msg || 'Error inesperado al agregar riego.',
            });
            throw error;  // Es buena práctica lanzar el error para manejarlo en donde se llama la función
        } finally {
            loading.value = false;
        }
    };

    const putRiegos = async (id, data) => {
        try {
            loading.value = true;
            let res = await axios.put(`api/riego/editar/${id}`, data, {
                headers: {
                    token: useUsuario.token
                }
            });
            return res;
        } catch (error) {
            loading.value = false;  // Asegurar que se desactiva el loading en caso de error
            console.log(error);
            Notify.create({
                type: "negative",
                message: error.response?.data?.errors?.[0]?.msg || 'Error inesperado al editar riego.',
            });
            throw error;
        } finally {
            loading.value = false;
        }
    };

    return { listarRiegos, postRiegos, putRiegos, loading, riegos };

}, {
    persist: true
});
