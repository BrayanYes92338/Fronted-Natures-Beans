<template>
  <div>
    <div style="display: flex; justify-content: flex-end; margin-left: 5%; margin-right: 5%; ">
      <q-btn style="background-color: #00C04F; color: white;" class="q-my-md q-ml-md" @click="abrir()">
        Registrar Usuario
      </q-btn>
      <q-btn-dropdown color="blue" icon="visibility" label="Filtrar"
        style="display: flex; justify-content: center; align-items: center; margin-left: 16px;height: 20px;"
        class="q-my-md q-ml-md">
        <q-list>
          <q-item clickable v-ripple @click="listarUsuarios()">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarUsuarioActivos()">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarUsuarioInactivo()">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <!-- AGREGAR USUARIO -->
    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color: #009b44; margin-bottom: 20px">
            <div class="text-h6 text-white">Agregar Usuario</div>
          </q-card-section>
          <q-input outlined v-model="nombre" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Nombre del Usuario" type="text" />
          <q-input outlined v-model="direccion" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Direccion del Usuario" type="text" />
          <q-input outlined v-model="documento" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Documento del Usuario" type="tel" required pattern="[0-9]+" maxlength="10" />
          <q-input outlined v-model="correo" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Correo del Usuario" type="text" />
          <q-input outlined v-model="password" use-input hide-selected fill-input input-debounce="0"
            :type="isPwd ? 'password' : 'text'" class="q-my-md q-mx-md" label="Contraseña">
            <template v-slot:append>
              <q-icon name="fas fa-eye" class="cursor-pointer" v-if="isPwd" @click="togglePasswordVisibility" />
              <q-icon name="fas fa-eye-slash" class="cursor-pointer" v-else @click="togglePasswordVisibility" />
            </template>
          </q-input>
          <q-input outlined v-model="telefono" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Telefono del Usuario" type="tel" required pattern="[0-9]+" maxlength="10" />
          <q-select outlined v-model="rol" :options="['GESTOR']" label="Seleccione el Rol del Usuario"
            class="q-my-md q-mx-md" />
          <q-select outlined v-model="departamento" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" :options="opcionesDepa" @filter="filterFnDepa"
            @update:model-value="onDepartmentChange" label="Selecciona el Departament Recide el Usuario">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select outlined v-model="municipio" use-input hide-selected fill-input input-debounce="0"
            :disable="!departamento" @filter="filterFnMun" :options="opcionesMun" class="q-my-md q-mx-md"
            label="Selecciona el Municipio donde vive el Usuario">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
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
          <q-card-section style="background-color: #009b44; margin-bottom: 20px">
            <div class="text-h6 text-white">Editar Usuario</div>
          </q-card-section>
          <q-input outlined v-model="nombre" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Nombre del Usuario" type="text" />
          <q-input outlined v-model="direccion" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Direccion del Usuario" type="text" />
          <q-input outlined v-model="documento" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Documento del Usuario" type="tel" required pattern="[0-9]+" maxlength="10" />
          <q-input outlined v-model="correo" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Correo del Usuario" type="text" />
          <q-input outlined v-model="telefono" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Telefono del Usuario" type="tel" required pattern="[0-9]+" maxlength="10" />
          <q-select outlined v-model="departamento" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" :options="opcionesDepa" @filter="filterFnDepa"
            @update:model-value="onDepartmentChange" label="Selecciona el Departament Recide el Usuario">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select outlined v-model="municipio" use-input hide-selected fill-input input-debounce="0"
            :disable="!departamento" @filter="filterFnMun" :options="opcionesMun" class="q-my-md q-mx-md"
            label="Selecciona el Municipio donde vive el Usuario">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-card-actions align="right">
            <q-btn @click="validarEdicionUsuario()" color="red" class="text-white" :loading="useUsuario.loading">
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
      <q-table :filter="buscar" title="Usuarios" title-class="text-green text-weight-bolder text-h4"
        table-header-class="text-black font-weight-bold" :rows="rows" :columns="columns" row-key="name"
        style="width: 90%; margin-bottom: 5%;">
        <template v-slot:top-right>
                 <q-input color="black" v-model="buscar" placeholder="Buscar">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                 </q-input>
                </template>
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <p style="color: green" v-if="props.row.estado == 1">Activo</p>
            <p style="color: red" v-else>Inactivo</p>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <div style="display: flex; gap: 15px; justify-content: center">
              <!-- boton de editar -->
              <q-btn color="primary" @click="traerInfo(props.row)">
                <q-tooltip> Editar </q-tooltip>
                <i class="fas fa-pencil-alt"> </i></q-btn>
              <!-- botons de activado y desactivado -->
              <q-btn v-if="props.row.estado == 1" @click="deshabilitarUsuario(props.row)" color="negative">
                <q-tooltip> Desacticar </q-tooltip>
                <i class="fas fa-times"> </i></q-btn>
              <q-btn v-else color="positive" @click="habilitarUsuaro(props.row)">
                <q-tooltip> Acticar </q-tooltip><i class="fas fa-check"> </i></q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Notify } from "quasar";
