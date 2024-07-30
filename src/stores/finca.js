import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuario.js";

export const  useFincaStore = defineStore('finca', () => {
    let loading = ref(false);
    let fincas = ref([]);
    const useUsuario = useUsuarioStore();

    const listarFincas = async () => {
        try {
            loading.value = true;
            const response = await axios.get('api/fincas/listar', {
                headers: {
                    token: useUsuario.token
                }
            })
            fincas.value = response.data;
            return response;    

        } catch (error) {
            console.error(' Error al obtener lista de Fincas:', error)
            throw error
        } finally {
            loading.value = false;
        }
    }

    const postFincas = async (data) =>{
        try{
           loading.value = true;
           let res = await axios.post("api/fincas/agregar", data, {
            headers: {
                token: useUsuario.token
            }
        })
        return res;
        }catch (error){
            loading.value = true
            console.log(error);
            Notify.create({
                type: "negative",
                message: error.response.data.errors[0].msg,
            });
        }finally{
            loading.value = false;
        }
    }

    const putFincas = async (id, data)=>{
        try{
           loading.value = true; 
           const r = axios.put(`api/fincas/editar/${id}`, data, {
            headers: {
                token: useUsuario.token
            }
           })
           return r
        }catch (error){
            loading.value = true
            console.log(error);
            Notify.create({
                type: "negative",
                message: error.response.data.errors[0].msg,
            
            })
        }finally{
            loading.value = false;
        }
    }

    const putFincaActivar = async (id)=>{
        try{
            loading.value = true;
            const r = await axios.put(`api/fincas/activar/${id}`, {},{
                headers: {
                    token: useUsuario.token
                }
            })
            return r
        }catch (error){
            loading.value = true
            console.log(error)
            Notify.create({
                type: "negative",
                message: error.response.data.errors[0].msg,
            });
        }finally{
            loading.value = false;
        }
    }

    const putFincaDesactivar = async (id)=>{
        try{
            loading.value = true;
            const r = await axios.put(`api/fincas/desactivar/${id}`, {},{
                headers: {
                    token: useUsuario.token
                }
            })
            return r
        }catch (error){
            loading.value = true
            console.log(error)
            Notify.create({
                type: "negative",
                message: error.response.data.errors[0].msg,
            });
        }finally{
            loading.value = false; 
        }
    }

    return {listarFincas, postFincas,putFincas,putFincaActivar, putFincaDesactivar, loading, fincas}

},
    {
        persist: true,
    })