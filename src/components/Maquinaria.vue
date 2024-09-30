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
            class="q-my-md q-mx-md" label="Cantidad comprada" type="tel" required pattern="[0-9]+" maxlength="10" />
          <q-input outlined v-model="precio" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Precio de Compra" type="tel" required pattern="[0-9]+" maxlength="10" />
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
            <div class="text-h6 text-white">Agregar Mantenimientos de {{ nombreF }}</div>
          </q-card-section>
          <q-input outlined v-model="responsable" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Agrega el responsable del Mantenimiento" type="text" />
          <q-input outlined v-model="observacionesMantenimiento" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Observaciones del Mantenimiento" type="text" />
          <q-input outlined v-model="precioMantenimiento" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Precio del Mantenimiento" type="tel" required pattern="[0-9]+"
            maxlength="10" />
          <q-card-actions align="right">
            <q-btn color="red" class="text-white" :loading="useMaquinaria.loading"
              @click="agregarMantenimientosMaquina()">
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
            <div class="text-h6 text-white">Editar Mantenimientos de {{ nombreF }}</div>
          </q-card-section>
          <q-input outlined v-model="responsable" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Agrega el responsable del Mantenimiento" type="text" />
          <q-input outlined v-model="observacionesMantenimiento" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Observaciones del Mantenimiento" type="text" />
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
              Mantenimientos de {{ nombreF }}
            </div>
          </q-card-section>
          <q-table v-if="mantenimiento.length > 0" table-header-class="text-black font-weight-bold"
            :rows="mantenimiento" :columns="columnas" row-key="name">
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <div style="display: flex; gap:15px; justify-content: center; ">
                  <!-- boton de editar -->
                  <q-btn color="primary" @click="traerMantenimiento(props.row)">
                    <q-tooltip>
                      Editar Mantenimientos
                    </q-tooltip>
                    <i class="fas fa-pencil-alt">
                    </i></q-btn>
                </div>
              </q-td>
            </template>
          </q-table>
          <h4 v-else>La Maquina {{ nombreF }}, aun no tiene registrado sus Mantenimientos </h4>
          <q-card-actions align="right">
            <q-btn @click="abrir2(props?.row)" color="green" class="text-white" :loading="useMaquinaria.loading">
              Agregar Mantenimientos
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

    <!-- Modelo para agregar Desinsfeccion de la Herrameinta -->
    <div>
      <q-dialog persistent v-model="alertaDesinfeccion">
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color: #009b44; margin-bottom: 20px">
            <div class="text-h6 text-white">Agregar Desinfeccion de {{ nombreDes }}</div>
          </q-card-section>
          <q-select outlined v-model="idEmpleado" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" :options="opcionesEmpleado" @filter="filterFnEmpleado"
            label="Selecciona el nombre del Empleado">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select outlined v-model="idInsumo" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" :options="opcionesInsumos" @filter="filterFnInsumos" label="Selecciona el insumo">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-card-actions align="right">
            <q-btn color="red" class="text-white" :loading="useMaquinaria.loading"
              @click="agregarDesinfeccionHerramienta()">
              Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn label="Cerrar" color="black" outline @click="cerrarFormularioDes()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <!-- Modelo para editar Desinsfeccion de la Herrameinta -->
    <div>
      <q-dialog persistent v-model="alertaDesinfeccion2">
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color: #009b44; margin-bottom: 20px">
            <div class="text-h6 text-white">Editar Desinfeccion de {{ nombreDes }}</div>
          </q-card-section>
          <q-select outlined v-model="idEmpleado" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" :options="opcionesEmpleado" @filter="filterFnEmpleado"
            label="Selecciona el nombre del Empleado">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select outlined v-model="idInsumo" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" :options="opcionesInsumos" @filter="filterFnInsumos" label="Selecciona el insumo">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-card-actions align="right">
            <q-btn color="red" class="text-white" :loading="useMaquinaria.loading"
              @click="editarDesinfeccionHerramientas()">
             Editar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn label="Cerrar" color="black" outline @click="cerrarModalEditarDesinfeccion()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <!-- Tabla de Desinfeccion -->
    <div>
      <q-dialog v-model="modalDesinfeccion" persistent full-width>
        <q-card class="">
          <q-card-section style="background-color:#009B44; margin-bottom: 20px">
            <div class="text-h6 text-white">
              Desinfeccion de {{ nombreDes }}
            </div>
          </q-card-section>
          <q-table v-if="desinfeccion.length > 0" table-header-class="text-black font-weight-bold" :rows="desinfeccion"
            :columns="columnasDesinfeccion" row-key="name">
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <div style="display: flex; gap:15px; justify-content: center; ">
                  <!-- boton de editar -->
                  <q-btn color="primary" @click="traerDesinfeccion(props.row)">
                    <q-tooltip>
                      Editar Desinfeccion
                    </q-tooltip>
                    <i class="fas fa-pencil-alt">
                    </i></q-btn>
                </div>
              </q-td>
            </template>
          </q-table>
          <h4 v-else>La Herramienta {{ nombreDes }}, aun no tiene registrado Desinfecciones </h4>
          <q-card-actions align="right">
            <q-btn @click="abrirModalDesinfeccion(props?.row)" color="green" class="text-white"
              :loading="useMaquinaria.loading">
              Agregar Desinfeccion
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn @click="cerrarModeloDes()" color="red" class="text-white" :loading="useMaquinaria.loading">
              Cerrar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

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
              <q-btn v-if="props.row.tipo == 'Maquina'" color="orange" @click="abrirMantenimientos(props.row)">
                <q-tooltip>
                  Ver registro de Mantenimiento de la Maquina
                </q-tooltip>
                <i class="fas fa-tools"></i>
              </q-btn>
              <q-btn v-else color="purple" @click="abrirDesinfeccion(props.row)">
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


