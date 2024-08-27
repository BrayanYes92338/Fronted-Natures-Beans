<template>
  <div>
    <div style=" display: flex;justify-content: flex-end; margin-left: 5%; margin-right: 5%;">
      <q-btn style="background-color: #00c04f; color: white" class="q-my-md q-ml-md" @click="abrir()">Registrar
        Insumos</q-btn>
    </div>

    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color: #009b44; margin-bottom: 20px">
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Insumo" : "Editar Insumo " }}
            </div>
          </q-card-section>
          <q-select outlined v-model="IdProveedor" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" :options="opciones" @filter="filterFn" label="Selecciona el Proveedor del Insumo">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> Sin resultados </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select outlined v-model="idReponsable" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" :options="options" @filter="filtrarEmpleado"
            label="Selecciona el Empleado que ha uso el insumo">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> Sin resultados </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input outlined v-model="nombre" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Nombre del Insumo" type="text" />
            <q-input outlined v-model="relacionNPK" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Ingrese la relacion NPK" type="tel" required pattern="[0-9]+" />
          <q-input outlined v-model="cantidad" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Ingrese la cantidad de NPK utilizada" type="tel" required pattern="[0-9]+"
            maxlength="10" />
          <q-select outlined v-model="unidad"
            :options="['Gramos (g)', 'Kilogramos (kg)', 'Litros (L)', 'Mililitros (ml)', 'Onzas (oz)']"
            label="Seleccione la unidad de medida" class="q-my-md q-mx-md" />
          <q-input outlined v-model="observaciones" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Observaciones" type="text" />
          <q-input outlined v-model="total" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Ingrese el total gastado" type="tel" required pattern="[0-9]+" />

          <q-card-actions align="right">
            <q-btn v-if="accion === 1" color="red" class="text-white" :loading="useInsumo.loading" @click="validarInsumos()">Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn v-if="accion !== 1" @click="validarEdicionInsumo()" color="red" class="text-white" :loading="useInsumo.loading">
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
      <q-table title="Insumos" title-class="text-green text-weight-bolder text-h4"
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
              <q-btn color="primary" @click="traerInsumos(props.row)">
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
import { ref, onMounted, computed } from "vue";
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
    label: "Nombre Proveedor",
    align: "center",
    field: (row) => row.IdProveedor.nombre,
    sortable: true,
  },
  {
    name: "idReponsable",
    required: true,
    label: "Nombre Responsable",
    align: "center",
    field: (row) => row.idReponsable.nombre,
    sortable: true,
  },
  {
    name: "nombre",
    required: true,
    label: "Nombre Insumo",
    align: "center",
    field: "nombre",
    sortable: true,
  },
  {
    name: "relacionNPK",
    required: true,
    label: "relacion NPK",
    align: "center",
    field: "relacionNPK",
    sortable: true,
  },
  {
    name: "cantidad",
    required: true,
    label: "Cantidad de Insumo",
    align: "center",
    field: "cantidad",
    sortable: true,
  },
  {
    name: "unidad",
    required: true,
    label: "Unidad de Medida",
    align: "center",
    field: "unidad",
    sortable: true,
  },
  {
    name: "observaciones",
    required: true,
    label: "Observaciones del Insumo",
    align: "center",
    field: "observaciones",
    sortable: true,
  },
  {
    name: "total",
    required: true,
    label: "Total Insumo Gastado",
    align: "center",
    field: "total",
    sortable: true,
  },
  {
    name: "fecha",
    required: true,
    label: "Fecha de Registro",
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
  },
]);



// Listar Proveedores Activos

let proveedores = [];
let datos = {};
const opciones = ref(proveedores);

function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    opciones.value = proveedores.filter((v) => v.label.toLowerCase().indexOf(needle) > -1);
  });
}


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
      label: `${item?.nombre} - ${item.descripcion} `,
      value: item._id,
    };
    empleados.push(dates);
  });
  console.log(empleados);
}


function filtrarEmpleado(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = empleados.filter((v) => v.label.toLowerCase().indexOf(needle) > -1);
  });
}

// Listar Insumos

async function listarInsumos() {
  const r = await useInsumo.listarInsumos();
  rows.value = r.data.insumo.reverse();
  console.log(r.data.insumo);
}


