<template>
  <div>
    <div style="
        display: flex;
        justify-content: flex-end;
        margin-left: 5%;
        margin-right: 5%;
      ">
      <q-btn style="background-color: #00c04f; color: white" class="q-my-md q-ml-md" @click="abrir()">Registrar
        Semilla</q-btn>
      <q-btn-dropdown color="blue" icon="visibility" label="Filtrar" style="
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 16px;
          height: 20px;
        " class="q-my-md q-ml-md">
        <q-list>
          <q-item clickable v-ripple @click="listarSemilla()">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarSemillaActiva()">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listarSemillaInactiva()">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color: #009b44; margin-bottom: 20px">
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Semilla" : "Editar Semilla " }}
            </div>
          </q-card-section>
          <q-select outlined v-model="idProveedor" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" :options="options" @filter="filterFn" label="Seleccionar  Finca">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input outlined v-model="registroIca" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="registro ICA" type="text" />
          <q-input outlined v-model="registroInvima" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="registro INVIMA" type="text" />

          <q-input outlined v-model="fechaVencimiento" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="fecha Vencimiento" type="date" />

    <q-select
      outlined
      v-model="especie"
      :options="opcionesSelect"
      label="Seleccione la Especie de la semilla"
      class="q-my-md q-mx-md"
      use-input
      input-debounce="0"
      @filter="filterFnSelect"
    />

          <q-input outlined v-model="NumLote" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label=" Numero Lote" type="tel" required pattern="[0-9]+" maxlength="99" />
          <q-input outlined v-model="origen" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="origen de la semilla" type="text" />
          <q-input outlined v-model="poderGerminativo" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="poder Germinativo (%)" type="text" />

          <q-card-actions align="right">
            <q-btn v-if="accion === 1" @click="validarIngresoSemilla()" color="red" class="text-white"
              :loading="useSemilla.loading">Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn v-if="accion !== 1" @click="validarEdicionSemilla()" color="red" class="text-white"
              :loading="useSemilla.loading">
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
      <q-table title="Semillas" title-class="text-green text-weight-bolder text-h4"
        table-header-class="text-black font-weight-bold" :rows="rows" :columns="columns" row-key="name"
        style="width: 90%; margin-bottom: 5%">
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
                <i class="fas fa-pencil-alt"> </i></q-btn>
              <!-- botons de activado y desactivado -->
              <q-btn v-if="props.row.estado == 1" @click="deshabilitarSemilla(props.row)" color="negative">
                <q-tooltip> Desactivar </q-tooltip>
                <i class="fas fa-times"> </i></q-btn>
              <q-btn v-else color="positive" @click="habilitarSemilla(props.row)">
                <q-tooltip> Activar </q-tooltip><i class="fas fa-check"> </i></q-btn>
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
import { useSemillaStore } from "../stores/semillas.js";
import { useFincaStore } from "../stores/finca.js";

const useSemilla = useSemillaStore();
const useFinca = useFincaStore();

let rows = ref([]);
let alert = ref(false);
let id = ref("");
let registroIca = ref("");
let registroInvima = ref("");
let accion = ref(1);
let idProveedor = ref("");
let numFactura = ref("");
let fechaVencimiento = ref("");
let especie = ref("");
let variedad = ref("");
let NumLote = ref("");
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
    name: "idFinca",
    required: true,
    label: "Nombre de la Finca",
    align: "center",
    field: (row) => row.idFinca?.nombre ?? "Finca no disponible",
    sortable: true,
  },
  {
    name: "fechaCompra",
    required: true,
    label: "fecha Compra",
    align: "center",
    field: "fechaCompra",
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
    name: "fechaVencimiento",
    required: true,
    label: "fecha Vencimiento",
    align: "center",
    field: (row) => row.fechaVencimiento.split("T")[0],
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
    name: "registro_Invima",
    required: true,
    label: "registro Invima",
    align: "center",
    field: "registro_Invima",
    sortable: true,
  },
  {
    name: "registro_ICA",
    required: true,
    label: "registro_ICA",
    align: "center",
    field: "registro_ICA",
    sortable: true,
  },
  {
    name: "especie",
    required: true,
    label: "especie de semilla",
    align: "center",
    field: "especie",
    sortable: true,
  },
  {
    name: "numLote",
    required: true,
    label: "Numero Lote",
    align: "center",
    field: "numLote",
    sortable: true,
  },
  {
    name: "origen",
    required: true,
    label: "origen de la semilla",
    align: "center",
    field: "origen",
    sortable: true,
  },
  {
    name: "poderGerminativo",
    required: true,
    label: "poder Germinativo",
    align: "center",
    field: "poderGerminativo",
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

//  listar proveedor

let proveedor = [];
let datos = {};
const options = ref(proveedor);

function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = proveedor.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
}

async function listarProveedor() {
  const data = await useFinca.listarFincas();
  console.log(data);

  data.data.fincas.forEach((item) => {
    datos = {
      label: `${item.nombre} `,
      value: item._id,
    };
    proveedor.push(datos);
  });
  console.log(proveedor);
}

const listarSemillaActiva = async () => {
  try {
    const res = await useSemilla.listarSemillaActiva();
    rows.value = res.semillaActiva.reverse();
    Notify.create({
      message: "Listado de Semilla Activa",
      color: "green",
    });
    console.log(res.semillaActiva);
  } catch (error) {
    console.error("Error al listar Semilla activa:", error);
    Notify.create("Error al obtener Semilla de Empleado activa");
  }
};

