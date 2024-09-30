<template>
    <div>
        <div style="display: flex; justify-content: flex-end;margin-left: 5%;  margin-right: 5%">
            <q-btn style="background-color: #00C04F; color: white;" class="q-my-md q-ml-md" @click="abrir()">Registrar
                Nomina</q-btn>
            <q-btn-dropdown color="blue" icon="visibility" label="Filtrar"
                style="display: flex; justify-content: center; align-items: center; margin-left: 16px;height: 20px;"
                class="q-my-md q-ml-md">
                <q-list>
                    <q-item clickable v-ripple @click="listarNominas()">
                        <q-item-section>Listar Todos</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="listarNominaActiva()">
                        <q-item-section>Listar Activos</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="listarNominaInactiva()">
                        <q-item-section>Listar Inactivos</q-item-section>
                    </q-item>
                </q-list>
            </q-btn-dropdown>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color:#009B44; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar Nomina" : "Editar Nomina " }}
                        </div>
                    </q-card-section>
                    <q-select outlined v-model="idEmpleado" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="opciones" @filter="filtrarFn" label="Selecciona el Empleado">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey"> Sin resultados </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-select outlined v-model="tipo" :options="['Nómina Ordinaria', 'Nómina por Horas', 'Nómina por Comisión', 'Nómina Complementaria', 'Nómina de Prestaciones', 'Nómina para Contratistas']" label="Seleccione el Tipo de Nomina"
                        class="q-my-md q-mx-md" />
                    <q-input outlined v-model="valor" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="valor de la nomina" type="tel" required pattern="[0-9]+"
                        maxlength="10" />
                    <q-card-actions align="right">
                        <q-btn v-if="accion === 1" @click="validarNomina()" color="red" class="text-white"
                            :loading="useNomina.loading">Agregar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn v-if="accion !== 1" @click="validarEdicionNomina()" color="red" class="text-white"
                            :loading="useNomina.loading">
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
            <q-table title="Nominas" title-class="text-green text-weight-bolder text-h4"
                table-header-class="text-black font-weight-bold" :rows="rows" :columns="columns" row-key="name"
                style="width: 90%; margin-bottom: 5%;">
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
                            <q-btn color="primary" @click="traerNominas(props.row)">
                                <q-tooltip>
                                    Editar
                                </q-tooltip>
                                <i class="fas fa-pencil-alt">
                                </i></q-btn>
                            <!-- botons de activado y desactivado -->
                            <q-btn v-if="props.row.estado == 1" @click="deshabilitarNomina(props.row)" color="negative">
                                <q-tooltip>
                                    Desacticar
                                </q-tooltip>
                                <i class="fas fa-times">
                                </i></q-btn>
                            <q-btn v-else color="positive" @click="habilitarNomina(props.row)">
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
import { useNominaStore } from "../stores/nomina.js"
import { useEmpleadoStore } from "../stores/empleado.js"


const useNomina = useNominaStore();
const useEmpleado = useEmpleadoStore();


