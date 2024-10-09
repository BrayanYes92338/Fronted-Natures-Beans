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
            class="q-my-md q-mx-md" label="Numero de Factura" type="text" />
          <q-input outlined v-model="descripcion" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Ingrese Descripcion del Gasto" type="text" />
          <q-card-actions align="right">
            <q-btn v-if="accion === 1" @click="validarGastos()" color="red" class="text-white"
              :loading="useGasto.loading">Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn v-if="accion !== 1" @click="validarEdicionGastos()" color="red" class="text-white"
              :loading="useGasto.loading">
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
    <!-- Modelo Gasto de Semillas -->
    <div>
      <q-dialog persistent v-model="alerta">
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color: #009b44; margin-bottom: 20px">
            <div class="text-h6 text-white">Agregar Gasto de Semillas de la factura {{ nombreF }}</div>
          </q-card-section>
          <q-select outlined v-model="idSemilla" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" :options="opcionesSemillas" @filter="filtarFnSemillas"
            label="Selecciona el Tipo de Semilla">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select outlined v-model="idProveedor" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" :options="opcionesProveedor" @filter="filterFnProveedor"
            label="Selecciona el nombre del Proveedor">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select outlined v-model="unidadSemilla" :options="['Gramo (g)','Kilogramo (kg)', 'Arroba','Libra (lb)', 'Onza (oz)']" label="Seleccione La unidad Gastada" class="q-my-md q-mx-md" />
          <q-card-actions align="right">
            <q-btn color="red" class="text-white" :loading="useGasto.loading" @click="">
              Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn label="Cerrar" color="black" outline @click="cerrar3()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <!-- Modelo Editar Gastos Semillas -->

    <!-- Tabla Gasto Semillas -->
    <div>
      <q-dialog v-model="modalGastoSemillas" persistent full-width>
        <q-card class="">
          <q-card-section style="background-color:#009B44; margin-bottom: 20px">
            <div class="text-h6 text-white">
              Gasto de Semillas de la Factura {{ nombreF }}
            </div>
          </q-card-section>
          <q-table v-if="semillas.length > 0" table-header-class="text-black font-weight-bold" :rows="semillas"
            :columns="columnas" row-key="name">
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <div style="display: flex; gap:15px; justify-content: center; ">
                  <!-- boton de editar -->
                  <q-btn color="primary" @click="">
                    <q-tooltip>
                      Editar Gasto Semillas
                    </q-tooltip>
                    <i class="fas fa-pencil-alt">
                    </i></q-btn>
                </div>
              </q-td>
            </template>
          </q-table>
          <h4 v-else>Aún no hay registro de Gastos de Semillas en la factura {{ nombreF }} </h4>
          <q-card-actions align="right">
            <q-btn @click="abrir2(props?.row)" color="green" class="text-white" :loading="useGasto.loading">
              Agregar Gasto
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn @click="cerrar2()" color="red" class="text-white" :loading="useGasto.loading">
              Cerrar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>


    <!-- Tabla de Gastos -->
    <div style="display: flex; justify-content: center">
      <q-table title="Gastos" title-class="text-green text-weight-bolder text-h4"
        table-header-class="text-black font-weight-bold" :rows="rows" :columns="columns" row-key="name"
        style="width: 90%; margin-bottom: 5%;">
        <template v-slot:body-cell-descripcion="props">
          <q-td :props="props">
            <!-- VDropdown para mostrar el tooltip al hacer clic -->
            <VDropdown :distance="6" v-model="props.row.showDropdown">
              <!-- Botón que activará el dropdown -->
              <q-btn flat dense @click="toggleDropdown(props.row)">
                <!-- Controlamos que no se muestre en mayúsculas -->
                <span style="text-transform: none;">
                  {{ props.row.descripcion.length > 10 ? props.row.descripcion.substring(0, 10) + '...' :
                    props.row.descripcion }}
                </span>
              </q-btn>

              <!-- Contenido del popper (dropdown) con estilos personalizados -->
              <template #popper>
                <div class="custom-tooltip-content"
                  style="max-height: 200px; max-width: 200px; overflow-y: auto; padding: 10px;">
                  {{ props.row.descripcion }}
                </div>
              </template>
            </VDropdown>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <div style="display: flex; gap: 15px; justify-content: center">
              <!-- Botones de Semillas e Insumos  -->
              <q-btn v-if="props.row.nombre == 'Semilla'" color="green" @click="abrirGastosSemillas(props.row)">
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
              <q-btn color="primary" @click="traerGastos(props.row)">
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
import { useSemillaStore } from '../stores/semillas.js'
import { useProveedorStore } from "../stores/proveedor.js";

const useGasto = useGastoStore()
const useFinca = useFincaStore()
const useSemilla = useSemillaStore()
const useProveedor = useProveedorStore();

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
let alerta = ref(false)
let alerta2 = ref(false)
let modalGastoSemillas = ref(false)
let idSemilla = ref("")
let idProveedor = ref("")
let unidadSemilla = ref("")
let cantidadSemilla = ref("")
let precioSemilla = ref("")
let totalSemilla = ref("")
let nombreF = ref("")
let idDeSemillas = ref("")
let idSemillaM = ref("")

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

