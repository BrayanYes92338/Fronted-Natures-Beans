<template>
    <div>
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn style="background-color: #00C04F; color: white;" class="q-my-md q-ml-md" @click="abrir()">Registrar
                Fertilizacion</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color:#009B44; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar Fertilizacion" : "Editar Fertilizacion " }}
                        </div>
                    </q-card-section>
                            <q-select outlined v-model="idCultivo" use-input hide-selected fill-input input-debounce="0"
                                 class="q-my-md q-mx-md" :options="options" @filter="filterFn" label="Seleccionar  el cultivo">
                                 <template v-slot:no-option>
                                <q-item>
                        <q-item-section class="text-grey"> Sin resultados </q-item-section>
                                </q-item>
                            </template>
                                </q-select>
                            <q-select outlined v-model="idEmpleado" use-input hide-selected fill-input input-debounce="0"
                                class="q-my-md q-mx-md" :options="opciones" @filter="filtrarFn" label="Selecciona el Empleado">
                                <template v-slot:no-option>
                                <q-item>
                            <q-item-section class="text-grey"> Sin resultados </q-item-section>
                         </q-item>
                        </template>
                    </q-select>
                    <q-select outlined v-model="idInsumo" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="opcion" @filter="filtraFn" label="Selecciona el Insumo">
                     <template v-slot:no-option>
                        <q-item>
                         <q-item-section class="text-grey"> Sin resultados </q-item-section>
                        </q-item>
                        </template> 
                    </q-select>
                    <q-input outlined v-model="estadoFenologico" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Estado Fenologico Fertilizante" type="text" />
                    <q-input outlined v-model="tipo" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Tipo de Fertilizante" type="text" />
                    
                    <q-input outlined v-model="nombreFertilizante" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="nombre Fertilizante" type="text" />
                    <q-input outlined v-model="cantidad" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ingrese la cantidad del fertilizante" type="text" />
                    <q-card-actions align="right">
                        <q-btn v-if="accion === 1" @click="validarIngresoFertilizacion()" color="red" class="text-white"
                            :loading="useFertilizacion.loading">Agregar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn v-if="accion !== 1" @click="validarEdicionFertilizacion()" color="red" class="text-white"
                            :loading="useFertilizacion.loading">
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
            <q-table title="Fertilizacion" title-class="text-green text-weight-bolder text-h4"
                table-header-class="text-black font-weight-bold" :rows="rows" :columns="columns" row-key="name"
                style="width: 90%; margin-bottom: 5%;">

                <template v-slot:body-cell-opciones="props">
                    <q-td :props="props">
                        <div style="display: flex; gap:15px; justify-content: center; ">

                            <!-- boton de editar -->
                            <q-btn color="primary" @click="traerFertilizacion(props.row)">
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
import { useFertilizacionStore } from "../stores/fertilizacion.js";
import { useCultivoStore } from "../stores/cultivo.js";
import { useEmpleadoStore } from '../stores/empleado.js';
import { UseInsumoStore } from "../stores/insumo.js";



const useFertilizacion = useFertilizacionStore();
const useCultivo = useCultivoStore();
const useEmpleado = useEmpleadoStore();
const useInsumo = UseInsumoStore();





let rows = ref([]);
let alert = ref(false);
let id = ref('');
let accion = ref(1);
let idCultivo = ref("");
let idEmpleado = ref("");
let idInsumo = ref("");
let estadoFenologico = ref("");
let tipo = ref("");
let nombreFertilizante = ref("");
let cantidad = ref("");





function abrir() {
    accion.value = 1
    alert.value = true;
}

function cerrar() {
    alert.value = false;
    Limpiar()
}




