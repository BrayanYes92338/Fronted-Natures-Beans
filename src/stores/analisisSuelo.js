import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuario.js";

export const useAnalisisSueloStore = defineStore(
  "analisis",
  () => {
    let loading = ref(false);
    let analisis = ref([]);
    const useUsuario = useUsuarioStore();
    const listarAnalisis = async () => {
      try {
        loading.value = true;
        const response = await axios.get("api/analisis/listar", {
          headers: {
            token: useUsuario.token,
          },
        });
        analisis.value = response.data;
        return response;
      } catch (error) {
        console.error(" Error al obtener lista de Analisis de Suleos:", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };
    const postAnalisis = async (data) => {
      try {
        loading.value = true;
        let res = await axios.post("api/analisis/agregar", data, {
          headers: {
            token: useUsuario.token,
          },
        });
        return res;
      } catch (error) {
        loading.value = true;
        console.log(error);
        Notify.create({
          type: "negative",
          message: error.response.data.errors[0].msg,
        });
      } finally {
        loading.value = false;
      }
    };

    const putAnalisis = async (id, data) => {
      try {
        loading.value = true;
        let r = await axios.put(`api/analisis/editar/${id}`, data, {
          headers: {
            token: useUsuario.token,
          },
        });
        return r;
      } catch (error) {
        loading.value = true;
        console.log(error);
        Notify.create({
          type: "negative",
          message: error.res.data.errors[0].msg,
        });
      } finally {
        loading.value = false;
      }
    };
    return { listarAnalisis, postAnalisis, putAnalisis, loading, analisis };
  },
  {
    persist: true,
  }
);
