import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { ref } from "vue";


export const useDepartamentoStore = defineStore('departamento', ()=>{
    let loading = ref(false); 
    let departamentos = ref([]);
    

    const listarDepartamento = async ()=>{
        try{
            loading.value = true;
            const response = await axios.get('https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.json');
            departamentos.value = response.data;
            return response;
        }catch (error){
            console.error(' Error al obtener lista de Departamentos y Municipios de Colombia :', error)
           throw error 
        }
    }
    return {
        loading,
        departamentos,
        listarDepartamento,
    }

},
{
    persist: true,
})