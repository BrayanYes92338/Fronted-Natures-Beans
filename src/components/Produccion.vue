<template>
  <div>
    <div style="margin-left: 5%; text-align: end; margin-right: 5%">
      <q-btn style="background-color: #00c04f; color: white" class="q-my-md q-ml-md" @click="abrir()">Registrar
        Produccion</q-btn>
    </div>
    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color: #009b44; margin-bottom: 20px">
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Produccion" : "Editar Produccion " }}
            </div>
          </q-card-section>
          <q-select outlined v-model="idCultivo" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" :options="options" @filter="filterFn" label="Seleccionar  el cultivo">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> Sin resultados </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input outlined v-model="numLote" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="numero de Lote" type="string" />
          <q-input outlined v-model="producto" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="producto" type="string" />
          <q-input outlined v-model="cantidad" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="cantidad" type="tel" required pattern="[0-9]+" maxlength="999" />
          <q-input outlined v-model="cantidadTrabajadores" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="cantidadTrabajadores" type="tel" />
          <q-input outlined v-model="observaciones" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="observaciones" type="text" />
          <q-card-actions align="right">
            <q-btn v-if="accion === 1" @click="validarIngresoProduccion()" color="red" class="text-white"
              :loading="useProduccion.loading">Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn v-if="accion !== 1" @click="validarEdicionProduccion()" color="red" class="text-white"
              :loading="useProduccion.loading">
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
      <q-table title="Producciones" title-class="text-green text-weight-bolder text-h4"
        table-header-class="text-black font-weight-bold" :rows="rows" :columns="columns" row-key="name"
        style="width: 90%; margin-bottom: 5%;">
        <template v-slot:body-cell-observaciones="props">
          <q-td :props="props">
            <!-- VDropdown para mostrar el tooltip al hacer clic -->
            <VDropdown :distance="6" v-model="props.row.showDropdown">
              <!-- Botón que activará el dropdown -->
              <q-btn flat dense @click="toggleDropdown(props.row)">
                <!-- Controlamos que no se muestre en mayúsculas -->
                <span style="text-transform: none;">
                  {{ props.row.observaciones.length > 10 ? props.row.observaciones.substring(0, 10) + '...' :
                    props.row.observaciones }}
                </span>
              </q-btn>

              <!-- Contenido del popper (dropdown) con estilos personalizados -->
              <template #popper>
                <div class="custom-tooltip-content"
                  style="max-height: 200px; max-width: 200px; overflow-y: auto; padding: 10px;">
                  {{ props.row.observaciones }}
                </div>
              </template>
            </VDropdown>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <div style="display: flex; gap: 15px; justify-content: center">
              <!-- boton de editar -->
              <q-btn color="primary" @click="traerProduccion(props.row)">
                <q-tooltip> Editar </q-tooltip>
                <i class="fas fa-pencil-alt"> </i></q-btn>
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
import { useProduccionStore } from "../stores/produccion.js";
import { useCultivoStore } from "../stores/cultivo.js";

const useProduccion = useProduccionStore();
const useCultivo = useCultivoStore();

let rows = ref([]);
let alert = ref(false);
let id = ref("");
let accion = ref(1);
let idCultivo = ref("");
let numLote = ref("");
let producto = ref("");
let cantidad = ref("");
let cantidadTrabajadores = ref("");
let observaciones = ref("");
let opciones = ref("");

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
    label: "Nombre del Cultivo",
    align: "center",
    field: (row) => row.idCultivo.nombre,
    sortable: true,
  },
  {
    name: "numLote",
    required: true,
    label: "Numero de Lote",
    align: "center",
    field: "numLote",
    sortable: true,
  },
  {
    name: "producto",
    required: true,
    label: "Producto",
    align: "center",
    field: "producto",
    sortable: true,
  },
  {
    name: "cantidad",
    required: true,
    label: "Cantidad",
    align: "center",
    field: "cantidad",
    sortable: true,
  },
  {
    name: "cantidadTrabajadores",
    required: true,
    label: "cantidad Trabajadores",
    align: "center",
    field: "cantidadTrabajadores",
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
    name: "fecha",
    required: true,
    label: "Fecha ",
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

//  listar cultivos

let cultivos = [];
let datos = {};
const options = ref(cultivos);

function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = cultivos.filter((v) => v.label.toLowerCase().indexOf(needle) > -1);
  });
}

