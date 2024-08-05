<template>
    <div>
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="red" class="q-my-md q-ml-md" @click="abrir()">Registrar Parcela</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color:#009B44; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar Finca" : "Editar Finca " }}
                        </div>
                    </q-card-section>
                    <q-select outlined v-model="idFinca" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="options" @filter="filterFn"
                        label="Selecciona el nombre de la Finca">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-select outlined v-model="asistenteTecnico" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="opciones" @filter="filtrarFn"
                        label="Selecciona el responsable de la parcela">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-input outlined v-model="ubicacion" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ubicacion de la Parcela" type="text" />
                    <q-input outlined v-model="numero" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Numero de la Parcela" type="tel" required pattern="[0-9]+"
                        maxlength="10" />
                    <q-input outlined v-model="cultivoAnterior" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ingresa Cultivo Anterior" type="text" />
                    <q-input outlined v-model="cultivoActual" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ingresa Cultivo Actual" type="text" />
                    <q-input outlined v-model="detalle" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Detalle de la Parcela" type="text" />
                    <q-input outlined v-model="area" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ingrese Area de la Parcela" type="tel" required pattern="[0-9]+"
                        maxlength="10" />
                    <q-card-actions align="right">
                        <q-btn v-if="accion === 1" @click="validarParcela()" color="red" class="text-white" :loading="useParcela.loading">Agregar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn v-if="accion !== 1" @click="validarEdicionParcela()"  color="red" class="text-white" :loading="useParcela.loading">
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
            <q-table title="Parcelas" title-class="text-red text-weight-bolder text-h4"
                table-header-class="text-black font-weight-bold" :rows="rows" :columns="columns" row-key="name"
                style="width: 90%;">
                <template v-slot:body-cell-estado="props">
                    <q-td :props="props">
                        <p style="color: green;" v-if="props.row.estado == 1">Activo</p>
                        <p style="color: red;" v-else>Inactivo</p>
                    </q-td>
                </template>
                <template v-slot:body-cell-opciones="props">
                    <q-td :props="props">
                        <div style="display: flex; gap:15px; justify-content: center; ">

                            <!-- boton de editar -->
                            <q-btn color="primary" @click="traerParcelas(props.row)" >
                                <q-tooltip>
                                    Editar
                                </q-tooltip>
                                <i class="fas fa-pencil-alt">
                                </i></q-btn>
                            <!-- botons de activado y desactivado -->
                            <q-btn v-if="props.row.estado == 1" @click="deshabilitarParcela(props.row)"  color="negative">
                                <q-tooltip>
                                    Desacticar
                                </q-tooltip>
                                <i class="fas fa-times">
                                </i></q-btn>
                            <q-btn v-else color="positive" @click="habilitarParcelas(props.row)" >
                                <q-tooltip>
                                    Acticar
                                </q-tooltip><i class="fas fa-check">

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
import { useParcelaStore } from "../stores/parcelas.js"
import { useFincaStore } from "../stores/finca.js";
import { useEmpleadoStore } from "../stores/empleado.js"


const useParcela = useParcelaStore();
const useFinca = useFincaStore();
const useEmpleado = useEmpleadoStore();


let rows = ref([]);
let alert = ref(false);
let id = ref('');
let accion = ref(1);
let idFinca = ref('');
let asistenteTecnico = ref('');
let ubicacion = ref('');
let numero = ref('');
let cultivoAnterior = ref('');
let cultivoActual = ref('');
let detalle = ref('');
let area = ref('');

function abrir() {
    accion.value = 1
    alert.value = true;
    Limpiar()
}

function cerrar() {
    alert.value = false;
}