import { useUsuarioStore } from "../stores/usuario";
import { QIcon } from "quasar";
import { useDepartamentoStore } from "../stores/departamento.js"

const useUsuario = useUsuarioStore();
const useDepartamento = useDepartamentoStore()
const buscar = ref("")

let rows = ref([]);
let nombre = ref("");
let direccion = ref("");
let documento = ref("");
let correo = ref("");
let password = ref("");
let telefono = ref("");
let rol = ref("");
let departamento = ref("")
let municipio = ref("");
let id = ref("");
let accion = ref(1);
let alert = ref(false);
let isPwd = ref(true);
let alerta = ref(false);






function abrir() {
  accion.value = 1;
  alert.value = true;
}

function cerrar() {
  alert.value = false;
  limpiar();
}

function cerrar2() {
  alerta.value = false;
  limpiar()
}

const togglePasswordVisibility = () => {
  isPwd.value = !isPwd.value;
};

const columns = ref([
  {
    name: "nombre",
    required: true,
    label: "Nombre Usuario",
    align: "center",
    field: "nombre",
    sortable: true,
  },
  {
    name: "direccion",
    required: true,
    label: "Direccion Usuario",
    align: "center",
    field: "direccion",
    sortable: true,
  },
  {
    name: "documento",
    required: true,
    label: "Documento Usuario",
    align: "center",
    field: "documento",
    sortable: true,
  },
  {
    name: "correo",
    required: true,
    label: "Correo Electronico",
    align: "center",
    field: "correo",
    sortable: true,
  },
  {
    name: "telefono",
    required: true,
    label: "Telefono Usuario",
    align: "center",
    field: "telefono",
    sortable: true,
  },
  {
    name: "rol",
    required: true,
    label: "Rol Usuario",
    align: "center",
    field: "rol",
    sortable: true,
  },
  {
    name: "departamento",
    required: true,
    label: "Departamento Usuario",
    align: "center",
    field: "departamento",
    sortable: true,
  },
  {
    name: "municipio",
    required: true,
    label: "Municipio Usuario",
    align: "center",
    field: "municipio",
    sortable: true,
  },
  {
    name: "estado",
    required: true,
    label: "Estado",
    align: "center",
    field: "estado",
    sortable: true,
  },
  {
    name: "opciones",
    required: true,
    label: "Opciones",
    align: "center",
    field: "opciones",
    sortable: true,
  },
]);

// Listar Departamentos

let Departamentos = []
const opcionesDepa = ref(Departamentos)

function filterFnDepa(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    opcionesDepa.value = Departamentos.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  });
};


async function ListarDepartamentos() {
  const data = await useDepartamento.listarDepartamento();
  Departamentos = data.data.map(item => ({
    label: item.departamento,
    value: item.ciudades
  }));
  opcionesDepa.value = [...Departamentos];
}

// Listar Municipios

let Municipios = [];
let dateMun = {};
const opcionesMun = ref(Municipios);

function onDepartmentChange(departamentoSeleccionado) {
  Municipios = departamentoSeleccionado ? departamentoSeleccionado.value.map(municipio=> ({
    label: municipio,
    value: municipio
  })) : [];
  opcionesMun.value = [...Municipios];
  municipio.value = null;
}

function filterFnMun(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    opcionesMun.value = Municipios.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  });
}


async function listarUsuarios() {
  const r = await useUsuario.listarUsuarios();
  console.log(r.data.usuario);
  rows.value = r.data.usuario.reverse();
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
    departamento: departamento.value.label,
    municipio: municipio.value.label,
  });
  listarUsuarios();
  cerrar();
  console.log( departamento.value.label);
}

async function validarUsuario() {

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
    }else if (!departamento.value || String(departamento.value).trim() === "") {
    Notify.create("Se debe agregar un Departamento donde vive el Usuario");
  } else if (!municipio.value || String(municipio.value).trim() === "") {
    Notify.create("Se debe agregar un municipio de Usuario");
  }else {
       agregarUsuarios();
      limpiar();
      cerrar2()
      Notify.create({
        type: "positive",
        message: "Usuario agregado exitosamente",
      });
    }

}

