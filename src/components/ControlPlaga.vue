<template>
  <div>
    <div style="margin-left: 5%; text-align: end; margin-right: 5%">
      <q-btn style="background-color: #00C04F; color: white;" class="q-my-md q-ml-md" @click="abrir()">Registrar
        Control Plagas</q-btn>
    </div>
    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color: #009b44; margin-bottom: 20px">
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Control Plagas" : "Editar Control Plagas " }}
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
          <q-select outlined v-model="idEmpleado" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" :options="opciones" @filter="filtrarFn" label="Selecciona el Empleado">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> Sin resultados </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select outlined v-model="idOperario" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" :options="opciones" @filter="filtrarFn" label="Selecciona el Operario">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> Sin resultados </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input outlined v-model="nombre" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Nombre" type="text" />
         
          <q-input outlined v-model="tipo" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Tipo" type="text" />
          <q-input outlined v-model="ingredienteActivo" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="ingrediente Activo" type="text" />
          <q-input outlined v-model="dosis" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="dosis (litro/hora)" type="number" />
          <q-input outlined v-model="observaciones" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="observaciones" type="tel" />
          <q-card-actions align="right">
            <q-btn v-if="accion === 1" @click="validarIngresoRiego()" color="red" class="text-white"
              :loading="useControlPlaga.loading">Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn v-if="accion !== 1" @click="validarEdicionRiego()" color="red" class="text-white"
              :loading="useControlPlaga.loading">
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
      <q-table title="Control de Plagas" title-class="text-green text-weight-bolder text-h4"
        table-header-class="text-black font-weight-bold" :rows="rows" :columns="columns" row-key="name"
        style="width: 90%">
        <template v-slot:body-cell-observaciones="props">
  <q-td :props="props">
    <div v-tooltip="props.row.observaciones">
      {{ props.row.observaciones.slice(0, 10) }}<span v-if="props.row.observaciones.length > 10">...</span>
    </div>
  </q-td>
</template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <div style="display: flex; gap: 15px; justify-content: center">
              <!-- boton de editar -->
              <q-btn color="primary" @click="traerRiego(props.row)">
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
import { useControlPlagaStore } from "../stores/controlPlaga.js";
import { useCultivoStore } from "../stores/cultivo.js";
import { useEmpleadoStore } from "../stores/empleado.js";

const useControlPlaga= useControlPlagaStore();
const useCultivo = useCultivoStore();
const useEmpleado = useEmpleadoStore();

let rows = ref([]);
let alert = ref(false);
let id = ref("");
let accion = ref(1);
let idCultivo = ref("");
let idEmpleado = ref("");
let idOperario= ref("");
let nombre = ref("");
let tipo = ref("");
let ingredienteActivo = ref("");
let dosis = ref("");
let observaciones = ref("");

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
      name: 'nombre',
      required: true,
      label: 'Nombre ',
      align: 'center',
      field: 'nombre',

      sortable: true
  },
  {
      name: 'tipo',
      required: true,
      label: 'Trabajador Finca',
      align: 'center',
      field: 'tipo',
      sortable: true
  },
  {
      name: 'dosis',
      required: true,
      label: 'Dosis',
      align: 'center',
      field: 'dosis',
      sortable: true
  },
  {
      name: 'observaciones',
      required: true,
      label: 'Observaciones',
      align: 'center',
      field: 'observaciones',
  },
  {
      name: 'ingredienteActivo',
      required: true,
      label: 'Ingrediente Activo',
      align: 'center',
      field: 'ingredienteActivo',
      sortable: true
  },
  {
      name: 'idCultivo',
      required: true,
      label: 'Cultivo ',
      align: 'center',
      field: (row) => row.idCultivo.nombre,
  },
  {
      name: 'idEmpleado',
      required: true,
      label: 'Empleado',
      align: 'center',
      field: (row) => row.idEmpleado.nombre,
      sortable: true
  },
  {
      name: 'idOperario',
      required: true,
      label: 'Operario',
      align: 'center',
      field: (row) => row.idOperario.nombre,

  },

  {
      name: 'opciones',
      required: true,
      label: 'Opciones',
      align: 'center',
      field: 'opciones',
  }
])
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

let empleados = [];
let dates = {};
const opciones = ref(empleados);

async function listarEmpleados() {
  const data = await useEmpleado.listarEmpleado();
  data.data.empleado.forEach((item) => {
    dates = {
      label: `${item?.nombre} - ${item.documento} `,
      value: item._id,
    };
    empleados.push(dates);
  });
  console.log(empleados);
}

function filtrarFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    opciones.value = empleados.filter((v) => v.label.toLowerCase().indexOf(needle) > -1);
  });
}

