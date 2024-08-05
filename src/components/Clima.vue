<template>
   <div>
       <div style="margin-left: 5%; text-align: end; margin-right: 5%">
           <q-btn color="red" class="q-my-md q-ml-md" @click="abrir()">Registrar Clima</q-btn>
       </div>
       <div>
           <q-dialog v-model="alert" persistent>
               <q-card class="" style="width: 700px">
                   <q-card-section style="background-color:#009B44; margin-bottom: 20px">
                       <div class="text-h6 text-white">
                           {{ accion == 1 ? "Agregar Clima" : "Editar Clima "}}
                       </div>
                   </q-card-section>
                   <q-select outlined v-model="idFinca" use-input hide-selected fill-input input-debounce="0"
                       class="q-my-md q-mx-md" :options="options" @filter="filterFn"
                       label="Seleccionar  la Finca">
                       <template v-slot:no-option>
                           <q-item>
                               <q-item-section class="text-grey">
                                   Sin resultados
                               </q-item-section>
                           </q-item>
                       </template>
                   </q-select>
                   <q-select outlined v-model="idEmpleado" use-input hide-selected fill-input input-debounce="0"
                   class="q-my-md q-mx-md" :options="opciones" @filter="filtrarFn"
                   label="Selecciona el Empleado">
                   <template v-slot:no-option>
                       <q-item>
                           <q-item-section class="text-grey">
                               Sin resultados
                           </q-item-section>
                       </q-item>
                       </template>
                   </q-select>
                   <q-input outlined v-model=" tipoClima" use-input hide-selected fill-input input-debounce="0"
                       class="q-my-md q-mx-md" label="Nombre del  tipo de Clima" type="text" />
                   <q-input outlined v-model="horaInicio" use-input hide-selected fill-input input-debounce="0"
                       class="q-my-md q-mx-md" label="hora de Inicio" type="text" />    
                   <q-input outlined v-model="horaFinal" use-input hide-selected fill-input input-debounce="0"
                       class="q-my-md q-mx-md" label="hora Final" type="text"  />
                   <q-input outlined v-model="tempMin" use-input hide-selected fill-input input-debounce="0"
                       class="q-my-md q-mx-md" label="temperatura Minima" type="text" />
                   <q-input outlined v-model="tempMax" use-input hide-selected fill-input input-debounce="0"
                       class="q-my-md q-mx-md" label="temperatura Maxima" type="text" />
                   <q-card-actions align="right">
                       <q-btn v-if="accion === 1" @click="validarIngresoClima()" color="red" class="text-white"
                           :loading="useClima.loading">Agregar
                           <template v-slot:loading>
                               <q-spinner color="primary" size="1em" />
                           </template>
                       </q-btn>
                       <q-btn v-if="accion !== 1" @click="validarEdicionClima()" color="red" class="text-white"
                           :loading="useClima.loading">
                           Editar
                           <template v-slot:loading>
                               <q-spinner color="primary" size="1em" />
                           </template>
                       </q-btn>
                       <q-btn label="Cerrar" color="black" outline @click="cerrar()" />
                   </q-card-actions>
               </q-card>
           </q-dialog>
       </div>
       
       <div style="display: flex; justify-content: center">
           <q-table title="Climas" title-class="text-red text-weight-bolder text-h4"
               table-header-class="text-black font-weight-bold" :rows="rows" :columns="columns" row-key="name"
               style="width: 90%;">
              
               <template v-slot:body-cell-opciones="props">
                   <q-td :props="props">
                       <div style="display: flex; gap:15px; justify-content: center; ">
                           
                           <!-- boton de editar -->
                           <q-btn color="primary" @click="traerClima(props.row)">
                               <q-tooltip>
                                   Editar
                               </q-tooltip>
                               <i class="fas fa-pencil-alt">
                               </i></q-btn>
                       </div>
                   </q-td>
               </template>
           </q-table>
       </div>

   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Notify } from 'quasar';
import axios from 'axios';
import { useClimaStore } from "../stores/clima.js";
import { useFincaStore } from "../stores/finca.js";
import {useEmpleadoStore} from '../stores/empleado.js';


const useClima = useClimaStore();
const useFinca = useFincaStore();
const useEmpleado = useEmpleadoStore();



let rows = ref([]);
let alert = ref(false);
let id = ref('');
let accion = ref(1);
let idFinca = ref("");
let idEmpleado = ref("");
let tipoClima = ref("");
let horaInicio = ref("");
let horaFinal = ref("");
let tempMin = ref("");
let tempMax = ref("");




function abrir() {
   accion.value = 1
   alert.value = true;
}

function cerrar() {
   alert.value = false;
}




const columns = ref([
   {
       name: 'idFinca',
       required: true,
       label: 'Nombre de la Finca',
       align: 'center',
       field: (row) => row.idFinca.nombre,
       sortable: true
   },
   {
       name: 'idEmpleado',
       required: true,
       label: 'Nombre del Empleado',
       align: 'center',
       field: (row) => row.idEmpleado.nombre,
       sortable: true
   },
   {
       name: 'tipoClima',
       required: true,
       label: 'Nombre tipo de Clima',
       align: 'center',
       field: 'tipoClima',
       sortable: true
   },
   {
       name: 'horaInicio',
       required: true,
       label: 'hora Inicio',
       align: 'center',
       field: 'horaInicio',
       sortable: true
   },
   {
       name: 'horaFinal',
       required: true,
       label: 'hora Final',
       align: 'center',
       field: 'horaFinal',
       sortable: true
   },
   {
       name: 'tempMin',
       required: true,
       label: 'temperatura Minima',
       align: 'center',
       field: 'tempMin',
       sortable: true
   },
   {
       name: 'tempMax',
       required: true,
       label: 'temperatura Maxima',
       align: 'center',
       field: 'tempMax',
       sortable: true
   },
   {
       name: 'createAt',
       required: true,
       label: 'Fecha',
       align: 'center',
       field: 'createAt',
       sortable: true
   },
   {
       name: 'opciones',
       required: true,
       label: 'Opciones',
       align: 'center',
       field: 'opciones',
       sortable: true
   }
])