function validarInsumos() {
  
  let validacionNumeros = /^[0-9]+$/;
  let validacionNPK = /^\d+\s\d+\s\d+$/;

  if (IdProveedor.value === "") {
    Notify.create("Se debe seleccionar el proveedor del insumo");
  } else if (idReponsable.value === "") {
    Notify.create("Se debe seleccionar el empleado que usó el insumo");
  } else if (nombre.value === "" || nombre.value.trim().length === 0) {
    Notify.create("Se debe ingresar el nombre del insumo");
  } else if (relacionNPK.value === "") {
    Notify.create("Se debe ingresar la relación NPK del insumo");
  } else if (cantidad.value === "") {
    Notify.create("Se debe ingresar la cantidad de insumo");
  } else if (!validacionNumeros.test(cantidad.value)) {
    Notify.create("La cantidad de insumo debe ser un número entero");
  } else if (unidad.value === "" || unidad.value.trim().length === 0) {
    Notify.create("Se debe seleccionar la unidad de medida del insumo");
  } else if (observaciones.value === "" || observaciones.value.trim().length === 0) {
    Notify.create("Se debe ingresar las observaciones del insumo");
  } else if (total.value === "") {
    Notify.create("Se debe ingresar el total gastado del insumo");
  } else if (!validacionNumeros.test(total.value)) {
    Notify.create("El total gastado del insumo debe ser un número entero");
  } else {
    agregarInsumos();
    limpiar();
    cerrar();
    Notify.create({
      type: "positive",
      message: "Insumo agregado exitosamente",
    });
  }
}

async function agregarInsumos() {
  const r = await useInsumo.postInsumos({
    IdProveedor: IdProveedor.value.value,
    idReponsable: idReponsable.value.value,
    nombre: nombre.value,
    cantidad: cantidad.value,
    relacionNPK: relacionNPK.value,
    unidad: unidad.value,
    observaciones: observaciones.value,
    total: total.value,

  })
  cerrar()
  listarInsumos()
  console.log(r)
}

function traerInsumos(insumo){
  alert.value = true;
  accion.value = 2;
  id.value = insumo._id;
  IdProveedor.value = {
    label: insumo.IdProveedor.nombre,
    value: insumo.IdProveedor._id
  }
  idReponsable.value = {
    label: insumo.idReponsable.nombre,
    value: insumo.idReponsable._id

  }
  nombre.value = insumo.nombre;
  relacionNPK.value = insumo.relacionNPK;
  cantidad.value = insumo.cantidad;
  unidad.value = insumo.unidad;
  observaciones.value = insumo.observaciones;
  total.value = insumo.total;

}

function validarEdicionInsumo(){
  let validacionNumeros = /^[0-9]+$/;
  let validacionNPK = /^\d+\s\d+\s\d+$/;

  if (IdProveedor.value === "") {
    Notify.create("Se debe seleccionar el proveedor del insumo");
  } else if (idReponsable.value === "") {
    Notify.create("Se debe seleccionar el empleado que usó el insumo");
  } else if (nombre.value === "" || nombre.value.trim().length === 0) {
    Notify.create("Se debe ingresar el nombre del insumo");
  } else if (relacionNPK.value === "") {
    Notify.create("Se debe ingresar la relación NPK del insumo");
  }  else if (cantidad.value === "") {
    Notify.create("Se debe ingresar la cantidad de insumo");
  } else if (!validacionNumeros.test(cantidad.value)) {
    Notify.create("La cantidad de insumo debe ser un número entero");
  } else if (unidad.value === "" || unidad.value.trim().length === 0) {
    Notify.create("Se debe seleccionar la unidad de medida del insumo");
  } else if (observaciones.value === "" || observaciones.value.trim().length === 0) {
    Notify.create("Se debe ingresar las observaciones del insumo");
  } else if (total.value === "") {
    Notify.create("Se debe ingresar el total gastado del insumo");
  } else if (!validacionNumeros.test(total.value)) {
    Notify.create("El total gastado del insumo debe ser un número entero");
  } else {
    editarInsumo();
    limpiar();
    cerrar();
    Notify.create({
      type: "positive",
      message: "Insumo editado exitosamente",
    });
  }
   
}


async function editarInsumo(){
  try{

    await useInsumo.putInsumos(id.value,{
      IdProveedor: IdProveedor.value.value,
      idReponsable: idReponsable.value.value,
      nombre: nombre.value,
      cantidad: cantidad.value,
      relacionNPK: relacionNPK.value,
      unidad: unidad.value,
      observaciones: observaciones.value,
      total: total.value,
    })
listarInsumos()
  }catch (error){
    console.error("Error de actualizar Insumo", error);
    Notify.create("Ocurrio un error al editar datos del Insumo");
  }
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