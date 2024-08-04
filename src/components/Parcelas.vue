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
                            {{ accion == 1 ? "Agregar Parcela" : "Editar Parcela "}}
                        </div>
                    </q-card-section>
                    <q-select outlined v-model="idFinca" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="options" @filter="filterFn"
                        label="Selecciona  la Finca">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-input outlined v-model="asistenteTecnico" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Nombre del asistente Tecnico" type="text" />
                    <q-input outlined v-model="ubicacion" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ubicacion donde esta la parcela" type="text" />    
                    <q-input outlined v-model="numero" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="numero de la parcela" type="tel" required pattern="[0-9]+"
                        maxlength="10" />
                    <q-input outlined v-model="cultivoAnterior" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="cultivo Anterior" type="text" />
                    <q-input outlined v-model="cultivoActual" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="cultivo Actual" type="text" />
                    <q-input outlined v-model="detalle" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Detalle donde esta la Parcela" type="text" />
                    <q-input outlined v-model="area" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Area de la Parcela" type="text" />
                    <q-card-actions align="right">
                        <q-btn v-if="accion === 1" @click="validarIngresoParcela()" color="red" class="text-white"
                            :loading="useParcela.loading">Agregar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn v-if="accion !== 1" @click="validarEdicionParcela()" color="red" class="text-white"
                            :loading="useParcela.loading">
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
                            <q-btn color="primary" @click="traerParcela(props.row)">
                                <q-tooltip>
                                    Editar
                                </q-tooltip>
                                <i class="fas fa-pencil-alt">
                                </i></q-btn>
                            <!-- botons de activado y desactivado -->
                            <q-btn v-if="props.row.estado == 1" @click="deshabilitarParcela(props.row)" color="negative">
                                <q-tooltip>
                                    Desactivar
                                </q-tooltip>
                                <i class="fas fa-times">
                                </i></q-btn>
                            <q-btn v-else color="positive" @click="habilitarParcela(props.row)">
                                <q-tooltip>
                                    Activar
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
import axios from 'axios';
import { useFincaStore } from "../stores/finca.js"
import { useParcelaStore } from "../stores/parcelas.js"

const useFinca = useFincaStore();
const useParcela = useParcelaStore();