// Variables para la tabla de Mantenimientos 

let mantenimiento = ref([])
let alerta = ref(false)
let alerta2 = ref(false)
let modalMantenimiento = ref(false)
let responsable = ref("")
let precioMantenimiento = ref("")
let observacionesMantenimiento = ref("")
let nombreF = ref("")
let idDeMantenimientos = ref("")
let idMantenimientos = ref("")

// Variables para la Tabla Desinfeccion

let desinfeccion = ref([])
let alertaDesinfeccion = ref(false)
let alertaDesinfeccion2 = ref(false)
let modalDesinfeccion = ref(false)
let nombreDes = ref("")
let idEmpleado = ref("")
let idInsumo = ref("")
let idDeDesinfeccion = ref("")
let idDesinfeccion = ref("")



function abrir() {
  accion.value = 1;
  alert.value = true;
}

function cerrar() {
  alert.value = false;
}

// Abrir el modal de Mantenimientos de Cada Maquina
function abrirMantenimientos(manten) {
  modalMantenimiento.value = true;
  idDeMantenimientos.value = manten._id;
  mantenimiento.value = manten.mantenimiento;
  nombreF.value = manten.nombre;
}


// El modelo de formulario de Registro de Mantenimiento

function abrir2() {
  alerta.value = true;
  modalMantenimiento.value = false;
}

// Cerrar el model de la tabla

function cerrar2() {
  modalMantenimiento.value = false;
}

// Cerrar el modelo de formulario

function cerrar3() {
  alerta.value = false;
  modalMantenimiento.value = true;
}


function cerrar4() {
  alerta2.value = false
  modalMantenimiento.value = true
}

// Traer los Mantenimientos de la tabla

function traerMantenimiento(data) {
  alerta2.value = true
  idMantenimientos.value = data._id
  responsable.value = data.responsable
  observacionesMantenimiento.value = data.observacionesMantenimiento
  precioMantenimiento.value = data.precioMantenimiento
  console.log(data)
}


// Listar Columnas de la Tabla de Mantenimientos
let columnas = ref([
  {
    name: 'responsable',
    required: true,
    label: 'Responsable del Mantenimiento',
    align: 'center',
    field: 'responsable',
    sortable: true
  },
  {
    name: 'observacionesMantenimiento',
    required: true,
    label: 'Observaciones del Mantenimiento',
    align: 'center',
    field: 'observacionesMantenimiento',
    sortable: true
  },
  {
    name: 'precioMantenimiento',
    required: true,
    label: 'Precio del Mantenimiento',
    align: 'center',
    field: 'precioMantenimiento',
    sortable: true,
    format: (valor) => {
      return valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    }
  },
  {
    name: 'fechaMantenimiento',
    required: true,
    label: 'Fecha del Mantenimiento',
    align: 'center',
    field: 'fechaMantenimiento',
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
    name: 'opciones',
    required: true,
    label: 'Opciones',
    align: 'center',
    field: 'opciones',
    sortable: true
  },
])

