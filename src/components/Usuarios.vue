<template>
    <div>
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
            <q-btn color="red" class="q-my-md q-ml-md" @click="abrir()">Registrar Usuario</q-btn>
        </div>

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
                        class="q-my-md q-mx-md" label="Dirrecion del Usuario" type="text" />
                    <q-input outlined v-model="documento" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Documento" type="tel" required pattern="[0-9]+" maxlength="10" />
                    <q-input outlined v-model="correo" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Correo" type="email" />
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
                        class="q-my-md q-mx-md" label="Telefono" type="tel" required pattern="[0-9]+" maxlength="10" />
                    <q-select outlined v-model="rol" :options="['ENCARGADO', 'TEC CAMPO', 'CONS AGRON']"
                        label="Seleccione el Rol del Usuario" class="q-my-md q-mx-md" />
                    <q-card-actions align="right">
                        <q-btn @click="validarUsuario()" color="red" class="text-white" :loading="useUsuario.loading">
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
        <div style="display: flex; justify-content: center">
            <q-table title="Usuarios" title-class="text-red text-weight-bolder text-h4"
                table-header-class="text-black font-weight-bold" :rows="rows" :columns="columns" row-key="name"
                style="width: 90%;">
                <template v-slot:body-cell-idsede="props">
                    <q-td :props="props">
                        <p v-if="props.row.idsede != null">{{ props.row.idsede.nombre }}</p>
                        <p v-else>-----</p>
                    </q-td>
                </template>
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
                            <q-btn color="primary" @click="traerUsuario(props.row)">
                                <q-tooltip>
                                    Editar
                                </q-tooltip>
                                <i class="fas fa-pencil-alt">
                            </i></q-btn>
                            <!-- botons de activado y desactivado -->
                            <q-btn v-if="props.row.estado == 1" @click="deshabilitarUsuario(props.row)" color="negative">
                                <q-tooltip>
                                    Desacticar
                                </q-tooltip>
                                <i class="fas fa-times">
                            </i></q-btn>
                            <q-btn v-else color="positive" @click="habilitarUsuaro(props.row)">                                         
                                 <q-tooltip>
                                        Acticar
                                </q-tooltip><i
                                    class="fas fa-check">

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
import { useUsuarioStore } from "../stores/usuario"

const useUsuario = useUsuarioStore();


let rows = ref([])
let id = ref("")
let accion = ref(1)
let alert = ref(false)
let isPwd = ref(true)
let alerta = ref(false)
let nombre = ref('')
let direccion = ref('')
let documento = ref('')
let correo = ref('')
let password = ref('')
let telefono = ref('')
let rol = ref('')
let municipio = ref('')

function abrir() {
    alert.value = true
    accion.value = 1;
}

function cerrar() {
    alert.value = false;
}

const togglePasswordVisibility = () => {
    isPwd.value = !isPwd.value;
};

</script>
  

  