async function listarRiegos() {
  const r = await useControlPlaga.listarControlPlaga();
  rows.value = r.data.controlPlagas.reverse()
  ;
  console.log(r.data.controlPlagas
  );
}

function validarIngresoRiego() {
let validacionnumeros = /^[0-9]+$/;

if (!idCultivo.value ) {
  Notify.create("Se debe seleccionar el cultivo");
}
else if (!idEmpleado.value) {
  Notify.create("Se debe seleccionar el Empleado");
}
else if (!idOperario.value ) {
  Notify.create("Se debe seleccionar el Operario");
}
else if (!nombre.value || nombre.value.trim().length === 0) {
  Notify.create("Se debe agregar el nombre");
}
else if (!tipo.value || tipo.value.trim().length === 0) {
  Notify.create("Se debe agregar el tipo");
}
else if (!ingredienteActivo.value || ingredienteActivo.value.trim().length === 0) {
  Notify.create("Se debe agregar el Ingrediente Activo");
}
else if (!dosis.value || dosis.value.trim().length === 0) {
  Notify.create("Se debe agregar la dosis");
} 

else if (!observaciones.value || observaciones.value.trim().length === 0) {
  Notify.create("Se deben agregar las observaciones");
} 
else {
  agregarControlPlaga();
  Limpiar();
  cerrar();
  listarRiegos();
  Notify.create({
    type: "positive",
    message: "Control Plaga agregado exitosamente",
  });
}
}


async function agregarControlPlaga() {

  const r = await useControlPlaga.postcontrolPlaga({
    idCultivo: idCultivo.value.value,
    idEmpleado: idEmpleado.value.value,
    idOperario: idOperario.value.value,
    nombre: nombre.value,
    tipo: tipo.value,
    ingredienteActivo: ingredienteActivo.value,
    dosis: dosis.value,
    observaciones: observaciones.value,

  });

  cerrar();
  Limpiar();
  listarRiegos();
  console.log(r);
}


function traerRiego(riego) {
  alert.value = true;
  accion.value = 2;
  id.value = riego._id;
  idCultivo.value = {
    label: riego.idCultivo.nombre,
    value: riego.idCultivo._id,
  };
  idEmpleado.value = {
    label: riego.idEmpleado.nombre,
    value: riego.idEmpleado._id,
  };
  idOperario.value = {
    label: riego.idOperario.nombre,
    value: riego.idOperario._id,
  };
    nombre.value= riego.nombre,
    tipo.value= riego.tipo,
    ingredienteActivo.value= riego.ingredienteActivo,
    dosis.value= riego.dosis,
    observaciones.value=riego.observaciones
}

function validarEdicionRiego() {
 let validacionnumeros = /^[0-9]+$/;

if (!idCultivo.value ) {
  Notify.create("Se debe seleccionar el cultivo");
}
else if (!idEmpleado.value) {
  Notify.create("Se debe seleccionar el Empleado");
}
else if (!idOperario.value ) {
  Notify.create("Se debe seleccionar el Operario");
}
else if (!nombre.value || nombre.value.trim().length === 0) {
  Notify.create("Se debe agregar el nombre");
}
else if (!tipo.value || tipo.value.trim().length === 0) {
  Notify.create("Se debe agregar el tipo");
}
else if (!ingredienteActivo.value || ingredienteActivo.value.trim().length === 0) {
  Notify.create("Se debe agregar el Ingrediente Activo");
}
else if (!dosis.value) {
  Notify.create("Se debe agregar la dosis");
} 

else if (!observaciones.value || observaciones.value.trim().length === 0) {
  Notify.create("Se deben agregar las observaciones");
} 
else {
  editarRiego();
  Limpiar();
  cerrar();
  listarRiegos();
  Notify.create({
    type: "positive",
    message: "Control Plaga editado exitosamente",
  });
}
}

async function editarRiego() {
  try {
    await useControlPlaga.putcontrolPlaga(id.value, {
    idCultivo: idCultivo.value.value,
    idEmpleado: idEmpleado.value.value,
    idOperario: idOperario.value.value,
    nombre: nombre.value,
    tipo: tipo.value,
    ingredienteActivo: ingredienteActivo.value,
    dosis: dosis.value,
    observaciones: observaciones.value,
    });
    listarRiegos();
  } catch (error) {
    console.error("Error de actualizar control de Plaga", error);
    Notify.create("Ocurrio un error al editar datos de control de Plaga");
  }
}

function Limpiar() {
  idCultivo.value = "";
  idEmpleado.value = "";
  idOperario.value = "";

  // diasTransplante.value = "";
  nombre.value= "",
    tipo.value= "",
    ingredienteActivo.value= "",
    dosis.value= "",
    observaciones.value=""
}

onMounted(() => {
  listarRiegos();
  listarCultivos();
  listarEmpleados();
});

</script>
