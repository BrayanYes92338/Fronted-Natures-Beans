<template>
  <div>
    <div
      style="
        display: flex;
        justify-content: flex-end;
        margin-left: 5%;
        margin-right: 5%;
      "
    >
      <q-btn
        style="background-color: #00c04f; color: white"
        class="q-my-md q-ml-md"
        @click="abrir()"
        >Registrar Insumos</q-btn
      >
    </div>

    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section
            style="background-color: #009b44; margin-bottom: 20px"
          >
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Insumo" : "Editar Insumo " }}
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              v-if="accion === 1"
              color="red"
              class="text-white"
              :loading="useInsumo.loading"
              @click=""
              >Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn
              v-if="accion !== 1"
              @click=""
              color="red"
              class="text-white"
              :loading="useInsumo.loading"
            >
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
      <q-table
        title="Insumos"
        title-class="text-green text-weight-bolder text-h4"
        table-header-class="text-black font-weight-bold"
        :rows="rows"
        :columns="columns"
        row-key="name"
        style="width: 90%; margin-bottom: 5%"
      >
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
              <q-btn color="primary" @click="traerEmpleados(props.row)">
                <q-tooltip> Editar </q-tooltip>
                <i class="fas fa-pencil-alt"> </i
              ></q-btn>
              <!-- botons de activado y desactivado -->
              <q-btn
                v-if="props.row.estado == 1"
                @click="deshabilitarEmpleado(props.row)"
                color="negative"
              >
                <q-tooltip> Desacticar </q-tooltip>
                <i class="fas fa-times"> </i
              ></q-btn>
              <q-btn
                v-else
                color="positive"
                @click="habilitarEmpleado(props.row)"
              >
                <q-tooltip> Activar </q-tooltip><i class="fas fa-check"></i>
              </q-btn>
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
import { UseInsumoStore } from "../stores/insumo.js";
import { useProveedorStore } from "../stores/proveedor.js";
import { useEmpleadoStore } from "../stores/empleado.js";

const useInsumo = UseInsumoStore();
const useProveedor = useProveedorStore();
const useEmpleado = useEmpleadoStore();

let rows = ref([]);
let alert = ref(false);
let id = ref("");
let accion = ref(1);
let IdProveedor = ref("");
let idReponsable = ref("");
let nombre = ref("");
let relacionNPK = ref("");
let cantidad = ref("");
let unidad = ref("");
let observaciones = ref("");
let total = ref("");

function abrir() {
  accion.value = 1;
  alert.value = true;
}

function cerrar() {
  alert.value = false;
  limpiar();
}

const columns = ref([
  {
    name: "IdProveedor",
    required: true,
    label: "",
    align: "center",
    field: "estado",
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
    name: "estado",
    required: true,
    label: "Estado",
    align: "center",
    field: "estado",
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
    name: "estado",
    required: true,
    label: "Estado",
    align: "center",
    field: "estado",
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
    name: "estado",
    required: true,
    label: "Estado",
    align: "center",
    field: "estado",
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

// Listar Insumos

async function listarInsumos() {
  const r = await useInsumo.listarInsumos();
  rows.value = r.data.insumo.reverse();
  console.log(r.data.insumo);
}

// Listar Proveedores Activos

let proveedores = [];
let datos = {};
const opciones = ref(proveedores);

async function listarProveedores() {
  const data = await useProveedor.listarProveedorActivos();
  data.data.proveedorActivo.forEach((item) => {
    datos = {
      label: `${item?.nombre} - ${item.telefono} `,
      value: item._id,
    };
    proveedores.push(datos);
  });
  console.log(proveedores);
}

// Listar Empleados Activos

let empleados = [];
let dates = {};
const options = ref(empleados);

async function listarEmpleados() {
  const data = await useEmpleado.ListarEmpleadoActivo();
  data.empleadoActivo.forEach((item) => {
    dates = {
      label: `${item?.nombre} - ${item.documento} `,
      value: item._id,
    };
    empleados.push(dates);
  });
  console.log(empleados);
}

function limpiar() {
  IdProveedor.value = "";
  idReponsable.value = "";
  nombre.value = "";
  relacionNPK.value = "";
  cantidad.value = "";
  unidad.value = "";
  observaciones.value = "";
  total.value = "";
}

onMounted(() => {
  listarInsumos();
  listarProveedores();
  listarEmpleados();
});
</script>