function traerInfo(usuario) {
  alerta.value = true;
  nombre.value = usuario.nombre;
  direccion.value = usuario.direccion;
  documento.value = usuario.documento;
  correo.value = usuario.correo;
  telefono.value = usuario.telefono;
  const departamentoSeleccionado = Departamentos.find(dep => dep.label === usuario.departamento);
  departamento.value = departamentoSeleccionado;
  if (departamentoSeleccionado) {
    const ciudades = departamentoSeleccionado.value;
    const ciudadSeleccionada = ciudades.find(municipio => municipio === usuario.municipio);
    Municipios = ciudades.map(municipio => ({ label: municipio, value: municipio }));
    opcionesMun.value = [...Municipios];
    municipio.value = { label: ciudadSeleccionada, value: ciudadSeleccionada };
  }
  id.value = usuario._id;
}

function validarEdicionUsuario() {
  let validacionnumeros = /^[0-9]+$/;
  let validacionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (nombre.value.trim() === "") {
    Notify.create("Se debe agregar un nombre de Usuario");
  } else if (direccion.value.trim() === "") {
    Notify.create("Se debe agregar una direccion de Usuario");
  } else if (documento.value.trim() === "") {
    Notify.create("Se debe agregar un documento de Usuario");
  } else if (!validacionnumeros.test(documento.value)) {
    Notify.create("El documento solo debe llevar numeros");
  } else if (correo.value.trim() === "") {
    Notify.create("Se debe agregar un correo de Usuario");
  } else if (!validacionCorreo.test(correo.value)) {
    Notify.create("El correo del usuario no es valido");
  } else if (telefono.value.trim() === "") {
    Notify.create("Se debe agregar un telefono de Usuario");
  } else if (!validacionnumeros.test(telefono.value)) {
    Notify.create("El telefono solo debe llevar numeros");
  } else if (!departamento.value || String(departamento.value).trim() === "") {

    Notify.create("Se debe agregar un Departamento donde vive el Usuario");
  } else if (!municipio.value || String(municipio.value).trim() === "") {
  console.log(municipio.value);
  
    Notify.create("Se debe agregar un municipio de Usuario");
  } else {
    editarUsuario();
    limpiar();
    cerrar2();
    Notify.create({
      type: "positive",
      message: "Usuario editado exitosamente",
    });
  }
}


async function editarUsuario() {
  try {
    await useUsuario.putUsuario(id.value, {
      nombre: nombre.value,
      direccion: direccion.value,
      documento: documento.value,
      correo: correo.value,
      telefono: telefono.value,
     departamento: departamento.value.label,
     municipio: municipio.value.value,
    });
    console.log( departamento.value);
    
    listarUsuarios();
    limpiar();
  } catch (error) {
    console.error("Error al editar el Usuario", error);
    Notify.create("Error al editar el Usuario");
  }
}

async function habilitarUsuaro(usuario) {
  const res = await useUsuario
    .putActivarUsuario(usuario._id)
    .then((response) => {
      console.log(response);
      listarUsuarios();
    })

    .catch((error) => {
      console.error("Error de Usuario", error);
      Notify.create("Error al habilitar el Usuario");
    });
}

async function deshabilitarUsuario(usuario) {
  if (useUsuario.user._id === usuario._id) {
    Notify.create("No puedes desactivar la cuenta en uso");
  } else {
    const res = await useUsuario
      .putDesactivarUsuario(usuario._id)
      .then((response) => {
        console.log(response);
        listarUsuarios();
      })

      .catch((error) => {
        console.error("Error de Usuario", error);
        Notify.create("Error al deshabilitar el Usuario");
      });
  }

}

const listarUsuarioActivos = async () => {
  try {
    const res = await useUsuario.ListarUsuarioActivo();
    rows.value = res.usuarios;
    Notify.create({
      message: "Listado de Usuarios Activos",
      color: "green",
    });
  } catch (error) {
    console.error("Error al listar Usuarios activos:", error);
    Notify.create("Error al obtener listado de Usuarios activos");
  }
};

const listarUsuarioInactivo = async () => {
  try {
    const res = await useUsuario.ListarUsuarioInactivo();
    rows.value = res.usuarios;
    Notify.create({
      message: "Listado de Usuarios Inactivos",
      color: "green",
    });
  } catch (error) {
    console.error("Error al listar Usuarios inactivos:", error);
    Notify.create("Error al obtener listado de Usuarios inactivos");
  }
};
function limpiar() {
  nombre.value = "";
  direccion.value = "";
  documento.value = "";
  correo.value = "";
  password.value = "";
  telefono.value = "";
  rol.value = "";
  departamento.value = "";
  municipio.value = "";
}

onMounted(() => {
  listarUsuarios();
  ListarDepartamentos()
});
</script>
