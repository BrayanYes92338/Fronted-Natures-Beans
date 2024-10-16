<template>
  <div>
    <div style="margin-left: 5%; text-align: end; margin-right: 5%">
      <q-btn
        style="background-color: #00c04f; color: white"
        class="q-my-md q-ml-md"
        @click="abrir()"
        >Registrar Elaboracion Sustrato</q-btn
      >
    </div>
    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section
            style="background-color: #009b44; margin-bottom: 20px"
          >
            <div class="text-h6 text-white">
              {{
                accion == 1
                  ? "Agregar Elaboracion de Sustrato"
                  : "Elaboracion de Sustrato"
              }}
            </div>
          </q-card-section>

          <!-- Select for idProceso -->
          <q-select
            outlined
            v-model="idProceso"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            class="q-my-md q-mx-md"
            :options="options"
            @filter="filterFn"
            label="Seleccionar el Proceso"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <!-- Select for idEmpleadooperario -->
          <q-select
            outlined
            v-model="idEmpleadooperario"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            class="q-my-md q-mx-md"
            :options="opciones"
            @filter="filtrarEmpleado"
            label="Seleccionar el Operario"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-select
            outlined
            v-model="idEmpleadoresponsable"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            class="q-my-md q-mx-md"
            :options="opciones"
            @filter="filtrarEmpleado"
            label="Seleccionar el Responsable"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-input
            outlined
            v-model="productocomercial"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            class="q-my-md q-mx-md"
            label="Producto Comercial"
            type="text"
            required
          />

          <q-input
            outlined
            v-model="ingredienteActivo"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            class="q-my-md q-mx-md"
            label="Ingrediente Activo"
            type="text"
            required
          />

          <q-input
            outlined
            v-model="dosisUtilizada"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            class="q-my-md q-mx-md"
            label="Dosis Utilizada"
            type="text"
            required
          />
          <q-select
            outlined
            v-model="MetodoAplicacion"
            :options="[
              'Mezcla Manual',
              'Mezcla Mecánica',
              'Aplicación Directa',
              'Aplicación en Capas',
              'Incorporación de Aditivos',
              'Esterilización del Sustrato',
              'Enriquecimiento con Microorganismos',
              'Aplicación de Cobertura',
            ]"
            label="Seleccione el Método de Aplicación"
            class="q-my-md q-mx-md"
            required
          />

          <q-card-actions align="right">
            <q-btn
              v-if="accion === 1"
              @click="validarIngresoagregarElaboracion()"
              color="red"
              class="text-white"
              :loading="useElaboracion.loading"
              >Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn
              v-if="accion !== 1"
              @click="validarEdicionElaboracion()"
              color="red"
              class="text-white"
              :loading="useProceso.loading"
              >Editar
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
      <q-table
        title="Elaboracion Sustrato"
        title-class="text-green text-weight-bolder text-h4"
        table-header-class="text-black font-weight-bold"
        :rows="rows"
        :columns="columns"
        row-key="name"
        style="width: 90%; margin-bottom: 5%">

        <template v-slot:body-cell-idProceso="props">
          <q-td :props="props">
              <!-- VDropdown para mostrar el tooltip al hacer clic -->
            <VDropdown :distance="6" v-model="props.row.showDropdown">
                <!-- Botón que activará el dropdown -->
              <q-btn flat dense @click="toggleDropdown(props.row)">
              <!-- Controlamos que no se muestre en mayúsculas -->
                <span style="text-transform: none;">
              <!-- Mostramos un resumen del campo 'detalle' con una longitud máxima de 10 caracteres -->
                {{ props.row.idProceso.descripcion.length > 10 ? props.row.idProceso.descripcion.substring(0, 10) + '...' :
               props.row.idProceso.descripcion }}
              </span>
              </q-btn>

                <!-- Contenido del popper (dropdown) con estilos personalizados -->
               <template #popper>
              <div class="custom-tooltip-content"
               style="max-height: 200px; max-width: 200px; overflow-y: auto; padding: 10px;">
                 <!-- Mostramos solo el campo 'descripcion' completo -->
               {{ props.row.idProceso.descripcion }}
               </div>
          </template>
         </VDropdown>
        </q-td>
        </template>

        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <div style="display: flex; gap: 15px; justify-content: center">
              <!-- boton de editar -->
              <q-btn color="primary" @click="traerRiego(props.row)">
                <q-tooltip> Editar </q-tooltip>
                <i class="fas fa-pencil-alt"> </i
              ></q-btn>
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
import axios from "axios";
import { useElaboracionSustratoStore } from "../stores/ElaboracionSustrato.js";
import { useProcesoStore } from "../stores/proceso.js";
import { useEmpleadoStore } from "../stores/empleado.js";