let rows = ref([]);
let alert = ref(false);
let id = ref('');
let accion = ref(1);
let idFinca = ref("");
let asistenteTecnico = ref("");
let ubicacion = ref("");
let numero = ref("");
let cultivoAnterior = ref("");
let cultivoActual = ref("");
let detalle = ref("");
let area = ref("");



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
        name: 'asistenteTecnico',
        required: true,
        label: 'Nombre asistente Tecnico',
        align: 'center',
        field: 'asistenteTecnico',
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
        label: 'cultivo Anterior',
        align: 'center',
        field: 'cultivoAnterior',
        sortable: true
    },
    {
        name: 'cultivoActual',
        required: true,
        label: 'cultivo Actual',
        align: 'center',
        field: 'cultivoActual',
        sortable: true
    },
    {
        name: 'detalle',
        required: true,
        label: 'detalle Parcela',
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


async function listarParcela() {
    const r = await useParcela.listarParcela()
    rows.value = r.data.parcela.reverse()
    console.log(r.data.parcela);
};

function validarIngresoParcela() {
    let validacionnumeros = /^[0-9]+$/;
    if (idFinca.value == "") {
        Notify.create("Se debe seleccionar la Finca");
    } else if (asistenteTecnico.value == "" || asistenteTecnico.value.trim().length === 0) {
        Notify.create("Se debe agregar un Nombre de asistente Tecnico");
    } else if (ubicacion.value == "" || ubicacion.value.trim().length === 0) {
        Notify.create("Se debe agregar una Ubicacion de la Parcela");
    } else if (numero.value == "") {
        Notify.create("Se debe agregar un numero de la parcela");
    } else if (!validacionnumeros.test(numero.value)) {
        Notify.create("El numero de la parcela debe ser un numero");
    } else if (cultivoAnterior.value == "" || cultivoAnterior.value.trim().length === 0) {
        Notify.create("Se debe agregar un cultivo Anterior de la Parcela");
    } else if (cultivoActual.value == "" || cultivoActual.value.trim().length === 0) {
        Notify.create("Se debe agregar un cultivo Actual de la Parcela");
    } else if (detalle.value == "" || detalle.value.trim().length === 0) {
        Notify.create("Se debe agregar un Detalle de la Parcela");
    }  else if (area.value == "" || area.value.trim().length === 0) {
        Notify.create("Se debe agregar una Area de la Parcela");
    } else {
        agregarParcela()
        Limpiar()
        cerrar()
        Notify.create({
            type: "positive",
            message: "Parcela agregada exitosamente",
        });
    }
}


async function agregarParcela() {
    const r = await useParcela.postParcela({
        idFinca: idFinca.value.value,
        asistenteTecnico: asistenteTecnico.value,
        ubicacion: ubicacion.value,
        numero: numero.value,
        cultivoAnterior: cultivoAnterior.value,
        cultivoActual: cultivoActual.value,
        detalle: detalle.value,
        area: area.value
    })
    cerrar()
    Limpiar()
    listarParcela()
    console.log(r);
}

async function habilitarParcela(parcela) {
    const res = await useParcela.putParcelaActiva(parcela._id)
        .then((response) => {
            console.log(response);
            listarParcela()
        })

        .catch((error) => {
            console.error('Error de Parcela', error);
            Notify.create('Error al habilitar la Parcela')
        })
}

async function deshabilitarParcela(parcela) {
    const res = await useParcela.putParcelaInactiva(parcela._id)
        .then((response) => {
            console.log(response);
            listarParcela()
        })

        .catch((error) => {
            console.error('Error de Parcela', error);
            Notify.create('Error al deshabilitar la Parcela')
        })
}


function traerParcela(parcela) {
    alert.value = true;
    accion.value = 2;
    id.value = parcela._id;
    idFinca.value = {
        label: parcela.idFinca.nombre,
        value: parcela.idFinca._id
    }
    asistenteTecnico.value = parcela.asistenteTecnico;
    ubicacion.value = parcela.ubicacion;
    numero.value = parcela.numero;
    cultivoAnterior.value = parcela.cultivoAnterior;
    cultivoActual.value = parcela.cultivoActual;
    detalle.value = parcela.detalle;
    area.value = parcela.area;
}


function validarEdicionParcela() {
    let validacionnumeros = /^[0-9]+$/;
    if (idFinca.value == "") {
        Notify.create("Se debe seleccionar la Finca");
    } else if (asistenteTecnico.value == "" || asistenteTecnico.value.trim().length === 0) {
        Notify.create("Se debe agregar un Nombre de asistente Tecnico");
    } else if (ubicacion.value == "" || ubicacion.value.trim().length === 0) {
        Notify.create("Se debe agregar una Ubicacion de la Parcela");
    } else if (numero.value == "") {
        Notify.create("Se debe agregar un numero de la parcela");
    } else if (!validacionnumeros.test(numero.value)) {
        Notify.create("El numero de la parcela debe ser un numero");
    } else if (cultivoAnterior.value == "" || cultivoAnterior.value.trim().length === 0) {
        Notify.create("Se debe agregar un cultivo Anterior de la Parcela");
    } else if (cultivoActual.value == "" || cultivoActual.value.trim().length === 0) {
        Notify.create("Se debe agregar un cultivo Actual de la Parcela");
    } else if (detalle.value == "" || detalle.value.trim().length === 0) {
        Notify.create("Se debe agregar un Detalle de la Parcela");
    }  else if (area.value == "" || area.value.trim().length === 0) {
        Notify.create("Se debe agregar una Area de la Parcela");
    } else {
        editarParcela()
        Limpiar()
        cerrar()
        Notify.create({
            type: "positive",
            message: "Edicion de Parcela agregada exitosamente",
        });
    }
}

async function editarParcela() {
    try {
        await useParcela.putParcela(id.value, {
            idFinca: idFinca.value.value,
            asistenteTecnico: asistenteTecnico.value,
            ubicacion: ubicacion.value,
            numero: numero.value,
            cultivoAnterior: cultivoAnterior.value,
            cultivoActual: cultivoActual.value,
            ddetalle: detalle.value,
            area: area.value
        })
        listarParcela()
    } catch (error) {
        console.error('Error de actualizar Parcela', error)
        Notify.create('Ocurrio un error al editar datos de la Parcela')
    }
}

function Limpiar() {
    idFinca.value = ""
    asistenteTecnico.value = ""
    ubicacion.value = ""
    numero.value = ""
    cultivoAnterior.value = ""
    cultivoActual.value = ""
    detalle.value = ""
    area.value = ""
}


onMounted(() => {

    listarParcela()
    listarFincas()
    
})

</script>