// Agregar Mantenimientos de la Maquina

async function agregarMantenimientosMaquina() {
  try {
    console.log(responsable.value)
    if (!responsable.value || responsable.value.trim().length === 0) {
      Notify.create("Se debe agregar el responsable del Mantenimiento")
    } else if (!observacionesMantenimiento.value || observacionesMantenimiento.value.trim().length === 0) {
      Notify.create("Se debe agregar las observaciones del Mantenimiento")
    } else if (!precioMantenimiento.value || precioMantenimiento.value.trim().length === 0) {
      Notify.create("Se debe agregar el precio del Mantenimiento")
    } else {
      let nuevoMantenimiento = {
        responsable: responsable.value,
        observacionesMantenimiento: observacionesMantenimiento.value,
        precioMantenimiento: precioMantenimiento.value,
        fechaMantenimiento: Date.now(),
      }
      mantenimiento.value.push(nuevoMantenimiento)
      alerta.value = false
      modalMantenimiento.value = true
      await useMaquinaria.putMaquinaria(idDeMantenimientos.value, {
        mantenimiento: mantenimiento.value
      })
      listarMaquinariaHerramienta()

    }
  } catch (error) {
    console.error("Error al agregar Mantenimientos de la Maquina", error)
    Notify.create("Ocurrio un error al agregar Mantenimientos de la Maquina")
  }
}


// Editar Mantenimientos de Maquinas
async function editarMantenimientos() {
  try {
    if (!responsable.value || responsable.value.trim().length === 0) {
      Notify.create("Se debe agregar el responsable del Mantenimiento")
    } else if (!observacionesMantenimiento.value || observacionesMantenimiento.value.trim().length === 0) {
      Notify.create("Se debe agregar las observaciones del Mantenimiento")
    } else if (precioMantenimiento.value == "") {
      Notify.create("Se debe agregar el precio del Mantenimiento")
    } else {
      for (let i = 0; i < mantenimiento.value.length; i++) {
        const info = mantenimiento.value[i];
        if (info._id === idMantenimientos.value) {
          info.responsable = responsable.value
          info.observacionesMantenimiento = observacionesMantenimiento.value
          info.precioMantenimiento = precioMantenimiento.value
          console.log(info)
          break
        }
      }
      console.log(mantenimiento.value)
      alerta2.value = false
      await useMaquinaria.putMaquinaria(idDeMantenimientos.value, {
        mantenimiento: mantenimiento.value
      })
      listarMaquinariaHerramienta()
    }

  } catch (error) {
    console.error('Error de Mantenimiento', error)
    Notify.create('Ocurrio un error al editar el Mantenimiento Maquina')
  }
}

// Funcion para Limpiar los Mantenimientos de las Maquinas

function limpiarMantenimientos() {
  responsable.value = ""
  observacionesMantenimiento.value = ""
  precioMantenimiento.value = ""
}


// Funciones de Desinfeccion

// Abrir el modal de Desinfeccion de cada Herramienta

function abrirDesinfeccion(desinfe) {
  modalDesinfeccion.value = true
  idDeDesinfeccion.value = desinfe._id
  desinfeccion.value = desinfe.desinfeccion
  nombreDes.value = desinfe.nombre
}

// Abrir formulario Desinfeccion

function abrirModalDesinfeccion() {
  alertaDesinfeccion.value = true;
  modalDesinfeccion.value = false;
}

function cerrarModeloDes() {
  modalDesinfeccion.value = false
}

function cerrarFormularioDes() {
  alertaDesinfeccion.value = false;
  modalDesinfeccion.value = true;
}




// Listar Empleados 

let empleados = []
let datosEmpleado = {}
const opcionesEmpleado = ref(empleados)

function filterFnEmpleado(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    opcionesEmpleado.value = empleados.filter((v) => v.label.toLowerCase().indexOf(needle) > -1);
  });
}

async function listarEmpleados() {
  const data = await useEmpleado.ListarEmpleadoActivo()
  data.data.empleadoActivo.forEach((item) => {
    datosEmpleado = {
      label: `${item.nombre} - ${item.descripcion}`,
      value: item._id
    }
    empleados.push(datosEmpleado)
  })
  console.log(empleados)
}


