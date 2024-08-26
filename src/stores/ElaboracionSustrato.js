import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuario.js";

export const useElaboracionSustratoStore = defineStore('elaboracionSustrato', () => {  // Cambio del nombre del store a 'elaboracionSustrato'
    let loading = ref(false);
    let elaboracion = ref([]);
    const useUsuario = useUsuarioStore();

    const listarElaboracionSustrato = async () => {
        try {
            loading.value = true;
            const response = await axios.get('api/sustrato/listar', {
                headers: {
                    token: useUsuario.token
                }
            });
            elaboracion.value = response.data;
            return response;
        } catch (error) {
            console.error('Error al obtener lista de elaboración de sustrato:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const postElaboracionSustrato = async (data) => {
        try {
            loading.value = true;
            let res = await axios.post('api/sustrato/agregar', data, {
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
                message: error.response?.data?.errors?.[0]?.msg || 'Error inesperado al agregar sustrato.',
            });
            throw error;  // Lanzar el error para manejarlo en donde se llama la función
        } finally {
            loading.value = false;
        }
    };

    const putElaboracionSustrato = async (id, data) => {
        try {
            loading.value = true;
            let res = await axios.put(`api/sustrato/editar/${id}`, data, {
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
                message: error.response?.data?.errors?.[0]?.msg || 'Error inesperado al editar sustrato.',
            });
            throw error;
        } finally {
            loading.value = false;
        }
    };

    return { listarElaboracionSustrato, postElaboracionSustrato, putElaboracionSustrato, loading, elaboracion };

}, {
    persist: true
});
