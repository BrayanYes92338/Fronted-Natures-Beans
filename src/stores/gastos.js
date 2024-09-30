import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuario.js";

export const useGastoStore = defineStore('gasto', () => {
    let loading = ref(false);
    let gastos = ref([]);
    const useUsuario = useUsuarioStore();

    const listarGastos = async () => {
        try {
            loading.value = true;
            const response = await axios.get('api/gastos/listar', {
                headers: {
                    token: useUsuario.token
                }
            })
            gastos.value = response.data;
            return response;
        } catch (error) {
            console.error(' Error al obtener lista de Gastos:', error)
            throw error
        } finally {
            loading.value = false;
        }
    }

    const postGastos = async (data) =>{
        try {
            loading.value = true;
            const res = await axios.post('api/gastos/agregar', data, {
                headers: {
                    token: useUsuario.token
                }
            })
           return res
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

    const putGastos = async (id,data)=>{
        try {
            loading.value = true;
            const r = await axios.put(`api/gastos/editar/${id}`, data, {
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

return {listarGastos, postGastos, putGastos, gastos, loading}
},
    {
        persist: true,
    })