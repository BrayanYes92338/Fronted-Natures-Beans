import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuario.js";


export const useNominaStore = defineStore('nomina', () => {
    let loading = ref(false);
    let nominas = ref([]);
    const useUsuario = useUsuarioStore();
    const listarNominas = async () => {
        try {
            loading.value = true;
            const response = await axios.get('api/nomina/listar', {
                headers: {
                    token: useUsuario.token
                }
            })
            nominas.value = response.data;
            return response;
        } catch (error) {
            console.error(' Error al obtener lista de Nominas:', error)
            throw error
        } finally {
            loading.value = false;
        }
    }

    let ListarNominaActiva = async () => {
  
        try {
          let res = await axios.get("api/nomina/activos",{
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

      let listarNominaInactiva = async () => {

        try {
          let res = await axios.get("api/nomina/inactivos",{
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

    const postNomina = async (data) => {
        try {
            loading.value = true;
            let res = await axios.post('api/nomina/agregar', data, {
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


    const putNomina = async (id, data) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/nomina/editar/${id}`, data, {
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

    const putNominaActiva = async (id) => {
        try {
            loading.value = true;
            let r = await axios.put(`/api/nomina/activar/${id}`, {}, {
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

    const putNominaInactiva = async (id) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/nomina/desactivar/${id}`, {}, {
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
    return { listarNominas, ListarNominaActiva, listarNominaInactiva, postNomina, putNominaActiva, putNominaInactiva,  putNomina, loading, nominas }

}, {
    persist: true
})