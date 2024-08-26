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
        >Registrar Mantenimiento</q-btn
      >
      <q-btn-dropdown
        color="blue"
        icon="visibility"
        label="Filtrar"
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 16px;
          height: 20px;
        "
        class="q-my-md q-ml-md"
      >
        <q-list>
          <q-item clickable v-ripple @click="listarMantenimiento()">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarMantenimientoActivo()">
            <q-item-section>Listar Verificacion  Realizada</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarMantenimientoInactivo()">
            <q-item-section>Listar Verificacion no Realizada</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <div>
      <q-dialog v-model="alert" persistent>
        <q-card style="width: 700px">
          <q-card-section
            style="background-color: #009b44; margin-bottom: 20px"
          >
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Mantenimiento" : "Editar Mantenimiento" }}
            </div>
          </q-card-section>

          <q-select
            outlined
            v-model="idMaquinaria"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            class="q-my-md q-mx-md"
            :options="opcionesMaquinaria"
            @filter="filtrarProveedor"
            label="Seleccionar el Maquinaria"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"
                  >Sin resultados</q-item-section
                >
              </q-item>
            </template>
          </q-select>

          <q-select
            outlined
            v-model="idResponsable"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            class="q-my-md q-mx-md"
            :options="opcionesEmpleados"
            @filter="filtrarProveedor"
            label="Seleccionar el Responsable"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"
                  >Sin resultados</q-item-section
                >
              </q-item>
            </template>
          </q-select>

          <q-input
            outlined
            v-model="observaciones"
            class="q-my-md q-mx-md"
            label="observaciones"
            type="text"
            required
          />

          <q-card-actions align="right">
            <q-btn
              v-if="accion === 1"
              @click="validarIngresoMantenimiento()"
              color="red"
              class="text-white"
              :loading="useMantenimiento.loading"
            >
              Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn
              v-if="accion !== 1"
              @click="validarEdicionMaquinaria()"
              color="red"
              class="text-white"
              :loading="useMantenimiento.loading"
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
        title="Mantenimiento"
        title-class="text-green text-weight-bolder text-h4"
        table-header-class="text-black font-weight-bold"
        :rows="rows"
        :columns="columns"
        row-key="name"
        style="width: 90%; margin-bottom: 5%"
      >
        <template v-slot:body-cell-observaciones="props">
    <q-td :props="props">
      <div v-tooltip="props.row.observaciones">
        {{ props.row.observaciones.slice(0, 40) }}<span v-if="props.row.observaciones.length > 30">...</span>
      </div>
    </q-td>
  </template>
        <template v-slot:body-cell-verificacionRealizada="props">
          <q-td :props="props">
            <p style="color: green" v-if="props.row.verificacionRealizada == 1">
              SI
            </p>
            <p style="color: red" v-else>NO</p>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <div style="display: flex; gap: 15px; justify-content: center">
              <q-btn color="primary" @click="traerRiego(props.row)">
                <q-tooltip> Editar </q-tooltip>
                <i class="fas fa-pencil-alt"> </i
              ></q-btn>
              <q-btn
                v-if="props.row.verificacionRealizada == 1"
                @click="deshabilitarMantenimiento(props.row)"
                color="negative"
              >
                <q-tooltip> Verificacion Realizada </q-tooltip>
                <i class="fas fa-times"> </i
              ></q-btn>
              <q-btn
                v-else
                color="positive"
                @click="habilitarMantenimiento(props.row)"
              >
                <q-tooltip> Verificacion no Realizada </q-tooltip><i class="fas fa-check"> </i
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
import { useMantenimientoStore } from "../stores/mantenimiento.js";
import { useProveedorStore } from "../stores/proveedor.js";
import { useMaquinariaStore } from "../stores/maquinaria.js";
import { useEmpleadoStore } from "../stores/empleado.js";

const useEmpleado = useEmpleadoStore();
const useMantenimiento = useMantenimientoStore();
const useMaquinaria = useMaquinariaStore();
const useProveedor = useProveedorStore();

let rows = ref([]);
let alert = ref(false);
let id = ref("");
let accion = ref(1);
let idResponsable = ref(null);
let idMaquinaria = ref(null);
let observaciones = ref("");
let proveedor = [];

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
    name: "idMaquinaria",
    required: true,
    label: "Nombre de Maquinaria",
    align: "center",
    field: (row) => row.idMaquinaria.nombre,

    sortable: true,
  },
  {
    name: "responsable",
    required: true,
    label: "Nombre de Responsable",
    align: "center",
    field: (row) => row.responsable.nombre,

    sortable: true,
  },
  {
    name: "observaciones",
    required: true,
    label: "observaciones",
    align: "center",
    field: "observaciones",
    sortable: true,
  },
  {
    name: "verificacionRealizada",
    required: true,
    label: "Verificacion Realizada",
    align: "center",
    field: "verificacionRealizada",
    sortable: true,
  },

  {
    name: "fecha",
    required: true,
    label: "fecha",
    align: "center",
    field: "fecha",
    sortable: true,
    format: (val) => {
      if (!val) return "";

      const fechaIngreso = new Date(val);
      const fechaColombia = new Date(
        fechaIngreso.toLocaleString("en-US", { timeZone: "America/Bogota" })
      );

      return (
        fechaColombia.toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }) +
        " " +
        fechaColombia.toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    },
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

function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = cultivos.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
}
let maquinaria = [];
let datos = {};
const opcionesMaquinaria = ref(maquinaria);