// Listar Insumos

let insumos = []
let datosInsumos = {}
const opcionesInsumos = ref(insumos)

function filterFnInsumos(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    opcionesInsumos.value = insumos.filter((v) => v.label.toLowerCase().indexOf(needle) > -1);
  });
}


async function listarInsumos() {
  const data = await useInsumo.listarInsumos()
  data.data.insumo.forEach((item) => {
    datosInsumos = {
      label: `${item.nombre} - ${item.relacionNPK}`,
      value: item._id
    }
    insumos.push(datosInsumos)
  })
  console.log(insumos)
}

// Listar columnas de Desinfeccion

let columnasDesinfeccion = ref([
  {
    name: "idEmpleado",
    required: true,
    label: "Nombre del Empleado",
    align: "center",
    field: (row) => row.idEmpleado.nombre,
    sortable: true,
  }, {
    name: "idInsumo",
    required: true,
    label: "Nombre del Producto",
    align: "center",
    field: (row) => row.idInsumo.nombre,
    sortable: true,
  },
  {
    name: 'fechaDesifeccion',
    required: true,
    label: 'Fecha de Desinfeccion',
    align: 'center',
    field: 'fechaDesifeccion',
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
    name: 'opciones',
    required: true,
    label: 'Opciones',
    align: 'center',
    field: 'opciones',
    sortable: true
  }
])

// Agregar Desinfeccion de las Herrameintas

async function agregarDesinfeccionHerramienta() {
  try {
    console.log(idEmpleado.value)
    if (idEmpleado.value == "") {
      Notify.create("Se debe agregar el responsable de la Desinfeccion")
    } else if (idInsumo.value == "") {
      Notify.create("Se debe agregar el insumo que utilizo para la Desinfeccion")
    } else {
      let nuevaDesinfeccion = {
        idEmpleado: idEmpleado.value.value,
        idInsumo: idInsumo.value.value,
        fechaDesifeccion: Date.now()
      }
      desinfeccion.value.push(nuevaDesinfeccion)
      alertaDesinfeccion.value = false
      await useMaquinaria.putMaquinaria(idDeDesinfeccion.value, {
        desinfeccion: desinfeccion.value
      })
      listarMaquinariaHerramienta()
    }

  } catch (error) {
    console.error("Error al agregar Desinfeccion de la herramienta", error)
    Notify.create("Ocurrio un error al agregar Desinfeccion de la herramienta")
  }
}

// Editar Desinfeccion de Herramientas

async function editarDesinfeccionHerramientas() {
  try {
    if (idEmpleado.value == "") {
      Notify.create("Se debe agregar el responsable de la Desinfeccion")
    } else if (idInsumo.value == "") {
      Notify.create("Se debe agregar el insumo que utilizo para la Desinfeccion")
    } else {
      for (let i = 0; i < desinfeccion.value.length; i++) {
        const infoDes = desinfeccion.value[i];
        if (infoDes._id === idDesinfeccion.value) {
          infoDes.idEmpleado = idEmpleado.value.value
          infoDes.idInsumo = idInsumo.value.value
          console.log(infoDes)
          break
        }
      }
      console.log(desinfeccion.value)
      alertaDesinfeccion2.value = false
      modalDesinfeccion.value = false
      await useMaquinaria.putMaquinaria(idDeDesinfeccion.value, {
        desinfeccion: desinfeccion.value
      })
      listarMaquinariaHerramienta()
    }
  } catch (error) {
    console.error("Error al editar la Desinfeccion de la Herramienta", error)
    Notify.create("Ocurrio un error al editar la Desinfeccion de la Herramienta")
  }
}

function cerrarModalEditarDesinfeccion(){
  alertaDesinfeccion2.value = false;
  modalDesinfeccion.value = true;
}

// Traer elementos de Desinfeccion

function traerDesinfeccion(data){
  alertaDesinfeccion2.value = true
  idDesinfeccion.value = data._id
  idEmpleado.value = {
    label: data.idEmpleado.nombre,
    value: data.idEmpleado._id
  }
  idInsumo.value = {
    label: data.idInsumo.nombre,
    value: data.idInsumo._id
  }
  console.log(data)
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
  listarInsumos()
  listarEmpleados()
});

</script>
