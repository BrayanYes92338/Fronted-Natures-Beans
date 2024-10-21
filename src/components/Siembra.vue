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
        >Registrar Siembra</q-btn
      >
    </div>
    <div>
      <q-dialog v-model="alert" persistent>
        <q-card style="width: 700px">
          <q-card-section
            style="background-color: #009b44; margin-bottom: 20px"
          >
            <div class="text-h6 text-white">
              {{ accion === 1 ? "Agregar Siembra" : "Editar Siembra" }}
            </div>
          </q-card-section>

          <q-select
            outlined
            v-model="idCultivo"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            class="q-my-md q-mx-md"
            :options="options"
            label="Seleccionar Cultivo"
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
            v-model="idEmpleados"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            class="q-my-md q-mx-md"
            :options="optionsEmpleado"
            label="Seleccionar Empleado"
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
            v-model="idSemilla"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            class="q-my-md q-mx-md"
            :options="optionsSemilla"
            label="Seleccionar Semilla"
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
            v-model="fechasiembra"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            class="q-my-md q-mx-md"
            label="Fecha Siembra"
            type="date"
          />

          <q-input
            outlined
            v-model="fechacosecha"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            class="q-my-md q-mx-md"
            label="Fecha Cosecha"
            type="date"
          />

          <q-input
            outlined
            v-model="cultivoAnterior"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            class="q-my-md q-mx-md"
            label="cultivo Anterior"
            type="text"
            required
          />
          <q-input
            outlined
            v-model="transplante"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            class="q-my-md q-mx-md"
            label="Transplante"
            type="text"
            required
          />

          <q-card-actions align="right">
            <q-btn
              v-if="accion === 1"
              @click="validarIngresoSemilla()"
              color="red"
              class="text-white"
              :loading="useSiembra.loading"
              >Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn
              v-if="accion !== 1"
              @click="validarEdicionSemilla()"
              color="red"
              class="text-white"
              :loading="useSiembra.loading"
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
        title="Siembras"
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
              <q-btn color="primary" @click="traerSemilla(props.row)">
                <q-tooltip> Editar </q-tooltip>
                <i class="fas fa-pencil-alt"> </i
              ></q-btn>
              <!-- botons de activado y desactivado -->
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
import { useSiembraStore } from "../stores/siembra.js";
import { useCultivoStore } from "../stores/cultivo.js";
import { useEmpleadoStore } from "../stores/empleado.js";
import { useSemillaStore } from "../stores/semillas.js";

const useSiembra = useSiembraStore();
const useCultivo = useCultivoStore();
const useEmpleado = useEmpleadoStore();
const useSemilla = useSemillaStore();

