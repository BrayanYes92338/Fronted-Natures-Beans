<template>
    <div>
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="red" class="q-my-md q-ml-md" @click="abrir()">Registrar Finca</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color:#009B44; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar Finca" : "Editar Finca" }}
                        </div>
                    </q-card-section>
                    <q-select outlined v-model="idUsuario" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="options" @filter="filterFn"
                        label="Selecciona el Responsable de la Finca">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-input outlined v-model="nombre" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Nombre de la Finca" type="text" />
                    <q-input outlined v-model="ruc" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="R.U.C de la Finca" type="tel" required pattern="[0-9]+"
                        maxlength="10" />
                    <q-input outlined v-model="departamento" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Departamento donde esta la Finca" type="text" />
                    <q-input outlined v-model="ciudad" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ciudad donde esta la Finca" type="text" />
                    <q-input outlined v-model="direccion" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Direccion donde esta la Finca" type="text" />
                    <q-input outlined v-model="ubicacion" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ubicacion donde esta la Finca" type="text" />
                    <q-input outlined v-model="area" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Area de la Finca" type="text" />
                    <q-card-actions align="right">
                        <q-btn v-if="accion === 1" @click="validarIngresoFincas()" color="red" class="text-white"
                            :loading="useFinca.loading">Agregar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn v-if="accion !== 1" @click="" color="red" class="text-white"
                            :loading="useFinca.loading">
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
            <q-table title="Fincas" title-class="text-red text-weight-bolder text-h4"
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
                        <div style="display: flex; gap:15px; justify-content: center;">
                            <!-- boton de editar -->
                            <q-btn color="primary" @click="">
                                <q-tooltip>
                                    Editar
                                </q-tooltip>
                                <i class="fas fa-pencil-alt">
                                </i></q-btn>
                            <!-- botons de activado y desactivado -->
                            <q-btn v-if="props.row.estado == 1" @click="" color="negative">
                                <q-tooltip>
                                    Desacticar
                                </q-tooltip>
                                <i class="fas fa-times">
                                </i></q-btn>
                            <q-btn v-else color="positive" @click="">
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
import { useUsuarioStore } from "../stores/usuario.js"
import { useFincaStore } from "../stores/finca.js"

const useUsuario = useUsuarioStore();
const useFinca = useFincaStore();

let rows = ref([]);
let alert = ref(false);
let id = ref('');
let accion = ref(1);
let idUsuario = ref("");
let nombre = ref("");
let ruc = ref("");
let departamento = ref("");
let ciudad = ref("");
let direccion = ref("");
let ubicacion = ref("");
let norte = ref("");
let sur = ref("");
let este = ref("");
let oeste = ref("");
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
        name: 'idUsuario',
        required: true,
        label: 'Responsable de la Finca',
        align: 'center',
        field: (row) => row.idUsuario.nombre,
        sortable: true
    },
    {
        name: 'nombre',
        required: true,
        label: 'Nombre Finca',
        align: 'center',
        field: 'nombre',
        sortable: true
    },
    {
        name: 'ruc',
        required: true,
        label: 'R.U.C Finca',
        align: 'center',
        field: 'ruc',
        sortable: true
    },
    {
        name: 'departamento',
        required: true,
        label: 'Departamento',
        align: 'center',
        field: 'departamento',
        sortable: true
    },
    {
        name: 'ciudad',
        required: true,
        label: 'Ciudad',
        align: 'center',
        field: 'ciudad',
        sortable: true
    },
    {
        name: 'direccion',
        required: true,
        label: 'Direccion Finca',
        align: 'center',
        field: 'direccion',
        sortable: true
    },
    {
        name: 'ubicacion',
        required: true,
        label: 'Ubicacion Finca',
        align: 'center',
        field: 'ubicacion',
        sortable: true
    },
    {
        name: 'area',
        required: true,
        label: 'Area Finca',
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

let usuarios = []
let datos = {}
const options = ref(usuarios)

function filterFn(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        options.value = usuarios.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });
};


async function listarUsuarios(){
    const data =  await useUsuario.listarUsuarios()
    data.data.usuario.forEach(item => {
        datos = {
            label: `${item?.nombre} - ${item.rol} `,
            value: item._id


        };
        usuarios.push(datos);
    });
    console.log(usuarios); 

}


async function listarFincas() {
    const r = await useFinca.listarFincas()
    rows.value = r.data.fincas.reverse()
    console.log(r.data.fincas);
};

function validarIngresoFincas(){
    let validacionnumeros = /^[0-9]+$/;
    if(idUsuario.value == ""){
        Notify.create("Se debe agregar un Responsable de la Finca");
    }else if (nombre.value == ""|| nombre.value.trim().length === 0) {
        Notify.create("Se debe agregar un Nombre de la Finca");
    }else if(ruc.value == "" || ruc.value.trim().length === 0 ){
        Notify.create("Se debe agregar un R.U.C de la Finca");
    }else if(!validacionnumeros.test(ruc.value)){
        Notify.create("El R.U.C de la Finca debe ser un numero");
    }else if(departamento.value == "" || departamento.value.trim().length === 0){
        Notify.create("Se debe agregar un Departamento de la Finca");
    }else if(ciudad.value == "" || ciudad.value.trim().length === 0){
        Notify.create("Se debe agregar una Ciudad de la Finca");
    }else if(direccion.value == "" || direccion.value.trim().length === 0){
        Notify.create("Se debe agregar una Direccion de la Finca");
    }else if(ubicacion.value == "" || ubicacion.value.trim().length === 0){
        Notify.create("Se debe agregar una Ubicacion de la Finca");
    }else if(area.value == "" || area.value.trim().length === 0){
        Notify.create("Se debe agregar una Area de la Finca");
    } else {
        agregarFincas()
        Limpiar()
        Notify.create({
            type: "positive",
            message: "Ingreso agregado exitosamente",
        });
    }
}


async function agregarFincas(){
    const r = await useFinca.postFincas({
        idUsuario: idUsuario.value.value,
        nombre: nombre.value,
        ruc: ruc.value,
        departamento: departamento.value,
        ciudad: ciudad.value,
        direccion: direccion.value,
        ubicacion: ubicacion.value,
        area: area.value
    })
    cerrar()
    Limpiar()
    listarFincas()
    console.log(r);
} 


function Limpiar() {
    idUsuario.value = ""
    nombre.value = ""
    ruc.value = ""
    departamento.value = ""
    ciudad.value = ""
    direccion.value = ""
    ubicacion.value = ""
    area.value = ""
}


onMounted(() => {
    listarUsuarios()
    listarFincas()

})

</script>