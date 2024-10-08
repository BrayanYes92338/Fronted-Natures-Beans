<template>
    <div>
        <div style="display: flex; justify-content: flex-end; margin-left: 5%; margin-right: 5%; ">
            <q-btn style="background-color: #00C04F; color: white;" class="q-my-md q-ml-md" @click="abrir()">Registrar
                Clima</q-btn>
            <q-btn-dropdown color="blue" icon="visibility" label="Filtrar"
                style="display: flex; justify-content: center; align-items: center; margin-left: 16px;height: 20px;"
                class="q-my-md q-ml-md">
                <q-list>
                    <q-item clickable v-ripple @click="listarClimas()">
                        <q-item-section>Listar Todos</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="mostrar()">
                        <q-item-section>Listar Tipo de Clima</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="">
                        <q-item-section>Listar Fechas</q-item-section>
                    </q-item>
                </q-list>
            </q-btn-dropdown>
        </div>
        <!-- Modelo para listar Tipo de Clima -->
        <div>
            <q-dialog v-model="alerta" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #009B44; margin-bottom: 20px">
                        <div class="text-h6 text-white">Buscar Tipo de Clima</div>
                    </q-card-section>
                    <q-select outlined v-model="tipoClima" :options="['Heladas', 'Granizo', 'Lluvias']"
                        label="Seleccione el tipo de Clima" class="q-my-md q-mx-md" />
                    <q-card-actions align="right">
                        <q-btn color="red" class="text-white" :loading="useClima.loading" @click="listarTipoClima()">
                            Buscar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn label="Cerrar" color="black" outline @click="cerrar2()" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color:#009B44; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar Clima" : "Editar Clima " }}
                        </div>
                    </q-card-section>
                    <q-select outlined v-model="idFinca" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="options" @filter="filterFn" label="Seleccionar  la Finca">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-select outlined v-model="idEmpleado" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="opciones" @filter="filtrarFn" label="Selecciona el Empleado">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-select outlined v-model="tipoClima" :options="['Heladas', 'Granizo', 'Lluvias']"
                        label="Seleccione el tipo de Clima" class="q-my-md q-mx-md" />
                    <q-input outlined v-model="horaInicio" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Horario de Inicio" type="time" />
                    <q-input outlined v-model="horaFinal" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Horario Final" type="time" />
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
            <q-table :filter="buscar" title="Climas" title-class="text-green text-weight-bolder text-h4"
                table-header-class="text-black font-weight-bold" :rows="rows" :columns="columns" row-key="name"
                style="width: 90%; margin-bottom: 5%;">
                <template v-slot:top-right>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <!-- Primer input de tipo date -->
                        <q-input v-model="fechaInicio" type="date" label="Fecha Inicio" class="q-my-md q-mx-md" />

                        <!-- Segundo input de tipo date -->
                        <q-input v-model="fechaFin" type="date" label="Fecha Fin" class="q-my-md q-mx-md" />

                        <!-- Input de búsqueda -->
                        <q-input color="black" v-model="buscar" placeholder="Buscar">
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                        </q-input>

                    </div>
                </template>

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
import { useClimaStore } from "../stores/clima.js";
import { useFincaStore } from "../stores/finca.js";
import { useEmpleadoStore } from '../stores/empleado.js';


const useClima = useClimaStore();
const useFinca = useFincaStore();
const useEmpleado = useEmpleadoStore();
const buscar = ref("")


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
let alerta = ref(false)
let fechaInicio = ref('')
let fechaFin = ref('')


function abrir() {
    accion.value = 1
    alert.value = true;
}

function cerrar() {
    alert.value = false;
    Limpiar()
}


function mostrar() {
    alerta.value = true

}

function cerrar2() {
    alerta.value = false
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
        sortable: true,
        format: (val) => {
            try {
                const [hours, minutes] = val.split(":");
                const date = new Date();
                date.setHours(parseInt(hours));
                date.setMinutes(parseInt(minutes));

                return date.toLocaleTimeString("es-CO", {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });
            } catch (error) {
                console.error("Error formateando la hora final:", error);
                return "Hora inválida";
            }
        }
    },
    {
        name: 'horaFinal',
        required: true,
        label: 'hora Final',
        align: 'center',
        field: 'horaFinal',
        sortable: true,
        format: (val) => {
            try {
                const [hours, minutes] = val.split(":");
                const date = new Date();
                date.setHours(parseInt(hours));
                date.setMinutes(parseInt(minutes));

                return date.toLocaleTimeString("es-CO", {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });
            } catch (error) {
                console.error("Error formateando la hora final:", error);
                return "Hora inválida";
            }
        }
    },
    {
        name: 'tempMin',
        required: true,
        label: 'Temperatura Minima',
        align: 'center',
        field: 'tempMin',
        format: (val) => `${val} °C`,
        sortable: true
    },
    {
        name: 'tempMax',
        required: true,
        label: 'Temperatura Maxima',
        align: 'center',
        field: 'tempMax',
        sortable: true,
        format: (val) => `${val} °C`,
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

async function listarTipoClima() {
    try {
        console.log(tipoClima.value);
        const r = await useClima.tipoClima(tipoClima.value);
        console.log(r);
        console.log(r.data);
        rows.value = r.data.reverse();
        Notify.create({
            message: "Busqueda Existosa",
            position: "top",
            color: 'green',
            timeout: 3000
        })
        cerrar2()
        console.log(r.data);
    } catch (error) {
        console.error('Error al listar tipos de clima:', error);
    }
}

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
    horaInicio.value = clima.horaInicio;
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