const columns = ref([
    {
        name: 'idCultivo',
        required: true,
        label: 'Nombre del Cultivo',
        align: 'center',
        field: (row) => row.idCultivo.nombre,
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
        name: 'idInsumo',
        required: true,
        label: 'Nombre del Insumo',
        align: 'center',
        field: (row) => row.idInsumo.nombre,
        sortable: true
    },
    {
        name: 'estadoFenologico',
        required: true,
        label: 'Estado Fenologico',
        align: 'center',
        field: 'estadoFenologico',
        sortable: true,
         format: val => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
    },
    {
        name: 'tipo',
        required: true,
        label: 'Tipo Fertilizacion',
        align: 'center',
        field: 'tipo',
        sortable: true,
         format: val => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
    },
    {
        name: 'nombreFertilizante',
        required: true,
        label: ' Nombre Fertilizante',
        align: 'center',
        field: 'nombreFertilizante',
        sortable: true,
         format: val => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
    },
    {
        name: 'cantidad',
        required: true,
        label: 'Cantidad',
        align: 'center',
        field: 'cantidad',
    },
    {
        name: 'fecha',
        required: true,
        label: 'Fecha',
        align: 'center',
        field: 'fecha',
        sortable: true,
        format: (val) => {
            if (!val) return '';

            const fechaIngreso = new Date(val);
            const fechaColombia = new Date(fechaIngreso.toLocaleString("en-US", { timeZone: "America/Bogota" }));

            return fechaColombia.toLocaleDateString("es-CO", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }) + ' ' + fechaColombia.toLocaleTimeString("es-CO", {
                hour: '2-digit',
                minute: '2-digit'
            });
        },
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

//  listar cultivos

let cultivos = [];
let datos = {};
const options = ref(cultivos);

function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = cultivos.filter((v) => v.label.toLowerCase().indexOf(needle) > -1);
  });
}

async function listarCultivos() {
  const data = await useCultivo.listarCultivo();
  data.data.cultivo.forEach((item) => {
    datos = {
      label: `${item.nombre} - ${item.tipo}`,
      value: item._id,
    };
    cultivos.push(datos);
  });
  console.log(cultivos);
}


//listar empleado
let empleados = [];
let dates = {};
const opciones = ref(empleados);

async function listarEmpleados() {
  const data = await useEmpleado.listarEmpleado();
  data.data.empleado.forEach((item) => {
    dates = {
      label: `${item?.nombre} - ${item.documento} `,
      value: item._id,
    };
    empleados.push(dates);
  });
  console.log(empleados);
}

function filtrarFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    opciones.value = empleados.filter((v) => v.label.toLowerCase().indexOf(needle) > -1);
  });
}
//listar Insumos
let insumos = []
let datesa = {}
const opcion = ref(insumos)

async function listarInsumos() {
    const data = await useInsumo.listarInsumos();
    data.data.insumo.forEach(item => {
        datesa = {
            label: `${item?.nombre} - ${item.registro_ICA} `,
            value: item._id
        };
        insumos.push(datesa);
    })
    console.log(insumos);
}

function filtraFn(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        opciones.value = insumos.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });
}




async function listarFertilizacion() {
    const r = await useFertilizacion.listarFertilizacion()
    rows.value = r.data.fert.reverse()
    console.log(r.data.fert);
};

function validarIngresoFertilizacion() {
    // let validacionnumeros = /^[0-9]+$/;
    if (idCultivo.value == "") {
        Notify.create("Se debe seleccionar idCultivo");
    } else if (idEmpleado.value == "") {
        Notify.create("Se debe seleccionar el Empleado");
    } else if (idInsumo.value == "") {
        Notify.create("Se debe seleccionar el Insumo");
    } else if (estadoFenologico.value == "" || estadoFenologico.value.trim().length === 0) {
        Notify.create("Se debe agregar estadoFenologico");
    } else if (tipo.value == "" || tipo.value.trim().length === 0) {
        Notify.create("Se debe agregar tipo de fertilizacion");
    } else if (nombreFertilizante.value == "" || nombreFertilizante.value.trim().length === 0) {
        Notify.create("Se debe agregar nombre Fertilizante");
    } else if (cantidad.value == "" || cantidad.value.trim().length === 0) {
        Notify.create("Se debe agregar cantidad de Fertilizante");
    } else {
        agregarFertilizacion()
        Limpiar()
        cerrar()
        Notify.create({
            type: "positive",
            message: "Fertilizacion agregado exitosamente",
        });
    }
}


