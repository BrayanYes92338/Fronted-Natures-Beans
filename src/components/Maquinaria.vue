<template>
  <div>
    <div style="margin-left: 5%; text-align: end; margin-right: 5%">
      <q-btn style="background-color: #00c04f; color: white" class="q-my-md q-ml-md" @click="abrir()">Registrar
        Maquinaria</q-btn>
    </div>
    <!-- Modal de agregar y editar los objetos -->
    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color: #009b44; margin-bottom: 20px">
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Maquinaria o Herramienta" : "Editar Maquinaria o Herramienta" }}
            </div>
          </q-card-section>
          <q-select outlined v-model="idProveedor" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" :options="opciones" @filter="filterFn" label="Selecciona el nombre del Proveedor">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input outlined v-model="nombre" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Nombre del Producto" type="text" />
          <q-select outlined v-model="tipo" :options="['Maquina', 'Herramienta']" label="Seleccione el Objeto"
            class="q-my-md q-mx-md" />
          <q-input outlined v-model="observaciones" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Agrega las observaciones" type="text" />
          <q-input outlined v-model="cantidad" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Cantidad Comprada" type="tel" required pattern="[0-9]+" maxlength="10" />
          <q-input outlined v-model="precio" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Precio" type="tel" required pattern="[0-9]+" maxlength="10" />
          <q-card-actions align="right">
            <q-btn v-if="accion === 1" @click="validarIngresoMaquinaHerramientas()" color="red" class="text-white"
              :loading="useMaquinaria.loading">Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn v-if="accion !== 1" @click="validarEdicionMaquinaHerramienta()" color="red" class="text-white"
              :loading="useMaquinaria.loading">
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
    <!-- Modelo Para agregar el registro de Mantenimiento Maquinas -->
    <div>
      <q-dialog persistent v-model="alerta">
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color: #009b44; margin-bottom: 20px">
            <div class="text-h6 text-white">Registro de Mantenimiento de {{ nombreF }}</div>
          </q-card-section>
          <q-input outlined v-model="responsable" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Agrega el Responsable del Mantenimiento" type="text" />
          <q-input outlined v-model="observacionesMantenimiento" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Agrega las Observaciones del Mantenimiento" type="text" />
          <q-input outlined v-model="precioMantenimiento" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Precio del Mantenimiento" type="tel" required pattern="[0-9]+"
            maxlength="10" />
          <q-card-actions align="right">
            <q-btn color="red" class="text-white" :loading="useMaquinaria.loading" @click="agregarMantenimientos()">
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

    <!-- Modelo Para editar el registro de Mantenimiento Maquinas -->
    <div>
      <q-dialog persistent v-model="alerta2">
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color: #009b44; margin-bottom: 20px">
            <div class="text-h6 text-white">Editar Mantenimiento de {{ nombreF }}</div>
          </q-card-section>
          <q-input outlined v-model="responsable" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Agrega el Responsable del Mantenimiento" type="text" />
          <q-input outlined v-model="observacionesMantenimiento" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Agrega las Observaciones del Mantenimiento" type="text" />
          <q-input outlined v-model="precioMantenimiento" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Precio del Mantenimiento" type="tel" required pattern="[0-9]+"
            maxlength="10" />
          <q-card-actions align="right">
            <q-btn color="red" class="text-white" :loading="useMaquinaria.loading" @click="editarMantenimientos()">
              Editar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn label="Cerrar" color="black" outline @click="cerrar4()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <!-- Tabla Mantenimiento -->
    <div>
      <q-dialog v-model="modalMantenimiento" persistent full-width>
        <q-card class="">
          <q-card-section style="background-color:#009B44; margin-bottom: 20px">
            <div class="text-h6 text-white">
              Historial de Mantenimientos de {{ nombreF }}
            </div>
          </q-card-section>
          <q-table v-if="mantenimiento.length > 0" table-header-class="text-black font-weight-bold"
            :rows="mantenimiento" :columns="columnas" row-key="name">

            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <div style="display: flex; gap:15px; justify-content: center; ">
                  <!-- boton de editar -->
                  <q-btn color="primary" @click="traerDatosMantenimientos(props.row)">
                    <q-tooltip>
                      Editar Mantenimientos
                    </q-tooltip>
                    <i class="fas fa-pencil-alt">
                    </i></q-btn>
                </div>
              </q-td>
            </template>
          </q-table>
          <h4 v-else>La Maquina {{ nombreF }}, aun no tiene registrado los mantenimientos</h4>
          <q-card-actions align="right">
            <q-btn @click="abrir2(props?.row)" color="green" class="text-white" :loading="useMaquinaria.loading">
              Agregar Mantenimiento
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn @click="cerrar2()" color="red" class="text-white" :loading="useMaquinaria.loading">
              Cerrar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <!-- Modelo para Desinsfeccion de la Herrameinta -->

    <!-- Tabla de Desinfeccion -->

    <!-- Tabla de Maquinaria y Herramientas -->

    <div style="display: flex; justify-content: center">
      <q-table title="Maquinaria & Herramientas" title-class="text-green text-weight-bolder text-h4"
        table-header-class="text-black font-weight-bold" :rows="rows" :columns="columns" row-key="name"
        style="width: 90%; margin-bottom: 5%">
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
              <!-- Botones de Mantenimiento o Desinfección -->
              <q-btn @click="abrirMantenimientos(props.row)" v-if="props.row.tipo == 'Maquina'" color="orange">
                <q-tooltip>
                  Ver registro de Mantenimiento de la Maquina
                </q-tooltip>
                <i class="fas fa-tools"></i>
              </q-btn>
              <q-btn v-else color="purple">
                <q-tooltip>
                  Ver Registro de desinfección de la Herramienta
                </q-tooltip>
                <i class="fas fa-spray-can"></i>
              </q-btn>
              <q-btn color="primary" @click="traerHerramientasMaquinaria(props.row)">
                <q-tooltip> Editar </q-tooltip>
                <i class="fas fa-pencil-alt"> </i>
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
import { useMaquinariaStore } from "../stores/maquinaria.js";
import { useProcesoStore } from "../stores/proceso.js";
import { useProveedorStore } from "../stores/proveedor.js";
import { useEmpleadoStore } from "../stores/empleado.js"
import { UseInsumoStore } from "../stores/insumo.js"



