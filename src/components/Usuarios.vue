<template>
    <div>
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="red" class="q-my-md q-ml-md" @click="abrir()">Registrar Usuario</q-btn>
        </div>
        <!-- AGREGAR USUARIO -->
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #009B44; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            Agregar Usuario
                        </div>
                    </q-card-section>
                    <q-input outlined v-model="nombre" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Nombre del Usuario" type="text" />
                    <q-input outlined v-model="direccion" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Direccion del Usuario" type="text" />
                    <q-input outlined v-model="documento" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Documento del Usuario" type="tel" required pattern="[0-9]+"
                        maxlength="10" />
                    <q-input outlined v-model="correo" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Correo del Usuario" type="text" />
                    <q-input outlined v-model="password" use-input hide-selected fill-input input-debounce="0"
                        :type="isPwd ? 'password' : 'text'" class="q-my-md q-mx-md" label="Contraseña">
                        <template v-slot:append>
                            <q-icon name="fas fa-eye" class="cursor-pointer" v-if="isPwd"
                                @click="togglePasswordVisibility" />
                            <q-icon name="fas fa-eye-slash" class="cursor-pointer" v-else
                                @click="togglePasswordVisibility" />
                        </template>
                    </q-input>
                    <q-input outlined v-model="telefono" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Telefono del Usuario" type="tel" required pattern="[0-9]+"
                        maxlength="10" />
                    <q-select outlined v-model="rol" :options="['GESTOR']" label="Seleccione el Rol del Usuario"
                        class="q-my-md q-mx-md" />
                    <q-input outlined v-model="municipio" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Municipio del Usuario" type="text" />
                    <q-card-actions align="right">
                        <q-btn color="red" class="text-white" :loading="useUsuario.loading" @click="validarUsuario()">
                            Agregar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn label="Cerrar" color="black" outline @click="cerrar()" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
        <!-- Editar Usuarios-->
        <div>
            <q-dialog v-model="alerta" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #009B44; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            Editar Usuario
                        </div>
                    </q-card-section>
                    <q-input outlined v-model="nombre" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Nombre del Usuario" type="text" />
                    <q-input outlined v-model="direccion" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Direccion del Usuario" type="text" />
                    <q-input outlined v-model="documento" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Documento del Usuario" type="tel" required pattern="[0-9]+"
                        maxlength="10" />
                    <q-input outlined v-model="correo" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Correo del Usuario" type="text" />
                    <q-input outlined v-model="telefono" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Telefono del Usuario" type="tel" required pattern="[0-9]+"
                        maxlength="10" />

                    <q-input outlined v-model="municipio" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Municipio del Usuario" type="text" />
                    <q-card-actions align="right">
                        <q-btn @click="validarEdicionUsuario()" color="red" class="text-white"
                            :loading="useUsuario.loading">
                            Editar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn label="Cerrar" color="black" outline @click="cerrar2()" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
        <!-- Tabla Usuarios -->
        <div style="display: flex; justify-content: center">
            <q-table title="Usuarios" title-class="text-red text-weight-bolder text-h4"
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
                            <q-btn color="primary" @click="traerInfo(props.row)">
                                <q-tooltip>
                                    Editar
                                </q-tooltip>
                                <i class="fas fa-pencil-alt">
                                </i></q-btn>
                            <!-- botons de activado y desactivado -->
                            <q-btn v-if="props.row.estado == 1" @click="deshabilitarUsuario(props.row)"
                                color="negative">
                                <q-tooltip>
                                    Desacticar
                                </q-tooltip>
                                <i class="fas fa-times">
                                </i></q-btn>
                            <q-btn v-else color="positive" @click="habilitarUsuaro(props.row)">
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
import { useUsuarioStore } from '../stores/usuario';
import { QIcon } from 'quasar';

const useUsuario = useUsuarioStore();

let rows = ref([])
let nombre = ref("")
let direccion = ref("")
let documento = ref("")
let correo = ref("")
let password = ref("")
let telefono = ref("")
let rol = ref("")
let municipio = ref("")
let id = ref("")
let accion = ref(1)
let alert = ref(false)
let isPwd = ref(true)
let alerta = ref(false)

function abrir() {
    accion.value = 1;
    alert.value = true;
}

function cerrar() {
    alert.value = false;
}

function cerrar2() {
    alerta.value = false;
}


const togglePasswordVisibility = () => {
    isPwd.value = !isPwd.value;
};

