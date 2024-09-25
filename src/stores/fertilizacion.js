import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuario.js";

export const useFertilizacionStore = defineStore(
  "fert",
  () => {
    let loading = ref(false);
    let fertilizacion = ref([]);
    const useUsuario = useUsuarioStore();
    const listarFertilizacion = async () => {
      try {
        loading.value = true;
        const response = await axios.get("api/fertilizacion/listar", {
          headers: {
            token: useUsuario.token,
          },
        });
        fertilizacion.value = response.data;
        return response;
      } catch (error) {
        console.error(" Error al obtener lista de fertilizacion:", error);
        throw error;
      } finally {
        loading.value = false;
      }
    };
    const postFertilizacion = async (data) => {
      try {
        loading.value = true;
        let res = await axios.post("api/fertilizacion/agregar", data, {
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

    const putFertilizacion = async (id, data) => {
      try {
        loading.value = true;
        let r = await axios.put(`api/fertilizacion/editar/${id}`, data, {
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
    return { listarFertilizacion, postFertilizacion, putFertilizacion, loading, fertilizacion };
  },
  {
    persist: true,
  }
);