async function getMaquinarias() {
  const data = await useMantenimiento.listarMaquinaria();
  data.data.maquinas.forEach((item) => {
    datos = {
      label: `${item.nombre}-${item.tipo}`,
      value: item._id,
    };
    maquinaria.push(datos);
  });
  console.log(maquinaria);
}

let dates = {};
const opciones = ref(proveedor);

async function listarProveedor() {
  const data = await useProveedor.listarProveedor();
  data.data.proveedor.forEach((item) => {
    dates = {
      label: `${item?.nombre} - ${item.correo} `,
      value: item._id,
    };
    proveedor.push(dates);
  });
  console.log(dates);
}

function filtrarFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    opciones.value = empleados.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
}
let empleados = [];
let datesEmpleados = {};
const opcionesEmpleados = ref(empleados);

async function listarEmpleados() {
  const data = await useEmpleado.listarEmpleado();
  data.data.empleado.forEach((item) => {
    datesEmpleados = {
      label: `${item?.nombre} - ${item.documento} `,
      value: item._id,
    };
    empleados.push(datesEmpleados);
  });
  console.log(empleados);
}
async function listarMantenimiento() {
  const r = await useMantenimiento.listarMantenimiento();
  rows.value = r.data.mantenimiento;
  console.log(r);
}
const listarMantenimientoActivo = async () => {
  try {
    const res = await useMantenimiento.listarMantenimientoActivos();
    rows.value = res.data.MantenimientoActivo;
    Notify.create({
      message: "Listado de Mantenimiento Activos",
      color: "green",
    });
    console.log("hola");
  } catch (error) {
    console.error("Error al listar Mantenimiento activos:", error);
    Notify.create("Error al obtener Mantenimiento de Usuarios activos");
  }
};

const listarMantenimientoInactivo = async () => {
  try {
    const res = await useMantenimiento.listarMantenimientoInactivos();
    rows.value = res.data.MantenimientoInactivo;

    console.log(res);

    Notify.create({
      message: "Listado de Mantenimiento Inactivos",
      color: "green",
    });
  } catch (error) {
    console.error("Error al listar Mantenimiento inactivos:", error);
    Notify.create("Error al obtener listado de Mantenimiento inactivos");
  }
};
function validarIngresoMantenimiento() {


  if (!idMaquinaria.value) {
    Notify.create("Se debe seleccionar la Maquinaria");
  } else if (!idResponsable.value) {
    Notify.create("Se debe agregar el Responsable");
  }  else if (observaciones.value.trim().length === 0) {
    Notify.create("Se debe agregar Observaciones");
  }else {
    agregarMantenimiento();
    Limpiar();
    cerrar();
    Notify.create({
      type: "positive",
      message: "Mantenimiento agregada exitosamente",
    });
  }
}
async function habilitarMantenimiento(mantenimiento) {
  const res = await useMantenimiento
    .putMantenimientoActivo(mantenimiento._id)
    .then((res) => {
      console.log(res);
      listarMantenimiento();
    })

    .catch((error) => {
      console.error("Error de Proveedor", error);
      Notify.create("Error al habilitar el Proveedor");
    });
}

async function deshabilitarMantenimiento(mantenimiento) {
  const res = await useMantenimiento
    .putMantenimientoInactivo(mantenimiento._id)
    .then((res) => {
      console.log(res);
      listarMantenimiento();
    })

    .catch((error) => {
      console.error("Error de Proveedor", error);
      Notify.create("Error al deshabilitar el Proveedor");
    });
}

async function agregarMantenimiento() {
  const r = await useMantenimiento.postMantenimiento({
    idMaquinaria: idMaquinaria.value.value,
    responsable: idResponsable.value.value,
    observaciones: observaciones.value,
  });

  cerrar();
  Limpiar();
  listarMantenimiento();
  console.log(idMaquinaria.value);
}

function traerRiego(riego) {
  console.log(riego);

  alert.value = true;
  accion.value = 2;
  id.value = riego._id;
  idMaquinaria.value = {
    label: riego.idMaquinaria.nombre,
    value: riego.idMaquinaria._id,
  };
  idResponsable.value = {
    label: riego.responsable.nombre,
    value: riego.responsable._id,
  };

  observaciones.value = riego.observaciones;
}

function validarEdicionMaquinaria() {
   if (!idMaquinaria.value) {
    Notify.create("Se debe seleccionar la Maquinaria");
  } else if (!idResponsable.value) {
    Notify.create("Se debe agregar el Responsable");
  }  else if (observaciones.value.trim().length === 0) {
    Notify.create("Se debe agregar Observaciones");
  }else {
    editarMantenimiento();
    Limpiar();
    cerrar();
    Notify.create({
      type: "positive",
      message: "Mantenimiento Editado exitosamente",
    });
  }
}

async function editarMantenimiento() {
  try {
    await useMantenimiento.putMantenimiento(id.value, {
      idMaquinaria: idMaquinaria.value.value,
      responsable: idResponsable.value.value,
      observaciones: observaciones.value,
    });
    listarMantenimiento();
    cerrar();
  } catch (error) {
    console.error("Error de actualizar Mantenimiento", error);
    Notify.create("Ocurrio un error al editar datos del Mantenimiento");
  }
}

function Limpiar() {
  idMaquinaria.value = null;
  idResponsable.value = null;
  observaciones.value = "";
}

onMounted(() => {
  listarMantenimiento();
  getMaquinarias();
  listarEmpleados();
});
</script>