const columns = ref([
    {
        name: 'nombre',
        required: true,
        label: 'Nombre Usuario',
        align: 'center',
        field: 'nombre',
        sortable: true
    },
    {
        name: 'direccion',
        required: true,
        label: 'Direccion Usuario',
        align: 'center',
        field: 'direccion',
        sortable: true
    },
    {
        name: 'documento',
        required: true,
        label: 'Documento Usuario',
        align: 'center',
        field: 'documento',
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
        name: 'telefono',
        required: true,
        label: 'Telefono Usuario',
        align: 'center',
        field: 'telefono',
        sortable: true
    },
    {
        name: 'rol',
        required: true,
        label: 'Rol Usuario',
        align: 'center',
        field: 'rol',
        sortable: true
    },
    {
        name: 'municipio',
        required: true,
        label: 'Municipio Usuario',
        align: 'center',
        field: 'municipio',
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

async function listarUsuarios() {
    const r = await useUsuario.listarUsuarios();
    console.log(r.data.usuario);
    rows.value = r.data.usuario.reverse()
}

async function agregarUsuarios() {
    const r = await useUsuario.postUsuarios({
        nombre: nombre.value,
        direccion: direccion.value,
        documento: documento.value,
        correo: correo.value,
        password: password.value,
        telefono: telefono.value,
        rol: rol.value,
        municipio: municipio.value
    });
    listarUsuarios();
    cerrar();
    console.log(r)
}

function validarUsuario() {
    let validacionnumeros = /^[0-9]+$/;
    let validacionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (nombre.value == "" || nombre.value.trim().length === 0) {
        Notify.create("Se debe agregar un nombre de Usuario");
    } else if (direccion.value == "" || direccion.value.trim().length === 0) {
        Notify.create("Se debe agregar una direccion de Usuario");
    } else if (documento.value == "" || documento.value.trim().length === 0) {
        Notify.create("Se debe agregar un documento de Usuario");
    } else if (!validacionnumeros.test(documento.value)) {
        Notify.create("El documento solo debe llevar numeros");
    } else if (correo.value == "" || correo.value.trim().length === 0) {
        Notify.create("Se debe agregar un correo de Usuario");
    } else if (!validacionCorreo.test(correo.value)) {
        Notify.create("El correo del usuario no es valido");
    } else if (password.value == "" || password.value.trim().length === 0) {
        Notify.create("Se debe agregar una contraseña de Usuario");
    } else if (telefono.value == "" || telefono.value.trim().length === 0) {
        Notify.create("Se debe agregar un telefono de Usuario");
    } else if (!validacionnumeros.test(telefono.value)) {
        Notify.create("El telefono solo debe llevar numeros");
    } else if (rol.value == "" || rol.value.trim().length === 0) {
        Notify.create("Se debe agregar un rol de Usuario");
    } else if (municipio.value == "" || municipio.value.trim().length === 0) {
        Notify.create("Se debe agregar un municipio de Usuario");
    } else {
        agregarUsuarios();
        limpiar()
        Notify.create({
            type: "positive",
            message: "Usuario agregado exitosamente",
        });
    }
}

function traerInfo(usuario) {
    alerta.value = true;
    nombre.value = usuario.nombre
    direccion.value = usuario.direccion
    documento.value = usuario.documento
    correo.value = usuario.correo
    telefono.value = usuario.telefono
    municipio.value = usuario.municipio
    id.value = usuario._id

}

function validarEdicionUsuario() {
    let validacionnumeros = /^[0-9]+$/;
    let validacionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (nombre.value == "" || nombre.value.trim().length === 0) {
        Notify.create("Se debe agregar un nombre de Usuario");
    } else if (direccion.value == "" || direccion.value.trim().length === 0) {
        Notify.create("Se debe agregar una direccion de Usuario");
    } else if (documento.value == "" || documento.value.trim().length === 0) {
        Notify.create("Se debe agregar un documento de Usuario");
    } else if (!validacionnumeros.test(documento.value)) {
        Notify.create("El documento solo debe llevar numeros");
    } else if (correo.value == "" || correo.value.trim().length === 0) {
        Notify.create("Se debe agregar un correo de Usuario");
    } else if (!validacionCorreo.test(correo.value)) {
        Notify.create("El correo del usuario no es valido");
    } else if (password.value == "" || password.value.trim().length === 0) {
        Notify.create("Se debe agregar una contraseña de Usuario");
    } else if (telefono.value == "" || telefono.value.trim().length === 0) {
        Notify.create("Se debe agregar un telefono de Usuario");
    } else if (!validacionnumeros.test(telefono.value)) {
        Notify.create("El telefono solo debe llevar numeros");
    } else if (rol.value == "" || rol.value.trim().length === 0) {
        Notify.create("Se debe agregar un rol de Usuario");
    } else if (municipio.value == "" || municipio.value.trim().length === 0) {
        Notify.create("Se debe agregar un municipio de Usuario");
    } else {
        editarUsuario()
        limpiar()
        cerrar2()
        Notify.create({
            type: "positive",
            message: "Usuario editado exitosamente",
        });
    }  
}

async function editarUsuario() {
    try {
        await useUsuario.putUsuario(id.value,{
            nombre: nombre.value,
            direccion: direccion.value,
            documento: documento.value,
            correo: correo.value,
            telefono: telefono.value,
            municipio: municipio.value,
        })
        listarUsuarios()
    } catch (error) {
        console.error('Error al editar el Usuario', error);
        Notify.create('Error al editar el Usuario')
    }
}



async function habilitarUsuaro(usuario) {
    const res = await useUsuario.putActivarUsuario(usuario._id)
        .then((response) => {
            console.log(response);
            listarUsuarios()
        })

        .catch((error) => {
            console.error('Error de Usuario', error);
            Notify.create('Error al habilitar el Usuario')
        })

}

async function deshabilitarUsuario(usuario) {
    const res = await useUsuario.putDesactivarUsuario(usuario._id)
        .then((response) => {
            console.log(response);
            listarUsuarios()
        })

        .catch((error) => {
            console.error('Error de Usuario', error);
            Notify.create('Error al deshabilitar el Usuario')
        })

}


function limpiar() {
    nombre.value = ""
    direccion.value = ""
    documento.value = ""
    correo.value = ""
    password.value = ""
    telefono.value = ""
    rol.value = ""
    municipio.value = ""

}


onMounted(() => {
    listarUsuarios()
})

</script>