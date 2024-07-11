import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { Notify } from "quasar";

export const useUsuarioStore = defineStore('usuarios', () => {
    let token = ref("")
    let loading = ref(false)
    let usuarios = ref([]);
    let user = ref({})

    const listarUsuaerios = async () => {
        try {
            loading.value = true
            let res = await axios.get("api/usuarios", {
                headers: {
                    token: token.value
                },
            })
            usuarios.value = res.data;
            return res

        } catch (error) {
            console.error('Error al obtener la lista de Usuarios', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    const postUsuarios = async ()=>{
        try{
            loading.value = true
            let res = await axios.post('api/usuarios', data, {
                headers: {
                    token: token.value
                }
            })
            return res
        }catch(error){
            console.error('Error al crear el usuario', error)
            throw error

        }finally{
            loading= false
        }

    }

    return {listarUsuaerios, postUsuarios, loading,token,usuarios, user}
},
    {
        persist: true,
    },
)