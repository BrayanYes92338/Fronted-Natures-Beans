import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuario.js";

export const UseFacturaStore = defineStore("factura", ()=>{
    let loading = ref(false);
    let insumos = ref([]);
    const useUsuario = useUsuarioStore();

    const listarFactura = async () => {
        try {
            loading.value = true;
            const response = await axios.get('api/factura/listar', {
                headers: {
                    token: useUsuario.token
                }
            })
            insumos.value = response.data;
            return response;

        } catch (error) {
            console.error(' Error al obtener lista de Empleados:', error)
            throw error
        } finally {
            loading.value = false;
        }
    }
    const postFactura = async (data)=>{
        try{
            loading.value = true;
            let res = await axios.post('api/factura/agregar', data, {
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
    
    const putFactura = async (id, data) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/factura/editar/${id}`, data, {
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
    };

  

    return{ postFactura,listarFactura,putFactura, loading, insumos}

}, {
    persist: true
})