const columns = ref([
    {
        name: 'idFinca',
        required: true,
        label: 'Nombre Finca',
        align: 'center',
        field: (row) => row.idFinca.nombre,
        sortable: true
    },
    {
        name: 'asistenteTecnico',
        required: true,
        label: 'Trabajador Finca',
        align: 'center',
        field: (row) => row.asistenteTecnico.nombre,
        sortable: true
    },
    {
        name: 'ubicacion',
        required: true,
        label: 'Ubicacion Parcela',
        align: 'center',
        field: 'ubicacion',
        sortable: true
    },
    {
        name: 'numero',
        required: true,
        label: 'Numero Parcela',
        align: 'center',
        field: 'numero',
        sortable: true
    },
    {
        name: 'cultivoAnterior',
        required: true,
        label: 'Cultivo Anterior',
        align: 'center',
        field: 'cultivoAnterior',
        sortable: true
    },
    {
        name: 'cultivoActual',
        required: true,
        label: 'Cultivo Actual',
        align: 'center',
        field: 'cultivoActual',
        sortable: true
    },
    {
        name: 'detalle',
        required: true,
        label: 'Detalle de la Parcela',
        align: 'center',
        field: 'detalle',
        sortable: true
    },
    {
        name: 'area',
        required: true,
        label: 'Area Parcela',
        align: 'center',
        field: 'area',
        sortable: true
    },

    {
        name: 'estado',
        required: true,
        label: 'Estado',
        align: 'center',
        field: 'estado',
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

// Filtrar datos de Fincas

let fincas = []
let datos = {}
const options = ref(fincas)

async function listarFincas() {
    const data = await useFinca.listarFincas()
    data.data.fincas.forEach(item => {
        datos = {
            label: `${item?.nombre} - ${item.ruc} `,
            value: item._id

        };
        fincas.push(datos);
    })
    console.log(fincas);

}

function filterFn(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        options.value = fincas.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });
};

// Filtrar Datos Empleado

let empleados = []
let dates = {}
const opciones = ref(empleados)

async function listarEmpleados() {
    const data = await useEmpleado.listarEmpleado();
    data.data.empleado.forEach(item => {
        dates = {
            label: `${item?.nombre} - ${item.descripcion} `,
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


// Filtrar Datos de las Parcelas

async function listarParcelas(){
    const r = await useParcela.listarParcela()
    rows.value = r.data.parcela.reverse()
    console.log(r.data.parcela)
}

function validarParcela(){
    let validacionnumeros = /^[0-9]+$/; 
    if(idFinca.value ==""){
        Notify.create("Se debe agregar el nombre de la Finca"); 
    }else if(asistenteTecnico.value ==""){
        Notify.create("Se debe agregar el nombre del Asistente Tecnico");
    }else if(ubicacion.value ==""|| ubicacion.value.trim().length === 0){
        Notify.create("Se debe agregar la ubicacion de la Parcela");
    }else if(numero.value == ""){
        Notify.create("Se debe agregar el numero de la Parcela");
    }else if(!validacionnumeros.test(numero.value)){

        Notify.create("El numero de la Parcela debe ser numerico");
    }else if(cultivoAnterior.value ==""|| cultivoAnterior.value.trim().length === 0){
        Notify.create("Se debe agregar el cultivo anterior");
    }else if(cultivoActual.value ==""|| cultivoActual.value.trim().length === 0){
        Notify.create("Se debe agregar el cultivo actual");
    }else if(detalle.value ==""|| detalle.value.trim().length === 0){
        Notify.create("Se debe agregar el detalle de la Parcela");
    }else if(area.value == "" || area.value.trim().length === 0){
        Notify.create("Se debe agregar el area de la Parcela");
    } else {
        Notify.create({
            type: "positive",
            message: "Finca agregada exitosamente",
        });
        cerrar()
        agregarParcleas()

    }
}

function traerParcelas(parcela){
    accion.value = 2
    alert.value = true
    id.value = parcela._id
    idFinca.value = {
        label: parcela.idFinca.nombre,
        value: parcela.idFinca._id
    }
    asistenteTecnico.value = {
        label: parcela.asistenteTecnico.nombre,
        value: parcela.asistenteTecnico._id
    }
    ubicacion.value = parcela.ubicacion
    numero.value = parcela.numero
    cultivoAnterior.value = parcela.cultivoAnterior
    cultivoActual.value = parcela.cultivoActual
    detalle.value = parcela.detalle
    area.value = parcela.area
}

function validarEdicionParcela(){
    let validacionnumeros = /^[0-9]+$/; 
    if(idFinca.value ==""){
        Notify.create("Se debe agregar el nombre de la Finca"); 
    }else if(asistenteTecnico.value ==""){
        Notify.create("Se debe agregar el nombre del Asistente Tecnico");
    }else if(ubicacion.value ==""|| ubicacion.value.trim().length === 0){
        Notify.create("Se debe agregar la ubicacion de la Parcela");
    }else if(numero.value == ""){
        Notify.create("Se debe agregar el numero de la Parcela");
    }else if(!validacionnumeros.test(numero.value)){

        Notify.create("El numero de la Parcela debe ser numerico");
    }else if(cultivoAnterior.value ==""|| cultivoAnterior.value.trim().length === 0){
        Notify.create("Se debe agregar el cultivo anterior");
    }else if(cultivoActual.value ==""|| cultivoActual.value.trim().length === 0){
        Notify.create("Se debe agregar el cultivo actual");
    }else if(detalle.value ==""|| detalle.value.trim().length === 0){
        Notify.create("Se debe agregar el detalle de la Parcela");
    }else if(area.value == "" || area.value.trim().length === 0){
        Notify.create("Se debe agregar el area de la Parcela");
    } else {
        Notify.create({
            type: "positive",
            message: "Parcela editada exitosamente",
        });
        cerrar()
        editarParcela()

    }
}


async function editarParcela(){
    try{
        await useParcela.putParcela(id.value,{
            idFinca:idFinca.value.value,
            asistenteTecnico: asistenteTecnico.value.value,
            ubicacion: ubicacion.value,
            numero: numero.value,
            cultivoAnterior: cultivoAnterior.value,
            cultivoActual: cultivoActual.value,
            detalle: detalle.value,
            area: area.value
        }) 

        listarParcelas()

    }catch (error){
        console.error('Error de actualizar Parcela', error)
        Notify.create('Ocurrio un error al editar datos de la Parcela')
    }
}

async function agregarParcleas(){
    const r = await useParcela.postParcela({
        idFinca:idFinca.value.value,
        asistenteTecnico: asistenteTecnico.value.value,
        ubicacion: ubicacion.value,
        numero: numero.value,
        cultivoAnterior: cultivoAnterior.value,
        cultivoActual: cultivoActual.value,
        detalle: detalle.value,
        area: area.value
    })
    cerrar()
    listarParcelas()
    console.log(r);
}



async function habilitarParcelas(parcela){
    const res = await useParcela.putParcelaActiva(parcela._id)
    .then((response) => {
            console.log(response);
            listarParcelas()
        })

        .catch((error) => {
            console.error('Error de Finca', error);
            Notify.create('Error al habilitar la Finca')
        })
}

async function deshabilitarParcela(parcela){
    const res = await useParcela.putParcelaInactiva(parcela._id)
    .then((response) => {
            console.log(response);
            listarParcelas()
        })

        .catch((error) => {
            console.error('Error de Finca', error);
            Notify.create('Error al deshabilitar la Finca')
        })
}

function Limpiar(){
    idFinca.value = ''
    asistenteTecnico.value = ''
    ubicacion.value = ''
    numero.value = ''
    cultivoAnterior.value = ''
    cultivoActual.value = ''
    detalle.value = ''
    area.value = ''
}

onMounted(() => {
    listarParcelas()
    listarFincas()
    listarEmpleados()

})

</script>