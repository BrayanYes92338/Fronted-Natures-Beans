import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuario.js";

export const UseInsumoStore = defineStore("insumo", ()=>{
    let loading = ref(false);
    let insumos = ref([]);
    const useUsuario = useUsuarioStore();

    const listarInsumos = async ()=>{
        try{
            loading.value = true;
            const response = await axios.get('api/insumo/listar',{
                headers:{
                    token: useUsuario.token
                }
            })
            insumos.value = response.data;
            return response;

        }catch (error){
            console.error('Error al obtener lista de insumos:', error)
            throw error
        }finally{
            loading.value = false;
        }
    }

    const postInsumos = async (data)=>{
        try{
            loading.value = true;
            let res = await axios.post('api/insumo/agregar', data, {
                headers:{
                    token: useUsuario.token
                }
            })
            return res;

        }catch (error){
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

    const putInsumos = async (data,id)=>{
        try{
            loading.value = true;
            let r = await axios.put(`api/insumo/editar/${id}`, data, {
                headers:{
                    token: useUsuario.token
                }
            });
            return r;

        }catch(error){
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

    return{listarInsumos, postInsumos, putInsumos, loading, insumos}

}, {
    persist: true
})