const useElaboracion = useElaboracionSustratoStore();
const useProceso = useProcesoStore();
const useEmpleado = useEmpleadoStore();

let rows = ref([]);
let alert = ref(false);
let id = ref("");
let accion = ref(1);
const idEmpleadoresponsable = ref(null);
const idEmpleadooperario = ref(null);
const idProceso = ref(null);
const productocomercial = ref("");
const ingredienteActivo = ref("");
const dosisUtilizada = ref("");
const MetodoAplicacion = ref(null);

function abrir() {
  accion.value = 1;
  alert.value = true;
}

function cerrar() {
  alert.value = false;
  Limpiar();
}

const columns = ref([
  {
    name: "idProceso",
    required: true,
    label: "Descripcion del Proceso",
    align: "center",
    field: (row) => row.idProceso.descripcion,
    sortable: true,
  },
  {
    name: "idEmpleadooperario",
    required: true,
    label: "Nombre del Operario",
    align: "center",
    field: (row) => row.idEmpleadooperario.nombre,
    sortable: true,
  },
  {
    name: "idEmpleadoresponsable",
    required: true,
    label: "Nombre del Responsable",
    align: "center",
    field: (row) => row.idEmpleadoresponsable.nombre,
    sortable: true,
  },

  {
    name: "productocomercial",
    required: true,
    label: "Producto Comercial",
    align: "center",
    field: "productocomercial",
    sortable: true,
     format: val => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
  },
  {
    name: "ingredienteActivo",
    required: true,
    label: "Ingrediente Activo",
    align: "center",
    field: "ingredienteActivo",
    sortable: true,
     format: val => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
  },
  {
    name: "dosisUtilizada",
    required: true,
    label: "Dosis Utilizada",
    align: "center",
    field: "dosisUtilizada",
    sortable: true,
  },
  {
    name: "MetodoAplicacion",
    required: true,
    label: "Metodo Aplicacion",
    align: "center",
    field: "MetodoAplicacion",
    sortable: true,
     format: val => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
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

//  listar cultivos

let proceso = [];
let datos = {};
const options = ref(proceso);

function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = proceso.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
}

async function listarCultivos() {
  const data = await useProceso.listarProcesos();
  data.data.procesos.forEach((item) => {
    datos = {
      label: `${item.descripcion}`,
      value: item._id,
    };
    proceso.push(datos);
  });
  console.log(data);
}

let empleados = [];
let dates = {};
const opciones = ref(empleados);
function filtrarEmpleado(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    opciones.value = empleados.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
}
async function listarEmpleados() {
  const data = await useEmpleado.listarEmpleado();
  data.data.empleado.forEach((item) => {
    dates = {
      label: `${item?.nombre} - ${item.documento} `,
      value: item._id,
    };
    empleados.push(dates);
  });
  console.log(empleados);
}

function filtrarFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    opciones.value = empleados.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
}

async function listarElaboracion() {
  const r = await useElaboracion.listarElaboracionSustrato();
  rows.value = r.data.sustratos;
  console.log(r);
}

function validarIngresoagregarElaboracion() {
  let validacionnumeros = /^[0-9]+$/;

  if (idProceso.value == null) {
    Notify.create("Se debe seleccionar el Proceso");
  } else if (idEmpleadooperario.value == null) {
    Notify.create("Se debe seleccionar el Operario");
  } else if (idEmpleadoresponsable.value == null) {
    Notify.create("Se debe seleccionar el Responsable");
  } else if (productocomercial.value.trim().length === 0) {
    Notify.create("Se debe agregar el Producto Comercial");
  } else if (ingredienteActivo.value.trim().length === 0) {
    Notify.create("Se debe agregar el Ingrediente Activo");
  } else if (dosisUtilizada.value.trim().length === 0) {
    Notify.create("Se debe agregar la Dosis Utilizada");
  } else if (!validacionnumeros.test(dosisUtilizada.value)) {
    Notify.create("La Dosis Utilizada solo debe llevar números");
  } else if (MetodoAplicacion.value.trim().length === 0) {
    Notify.create("Se debe agregar el Método de Aplicación");
  } else {
    agregarElaboracion();
    listarElaboracion();
    Limpiar();
    cerrar();
    Notify.create({
      type: "positive",
      message: "Elaboracion de Sustrato agregado exitosamente",
    });
  }
}

async function agregarElaboracion() {
  const r = await useElaboracion.postElaboracionSustrato({
    idEmpleadoresponsable: idEmpleadoresponsable.value.value,
    idEmpleadooperario: idEmpleadooperario.value.value,
    idProceso: idProceso.value.value,
    productocomercial: productocomercial.value,
    ingredienteActivo: ingredienteActivo.value,
    dosisUtilizada: dosisUtilizada.value,
    MetodoAplicacion: MetodoAplicacion.value,
  });

  cerrar();
  Limpiar();
  listarElaboracion();
  console.log(r);
}

function traerRiego(riego) {
  alert.value = true;
  accion.value = 2;
  id.value = riego._id;
  idProceso.value = {
    label: riego.idProceso.descripcion,
    value: riego.idProceso._id,
  };
  idEmpleadoresponsable.value = {
    label: riego.idEmpleadoresponsable.nombre,
    value: riego.idEmpleadoresponsable._id,
  };
  idEmpleadooperario.value = {
    label: riego.idEmpleadooperario.nombre,
    value: riego.idEmpleadooperario._id,
  };
  productocomercial.value = riego.productocomercial;
  ingredienteActivo.value = riego.ingredienteActivo;
  dosisUtilizada.value = riego.dosisUtilizada;
  MetodoAplicacion.value = riego.MetodoAplicacion;
}

function validarEdicionElaboracion() {
  let validacionnumeros = /^[0-9]+$/;

  if (idProceso.value == null) {
    Notify.create("Se debe seleccionar el Proceso");
  } else if (idEmpleadooperario.value == null) {
    Notify.create("Se debe seleccionar el Operario");
  } else if (idEmpleadoresponsable.value == null) {
    Notify.create("Se debe seleccionar el Responsable");
  } else if (productocomercial.value.trim().length === 0) {
    Notify.create("Se debe agregar el Producto Comercial");
  } else if (ingredienteActivo.value.trim().length === 0) {
    Notify.create("Se debe agregar el Ingrediente Activo");
  } else if (dosisUtilizada.value.trim().length === 0) {
    Notify.create("Se debe agregar la Dosis Utilizada");
  } else if (!validacionnumeros.test(dosisUtilizada.value)) {
    Notify.create("La Dosis Utilizada solo debe llevar números");
  } else if (MetodoAplicacion.value.trim().length === 0) {
    Notify.create("Se debe agregar el Método de Aplicación");
  } else {
    editarElaboracion();
    listarElaboracion();
    Limpiar();
    cerrar();
    Notify.create({
      type: "positive",
      message: "Elaboracion de Sustrato agregado exitosamente",
    });
  }
}

async function editarElaboracion() {
  try {
    await useElaboracion.putElaboracionSustrato(id.value, {
      idEmpleadoresponsable: idEmpleadoresponsable.value.value,
      idEmpleadooperario: idEmpleadooperario.value.value,
      idProceso: idProceso.value.value,
      productocomercial: productocomercial.value,
      ingredienteActivo: ingredienteActivo.value,
      dosisUtilizada: dosisUtilizada.value,
      MetodoAplicacion: MetodoAplicacion.value,
    });

    listarElaboracion();
    cerrar();
  } catch (error) {
    console.error("Error de actualizar Elaboracion de sustrato", error);
    Notify.create(
      "Ocurrio un error al editar datos del Elaboracion de sustrato"
    );
  }
}

function Limpiar() {
  idProceso.value = null;
  idEmpleadooperario.value = null;
  idEmpleadoresponsable.value = null;
  productocomercial.value = "";
  ingredienteActivo.value = "";
  dosisUtilizada.value = "";
  MetodoAplicacion.value = "";
}

// Función para alternar la visibilidad del dropdown
const toggleDropdown = (row) => {
  row.showDropdown = !row.showDropdown;
};


// Inicialización de los datos de la tabla
rows.value = rows.value.map(row => ({
  ...row,
  showDropdown: false,
}));

onMounted(() => {
  listarElaboracion();
  listarCultivos();
  listarEmpleados();
});
</script>
