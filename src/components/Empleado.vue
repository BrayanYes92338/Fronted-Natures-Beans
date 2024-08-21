<template>
    <div>
        <div style="display: flex; justify-content: flex-end;margin-left: 5%; margin-right: 5%">
            <q-btn  style="background-color: #00C04F; color: white;" class="q-my-md q-ml-md" @click="abrir()">Registrar Empleado</q-btn>
            <q-btn-dropdown color="blue" icon="visibility" label="Filtrar"
                style="display: flex; justify-content: center; align-items: center; margin-left: 16px;height: 20px;"
                class="q-my-md q-ml-md">
                <q-list>
                    <q-item clickable v-ripple @click="listarEmplados()">
                        <q-item-section>Listar Todos</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="listarEmpleadosActivo()">
                        <q-item-section>Listar Activos</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="listarEmpleadosInactivo()">
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
                            {{ accion == 1 ? "Agregar Empleado" : "Editar Empleado " }}
                        </div>
                    </q-card-section>
                    <q-input outlined v-model="nombre" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Nombre del Trabajador" type="text" />
                    <q-input outlined v-model="correo" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Correo del Trabajador" type="email" />
                    <q-input outlined v-model="documento" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Documento del Trabajador" type="tel" required pattern="[0-9]+"
                        maxlength="10" />
                    <q-input outlined v-model="direccion" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Direccion del Trabajador" type="text" />
                    <q-input outlined v-model="telefono" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Telefono del Trabajador" type="tel" required pattern="[0-9]+"
                        maxlength="10" />
                    <q-input outlined v-model="estudios" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Estudios del Trabajador" type="text" />
                        <q-select outlined v-model="descripcion" :options="['Agricultor','Meteorólogo','Téc de Mantenimiento', 'Gestor de Inventario', 'Coordinador de Riego','Operador de Maquinaria']" label="Seleccione el Rol del Trabajador"
                        class="q-my-md q-mx-md" />
                    <q-card-actions align="right">
                        <q-btn v-if="accion === 1" color="red" class="text-white" :loading="useEmpleado.loading"
                            @click="validarIngresoEmpleados()">Agregar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn v-if="accion !== 1" @click="validarEdicionEmpleado() " color="red" class="text-white" :loading="useEmpleado.loading" >
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
            <q-table title="Empleados" title-class="text-green text-weight-bolder text-h4"
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
                            <q-btn color="primary" @click="traerEmpleados(props.row)" >
                                <q-tooltip>
                                    Editar
                                </q-tooltip>
                                <i class="fas fa-pencil-alt">
                                </i></q-btn>
                            <!-- botons de activado y desactivado -->
                            <q-btn v-if="props.row.estado == 1" @click="deshabilitarEmpleado(props.row)" color="negative">
                                <q-tooltip>
                                    Desacticar
                                </q-tooltip>
                                <i class="fas fa-times">
                                </i></q-btn>
                            <q-btn v-else color="positive" @click="habilitarEmpleado(props.row)">
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
import { useEmpleadoStore } from '../stores/empleado.js';

const useEmpleado = useEmpleadoStore()

let rows = ref([]);
let alert = ref(false);
let id = ref('');
let accion = ref(1);
let nombre = ref("");
let correo = ref("");
let documento = ref("");
let direccion = ref("");
let telefono = ref("");
let estudios = ref("");
let descripcion = ref("");

function abrir() {
    accion.value = 1
    alert.value = true;
}

function cerrar() {
    alert.value = false;
    limpiar()
}