async function listarCultivos() {
  const data = await useCultivo.listarCultivo();
  data.data.cultivo.forEach((item) => {
    datos = {
      label: `${item.nombre} - ${item.tipo}`,
      value: item._id,
    };
    cultivos.push(datos);
  });
  console.log(cultivos);
}

async function listarProduccion() {
  const r = await useProduccion.listarProduccion();
  rows.value = r.data.produccion.reverse();
  console.log(r.data.produccion);
}

function validarIngresoProduccion() {
  let validacionnumeros = /^[0-9]+$/;
  if (idCultivo.value == "") {
    Notify.create("Se debe seleccionar cultivo");
  } else if (numLote.value == "") {
    Notify.create("Se debe agregar numero de Lote");
  } else if (producto.value == "" || producto.value.trim().length === 0) {
    Notify.create("Se debe agregar producto");
  } else if (cantidad.value == "") {
    Notify.create("Se debe agregar producto");
  } else if (!validacionnumeros.test(cantidad.value)) {
    Notify.create("La cantidad solo debe llevar numeros");
  } else if (cantidadTrabajadores.value == "") {
    Notify.create("Se debe agregar cantidad de trabajadores");
  } else if (!validacionnumeros.test(cantidadTrabajadores.value)) {
    Notify.create("La cantidad de trabajadores solo debe llevar numeros");
  } else if (observaciones.value == "" || observaciones.value.trim().length === 0) {
    Notify.create("Se debe agregar observaciones");
  } else {
    agregarProduccion();
    Limpiar();
    cerrar();
    Notify.create({
      type: "positive",
      message: "Produccion agregado exitosamente",
    });
  }
}

async function agregarProduccion() {
  const r = await useProduccion.postProduccion({
    idCultivo: idCultivo.value.value,
    numLote: numLote.value,
    producto: producto.value,
    cantidad: cantidad.value,
    cantidadTrabajadores: cantidadTrabajadores.value,
    observaciones: observaciones.value,
  });

  cerrar();
  Limpiar();
  listarProduccion();
  console.log(r);
}

function traerProduccion(produccion) {
  alert.value = true;
  accion.value = 2;
  id.value = produccion._id;
  idCultivo.value = {
    label: produccion.idCultivo.nombre,
    value: produccion.idCultivo._id,
  };
  numLote.value = produccion.numLote;
  producto.value = produccion.producto;
  cantidad.value = produccion.cantidad;
  cantidadTrabajadores.value = produccion.cantidadTrabajadores;
  observaciones.value = produccion.observaciones;
}

function validarEdicionProduccion() {
  let validacionnumeros = /^[0-9]+$/;
  if (idCultivo.value == "") {
    Notify.create("Se debe seleccionar cultivo");
  } else if (numLote.value == "" || numLote.value.trim().length === 0) {
    Notify.create("Se debe agregar numero de Lote");
  } else if (producto.value == "" || producto.value.trim().length === 0) {
    Notify.create("Se debe agregar producto");
  } else if (cantidad.value == "") {
    Notify.create("Se debe agregar cantidad");
  } else if (!validacionnumeros.test(cantidad.value)) {
    Notify.create("La cantidad solo debe llevar numeros");
  } else if (cantidadTrabajadores.value == "") {
    Notify.create("Se debe agregar cantidad de trabajadores");
  } else if (!validacionnumeros.test(cantidadTrabajadores.value)) {
    Notify.create("La cantidad de trabajadores solo debe llevar numeros");
  } else if (observaciones.value == "" || observaciones.value.trim().length === 0) {
    Notify.create("Se debe agregar observaciones");
  } else {
    editarProduccion();
    Limpiar();
    cerrar();
    Notify.create({
      type: "positive",
      message: "Edicion de Produccion agregado exitosamente",
    });
  }
}

async function editarProduccion() {
  try {
    await useProduccion.putProduccion(id.value, {
      idCultivo: idCultivo.value.value,
      numLote: numLote.value,
      producto: producto.value,
      cantidad: cantidad.value,
      cantidadTrabajadores: cantidadTrabajadores.value,
      observaciones: observaciones.value,
    });
    listarProduccion();
  } catch (error) {
    console.error("Error de actualizar Produccion", error);
    Notify.create("Ocurrio un error al editar datos de la Produccion");
  }
}

function Limpiar() {
  idCultivo.value = "";
  numLote.value = "";
  producto.value = "";
  cantidad.value = "";
  cantidadTrabajadores.value = "";
  observaciones.value = "";
}

onMounted(() => {
  listarProduccion();
  listarCultivos();
});
</script>
