import { defineStore } from "pinia";
import { ref } from "vue";
import { Notify } from "quasar";
import { useUsuarioStore} from "./usuario.js";
import axios from "axios";


export const useCultivoStore = defineStore("cultivo",()=>{
    let loading = ref(false);
    let cultivo = ref({})
    const useUsuario = useUsuarioStore();

    const listarCultivo= async () => {
        try{
            loading.value = true;
            let res = await axios.get("api/cultivo/listar", {
                headers: {
                    token: useUsuario.token
                }
            })
            cultivo.value = res.data;
            return res;
        } catch (error){
            console.error('Error al obtener la lista de Cultivos', error);
            throw error;
        } finally {
            loading.value = false;
        } 
        }       

    const postCultivo = async (data) => {
    try {
        loading.value = true;
        let res = await axios.post("api/cultivo/agregar", data, {
            headers: {
                token: useUsuario.token
            }
        })
        return res;
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


    const putCultivo = async (id, data) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/cultivo/editar/${id}`, data, {
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
    

    const putCultivoActiva = async (id) => {
        try {
            loading.value = true;
            let r = await axios.put(`/api/cultivo/activar/${id}`, {}, {
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

    const putCultivoInactiva = async (id) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/cultivo/desactivar/${id}`, {}, {
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

    return { listarCultivo,  postCultivo, putCultivo, putCultivoActiva, putCultivoInactiva, loading, cultivo}

},

{
    persist: true,

})