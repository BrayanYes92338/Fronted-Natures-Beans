<template>
  <div>
    <div style="margin-left: 5%; text-align: end; margin-right: 5%">
      <q-btn
        style="background-color: #00c04f; color: white"
        class="q-my-md q-ml-md"
        @click="abrir()"
        >Registrar Maquinaria</q-btn
      >
    </div>
    <div>
    <q-dialog v-model="alert" persistent>
  <q-card style="width: 700px">
    <q-card-section style="background-color: #009b44; margin-bottom: 20px">
      <div class="text-h6 text-white">
        {{ accion == 1 ? "Agregar Maquinaria" : "Editar Maquinaria" }}
      </div>
    </q-card-section>

    <!-- Select for idProveedor -->
    <q-select
      outlined
      v-model="idProveedor"
      use-input
      hide-selected
      fill-input
      input-debounce="0"
      class="q-my-md q-mx-md"
      :options="opciones"
      @filter="filtrarProveedor"
      label="Seleccionar el Proveedor"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">Sin resultados</q-item-section>
        </q-item>
      </template>
    </q-select>

    <!-- Input for Nombre -->
    <q-input
      outlined
      v-model="nombre"
      class="q-my-md q-mx-md"
      label="Nombre"
      type="text"
      required
    />

    <q-input
      outlined
      v-model="tipo"
      class="q-my-md q-mx-md"
      label="Tipo"
      type="text"
      required
    />

    <!-- Input for Observaciones -->
    <q-input
      outlined
      v-model="observaciones"
      class="q-my-md q-mx-md"
      label="Observaciones"
      type="text"
      required
    />

    <!-- Input for Cantidad -->
    <q-input
      outlined
      v-model="cantidad"
      class="q-my-md q-mx-md"
      label="Cantidad"
      type="text"
      required
    />

    <!-- Input for Precio -->
    <q-input
      outlined
      v-model="precio"
      class="q-my-md q-mx-md"
      label="Precio"
      type="number"
      required
    />

    <!-- Input for Total (calculated, so possibly readonly) -->
    <q-input
      outlined
      v-model="total"
      class="q-my-md q-mx-md"
      label="Total"
      type="number"
    />

    <q-card-actions align="right">
      <q-btn
        v-if="accion === 1"
        @click="validarIngresoMaquinaria()"
        color="red"
        class="text-white"
        :loading="useMaquinaria.loading"
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
        :loading="useProceso.loading"
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
        title="Maquinaria"
        title-class="text-green text-weight-bolder text-h4"
        table-header-class="text-black font-weight-bold"
        :rows="rows"
        :columns="columns"
        row-key="name"
        style="width: 90%; margin-bottom: 5%"
      >
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <div style="display: flex; gap: 15px; justify-content: center">
              <q-btn color="primary" @click="traerRiego(props.row)">
                <q-tooltip> Editar </q-tooltip>
                <i class="fas fa-pencil-alt"> </i
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
import axios from "axios";
import { useMaquinariaStore } from "../stores/maquinaria.js";
import { useProcesoStore } from "../stores/proceso.js";
import { useProveedorStore } from "../stores/proveedor.js";

const useMaquinaria = useMaquinariaStore();
const useProceso = useProcesoStore();
const useProveedor= useProveedorStore();

let rows = ref([]);
let alert = ref(false);
let id = ref("");
let accion = ref(1);
    const idProveedor = ref(null);
    const nombre = ref('');
    const tipo = ref('');
    const observaciones = ref('');
    const cantidad = ref('');
    const precio = ref(0);
    const total = ref(0);

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
    name: "idProveedor",
    required: true,
    label: "Nombre del Cultivo",
    align: "center",
   field: (row) => row.idProveedor.nombre,

    sortable: true,
  },
  {
    name: "nombre",
    required: true,
    label: "Nombre",
    align: "center",
    field:"nombre",
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
    label: " observaciones",
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
    label: "precio",
    align: "center",
    field: "precio",
    sortable: true,
    
  },
   {
    name: "total",
    required: true,
    label: "total",
    align: "center",
    field: "total",
    sortable: true,
    
  },
   {
    name: "fechaCompra",
    required: true,
    label: "fechaCompra",
    align: "center",
    field: "fechaCompra",
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

//  listar cultivos

let proceso = [];
let datos = {};
const options = ref(proceso);

function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = cultivos.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
}