const useMaquinaria = useMaquinariaStore();
const useProveedor = useProveedorStore();
const useEmpleado = useEmpleadoStore()
const useInsumo = UseInsumoStore()


const showTooltip = ref(false);
let rows = ref([]);
let alert = ref(false);
let id = ref("");
let accion = ref(1);
let idProveedor = ref("");
let nombre = ref('');
let tipo = ref('');
let observaciones = ref('');
let cantidad = ref('');
let precio = ref("");
let mantenimiento = ref([])
let responsable = ref("")
let observacionesMantenimiento = ref("")
let precioMantenimiento = ref("")
let desinfeccion = ref("")
let fechaDesinfeccion = ref("")
let idEmpleado = ref("")
let idInsumo = ref("")
let alerta = ref(false)
let alerta2 = ref(false)
let modalMantenimiento = ref(false)
let nombreF = ref("")
let idDeMantenimientos = ref("")
let idMantenimientos = ref("")




function abrir() {
  accion.value = 1;
  alert.value = true;
}

function abrir2() {
  modalMantenimiento.value = true;
  alerta.value = true;

}

function cerrar() {
  alert.value = false;
}

function cerrar2() {
  modalMantenimiento.value = false;
}

function cerrar3() {
  alerta.value = false;
  modalMantenimiento.value = true;
}

function cerrar4() {
  alerta2.value = false;
  modalMantenimiento.value = true;
}


function abrirMantenimientos(manten) {
  modalMantenimiento.value = true;
  idDeMantenimientos.value = manten._id
  mantenimiento.value = manten.mantenimiento
  nombreF.value = manten.nombre

}


// Columns de Mantenimientos