const listarSemillaInactiva = async () => {
  try {
    const res = await useSemilla.listarSemillaInactiva();
    rows.value = res.semillaInactiva.reverse();
    Notify.create({
      message: "Listado de Nomina Inactiva",
      color: "green",
    });

    console.log(res.semillaInactiva);
  } catch (error) {
    console.error("Error al listar Semilla inactiva", error);
    Notify.create("Error al obtener listado de Semilla inactiva");
  }
};

async function listarSemilla() {
  const r = await useSemilla.listarSemilla();
  rows.value = r.data.semilla.reverse();
  console.log(r.data.semilla);
}

function validarIngresoSemilla() {
  let validacionnumeros = /^[0-9]+$/;
  if (idProveedor.value == "") {
    Notify.create("Se debe seleccionar proveedor");
  } else if (
    fechaVencimiento.value == "" ||
    fechaVencimiento.value.trim().length === 0
  ) {
    Notify.create("Se debe agregar  fecha Vencimiento");
  } else if (especie.value == "" || especie.value.trim().length === 0) {
    Notify.create("Se debe agregar especie");
  } else if (NumLote.value == "") {
    Notify.create("Se debe agregar un Numero Lote");
  } else if (!validacionnumeros.test(NumLote.value)) {
    Notify.create("El Numero Lote solo debe llevar numeros");
  } else if (origen.value == "" || origen.value.trim().length === 0) {
    Notify.create("Se debe agregar origen");
  } else if (
    poderGerminativo.value == "" ||
    poderGerminativo.value.trim().length === 0
  ) {
    Notify.create("Se debe agregar poder Germinativo (%)");
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
  const r = await useSemilla.postSemilla({
    idFinca: idProveedor.value.value,
    registro_ICA: registroIca.value,
    registro_Invima: registroInvima.value,
    numFactura: numFactura.value,
    fechaVencimiento: fechaVencimiento.value,
    especie: especie.value,
    variedad: variedad.value,
    numLote: NumLote.value,
    origen: origen.value,
    poderGerminativo: poderGerminativo.value,
    total: total.value,
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
  idProveedor.value = {
    label: semilla.idFinca.nombre,
    value: semilla.idFinca._id,
  };
  numFactura.value = semilla.numFactura;
  registroIca.value = semilla.registro_ICA;
  registroInvima.value = semilla.registro_Invima;

  fechaVencimiento.value = semilla.fechaVencimiento.split("T")[0];
  especie.value = semilla.especie;
  variedad.value = semilla.variedad;
  NumLote.value = semilla.numLote;
  origen.value = semilla.origen;
  poderGerminativo.value = semilla.poderGerminativo;
  total.value = semilla.total;
}

function validarEdicionSemilla() {
  let validacionnumeros = /^[0-9]+$/;
  if (idProveedor.value == "") {
    Notify.create("Se debe seleccionar proveedor");
  } else if (numFactura.value == "") {
    Notify.create("Se debe agregar un numero de Factura");
  } else if (
    fechaVencimiento.value == "" ||
    fechaVencimiento.value.trim().length === 0
  ) {
    Notify.create("Se debe agregar  fecha Vencimiento");
  } else if (especie.value == "" || especie.value.trim().length === 0) {
    Notify.create("Se debe agregar especie");
  } else if (NumLote.value == "") {
    Notify.create("Se debe agregar un Numero Lote");
  } else if (!validacionnumeros.test(NumLote.value)) {
    Notify.create("El Numero Lote solo debe llevar numeros");
  } else if (origen.value == "" || origen.value.trim().length === 0) {
    Notify.create("Se debe agregar origen");
  } else if (
    poderGerminativo.value == "" ||
    poderGerminativo.value.trim().length === 0
  ) {
    Notify.create("Se debe agregar poder Germinativo (%)");
  } else if (total.value == "") {
    Notify.create("Se debe agregar total");
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
    await useSemilla.putSemilla(id.value, {
      idFinca: idProveedor.value.value,
      numFactura: numFactura.value,
      fechaVencimiento: fechaVencimiento.value,
      especie: especie.value,
      registro_ICA: registroIca.value,
      NumLote: NumLote.value,
      origen: origen.value,
      poderGerminativo: poderGerminativo.value,
      registro_Invima: registroInvima.value,
    });
    listarSemilla();
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
  idProveedor.value = "";
  registroIca.value = "";
  registroInvima.value = "";
  fechaVencimiento.value = "";
  especie.value = "";
  variedad.value = "";
  NumLote.value = "";
  origen.value = "";
  poderGerminativo.value = "";
  total.value = "";
}

const opcionesSelect = ref([
  'Maíz', 'Arroz', 'Fríjol', 'Café', 'Caña de azúcar', 'Sorgo',
  'Papa', 'Yuca', 'Soya', 'Trigo', 'Plátano', 'Cebada',
  'Avena', 'Cacao', 'Tomate', 'Pimentón', 'Ají', 'Algodón',
  'Alfalfa', 'Girasol'
])

const filterFnSelect = (val, update) => {
  update(() => {
    if (val && !opcionesSelect.value.includes(val)) {
      opcionesSelect.value = [...opcionesSelect.value, val] // Agregar nueva opción si no existe
    }
  })
}

onMounted(() => {
  listarSemilla();
  listarProveedor();
});
</script>