let rows = ref([]);
let alert = ref(false);
let id = ref('');
let accion = ref(1);
let idEmpleado = ref('');
let tipo = ref('');
let valor = ref('');


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
        name: 'idEmpleado',
        required: true,
        label: 'Nombre Empleado',
        align: 'center',
        field: (row) => row.idEmpleado.nombre,
        sortable: true
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
        }
    },
    {
        name: 'tipo',
        required: true,
        label: 'Tipo de Nomina',
        align: 'center',
        field: 'tipo',
        sortable: true
    },
    {
        name: 'valor',
        required: true,
        label: 'Valor Nómina',
        align: 'center',
        field: 'valor',
        sortable: true,
        format: (valor) => {
            // Formatear el precio como pesos colombianos
            return valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
        }
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

// Filtrar datos de Empleados

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


const listarNominaActiva = async () => {
    try {
        const res = await useNomina.ListarNominaActiva();
        rows.value = res.nominas.reverse();
        Notify.create({
            message: "Listado de Nomina Activa",
            color: "green",
        });
        console.log(res.nominas);


    } catch (error) {
        console.error("Error al listar Nomina activa:", error);
        Notify.create("Error al obtener Nomina de Empleado activa");
    }
};

const listarNominaInactiva = async () => {
    try {
        const res = await useNomina.listarNominaInactiva();
        rows.value = res.nominas.reverse();
        Notify.create({
            message: "Listado de Nomina Inactiva",
            color: "green",
        });

        console.log(res.nominas);

    } catch (error) {
        console.error("Error al listar Nomina inactiva", error);
        Notify.create("Error al obtener listado de Nomina inactiva");
    }
};


// function filterFn(val, update, abort) {
//     update(() => {
//         const needle = val.toLowerCase();
//         options.value = fincas.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
//     });
// };



// Filtrar Datos de las Nominas

async function listarNominas() {
    const r = await useNomina.listarNominas()
    rows.value = r.data.nominas.reverse()
    console.log(r.data.nominas)
}

function validarNomina() {
    let validacionnumeros = /^[0-9]+$/;
    if (idEmpleado.value == "") {
        Notify.create("Se debe agregar el nombre de la Empleado");
    } else if (tipo.value == "" || tipo.value.trim().length === 0) {
        Notify.create("Se debe agregar tipo de la Nomina");
    } else if (valor.value == "") {
        Notify.create("Se debe agregar el valor de la Nomina");
    } else if (!validacionnumeros.test(valor.value)) {
        Notify.create("El valor de la Nomina debe ser numerico");
    } else {
        Notify.create({
            type: "positive",
            message: "Nomina agregada exitosamente",
        });
        cerrar()
        agregarNominas()

    }
}

function traerNominas(nominas) {
    accion.value = 2
    alert.value = true
    id.value = nominas._id
    idEmpleado.value = {
        label: nominas.idEmpleado.nombre,
        value: nominas.idEmpleado._id
    }
    tipo.value = nominas.tipo
    valor.value = nominas.valor
}

function validarEdicionNomina() {
    let validacionnumeros = /^[0-9]+$/;
    if (idEmpleado.value == "") {
        Notify.create("Se debe agregar el nombre de la Empleado");
    } else if (tipo.value == "" || tipo.value.trim().length === 0) {
        Notify.create("Se debe agregar tipo de la Nomina");
    } else if (valor.value == "") {
        Notify.create("Se debe agregar el valor de la Nomina");
    } else if (!validacionnumeros.test(valor.value)) {
        Notify.create("El valor de la Nomina debe ser numerico");
    } else {
        Notify.create({
            type: "positive",
            message: "Nomina editada exitosamente",
        });
        cerrar()
        editarNomina()

    }
}


async function editarNomina() {
    try {
        await useNomina.putNomina(id.value, {
            idEmpleado: idEmpleado.value.value,
            tipo: tipo.value,
            valor: valor.value,
        })

        listarNominas()

    } catch (error) {
        console.error('Error de actualizar Nomina', error)
        Notify.create('Ocurrio un error al editar datos de la Nomina')
    }
}

async function agregarNominas() {
    const r = await useNomina.postNomina({
        idEmpleado: idEmpleado.value.value,
        tipo: tipo.value,
        valor: valor.value,
    })
    cerrar()
    listarNominas()
    console.log(r);
}



async function habilitarNomina(nominas) {
    const res = await useNomina.putNominaActiva(nominas._id)
        .then((response) => {
            console.log(response);
            listarNominas()
        })

        .catch((error) => {
            console.error('Error de Nomina', error);
            Notify.create('Error al habilitar la Nomina')
        })
}

async function deshabilitarNomina(nominas) {
    const res = await useNomina.putNominaInactiva(nominas._id)
        .then((response) => {
            console.log(response);
            listarNominas()
        })
        .catch((error) => {
            console.error('Error de Nomina', error);
            Notify.create('Error al deshabilitar la Nomina')
        })
}

function Limpiar() {
    idEmpleado.value = ''
    tipo.value = ''
    valor.value = ''
}

onMounted(() => {
    listarNominas()
    listarEmpleados()

})

</script>