let fincas = []
let datos = {}
const options = ref(fincas)

function filterFn(val, update, abort) {
   update(() => {
       const needle = val.toLowerCase();
       options.value = fincas.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
   });
};

async function listarFincas() {
   const data = await useFinca.listarFincas()
   data.data.fincas.forEach(item => {
       datos = {
           label: `${item.nombre} - ${item.ruc}`,
           value: item._id


       };
       fincas.push(datos);
   });
   console.log(fincas);

}

let empleados = []
let dates = {}
const opciones = ref(empleados)

async function listarEmpleados() {
    const data = await useEmpleado.listarEmpleado();
    data.data.empleado.forEach(item => {
        dates = {
            label: `${item?.nombre} - ${item.documento} `,
            value: item._id
        };
        empleados.push(dates);
    })
    console.log(empleados);
}

function filtrarFn(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        opciones.value = empleados.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });
}

async function listarClimas() {
   const r = await useClima.listarClimas()
   rows.value = r.data.clima.reverse()
   console.log(r.data.clima);
};

function validarIngresoClima() {
   let validacionnumeros = /^[0-9]+$/;
   if (idFinca.value == "") {
       Notify.create("Se debe seleccionar la Finca");
   } else if (idEmpleado.value == "") {
       Notify.create("Se debe seleccionar el Empleado");
   } else if (tipoClima.value == "" || tipoClima.value.trim().length === 0) {
       Notify.create("Se debe agregar tipo de clima");
   } else if (horaInicio.value == "" || horaInicio.value.trim().length === 0) {
       Notify.create("Se debe agregar hora Inicio");
   } else if (horaFinal.value == "" || horaFinal.value.trim().length === 0) {
       Notify.create("Se debe agregar hora Final");
   } else if (tempMin.value == "" || tempMin.value.trim().length === 0) {
       Notify.create("Se debe agregar temperatura Minima");
   } else if (tempMax.value == "" || tempMax.value.trim().length === 0) {
       Notify.create("Se debe agregar temperatura Maxima");
   } else {
       agregarClima()
       Limpiar()
       cerrar()
       Notify.create({
           type: "positive",
           message: "Clima agregado exitosamente",
       });
   }
}


async function agregarClima() {
   const r = await useClima.postClimas({
       idFinca: idFinca.value.value,
       idEmpleado: idEmpleado.value.value,
       tipoClima: tipoClima.value,
       horaInicio: horaInicio.value,
       horaFinal: horaFinal.value,
       tempMin: tempMin.value,
       tempMax: tempMax.value,
       
   })
   cerrar()
   Limpiar()
   listarClimas()
   console.log(r);
}

function traerClima(clima) {
   alert.value = true;
   accion.value = 2;
   id.value = clima._id;
   idFinca.value = {
       label: clima.idFinca.nombre,
       value: clima.idFinca._id
   };
   idEmpleado.value = {
       label: clima.idEmpleado.nombre,
       value: clima.idEmpleado._id
   };
   tipoClima.value = clima.tipoClima;
   horaInicio.value = clima. horaInicio;
   horaFinal.value = clima.horaFinal;
   tempMin.value = clima.tempMin;
   tempMax.value = clima.tempMax;
  
}


function validarEdicionClima() {
   let validacionnumeros = /^[0-9]+$/;
   if (idFinca.value == "") {
       Notify.create("Se debe seleccionar la Finca");
   } else if (idEmpleado.value == "") {
       Notify.create("Se debe seleccionar el Empleado");
   } else if (tipoClima.value == "" || tipoClima.value.trim().length === 0) {
       Notify.create("Se debe agregar tipo de clima");
   } else if (horaInicio.value == "" || horaInicio.value.trim().length === 0) {
       Notify.create("Se debe agregar hora Inicio");
   } else if (horaFinal.value == "" || horaFinal.value.trim().length === 0) {
       Notify.create("Se debe agregar hora Final");
   } else if (tempMin.value == "" || tempMin.value.trim().length === 0) {
       Notify.create("Se debe agregar temperatura Minima");
   } else if (tempMax.value == "" || tempMax.value.trim().length === 0) {
       Notify.create("Se debe agregar temperatura Maxima");
   } else {
       editarClima()
       Limpiar()
       cerrar()
       Notify.create({
           type: "positive",
           message: "Edicion de Clima agregada exitosamente",
       });
   }
}

async function editarClima() {
   try {
       await useClima.putClimas(id.value, {
       idFinca: idFinca.value.value,
       idEmpleado: idEmpleado.value.value,
       tipoClima: tipoClima.value,
       horaInicio: horaInicio.value,
       horaFinal: horaFinal.value,
       tempMin: tempMin.value,
       tempMax: tempMax.value,
       })
       listarClimas()
   } catch (error) {
       console.error('Error de actualizar Clima', error)
       Notify.create('Ocurrio un error al editar datos del Clima')
   }
}

function Limpiar() {
   idFinca.value = ""
   idEmpleado.value = ""
   tipoClima.value = ""
   horaInicio.value = ""
   horaFinal.value = ""
   tempMin.value = ""
   tempMax.value = ""
}


onMounted(() => {

   listarClimas()
   listarFincas()
   listarEmpleados()
})

</script>