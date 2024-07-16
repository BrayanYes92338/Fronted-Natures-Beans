import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";

export const useUsuarioStore = defineStore("usuario", () => {
    let token = ref("")
    let loading = ref(false)
    let usuarios = ref([]);
    let user = ref({})

    const listarUsuarios = async () => {
        try {
            loading = true;
            let res = await axios.get("api/usuarios/listar", {
                headers: {
                    token: token.value
                }
            })
            usuarios.value = res.data;
            return res;
        } catch (error) {
            console.error('Error al obtener la lista de usuarios', error);
            throw error;
        } finally {
            loading = false;
        }
    }

    const postUsuarios = async (data) => {
        try {
            loading = true;
            let res = await axios.post("api/usuarios/agregar", data, {
                headers: {
                    token: token.value
                }
            })
            return res;
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            loading = false;
        }
    }
    const putUsuario = async (id, data) => {
        try{
            loading.value = true;
            let r = await axios.put(`api/usuarios/editar${id}`, data, {
                headers: {
                    token: token.value
                }
            })
            return r;
        }catch(error){
            console.log(error);
            return error;  
        }finally{
        loading = false;
        }
    }
    const putActivarUsuario = async (id) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/usuarios/activar/${id}`, {}, {
                headers: {
                    token: token.value
                }
            })
            return r;

        } catch (error) {
            loading.value = true;
            console.log(error);

        } finally {
            loading.value = false;

        }
    }
    const putdesactivarUsuario = async (id) => {
        try {
            loading.value = true;
            let r = await axios.put(`api/usuarios/desactivar/${id}`, {}, {
                headers: {
                    token: token.value
                }
            })
            return r;

        } catch (error) {
            loading.value = true;
            console.log(error);

        } finally {
            loading.value = false;

        }
    }

    return { listarUsuarios, postUsuarios,putUsuario,putActivarUsuario, putdesactivarUsuario, usuarios, token, loading, user }
},
    {
        persist: true,
    },
);