let rows = ref([]);
let alert = ref(false);
let id = ref("");
let idCultivo = ref("");
let idEmpleados = ref("");
let accion = ref(1);
let idProveedor = ref("");
let idSemilla = ref("");
let fechasiembra = ref("");
let fechacosecha = ref("");
let cultivoAnterior = ref("");
let transplante = ref("");
let origen = ref("");
let poderGerminativo = ref("");
let total = ref("");
let today = new Date().toISOString().split("T")[0];

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
    name: "idCultivo",
    required: true,
    label: "Nombre de el Cultivo",
    align: "center",
    field: (row) => row.idCultivo?.nombre ?? "Finca no disponible",
    sortable: true,
  },
  {
    name: "fechasiembra",
    required: true,
    label: "fecha Siembra",
    align: "center",
    field: "fechasiembra",
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
    name: "fechacosecha",
    required: true,
    label: "fecha Vencimiento",
    align: "center",
    field: (row) => row.fechacosecha.split("T")[0],
    sortable: true,
    format: (val) => {
      const fechaVencimiento = new Date(val);
      return fechaVencimiento.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
  {
    name: "idEmpleados",
    required: true,
    label: "Empleados",
    align: "center",
    field: (row) => row.idEmpleados?.nombre ?? "Finca no disponible",
    sortable: true,
  },
  {
    name: "idSemilla",
    required: true,
    label: "Semilla",
    align: "center",
    field: (row) => row.idSemilla?.especie ?? "semilla no disponible",
    sortable: true,
  },
  {
    name: "cultivoAnterior",
    required: true,
    label: "cultivo Anterior",
    align: "center",
    field: "cultivoAnterior",
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

//  listar proveedor

let proveedor = [];
let empleado = [];
let semilla = [];

let datos = {};
let datosEmpleado = {};
let datosSemilla = {};

const options = ref(proveedor);
const optionsEmpleado = ref(empleado);
const optionsSemilla = ref(semilla);

function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = proveedor.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
    optionsEmpleado.value = empleado.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
}

async function listarProveedor() {
  const data = await useCultivo.listarCultivo();
  console.log(data);

  data.data.cultivo.forEach((item) => {
    datos = {
      label: `${item.nombre} `,
      value: item._id,
    };
    proveedor.push(datos);
  });
  console.log(proveedor);
}
async function listarEmpleado() {
  const data = await useEmpleado.listarEmpleado();
  console.log(data);

  data.data.empleado.forEach((item) => {
    datosEmpleado = {
      label: `${item.nombre} `,
      value: item._id,
    };
    empleado.push(datosEmpleado);
  });
  console.log(proveedor);
}
async function listarSemilla() {
  const data = await useSemilla.listarSemilla();
  console.log(data);

  data.data.semilla.forEach((item) => {
    datosSemilla = {
      label: `${item.especie} `,
      value: item._id,
    };
    semilla.push(datosSemilla);
  });
  console.log(semilla);
}

const listarSemillaActiva = async () => {
  try {
    const res = await useSemilla.listarSemillaActiva();
    rows.value = res.semilla.reverse();
    Notify.create({
      message: "Listado de Semilla Activa",
      color: "green",
    });
    console.log(res.semilla);
  } catch (error) {
    console.error("Error al listar Semilla activa:", error);
    Notify.create("Error al obtener Semilla de Empleado activa");
  }
};

const listarSemillaInactiva = async () => {
  try {
    const res = await useSemilla.listarSemillaInactiva();
    rows.value = res.semilla.reverse();
    Notify.create({
      message: "Listado de Nomina Inactiva",
      color: "green",
    });

    console.log(res.semilla);
  } catch (error) {
    console.error("Error al listar Semilla inactiva", error);
    Notify.create("Error al obtener listado de Semilla inactiva");
  }
};

async function listarSiembra() {
  const r = await useSiembra.listarSiembra();
  console.log(r);

  rows.value = r.data.siem;
  console.log(r.data.semilla);
}

function validarIngresoSemilla() {
  let validacionnumeros = /^[0-9]+$/;

  if (idCultivo.value == null) {
    Notify.create("Se debe seleccionar un cultivo");
  } else if (idEmpleados.value.value == null) {
    Notify.create("Se debe seleccionar un empleado");
  } else if (idSemilla.value.value == null) {
    Notify.create("Se debe seleccionar una semilla");
  } else if (
    fechasiembra.value == "" ||
    fechasiembra.value.trim().length === 0
  ) {
    Notify.create("Se debe agregar la fecha de siembra");
  } else if (
    fechacosecha.value == "" ||
    fechacosecha.value.trim().length === 0
  ) {
    Notify.create("Se debe agregar la fecha de cosecha");
  } else if (cultivoAnterior.value == null) {
    Notify.create("Se debe agregar el cultivo anterior");
  } else if (transplante.value == "" || transplante.value.trim().length === 0) {
    Notify.create("Se debe indicar si es un transplante");
  } else {
    agregarSemilla();
    Limpiar();
    cerrar();
    Notify.create({
      type: "positive",
      message: "Semilla agregado exitosamente",
    });
  }
}

async function agregarSemilla() {
  const r = await useSiembra.postSiembra({
    idCultivo: idCultivo.value.value,
    idEmpleados: idEmpleados.value.value,
    idSemilla: idSemilla.value.value,
    fechasiembra: fechasiembra.value,
    fechacosecha: fechacosecha.value,
    cultivoAnterior: cultivoAnterior.value,
    transplante: transplante.value,
  });

  cerrar();
  Limpiar();
  listarSemilla();
  console.log(r);
}

function traerSemilla(semilla) {
  console.log(semilla);

  alert.value = true;
  accion.value = 2;
  id.value = semilla._id;
  if (semilla.idCultivo) {
    idCultivo.value = {
      label: semilla.idCultivo.nombre,
      value: semilla.idCultivo._id,
    };
  } else {
    idCultivo.value = {
      label: "Selecciona un cultivo",
      value: null,
    };
  }

  idEmpleados.value = {
    label: semilla.idEmpleados.nombre,
    value: semilla.idEmpleados._id,
  };
  if (semilla.idSemilla) {
    idSemilla.value = {
      label: semilla.idSemilla.especie,
      value: semilla.idSemilla._id,
    };
  } else {
    idSemilla.value = {
      label: "Selecciona una semilla",
      value: null,
    };
  }

  cultivoAnterior.value = semilla.cultivoAnterior;
  fechacosecha.value = semilla.fechacosecha.split("T")[0];
  fechasiembra.value = semilla.fechasiembra.split("T")[0];

  transplante.value = semilla.transplante;
}

function validarEdicionSemilla() {
  let validacionnumeros = /^[0-9]+$/;

  if (idCultivo.value == null) {
    Notify.create("Se debe seleccionar un cultivo");
  } else if (idEmpleados.value.value == null) {
    Notify.create("Se debe seleccionar un empleado");
  } else if (idSemilla.value.value == null) {
    Notify.create("Se debe seleccionar una semilla");
  } else if (
    fechasiembra.value == "" ||
    fechasiembra.value.trim().length === 0
  ) {
    Notify.create("Se debe agregar la fecha de siembra");
  } else if (
    fechacosecha.value == "" ||
    fechacosecha.value.trim().length === 0
  ) {
    Notify.create("Se debe agregar la fecha de cosecha");
  } else if (cultivoAnterior.value == null) {
    Notify.create("Se debe agregar el cultivo anterior");
  } else if (transplante.value == "" || transplante.value.trim().length === 0) {
    Notify.create("Se debe indicar si es un transplante");
  } else {
    editarSemilla();
    Limpiar();
    cerrar();
    Notify.create({
      type: "positive",
      message: "Edicion de semillas agregadas exitosamente",
    });
  }
}

async function editarSemilla() {
  try {
    await useSiembra.putSiembra(id.value, {
      idCultivo: idCultivo.value.value,
      idEmpleados: idEmpleados.value.value,
      idSemilla: idSemilla.value.value,
      fechasiembra: fechasiembra.value,
      fechacosecha: fechacosecha.value,
      cultivoAnterior: cultivoAnterior.value,
      transplante: transplante.value,
    });
    listarSiembra();
    cerrar();
  } catch (error) {
    console.error("Error de actualizar Semillas", error);
    Notify.create("Ocurrio un error al editar datos del semillas");
  }
}

async function habilitarSemilla(semilla) {
  const res = await useSemilla
    .putSemillaActiva(semilla._id)
    .then((response) => {
      console.log(response);
      listarSemilla();
    })

    .catch((error) => {
      console.error("Error de Semilla Activa", error);
      Notify.create("Error al habilitar la Semilla");
    });
}

async function deshabilitarSemilla(semilla) {
  const res = await useSemilla
    .putSemillaDesactivar(semilla._id)
    .then((response) => {
      console.log(response);
      listarSemilla();
    })
    .catch((error) => {
      console.error("Error de Semilla", error);
      Notify.create("Error al deshabilitar la Semilla");
    });
}

function Limpiar() {
  idCultivo.value = "";
  idEmpleados.value = "";
  idSemilla.value = "";
  fechasiembra.value = "";
  fechacosecha.value = "";
  transplante.value = "";
  cultivoAnterior.value = "";
}

onMounted(() => {
  listarSiembra();
  listarProveedor();
  listarEmpleado();
  listarSemilla();
});
</script>
