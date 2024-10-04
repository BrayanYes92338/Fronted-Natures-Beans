<template>
  <div>
    <div style="margin-left: 5%; text-align: end; margin-right: 5%">
      <q-btn style="background-color: #00c04f; color: white" class="q-my-md q-ml-md" @click="abrir()">Registrar
        Gastos</q-btn>
    </div>

    <!-- Modelo del gasto -->
    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color:#009B44; margin-bottom: 20px">
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Gastos" : "Editar Gastos" }}
            </div>
          </q-card-section>
          <q-select outlined v-model="idFinca" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" :options="opciones" @filter="filterFnFinca"
            label="Selecciona el nombre del Proveedor">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select outlined v-model="nombre" :options="['Semilla', 'Insumo']" label="Seleccione el Tipo de Gasto"
            class="q-my-md q-mx-md" />
          <q-input outlined v-model="numerofactura" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Numero de Factura" type="tel" required pattern="[0-9]+" maxlength="10" />
          <q-input outlined v-model="descripcion" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Ingrese Descripcion del Gasto" type="text" />
          <q-card-actions align="right">
            <q-btn v-if="accion === 1" @click="validarGastos()" color="red" class="text-white"
              :loading="useGasto.loading">Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn v-if="accion !== 1" @click="" color="red" class="text-white" :loading="useGasto.loading">
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

    <!-- Tabla de Gastos -->
    <div style="display: flex; justify-content: center">
      <q-table title="Gastos" title-class="text-green text-weight-bolder text-h4"
        table-header-class="text-black font-weight-bold" :rows="rows" :columns="columns" row-key="name"
        style="width: 90%; margin-bottom: 5%;">
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <div style="display: flex; gap: 15px; justify-content: center">
              <!-- Botones de Semillas e Insumos  -->
              <q-btn v-if="props.row.nombre == 'Semillas'" color="green" @click="">
                <q-tooltip>
                  Ver registro de Gastos de Semillas
                </q-tooltip>
                <i class="fas fa-seedling"></i>
              </q-btn>
              <q-btn v-else color="blue" @click="">
                <q-tooltip>
                  Ver Registro de Gastos de Insumos
                </q-tooltip>
                <i class="fas fa-flask"></i>
              </q-btn>
              <!-- boton de editar -->
              <q-btn color="primary" @click="">
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
import { useGastoStore } from '../stores/gastos.js'
import { useFincaStore } from '../stores/finca.js'

const useGasto = useGastoStore()
const useFinca = useFincaStore()

const showTooltip = ref(false);
let rows = ref([]);
let alert = ref(false);
let id = ref("");
let accion = ref(1);
let idFinca = ref("");
let nombre = ref("")
let numerofactura = ref("")
let descripcion = ref("")

// Variables Para semillas
let semillas = ref([]);
let idSemilla = ref("")
let idProveedor = ref("")
let unidad = ref("")
let cantidadSemillas = ref("")
let precio = ref("")
let totalSemillas = ref("")
let descripcionSemillas = ref("")

// Variables para insumos

let insumos = ref([])
let idInsumo = ref("")
let idProveedorInsumo = ref("")
let unidadInsumo = ref("")
let totalInsumos = ref("")
let cantidad = ref("")

function abrir() {
  accion.value = 1,
    alert.value = true;
}

function cerrar() {
  alert.value = false;
}

// Listar Gastos
async function listarGastos() {
  const r = await useGasto.listarGastos()
  rows.value = r.data.siem.reverse()
  console.log(r.data.siem)
}

function validarGastos() {
  if (idFinca.value == "") {
    Notify.create("Se Debe agregar el nombre de la Finca");
  } else if (nombre.value == "" || nombre.value.trim().length === 0) {
    Notify.create("Se debe ingresar el tipo de Gasto realizado");
  } else if (numerofactura.value == "" || numerofactura.value.trim().length === 0) {
    Notify.create("Se debe ingresar el numero de factura");
  } else if (descripcion.value == "" || descripcion.value.trim().length === 0) {
    Notify.create("Se debe ingresar el numero de factura");
  } else {
    cerrar()
    agregarGasto()
    Notify.create({
      type: "positive",
      message: "Gasto agregado exitosamente",
    });
  }
}


async function agregarGasto() {
  const r = await useGasto.postGastos({
    idFinca: idFinca.value.value,
    nombre: nombre.value,
    numerofactura: numerofactura.value,
    descripcion: descripcion.value,
  })
  cerrar()
  listarGastos()
  console.log(r)
}

// Listar Tabla de Gastos

const columns = ref([
  {
    name: "idProveedor",
    required: true,
    label: "Nombre de la Finca",
    align: "center",
    field: (row) => row.idFinca.nombre,
    sortable: true,
  },
  {
    name: "nombre",
    required: true,
    label: "Tipo de Gasto",
    align: "center",
    field: "nombre",
    sortable: true,
  },
  {
    name: "numerofactura",
    required: true,
    label: "Numero de Factura",
    align: "center",
    field: "numerofactura",
    sortable: true,
  },
  {
    name: "descripcion",
    required: true,
    label: "Descripcion del Gasto",
    align: "center",
    field: "descripcion",
    sortable: true,
  },
  {
    name: "fecha",
    required: true,
    label: "Fecha del Gasto",
    align: "center",
    field: "fecha",
    sortable: true,
  },
  {
    name: "opciones",
    required: true,
    label: "Opciones",
    align: "center",
    field: "opciones",
    sortable: true,
  }
])


// Listar Fincas
let fincas = [];
let datos = {}
const opciones = ref(fincas)

function filterFnFinca(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    opciones.value = fincas.filter((v) => v.label.toLowerCase().indexOf(needle) > -1);
  });
}

async function listarFincas() {
  const data = await useFinca.ListarFincasActivo()
  data.data.FincaActiva.forEach((item) => {
    datos = {
      label: `${item.nombre}- ${item.ruc}`,
      value: item._id,
    }
    fincas.push(datos)
  })
  console.log(fincas)
}

onMounted(() => {
  listarGastos()
  listarFincas()
});

</script>