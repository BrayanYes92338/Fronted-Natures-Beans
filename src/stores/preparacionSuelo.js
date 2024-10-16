import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuario.js";

export const usePreparacionSueloStore = defineStore(
  "preparacion",
  () => {
    let loading = ref(false);
    let preparacion = ref([]);
    const useUsuario = useUsuarioStore();

    const listarPreparacionSuelo = async () => {
      try {
        loading.value = true;
        const response = await axios.get("api/preparacion/listar", {
          headers: {
            token: useUsuario.token,
          },
        });
        preparacion.value = response.data;
        return response;
      } catch (error) {
        console.error(" Error al obtener lista de Preparacion Suelo:", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };
    
    const postPreparacionSuelo = async (data) => {
      try {
        loading.value = true;
        let res = await axios.post("api/preparacion/agregar", data, {
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

    const putPreparacionSuelo = async (id, data) => {
      try {
        loading.value = true;
        const r = axios.put(`api/preparacion/editar/${id}`, data, {
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
          message: error.response.data.errors[0].msg,
        });
      } finally {
        loading.value = false;
      }
    };

   
    return {
      listarPreparacionSuelo,
      postPreparacionSuelo,
      putPreparacionSuelo,
      loading,
      preparacion,
    };
  },
  {
    persist: true,
  }
);