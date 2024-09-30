<template>
    <div>
        <div style="margin-left: 5%; text-align: end; margin-right: 5%">
      <q-btn style="background-color: #00c04f; color: white" class="q-my-md q-ml-md" @click="">Registrar Gastos</q-btn>
    </div>

    <!-- Tabla de Gastos -->
    <div style="display: flex; justify-content: center">
      <q-table title="Gastos" title-class="text-green text-weight-bolder text-h4"
        table-header-class="text-black font-weight-bold" :rows="rows" :columns="columns" row-key="name"
        style="width: 90%; margin-bottom: 5%;">
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <div style="display: flex; gap: 15px; justify-content: center">
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
import {useGastoStore}from '../stores/gastos.js'
import {useFincaStore} from '../stores/finca.js'

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
let semillas =ref([]);
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

// Listar Gastos
async function listarGastos(){
    const r = await useGasto.listarGastos()
    rows.value = r.data.siem.reverse()
    console.log(r.data.siem)

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
    label: "Gasto",
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
    name: "nombre",
    required: true,
    label: "Nombre",
    align: "center",
    field: "nombre",
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
let fincas =[];
let datos = {}
const opciones = ref(fincas)

async function listarFincas(){
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