function abrir2() {
  alerta.value = true;
  modalGastoSemillas.value = false
}

function cerrar() {
  alert.value = false;
}

function cerrar2() {
  modalGastoSemillas.value = false
}

function cerrar3() {
  alerta.value = false;
  modalGastoSemillas.value = true
}

// Abrir modelo de la tabla Gastos Semillas

function abrirGastosSemillas(gastoSemi) {
  modalGastoSemillas.value = true;
  idDeSemillas.value = gastoSemi._id;
  semillas.value = gastoSemi.semillas
  nombreF = gastoSemi.numerofactura
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
    format: (val) => {
      if (!val) return '';
      const fechaIngreso = new Date(val);
      const fechaColombia = new Date(fechaIngreso.toLocaleString("en-US", { timeZone: "America/Bogota" }));
      return fechaColombia.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }) + ' ' + fechaColombia.toLocaleTimeString("es-CO", {
        hour: '2-digit',
        minute: '2-digit'
      });
    },
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
  } else if (numerofactura.value == "") {
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



// Traer datos de Gastos

function traerGastos(GastoRealizado) {
  alert.value = true;
  accion.value = 2;
  id.value = GastoRealizado._id;
  idFinca.value = {
    label: GastoRealizado.idFinca.nombre,
    value: GastoRealizado.idFinca._id,
  };
  nombre.value = GastoRealizado.nombre;
  numerofactura.value = GastoRealizado.numerofactura;
  descripcion.value = GastoRealizado.descripcion;
}

function validarEdicionGastos() {
  if (idFinca.value == "") {
    Notify.create("Se Debe agregar el nombre de la Finca");
  } else if (nombre.value == "" || nombre.value.trim().length === 0) {
    Notify.create("Se debe ingresar el tipo de Gasto realizado");
  } else if (numerofactura.value == "") {
    Notify.create("Se debe ingresar el numero de factura");
  } else if (descripcion.value == "" || descripcion.value.trim().length === 0) {
    Notify.create("Se debe ingresar el numero de factura");
  } else {
    cerrar()
    editarGastos()
    Notify.create({
      type: "positive",
      message: "Gasto editado exitosamente",
    });
  }
}


// Editar Gastos

async function editarGastos() {
  try {
    await useGasto.putGastos(id.value, {
      idFinca: idFinca.value.value,
      nombre: nombre.value,
      numerofactura: numerofactura.value,
      descripcion: descripcion.value,
    })
    listarGastos()
  } catch (error) {
    console.error("Error de actualizar Gastos", error);
    Notify.create("Ocurrio un error al editar datos de Gastos");
  }
}


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

// Listar Semillas
let Csemillas = [];
let datosSemullas = {};
const opcionesSemillas = ref(Csemillas)

function filtarFnSemillas(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    opcionesSemillas.value = Csemillas.filter((v) => v.label.toLowerCase().indexOf(needle) > -1);
  });
}

async function listarSemillas() {
  const data = await useSemilla.listarSemillaActiva()
  data.data.semillaActiva.forEach((item) => {
    datosSemullas = {
      label: `${item.especie}- ${item.registro_ICA}`,
      value: item._id,
    }
    Csemillas.push(datosSemullas)
  })
  console.log(Csemillas)
}

// Listar Proveedor

let proveedor = []
let datosProveedor = {};
const opcionesProveedor = ref(proveedor)

function filterFnProveedor(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    opcionesProveedor.value = proveedor.filter((v) => v.label.toLowerCase().indexOf(needle) > -1);
  });
}

async function listarProveedores() {
  const data = await useProveedor.listarProveedorActivos();
  data.data.proveedorActivo.forEach((item) => {
    datosProveedor = {
      label: `${item.nombre}- ${item.telefono}`,
      value: item._id,
    }
    proveedor.push(datosProveedor)
  })
  console.log(proveedor)
}


// Listar tabla de Gastos de Semillas



let columnas = ref([
  {
    name: 'idSemilla',
    required: true,
    label: 'Tipo de Semilla',
    align: 'center',
    field: (row) => row.idSemilla.especie,
    sortable: true
  },
  {
    name: 'idProveedor',
    required: true,
    label: 'Nombre de Proveedor',
    align: 'center',
    field: (row) => row.idProveedor.nombre,
    sortable: true
  },
  {
    name: 'unidadSemilla',
    required: true,
    label: 'Cantidad Gastado',
    align: 'center',
    field: 'unidadSemilla',
    sortable: true
  },
  {
    name: 'precioSemilla',
    required: true,
    label: 'Precio de la Semilla',
    align: 'center',
    field: 'precioSemilla',
    sortable: true
  },
  {
    name: 'cantidadSemilla',
    required: true,
    label: 'Cantidad de Semilla Gastado',
    align: 'center',
    field: 'cantidadSemilla',
    sortable: true
  },
  {
    name: 'totalSemilla',
    required: true,
    label: 'Total Semilla GGastado',
    align: 'center',
    field: 'totalSemilla',
    sortable: true
  },
  {
    name: 'opciones',
    required: true,
    label: 'Opciones',
    align: 'center',
    field: 'opciones',
    sortable: true
  }
])



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
  listarGastos()
  listarFincas()
  listarSemillas()
  listarProveedores()
});

</script>