const columnas = ref([
  {
    name: "responsable",
    required: true,
    label: "Responsable del Mantenimiento",
    align: "center",
    field: "responsable",
    sortable: true,
  },
  {
    name: "observacionesMantenimiento",
    required: true,
    label: "Observaciones del Mantenimiento",
    align: "center",
    field: "observacionesMantenimiento",
    sortable: true,
  },
  {
    name: "fechaMantenimiento",
    required: true,
    label: "Fecha de Mantenimiento de la Maquina",
    align: "center",
    field: "fechaMantenimiento",
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
    name: "precioMantenimiento",
    required: true,
    label: "Precio del Mantenimiento ",
    align: "center",
    field: "precioMantenimiento",
    sortable: true,
    format: (valor) => {
      return valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    }
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

// Listar Mantenimientos de Cada Maquina

function traerDatosMantenimientos(data) {
  alerta2.value = true;
  responsable.value = data.responsable
  observacionesMantenimiento.value = data.observacionesMantenimiento
  precioMantenimiento.value = data.precioMantenimiento
  idMantenimientos.value = data._id
  console.log(data)
}

// Agregar Mantenimientos de la Maquina


// Listar Insumos

async function agregarMantenimientos() {
  try {
    if (responsable.value == "" || responsable.value.trim().length === 0) {
      Notify.create("Se debe agregar el responsable del mantenimiento");
    } else if (observacionesMantenimiento.value == "" || observacionesMantenimiento.value.trim().length === 0) {
      Notify.create("Se debe agregar observaciones del Mantenimiento");
    } else if (precioMantenimiento.value == "") {
      Notify.create("Se debe agregar observaciones del Mantenimiento");
    } else {
      let nuevosMantenimientos = {
        responsable: responsable.value,
        observacionesMantenimiento: observacionesMantenimiento.value,
        precioMantenimiento: precioMantenimiento.value,
      }
      mantenimiento.value.push(nuevosMantenimientos)
      await useMaquinaria.putMaquinaria(idDeMantenimientos.value, {
        mantenimiento: mantenimiento.value
      })
      listarMaquinariaHerramienta()
      cerrar3()

    }

  } catch (error) {
    console.error('Error de Mantenimiento', error)
    Notify.create('Ocurrio un error al ingresar datos del Mantenimiento de la Maquina')
  }
}

// Editar Mantenimientos de Maquinas

async function editarMantenimientos() {
  try {
    if (responsable.value == "" || responsable.value.trim().length === 0) {
      Notify.create("Se debe agregar el responsable del mantenimiento");
    } else if (observacionesMantenimiento.value == "" || observacionesMantenimiento.value.trim().length === 0) {
      Notify.create("Se debe agregar observaciones del Mantenimiento");
    } else if (precioMantenimiento.value == "") {
      Notify.create("Se debe agregar observaciones del Mantenimiento");
    } else {
      for (let i = 0; i < mantenimiento.value.length; i++) {
        const info = mantenimiento.value[i]
        if (info._id === idMantenimientos.value) {
          info.responsable = responsable.value
          info.observacionesMantenimiento = observacionesMantenimiento.value
          info.precioMantenimiento = precioMantenimiento.value
          break
        }
      }
      alerta2.value = false
      await useMaquinaria.putMaquinaria(idDeMantenimientos.value, {
        mantenimiento: mantenimiento.value
      })
      listarMaquinariaHerramienta()
    }

  } catch (error) {
    console.error('Error de Mantenimiento', error)
    Notify.create('Ocurrio un error al editar los datos del Mantenimientos')
  }
}




const columns = ref([
  {
    name: "idProveedor",
    required: true,
    label: "Nombre del Proveedor",
    align: "center",
    field: (row) => row.idProveedor.nombre,
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
    name: "tipo",
    required: true,
    label: "Tipo",
    align: "center",
    field: "tipo",
    sortable: true,
  },
  {
    name: "observaciones",
    required: true,
    label: "Observaciones",
    align: "center",
    field: "observaciones",
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
    name: "precio",
    required: true,
    label: "Precio Compra",
    align: "center",
    field: "precio",
    sortable: true,
    format: (valor) => {

      return valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    }
  },
  {
    name: "total",
    required: true,
    label: "  Total",
    align: "center",
    field: "total",
    sortable: true,
    format: (valor) => {
      return valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    }
  },
  {
    name: "fechaCompra",
    required: true,
    label: "Fecha de Registro",
    align: "center",
    field: "fechaCompra",
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
]);

// listar proveedor

let proveedor = [];
let datos = {}
const opciones = ref(proveedor)

function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    opciones.value = proveedor.filter((v) => v.label.toLowerCase().indexOf(needle) > -1);
  });
}

async function listarProveedores() {
  const data = await useProveedor.listarProveedorActivos();
  data.data.proveedorActivo.forEach((item) => {
    datos = {
      label: `${item.nombre}- ${item.telefono}`,
      value: item._id,
    }
    proveedor.push(datos)
  })
  console.log(proveedor)
}

// Listar Empleados 

let empleados = []
let datosEmpleados = {}
const opcionesEmpleado = ref(empleados)

async function listarEmpleados() {
  const data = await useEmpleado.ListarEmpleadoActivo();
  data.empleadoActivo.forEach((item) => {
    datosEmpleados = {
      label: `${item.nombre}- ${item.descripcion}`,
      value: item._id,
    }
  })
  console.log(datosEmpleados)
}


// Listar Insumos

let insumos =[]
let datosInsumos = {}
const opcionesInsumos = ref(insumos)

async function listarInsumos(){
  const data=  await useInsumo.listarInsumos()
  data.data.insumo.forEach((item)=>{
    datosInsumos ={
      label: `${item.nombre}- ${item.relacionNPK}`,
      value: item._id,
    }
  })
  console.log(datosInsumos)
}


// Listar Maquinarias y Herrameintas

async function listarMaquinariaHerramienta() {
  const r = await useMaquinaria.listarMaquinaria()
  rows.value = r.data.maquinas.reverse()
  console.log(r.data.maquinas)
}

async function agregarMaquinaHerramienta() {
  const r = await useMaquinaria.postMaquinaria({
    idProveedor: idProveedor.value.value,
    nombre: nombre.value,
    tipo: tipo.value,
    observaciones: observaciones.value,
    cantidad: cantidad.value,
    precio: precio.value,
  })
  cerrar()
  listarMaquinariaHerramienta()
  console.log(r)

}

function validarIngresoMaquinaHerramientas() {
  let validacionnumeros = /^[0-9]+$/;
  if (idProveedor.value == "") {
    Notify.create("Se debe agregar el nombre del Proveedor");
  } else if (nombre.value == "" || nombre.value.trim().length === 0) {
    Notify.create("Se debe agregar el nombre del Producto");
  } else if (tipo.value == "") {
    Notify.create("Se debe seleccionar el tipo de objeto");
  } else if (observaciones.value == "" || observaciones.value.trim().length === 0) {
    Notify.create("Se debe agregar las observaciones");
  } else if (cantidad.value == "") {
    Notify.create("Se debe agregar la cantidad comprada");
  } else if (!validacionnumeros.test(cantidad.value)) {
    Notify.create("La cantidad debe ser un número");
  } else if (precio.value == "") {
    Notify.create("Se debe agregar el precio de compra");
  } else if (!validacionnumeros.test(precio.value)) {
    Notify.create("El precio debe ser un número");
  } else {
    cerrar();
    agregarMaquinaHerramienta();
    Notify.create({
      type: "positive",
      message: "Maquina/Herramienta agregada exitosamente",
    });
  }

}

function traerHerramientasMaquinaria(MaquiHerra) {
  alert.value = true;
  accion.value = 2;
  id.value = MaquiHerra._id;
  idProveedor.value = {
    label: MaquiHerra.idProveedor.nombre,
    value: MaquiHerra.idProveedor._id,
  };
  nombre.value = MaquiHerra.nombre;
  tipo.value = MaquiHerra.tipo;
  observaciones.value = MaquiHerra.observaciones;
  cantidad.value = MaquiHerra.cantidad;
  precio.value = MaquiHerra.precio;

}

function validarEdicionMaquinaHerramienta() {
  let validacionnumeros = /^[0-9]+$/;
  if (idProveedor.value == "") {
    Notify.create("Se debe agregar el nombre del Proveedor");
  } else if (nombre.value == "" || nombre.value.trim().length === 0) {
    Notify.create("Se debe agregar el nombre del Producto");
  } else if (tipo.value == "") {
    Notify.create("Se debe seleccionar el tipo de objeto");
  } else if (observaciones.value == "" || observaciones.value.trim().length === 0) {
    Notify.create("Se debe agregar las observaciones");
  } else if (cantidad.value == "") {
    Notify.create("Se debe agregar la cantidad comprada");
  } else if (!validacionnumeros.test(cantidad.value)) {
    Notify.create("La cantidad debe ser un número");
  } else if (precio.value == "") {
    Notify.create("Se debe agregar el precio de compra");
  } else if (!validacionnumeros.test(precio.value)) {
    Notify.create("El precio debe ser un número");
  } else {
    cerrar();
    editarMaquinaHerramienta();
    Notify.create({
      type: "positive",
      message: "Maquina/Herramienta editada exitosamente",
    });
  }
}

async function editarMaquinaHerramienta() {
  try {
    await useMaquinaria.putMaquinaria(id.value, {
      idProveedor: idProveedor.value.value,
      nombre: nombre.value,
      tipo: tipo.value,
      observaciones: observaciones.value,
      cantidad: cantidad.value,
      precio: precio.value,
    })
    listarMaquinariaHerramienta()
  } catch (error) {
    console.error("Error de actualizar Maquina/Riego", error);
    Notify.create("Ocurrio un error al editar datos de la Maquina/Herramienta");
  }
}



// Función para alternar la visibilidad del dropdown
const toggleDropdown = (row) => {
  row.showDropdown = !row.showDropdown;
};

const toggleObservacionesMantenimiento = (row) => {
  row.showDropdown = !row.showDropdown;
};


// Inicialización de los datos de la tabla
rows.value = rows.value.map(row => ({
  ...row,
  showDropdown: false,
}));

function Limpiar() {
  idProveedor.value = "";
  nombre.value = "";
  tipo.value = "";
  observaciones.value = "";
  cantidad.value = "";
  precio.value = "";
}

onMounted(() => {
  listarMaquinariaHerramienta()
  listarProveedores()
  listarEmpleados()
  listarInsumos()
});

</script>
