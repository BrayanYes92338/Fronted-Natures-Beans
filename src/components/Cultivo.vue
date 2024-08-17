<template>
    <div>
        <div style="display: flex; justify-content: flex-end;margin-left: 5%;  margin-right: 5%">
            <q-btn color="red" class="q-my-md q-ml-md" @click="abrir()">Registrar Cultivo</q-btn> <q-btn-dropdown
                color="green" icon="visibility" label="Filtrar"
                style="display: flex; justify-content: center; align-items: center; margin-left: 16px;height: 20px;"
                class="q-my-md q-ml-md">
                <q-list>
                    <q-item clickable v-ripple @click="listarCultivo()">
                        <q-item-section>Listar Todos</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="listarCultivosActivo()">
                        <q-item-section>Listar Activos</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="listarCultivosInactivo()">
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
                            {{ accion == 1 ? "Agregar Cultivo" : "Editar Cultivo " }}
                        </div>
                    </q-card-section>
                    <q-select outlined v-model="idParcela" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="options" @filter="filterFn"
                        label="Selecciona el detalle de la Parcela">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-input outlined v-model="nombre" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="nombre del cultivo" type="text" />
                    <q-input outlined v-model="tipo" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="tipo Cultivo" type="text" />
                    <q-card-actions align="right">
                        <q-btn v-if="accion === 1" @click="validarCultivo()" color="red" class="text-white"
                            :loading="useCultivo.loading">Agregar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn v-if="accion !== 1" @click="validarEdicionCultivo()" color="red" class="text-white"
                            :loading="useCultivo.loading">
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
            <q-table title="Cultivos" title-class="text-red text-weight-bolder text-h4"
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
                            <q-btn color="primary" @click="traerCultivos(props.row)">
                                <q-tooltip>
                                    Editar
                                </q-tooltip>
                                <i class="fas fa-pencil-alt">
                                </i></q-btn>
                            <!-- botons de activado y desactivado -->
                            <q-btn v-if="props.row.estado == 1" @click="deshabilitarCultivo(props.row)"
                                color="negative">
                                <q-tooltip>
                                    Desactivar
                                </q-tooltip>
                                <i class="fas fa-times">
                                </i></q-btn>
                            <q-btn v-else color="positive" @click="habilitarCultivos(props.row)">
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
import { useCultivoStore } from "../stores/cultivo.js";
import { useParcelaStore } from "../stores/parcelas.js"



const useCultivo = useCultivoStore();
const useParcela = useParcelaStore();

let rows = ref([]);
let alert = ref(false);
let id = ref('');
let accion = ref(1);
let idParcela = ref('');
let nombre = ref('');
let tipo = ref('');


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
        name: 'nombre',
        required: true,
        label: 'Nombre del Cultivo',
        align: 'center',
        field: 'nombre',
        sortable: true,
        format: (val) => {
      return val.charAt(0).toUpperCase() + val.slice(1);
    }
    },
    {
        name: 'idParcela',
        required: true,
        label: 'Detalle Parcela',
        align: 'center',
        field: (row) => row.idParcela.detalle,
        sortable: true
    },

    {
        name: 'tipo',
        required: true,
        label: 'Tipo Cultivo',
        align: 'center',
        field: 'tipo',
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



let parcela = []
let datos = {}
const options = ref(parcela)

async function listarParcela() {
    const data = await useParcela.listarParcela()
    data.data.parcela.forEach(item => {
        datos = {
            label: `${item?.detalle} - ${item.numero} `,
            value: item._id

        };
        parcela.push(datos);
    })
    console.log(parcela);

}

function filterFn(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        options.value = parcela.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });
};




async function listarCultivo() {
    const r = await useCultivo.listarCultivo()
    rows.value = r.data.cultivo.reverse()
    console.log(r.data.cultivo)
}
const listarCultivosActivo = async () => {
    try {
        const res = await useCultivo.ListarCultivoActivo();
        rows.value = res.cultivo;
        Notify.create({
            message: "Listado de Parcela Activos",
            color: "green",
        });
        console.log("hola");


    } catch (error) {
        console.error("Error al listar Parcela activos:", error);
        Notify.create("Error al obtener Parcela de Usuarios activos");
    }
};

const listarCultivosInactivo = async () => {
    try {
        const res = await useCultivo.ListarCultivoInactivo();
        rows.value = res.cultivo;
        Notify.create({
            message: "Listado de Parcela Inactivos",
            color: "green",
        });
    } catch (error) {
        console.error("Error al listar Parcela inactivos:", error);
        Notify.create("Error al obtener listado de Parcela inactivos");
    }
};
function validarCultivo() {
    // let validacionnumeros = /^[0-9]+$/; 
    if (idParcela.value == "") {
        Notify.create("Se debe agregar el numero de la Parcela");
    } else if (nombre.value == "" || nombre.value.trim().length === 0) {
        Notify.create("Se debe agregar el nombre del cultivo");
    } else if (tipo.value == "" || tipo.value.trim().length === 0) {
        Notify.create("Se debe agregar el tipo de cultivo ");
    } else {
        Notify.create({
            type: "positive",
            message: "Cultivo agregado exitosamente",
        });
        cerrar()
        agregarCultivo()

    }
}

function traerCultivos(cultivo) {
    accion.value = 2
    alert.value = true
    id.value = cultivo._id
    idParcela.value = {
        label: cultivo.idParcela.detalle,
        value: cultivo.idParcela._id
    }

    nombre.value = cultivo.nombre
    tipo.value = cultivo.tipo
}

function validarEdicionCultivo() {
    // let validacionnumeros = /^[0-9]+$/; 
    if (idParcela.value == "") {
        Notify.create("Se debe agregar el numero de la Parcela");
    } else if (nombre.value == "" || nombre.value.trim().length === 0) {
        Notify.create("Se debe agregar el nombre del cultivo");
    } else if (tipo.value == "" || tipo.value.trim().length === 0) {
        Notify.create("Se debe agregar el tipo de cultivo ");
    } else {
        Notify.create({
            type: "positive",
            message: "Cultivo agregado exitosamente",
        });
        cerrar()
        editarCultivo()

    }
}


async function editarCultivo() {
    try {
        await useCultivo.putCultivo(id.value, {
            idParcela: idParcela.value.value,
            nombre: nombre.value,
            tipo: tipo.value
        })

        listarCultivo()

    } catch (error) {
        console.error('Error de actualizar Cultivo', error)
        Notify.create('Ocurrio un error al editar datos del Cultivo')
    }
}

async function agregarCultivo() {
    const r = await useCultivo.postCultivo({
        idParcela: idParcela.value.value,
        nombre: nombre.value,
        tipo: tipo.value
    })
    cerrar()
    listarCultivo()
    console.log(r);
}



async function habilitarCultivos(cultivos) {
    const res = await useCultivo.putCultivoActiva(cultivos._id)
        .then((response) => {
            console.log(response);
            listarCultivo()
        })

        .catch((error) => {
            console.error('Error de Cultivo', error);
            Notify.create('Error al habilitar el Cultivo')
        })
}

async function deshabilitarCultivo(cultivos) {
    const res = await useCultivo.putCultivoInactiva(cultivos._id)
        .then((response) => {
            console.log(response);
            listarCultivo()
        })

        .catch((error) => {
            console.error('Error de Cultivo', error);
            Notify.create('Error al deshabilitar el Cultivo')
        })
}

function Limpiar() {
    idParcela.value = ''
    nombre.value = ''
    tipo.value = ''
}

onMounted(() => {
    listarCultivo()
    listarParcela()



})

</script>