async function listarCultivos() {
  const data = await useProceso.listarProcesos();
  data.data.procesos.forEach((item) => {
    datos = {
      label: `${item.descripcion}`,
      value: item._id,
    };
    proceso.push(datos);
  });
  console.log(data);
}

let proveedor = [];
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

async function listarMaquinarias() {
  const r = await useMaquinaria.listarMaquinaria();
  rows.value = r.data.maquinas;
  console.log(r);
}

function validarIngresoMaquinaria() {
  let validacionnumeros = /^[0-9]+$/;
  let validacionPrecio = /^[0-9]+(\.[0-9]+)?$/; // To allow decimal values for price

  if (!idProveedor.value) {
    Notify.create("Se debe seleccionar el Proveedor");
  } else if (nombre.value.trim().length === 0) {
    Notify.create("Se debe agregar el Nombre");
  } else if (tipo.value.trim().length === 0) {
    Notify.create("Se debe agregar el Tipo");
  } else if (observaciones.value.trim().length === 0) {
    Notify.create("Se debe agregar Observaciones");
  } else if (!validacionnumeros.test(cantidad.value)) {
    Notify.create("La cantidad solo debe llevar números");
  } else if (!validacionPrecio.test(precio.value)) {
    Notify.create("El precio debe ser un número válido");
  } else if (!validacionnumeros.test(total.value)) {
    Notify.create("El total debe ser un número válido");
  } else {
    agregarMaquinaria(); 
    Limpiar();
    cerrar();
    Notify.create({
      type: "positive",
      message: "Maquinaria agregada exitosamente",
    });
  }
}


async function agregarMaquinaria() {
  const r = await useMaquinaria.postMaquinaria({
    idProveedor: idProveedor.value.value,
    nombre: nombre.value,
    tipo: tipo.value,
    observaciones: observaciones.value,
    cantidad: cantidad.value,
    precio: precio.value,
    total: total.value,
  });

  cerrar();
  Limpiar();
  listarMaquinarias();
  console.log(r);
}

function traerRiego(riego) {
console.log(riego);

  alert.value = true;
  accion.value = 2;
  id.value = riego._id;
    idProveedor.value = {
    label: riego.idProveedor.nombre,
    value: riego.idProveedor._id,
  };
 
  nombre.value = riego.nombre;
    precio.value = riego.precio;

  tipo.value = riego.tipo;
  total.value = riego.total;
  observaciones.value = riego.observaciones;
  cantidad.value = riego.cantidad;


}

function validarEdicionMaquinaria() {
 let validacionnumeros = /^[0-9]+$/;
  let validacionPrecio = /^[0-9]+(\.[0-9]+)?$/; // To allow decimal values for price

  if (!idProveedor.value) {
    Notify.create("Se debe seleccionar el Proveedor");
  } else if (nombre.value.trim().length === 0) {
    Notify.create("Se debe agregar el Nombre");
  } else if (tipo.value.trim().length === 0) {
    Notify.create("Se debe agregar el Tipo");
  } else if (observaciones.value.trim().length === 0) {
    Notify.create("Se debe agregar Observaciones");
  } else if (!validacionnumeros.test(cantidad.value)) {
    Notify.create("La cantidad solo debe llevar números");
  } else if (!validacionPrecio.test(precio.value)) {
    Notify.create("El precio debe ser un número válido");
  } else if (!validacionnumeros.test(total.value)) {
    Notify.create("El total debe ser un número válido");
  } else {
    editarMaquinaria(); 
    Limpiar();
    cerrar();
    Notify.create({
      type: "positive",
      message: "Maquinaria Eitada exitosamente",
    });
  }
}

async function editarMaquinaria() {
  try {
    await useMaquinaria.putMaquinaria(id.value, {
   idProveedor: idProveedor.value.value,
    nombre: nombre.value,
    tipo: tipo.value,
    observaciones: observaciones.value,
    cantidad: cantidad.value,
    precio: precio.value,
    total: total.value,
    });
    listarMaquinarias();
    cerrar()
  } catch (error) {
    console.error("Error de actualizar Maquina", error);
    Notify.create("Ocurrio un error al editar datos del Maquina");
  }
}

function Limpiar() {
  idProveedor.value = null;
  nombre.value = '';
  tipo.value = '';
  observaciones.value = '';
  cantidad.value = '';
  precio.value = 0;
  total.value = 0;
}


onMounted(() => {
  listarMaquinarias();
  listarCultivos();
  listarProveedor();
});
</script>
