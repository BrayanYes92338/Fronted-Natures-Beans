import { defineStore } from "pinia";
import { ref } from "vue";
import { Notify } from "quasar";
import { useUsuarioStore} from "./usuario.js";
import axios from "axios";


export const useCompradorStore = defineStore("comprador",()=>{
    let loading = ref(false);
    let comprador = ref({})
    const useUsuario = useUsuarioStore();

    const listarComprador= async () => {
        try{
            loading.value = true;
            let res = await axios.get("api/comprador/listar", {
                headers: {
                    token: useUsuario.token
                }
            })
            comprador.value = res.data;
            return res;
        } catch (error){
            console.error('Error al obtener la lista de Comprador', error);
            throw error;
        } finally {
            loading.value = false;
        } 
        }       
        let ListarCompradorActivo = async () => {
  
            try {
              let res = await axios.get("api/comprador/activos",{
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
          let ListarCompradorInactivo = async () => {
    
            try {
              let res = await axios.get("api/comprador/inactivos",{
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
    const postComprador = async (data) => {
    try {
        loading.value = true;
        let res = await axios.post("api/comprador/agregar", data, {
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


    const putcomprador = async (id, data) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/comprador/editar/${id}`, data, {
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
    

    const putCompradorActiva = async (id) => {
        try {
            loading.value = true;
            let r = await axios.put(`/api/comprador/activar/${id}`, {}, {
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

    const putCompradorInactiva = async (id) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/comprador/desactivar/${id}`, {}, {
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

    return { listarComprador,  postComprador, putcomprador, putCompradorActiva, putCompradorInactiva,ListarCompradorActivo,ListarCompradorInactivo, loading, comprador}

},

{
    persist: true,

})