async function agregarFertilizacion() {
    const r = await useFertilizacion.postFertilizacion({
        idCultivo: idCultivo.value.value,
        idEmpleado: idEmpleado.value.value,
        idInsumo: idInsumo.value.value,
        estadoFenologico: estadoFenologico.value,
        tipo: tipo.value,
        nombreFertilizante: nombreFertilizante.value,
        cantidad: cantidad.value,

    })
    cerrar()
    Limpiar()
    listarFertilizacion()
    console.log(r);
}

function traerFertilizacion(fertilizacion) {
    alert.value = true;
    accion.value = 2;
    id.value = fertilizacion._id;

    idCultivo.value = {
        label: fertilizacion.idCultivo.nombre,
        value: fertilizacion.idCultivo._id
    };
    idEmpleado.value = {
        label: fertilizacion.idEmpleado.nombre,
        value: fertilizacion.idEmpleado._id
    };
    idInsumo.value = {
        label: fertilizacion.idInsumo.nombre,
        value: fertilizacion.idInsumo._id
    };
    estadoFenologico.value = fertilizacion.estadoFenologico;
    tipo.value = fertilizacion.tipo;
    nombreFertilizante.value = fertilizacion.nombreFertilizante;
    cantidad.value = fertilizacion.cantidad;

}


function validarEdicionFertilizacion() {
    // let validacionnumeros = /^[0-9]+$/;
    if (idCultivo.value == "") {
        Notify.create("Se debe seleccionar idCultivo");
    } else if (idEmpleado.value == "") {
        Notify.create("Se debe seleccionar el Empleado");
    } else if (idInsumo.value == "") {
        Notify.create("Se debe seleccionar el Insumo");
    } else if (estadoFenologico.value == "" || estadoFenologico.value.trim().length === 0) {
        Notify.create("Se debe agregar estadoFenologico");
    } else if (tipo.value == "" || tipo.value.trim().length === 0) {
        Notify.create("Se debe agregar tipo de fertilizacion");
    } else if (nombreFertilizante.value == "" || nombreFertilizante.value.trim().length === 0) {
        Notify.create("Se debe agregar nombre Fertilizante");
    } else if (cantidad.value == "" || cantidad.value.trim().length === 0) {
        Notify.create("Se debe agregar cantidad de Fertilizante");
    } else {
        editarFertilizacion()
        Limpiar()
        cerrar()
        Notify.create({
            type: "positive",
            message: "Edicion de Fertilizacion agregada exitosamente",
        });
    }
}

async function editarFertilizacion() {
    try {
        await useFertilizacion.putFertilizacion(id.value, {
        idCultivo: idCultivo.value.value,
        idEmpleado: idEmpleado.value.value,
        idInsumo: idInsumo.value.value,
        estadoFenologico: estadoFenologico.value,
        tipo: tipo.value,
        nombreFertilizante: nombreFertilizante.value,
        cantidad: cantidad.value,
        })
        listarFertilizacion()
    } catch (error) {
        console.error('Error de actualizar Fertilizacion', error)
        Notify.create('Ocurrio un error al editar datos de Fertilizacion')
    }
}

function Limpiar() {
    idCultivo.value = ""
    idEmpleado.value = ""
    idInsumo.value = ""
    estadoFenologico.value = ""
    tipo.value = ""
    nombreFertilizante.value = ""
    cantidad.value = ""
}


onMounted(() => {

    listarFertilizacion()
    listarCultivos()
    listarEmpleados()
    listarInsumos()
})

</script>