import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";

export const useUsuarioStore = defineStore("usuario", () => {
    let token = ref("");
    let loading = ref(false);
    let usuarios = ref([]);
    let user = ref({});

    const listarUsuarios = async () => {
        try {
            loading.value = true;
            let res = await axios.get("api/usuarios/listar/", {
                headers: {
                    token: token.value
                }
            });
            usuarios.value = res.data;
            return res;
        } catch (error) {
            console.error('Error al obtener la lista de usuarios', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };
    let ListarUsuarioActivo = async () => {
        loading.value =true;
  
          try {
            let res = await axios.get("api/usuarios/activos",{
              headers: {
                token: token.value

              },
            });
            console.log(res);
            return res.data;
          } catch (error) {
            console.log(error);
            return error;
          }finally {
            loading.value = false;
          }
        };
        let ListarUsuarioInactivo = async () => {
          loading.value =true;
  
          try {
            let res = await axios.get("api/usuarios/inactivos",{
              headers: {
                token: token.value

              },
            });
            console.log(res);
            return res.data;
          } catch (error) {
            console.log(error);
            return error;
          }finally {
            loading.value = false;
          }
        };

    const listarUsuarioRol = async ()=>{
        try{
            loading.value = true;
            const response = await axios.get("api/usuarios/listarRol",{
                headers:{
                    token: token.value
                }
            })
            usuarios.value = response.data;
            return response;
        }catch (error){
            loading.value = true;

        }finally{
            loading.value = false;
        }
    };

    const postUsuarios = async (data) => {
        try {
            loading.value = true;
            let res = await axios.post("api/usuarios/agregar", data, {
                headers: {
                    token: token.value
                }
            });
            return res;
        } catch (error) {
            loading.value = true
            console.log(error)
        // Notify.create({
        //     type: "negative",
        //     message: error.response.data.errors[0].msg,
        // });
            throw error; 

        } finally {
            loading.value = false

        }
    }

    const putUsuario = async (id, data) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/usuarios/editar/${id}`, data, {
                headers: {
                    token: token.value
                }
            });
            return r;
        } catch (error) {
            console.log('Error en el PUT request:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const putActivarUsuario = async (id) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/usuarios/activar/${id}`, {}, {
                headers: {
                    token: token.value
                }
            });
            return r;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const putDesactivarUsuario = async (id) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/usuarios/desactivar/${id}`, {}, {
                headers: {
                    token: token.value
                }
            });
            return r;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    let Login = async (data) => {
        try {
            let res = axios.post("api/usuarios/login", data);
            return res;
        } catch (error) {
            console.log(error);
            if (error.response.status === 401) {
                Notify.create({
                    message: "Usuario Inactivo",
                    position: "top",
                    color: 'red',
                    timeout: 4000
                })
            } else {
                Notify.create({
                    message: "El correo o la cotraseña son incorrectas",
                    position: "top",
                    color: 'red',
                    timeout: 4000
                })
            }
            return error;

        }

    }

    let usuarioGetEmail = async (correo) => {
        try{
            let res = await axios.get(`api/usuarios/correo/${correo}`)
                return res;
            
        }catch (error) {
            console.log(error);
            return error;
        }
    }

    let enviarCorreo = async (correo) =>{
        try{
            console.log(correo);
            let res = await axios.post("api/usuarios/recuperarContra", {
                correo: correo
            })
            return res
        }catch (error){
            return error
        }
    }

    let actualizarContra = async (correo,password)=>{
        try {
            let res = await axios.put("api/usuarios/actualizarContra",{
                correo: correo,
                password: password
            })
            return res 
        } catch (error) {
            console.log(error);
            return error
        }
    }

    return { listarUsuarios,listarUsuarioRol, postUsuarios, putUsuario, putActivarUsuario, putDesactivarUsuario, Login,usuarioGetEmail, enviarCorreo, actualizarContra, token, loading, usuarios, user ,ListarUsuarioActivo,ListarUsuarioInactivo};
}, {
    persist: true,
});
