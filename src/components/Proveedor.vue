<template>
    <div>
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="red" class="q-my-md q-ml-md" @click="abrir()">Registrar proveedor</q-btn>
	        <!-- AQUI VA EL SELECT -->
            <!-- <q-select outlined v-model="listar" :options="['LISTAR TODO', 'LISTAR ACTIVOS', 'LISTAR INACTIVOS']" label="LISTAR"
            class="q-my-md q-mx-md"/> -->
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color:#009B44; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar Proveedor" : "Editar Provedor " + nombreF }}
                        </div>
                    </q-card-section>
                   <q-input outlined v-model="nombre" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Nombre del proveedor" type="text" />
                    <q-input outlined v-model="direccion" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Direccion del proveedor" type="text" />
                    <q-input outlined v-model="telefono" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="telefono del proveedor" type="tel" required pattern="[0-9]+"
                        maxlength="10" />
                    <q-input outlined v-model="correo" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Correo del proveedor" type="email" />
                    <q-card-actions align="right">
                        <q-btn v-if="accion === 1" @click="validarProveedor()" color="red" class="text-white"
                            :loading="useProveedor.loading">Agregar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn v-if="accion !== 1" @click="validarEdicionProveedor()" color="red" class="text-white"
                            :loading="useProveedor.loading">
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
            <q-table title="Proveedores" title-class="text-red text-weight-bolder text-h4"
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
                            <q-btn color="primary" @click="traerProveedor(props.row)">
                                <q-tooltip>
                                    Editar
                                </q-tooltip>
                                <i class="fas fa-pencil-alt">
                                </i></q-btn>
                            <!-- botons de activado y desactivado -->
                             <q-btn v-if="props.row.estado == 1" @click="deshabilitarProveedor(props.row)"
                                color="negative">
                                <q-tooltip>
                                    Desactivar
                                </q-tooltip>
                                <i class="fas fa-times">
                                </i></q-btn>
                            <q-btn v-else color="positive" @click="habilitarProveedor(props.row)">
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
import { useProveedorStore } from '../stores/proveedor';
import axios from 'axios';

const useProveedor = useProveedorStore();

let rows = ref([])
let nombre = ref("")
let direccion = ref("")
let correo = ref("")
let telefono = ref("")
let id = ref("")
let accion = ref(1)
let alert = ref(false)
let alerta = ref(false)
let nombreF = ref("")

function abrir() {
    accion.value = 1;
    alert.value = true;
}

function cerrar() {
    alert.value = false;
}

// function cerrar2() {
//     alerta.value = false;
// }

const columns = ref([
    {
        name: 'nombre',
        required: true,
        label: 'Nombre proveedor',
        align: 'center',
        field: 'nombre',
        sortable: true
    },
    {
        name: 'direccion',
        required: true,
        label: 'Direccion Proveedor',
        align: 'center',
        field: 'direccion',
        sortable: true
    },
    {
        name: 'telefono',
        required: true,
        label: 'Telefono Proveedor',
        align: 'center',
        field: 'telefono',
        sortable: true
    },
    {
        name: 'correo',
        required: true,
        label: 'Correo Electronico',
        align: 'center',
        field: 'correo',
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



async function listarProveedor() {
    const r = await useProveedor.listarProveedor();
    rows.value = r.data.proveedor.reverse()
    console.log(r.data.proveedor)
}

function validarProveedor() {
    let validacionnumeros = /^[0-9]+$/;
    let validacionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (nombre.value == "" || nombre.value.trim().length === 0) {
        Notify.create("Se debe agregar un nombre de Proveedor");
    } else if (direccion.value == "" || direccion.value.trim().length === 0) {
        Notify.create("Se debe agregar una direccion de Proveedor");
    } else if (telefono.value == "" || telefono.value.trim().length === 0) {
        Notify.create("Se debe agregar un telefono de Proveedor");
    } else if (!validacionnumeros.test(telefono.value)) {
        Notify.create("El telefono solo debe llevar numeros");
    }else if (correo.value == "" || correo.value.trim().length === 0) {
        Notify.create("Se debe agregar un correo de Proveedor");
    } else if (!validacionCorreo.test(correo.value)) {
        Notify.create("El correo del Proveedor no es valido");
    }  else {
        agregarProveedor();
        limpiar();
        Notify.create({
            type: "positive",
            message: "Proveedor agregado exitosamente",
        });
    }
}

async function agregarProveedor() {
    const r = await useProveedor.postProveedor({
        nombre: nombre.value,
        direccion: direccion.value,
        telefono: telefono.value,
        correo: correo.value,
    });
    cerrar();
    limpiar()
    listarProveedor();
    console.log(r);
}

async function habilitarProveedor(proveedor) {
    const res = await useProveedor.putProveedorActivo(proveedor._id)
        .then((res) => {
            console.log(res);
            listarProveedor()
        })

        .catch((error) => {
            console.error('Error de Proveedor', error);
            Notify.create('Error al habilitar el Proveedor')
        })

}

async function deshabilitarProveedor(proveedor) {
    const res = await useProveedor.putProveedorInactivo(proveedor._id)
        .then((res) => {
            console.log(res);
            listarProveedor()
        })

        .catch((error) => {
            console.error('Error de Proveedor', error);
            Notify.create('Error al deshabilitar el Proveedor')
        })

}

function traerProveedor(proveedor){
    alert.value = true;
    accion.value = 2;
    id.value = proveedor._id;
    nombre.value = proveedor.nombre;
    nombreF.value = proveedor.nombre;
    direccion.value = proveedor.direccion;
    correo.value = proveedor.correo;
    telefono.value = proveedor.telefono;
}

function validarEdicionProveedor() {
    let validacionnumeros = /^[0-9]+$/;
    let validacionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (nombre.value == "" || nombre.value.trim().length === 0) {
        Notify.create("Se debe agregar un nombre de Proveedor");
    } else if (direccion.value == "" || direccion.value.trim().length === 0) {
        Notify.create("Se debe agregar una direccion de Proveedor");
    } else if (telefono.value == "" || telefono.value.trim().length === 0) {
        Notify.create("Se debe agregar un telefono de Proveedor");
    } else if (!validacionnumeros.test(telefono.value)) {
        Notify.create("El telefono solo debe llevar numeros");
    }else if (correo.value == "" || correo.value.trim().length === 0) {
        Notify.create("Se debe agregar un correo de Proveedor");
    } else if (!validacionCorreo.test(correo.value)) {
        Notify.create("El correo del Proveedor no es valido");
    }  else {
    editarProveedor();
    limpiar();
    cerrar();
    Notify.create({
        type: "positive",
        message: "Proveedor editado exitosamente",
    });
}
}

async function editarProveedor() {
    try {
        await useProveedor.putProveedor(id.value, {
            nombre: nombre.value,
            direccion: direccion.value,
            telefono: telefono.value,
            correo: correo.value,
        });
        listarProveedor();
    } catch (error) {
        console.error('Error al editar el Proveedor', error);
        Notify.create('Error al editar el Proveedor');
    }
}



function limpiar() {
    nombre.value = "";
    direccion.value = "";
    telefono.value = "";
    correo.value = "";
}

onMounted(() => {
    listarProveedor();
});
</script>
