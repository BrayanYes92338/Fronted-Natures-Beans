import { defineStore } from "pinia";
import { ref } from "vue";
import { Notify } from "quasar";
import { useUsuarioStore} from "./usuario.js";
import axios from "axios";


export const useParcelaStore = defineStore("parcela",()=>{
    let loading = ref(false);
    let parcela = ref({})
    const useUsuario = useUsuarioStore();

    const listarParcela= async () => {
        try{
            loading.value = true;
            let res = await axios.get("api/parcela/listar", {
                headers: {
                    token: useUsuario.token
                }
            })
            parcela.value = res.data;
            return res;
        } catch (error){
            console.error('Error al obtener la lista de parcelas', error);
            throw error;
        } finally {
            loading.value = false;
        } 
        }       
        let ListarParcelaActivo = async () => {
  
            try {
              let res = await axios.get("api/parcela/listarParcelaActiva",{
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
          };
          let ListarParcelaInactivo = async () => {
    
            try {
              let res = await axios.get("api/parcela/listarParcelaInactiva",{
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
          };
    const postParcela = async (data) => {
    try {
        loading.value = true;
        let res = await axios.post("api/parcela/agregar", data, {
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


    const putParcela = async (id, data) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/parcela/editar/${id}`, data, {
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
    

    const putParcelaActiva = async (id) => {
        try {
            loading.value = true;
            let r = await axios.put(`/api/parcela/activar/${id}`, {}, {
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

    const putParcelaInactiva = async (id) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/parcela/desactivar/${id}`, {}, {
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

    return { listarParcela,  postParcela, putParcela, putParcelaActiva, putParcelaInactiva,ListarParcelaActivo,ListarParcelaInactivo, loading, parcela }

},

{
    persist: true,

})