import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuario.js";


export const useSemillaStore = defineStore('semilla', () => {
    let loading = ref(false);
    let semilla = ref([]);
    const useUsuario = useUsuarioStore();
    const listarSemilla = async () => {
        try {
            loading.value = true;
            const response = await axios.get('api/semilla/listar', {
                headers: {
                    token: useUsuario.token
                }
            })
            semilla.value = response.data;
            return response;
        } catch (error) {
            console.error(' Error al obtener lista de semillas:', error)
            throw error
        } finally {
            loading.value = false;
        }
    }

    let listarSemillaActiva = async () => {
  
        try {
          let res = await axios.get("api/semilla/activos",{
            headers: {
              token: useUsuario.token
            },
          });
        semilla.value = res.data
        return res   
          
        } catch (error) {
          console.log(error);
          return error;
        }
      }

      let listarSemillaInactiva = async () => {

        try {
          let res = await axios.get("api/semilla/inactivos",{
            headers: {
              token: useUsuario.token

            },
          });
          semilla.value = res.data
          return res   
        } catch (error) {
          console.log(error);
          return error;
        }
      }

    const postSemilla = async (data) => {
      try {
        loading.value = true;
        let res = await axios.post("api/semilla/agregar", data, {
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


    const putSemilla= async (id, data) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/semilla/editar/${id}`, data, {
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
    }

    const putSemillaActiva = async (id) => {
        try {
            loading.value = true;
            let r = await axios.put(`/api/semilla/activar/${id}`, {}, {
                headers: {
                    token: useUsuario.token
                }
            })
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
    }

    const putSemillaDesactivar = async (id) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/semilla/desactivar/${id}`, {}, {
                headers: {
                    token: useUsuario.token
                }
            })
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
    }
    return { listarSemilla, listarSemillaActiva, listarSemillaInactiva, postSemilla, putSemilla,putSemillaActiva, putSemillaDesactivar, loading, semilla }

}, {
    persist: true
})