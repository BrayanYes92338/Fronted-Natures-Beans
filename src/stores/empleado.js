import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useUsuarioStore } from "./usuario.js";

export const useEmpleadoStore = defineStore('empleado', ()=>{
    let loading = ref(false);
    let empleados = ref([]);
    const useUsuario = useUsuarioStore(); 

    const listarEmpleado = async ()=>{
        try{
            loading.value = true;
            const response = await axios.get('api/empleado/listar',{
                headers: {
                    token: useUsuario.token
                }
            })
            empleados.value = response.data;
            return response;

        }catch (error){
            console.error(' Error al obtener lista de Empleados:', error)
            throw error
        }finally{
            loading.value = false;
        }
    }
    const postEmpleado = async (data)=>{
        try{
            loading.value = true;
            let res = await axios.post('api/empleado/agregar', data, {
                headers: {
                    token: useUsuario.token
                }
            })
            return res
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

    return{listarEmpleado,postEmpleado, loading, empleados}
},{
    persist: true, 
})