const columns = ref([
    {
        name: 'nombre',
        required: true,
        label: 'Nombre Empleado',
        align: 'center',
        field: 'nombre',
        sortable: true
    },
    {
        name: 'correo',
        required: true,
        label: 'Correo Empleado',
        align: 'center',
        field: 'correo',
        sortable: true
    },
    {
        name: 'documento',
        required: true,
        label: 'Documento Empleado',
        align: 'center',
        field: 'documento',
        sortable: true
    },
    {
        name: 'direccion',
        required: true,
        label: 'Direccion Empleado',
        align: 'center',
        field: 'direccion',
        sortable: true
    },
    {
        name: 'telefono',
        required: true,
        label: 'Telefono Empleado',
        align: 'center',
        field: 'telefono',
        sortable: true
    },
    {
        name: 'estudios',
        required: true,
        label: 'Estudios Empleado',
        align: 'center',
        field: 'estudios',
        sortable: true
    },
    {
        name: 'descripcion',
        required: true,
        label: 'Rol del Empleado',
        align: 'center',
        field: 'descripcion',
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

async function listarEmplados() {
    const r = await useEmpleado.listarEmpleado()
    rows.value = r.data.empleado.reverse()
    console.log(r.data.empleado);
}
const listarEmpleadosActivo = async () => {
    try {
        const res = await useEmpleado.ListarEmpleadoActivo();
        rows.value = res.empleado;
        Notify.create({
            message: "Listado de Empleados Activos",
            color: "green",
        });
        console.log("hola");
        
        
    } catch (error) {
        console.error("Error al listar Empleados activos:", error);
        Notify.create("Error al obtener Empleados de Usuarios activos");
    }
};

const listarEmpleadosInactivo = async () => {
    try {
        const res = await useEmpleado.ListarEmpleadoInactivo();
        rows.value = res.empleado;

            console.log(res);
            
        Notify.create({
            message: "Listado de Empleados Inactivos",
            color: "green",
        });
    } catch (error) {
        console.error("Error al listar Empleados inactivos:", error);
        Notify.create("Error al obtener listado de Empleados inactivos");
    }
};

function validarIngresoEmpleados() {
    let validacionnumeros = /^[0-9]+$/;
    let validacionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (nombre.value == "" || nombre.value.trim().length === 0) {
        Notify.create("Se debe agregar nombre del Empleado");
    } else if (correo.value == "" || correo.value.trim().length === 0) {
        Notify.create("Se debe agregar un correo de Usuario");
    } else if (!validacionCorreo.test(correo.value)) {
        Notify.create("El correo del usuario no es valido");
    } else if (documento.value == "") {
        Notify.create("Se debe agregar un documento de Usuario");
    } else if (!validacionnumeros.test(documento.value)) {
        Notify.create("El documento solo debe llevar numeros");
    } else if (direccion.value == "" || direccion.value.trim().length === 0) {
        Notify.create("Se debe agregar una direccion del Empleado");
    } else if (telefono.value == "") {
        Notify.create("Se debe agregar un telefono del Empleado");
    } else if (!validacionnumeros.test(telefono.value)) {
        Notify.create("El telefono solo debe llevar numeros");
    } else if (estudios.value == "" || estudios.value.trim().length === 0) {
        Notify.create("Se debe agregar estudios del Empleado");
    } else if (descripcion.value == "" || descripcion.value.trim().length === 0) {
        Notify.create("Se debe agregar una descripcion del Empleado");
    } else {
        agregarEmpleados()
        cerrar()
        Notify.create({
            type: "positive",
            message: "Empleado agregado exitosamente",
        });
    }
}

async function agregarEmpleados() {
    const r = await useEmpleado.postEmpleado({
        nombre: nombre.value,
        correo: correo.value,
        documento: documento.value,
        direccion: direccion.value,
        telefono: telefono.value,
        estudios: estudios.value,
        descripcion: descripcion.value
    })
    cerrar()
    listarEmplados()
    console.log(r);

}

function traerEmpleados(empleado){
    accion.value = 2
    alert.value = true
    id.value = empleado._id
    nombre.value = empleado.nombre
    correo.value = empleado.correo
    documento.value = empleado.documento
    direccion.value = empleado.direccion
    telefono.value = empleado.telefono
    estudios.value = empleado.estudios
    descripcion.value = empleado.descripcion
}

function validarEdicionEmpleado() {
    let validacionnumeros = /^[0-9]+$/;
    let validacionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (nombre.value == "" || nombre.value.trim().length === 0) {
        Notify.create("Se debe agregar nombre del Empleado");
    } else if (correo.value == "" || correo.value.trim().length === 0) {
        Notify.create("Se debe agregar un correo de Usuario");
    } else if (!validacionCorreo.test(correo.value)) {
        Notify.create("El correo del usuario no es valido");
    } else if (documento.value == "") {
        Notify.create("Se debe agregar un documento de Usuario");
    } else if (!validacionnumeros.test(documento.value)) {
        Notify.create("El documento solo debe llevar numeros");
    } else if (direccion.value == "" || direccion.value.trim().length === 0) {
        Notify.create("Se debe agregar una direccion del Empleado");
    } else if (telefono.value == "") {
        Notify.create("Se debe agregar un telefono del Empleado");
    } else if (!validacionnumeros.test(telefono.value)) {
        Notify.create("El telefono solo debe llevar numeros");
    } else if (estudios.value == "" || estudios.value.trim().length === 0) {
        Notify.create("Se debe agregar estudios del Empleado");
    } else if (descripcion.value == "" || descripcion.value.trim().length === 0) {
        Notify.create("Se debe agregar una descripcion del Empleado");
    } else {
     
        editarEmpleado()
        cerrar()
        Notify.create({
            type: "positive",
            message: "Empleado editado exitosamente",
        });
    }
}


async function editarEmpleado(){
    try{
        await useEmpleado.putEmpleado(id.value,{
            nombre: nombre.value,
            correo: correo.value,
            documento: documento.value,
            direccion: direccion.value,
            telefono: telefono.value,
            estudios: estudios.value,
            descripcion: descripcion.value
        })
        listarEmplados()
        limpiar()
    }catch (error){
        console.error('Error de Empleado', error);
        Notify.create('Error al editar el Empleado')
    }
}

async function habilitarEmpleado(empleado){
    const res = await useEmpleado.putEmpleadoActivar(empleado._id)
    .then((response) => {
            console.log(response);
            listarEmplados()
        })

        .catch((error) => {
            console.error('Error de Empleado', error);
            Notify.create('Error al habilitar el Empleado')
        })
   
}

async function deshabilitarEmpleado(empleado){
    const res = await useEmpleado.putEmpleadoDesactivar(empleado._id)
    .then((response) => {
            console.log(response);
            listarEmplados()
        })

        .catch((error) => {
            console.error('Error de Empleado', error);
            Notify.create('Error al deshabilitar el Empleado')
        })
}

function limpiar() {
    nombre.value = ""
    correo.value = ""
    documento.value = ""
    direccion.value = ""
    telefono.value = ""
    estudios.value = ""
    descripcion.value = ""
}


onMounted(() => {
    listarEmplados()
})


</script>