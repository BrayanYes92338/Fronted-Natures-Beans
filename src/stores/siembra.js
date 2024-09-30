import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuario.js";


export const useSiembraStore = defineStore('siembra', () => {
    let loading = ref(false);
    let siembra = ref([]);
    const useUsuario = useUsuarioStore();
    const listarSiembra = async () => {
        try {
            loading.value = true;
            const response = await axios.get('api/siembra/listar', {
                headers: {
                    token: useUsuario.token
                }
            })
            siembra.value = response.data;
            return response;
        } catch (error) {
            console.error(' Error al obtener lista de siembra:', error)
            throw error
        } finally {
            loading.value = false;
        }
    }

    let listarSiembraActiva = async () => {
  
        try {
          let res = await axios.get("api/siembra/activos",{
            headers: {
              token: useUsuario.token
            },
          });
          
          console.log(res);
          return res.data;
        } catch (error) {
          console.log(error);
          return error;
        }
      }

      let listarSiembraInactiva = async () => {

        try {
          let res = await axios.get("api/siembra/inactivos",{
            headers: {
              token: useUsuario.token

            },
          });
          console.log(res);
          return res.data;
        } catch (error) {
          console.log(error);
          return error;
        }
      }

    const postSiembra = async (data) => {
      try {
        loading.value = true;
        let res = await axios.post("api/siembra/agregar", data, {
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


    const putSiembra= async (id, data) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/siembra/editar/${id}`, data, {
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

    const putSiembraActiva = async (id) => {
        try {
            loading.value = true;
            let r = await axios.put(`/api/siembra/activar/${id}`, {}, {
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

    const putSiembraDesactivar = async (id) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/siembra/desactivar/${id}`, {}, {
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
    return { listarSiembra, listarSiembraActiva, listarSiembraInactiva, postSiembra, putSiembra,putSiembraActiva, putSiembraDesactivar, loading, siembra }

}, {
    persist: true
})