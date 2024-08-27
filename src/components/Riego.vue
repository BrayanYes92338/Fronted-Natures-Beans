<template>
  <div>
    <div style="margin-left: 5%; text-align: end; margin-right: 5%">
      <q-btn style="background-color: #00C04F; color: white;" class="q-my-md q-ml-md" @click="abrir()">Registrar
        Riego</q-btn>
    </div>
    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color: #009b44; margin-bottom: 20px">
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Riego" : "Editar Riego " }}
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
          <q-input outlined v-model="diasTransplante" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="dias de Transplante" type="tel" required pattern="[0-9]+" maxlength="999" />
          <q-select outlined v-model="estadoFenológico" :options="['Germinación', 'Emergencia', 'Crecimiento Vegetativo', 'Desarrollo de Yemas/Floración', 'Fructificación','Maduración', 'Cosecha','Senescencia', 'Dormancia (en algunos cultivos)']" label="Seleccione el Estado Fenológico"
            class="q-my-md q-mx-md" />
          <q-input outlined v-model="horaInicio" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="hora Inicio" type="time" />
          <q-input outlined v-model="horaFin" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="hora Fin" type="time" />
          <q-input outlined v-model="dosis" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="dosis (litro/hora)" type="tel" required pattern="[0-9]+" maxlength="999"/>
          <q-input outlined v-model="cantidadAgua" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="cantidad de Agua" type="tel" 
            />
          <q-card-actions align="right">
            <q-btn v-if="accion === 1" @click="validarIngresoRiego()" color="red" class="text-white"
              :loading="useRiego.loading">Agregar
              <template v-slot:loading>
                <q-spinner color="primary" size="1em" />
              </template>
            </q-btn>
            <q-btn v-if="accion !== 1" @click="validarEdicionRiego()" color="red" class="text-white"
              :loading="useRiego.loading">
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
      <q-table title="Riegos" title-class="text-green text-weight-bolder text-h4"
        table-header-class="text-black font-weight-bold" :rows="rows" :columns="columns" row-key="name"
        style="width: 90%; margin-bottom: 5%;">
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
import { useRiegoStore } from "../stores/riego.js";
import { useCultivoStore } from "../stores/cultivo.js";
import { useEmpleadoStore } from "../stores/empleado.js";

const useRiego = useRiegoStore();
const useCultivo = useCultivoStore();
const useEmpleado = useEmpleadoStore();

let rows = ref([]);
let alert = ref(false);
let id = ref("");
let accion = ref(1);
let idCultivo = ref("");
let idEmpleado = ref("");
let fechaRiego = ref("");
let diasTransplante = ref("");
let estadoFenológico = ref("");
let horaInicio = ref("");
let horaFin = ref("");
let dosis = ref("");
let cantidadAgua = ref("");

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
    name: "idEmpleado",
    required: true,
    label: "Nombre del Empleado",
    align: "center",
    field: (row) => row.idEmpleado.nombre,
    sortable: true,
  },
  {
    name: "fechaRiego",
    required: true,
    label: "Fecha de Riego",
    align: "center",
    field: "fechaRiego",
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
    name: "diasTransplante",
    required: true,
    label: "Días de Transplante",
    align: "center",
    field: "diasTransplante",
    sortable: true,
  },
  {
    name: "estadoFenológico",
    required: true,
    label: "Estado Fenológico",
    align: "center",
    field: "estadoFenológico",
    sortable: true,
  },
  {
    name: "horaInicio",
    required: true,
    label: "Hora Inicio",
    align: "center",
    field: "horaInicio",
    sortable: true,
    format: (val) => {
      try {
        // Aquí asumimos que val es solo la hora en formato "HH:mm"
        const [hours, minutes] = val.split(":");
        const date = new Date();
        date.setHours(parseInt(hours));
        date.setMinutes(parseInt(minutes));

        return date.toLocaleTimeString("es-CO", {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      } catch (error) {
        console.error("Error formateando la hora de inicio:", error);
        return "Hora inválida";
      }
    }
  },
  {
    name: "horaFin",
    required: true,
    label: "Hora Final",
    align: "center",
    field: "horaFin",
    sortable: true,
    format: (val) => {
      try {
        const [hours, minutes] = val.split(":");
        const date = new Date();
        date.setHours(parseInt(hours));
        date.setMinutes(parseInt(minutes));

        return date.toLocaleTimeString("es-CO", {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      } catch (error) {
        console.error("Error formateando la hora final:", error);
        return "Hora inválida";
      }
    }
  },
  {
    name: "dosis",
    required: true,
    label: "Dosis (litro/hora)",
    align: "center",
    field: "dosis",
    sortable: true,
    format: (val) => `${val} L/H`,
  },
  {
    name: "cantidadAgua",
    required: true,
    label: "Cantidad Agua",
    align: "center",
    field: "cantidadAgua",
    sortable: true,
    format: (val) => `${val} Litros`
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
 const r = await useRiego.listarRiegos()
 rows.value = r.data.riegos.reverse()
 console.log(r.data.riegos)
}

function validarIngresoRiego() {
  let validacionnumeros = /^[0-9]+$/;
  if (idCultivo.value == "") {
    Notify.create("Se debe seleccionar cultivo");
  } else if (idEmpleado.value == "") {
    Notify.create("Se debe seleccionar el Empleado");
  } else if (diasTransplante.value == "" || diasTransplante.value.trim().length === 0) {
    Notify.create("Se debe agregar dias Transplante");
  } else if (!validacionnumeros.test(diasTransplante.value)) {
      Notify.create("Los dias de Transplante solo debe llevar numeros"); 
  } else if (estadoFenológico.value == "" || estadoFenológico.value.trim().length === 0) {
    Notify.create("Se debe agregar estado Fenológico");
  } else if (horaInicio.value == "" || horaInicio.value.trim().length === 0) {
    Notify.create("Se debe agregar hora Inicio");
  } else if (horaFin.value == "" || horaFin.value.trim().length === 0) {
    Notify.create("Se debe agregar hora Final");
  } else if (dosis.value == "") {
    Notify.create("Se debe agregar dosis"); 
  } else if (!validacionnumeros.test(dosis.value)) {
    Notify.create("La dosis solo debe llevar numeros");  
  } else if (cantidadAgua.value == "") {
    Notify.create("Se debe agregar cantidad de Agua");
  } else if (!validacionnumeros.test(cantidadAgua.value)) {
    Notify.create("La cantidad de Agua solo debe llevar numeros");  
  } else {
    agregarRiego();
    Limpiar();
    cerrar();
    Notify.create({
      type: "positive",
      message: "Riego agregado exitosamente",
    });
  }
}

async function agregarRiego() {

  const r = await useRiego.postRiegos({
    idCultivo: idCultivo.value.value,
    idEmpleado: idEmpleado.value.value,
    diasTransplante: diasTransplante.value,
    estadoFenológico: estadoFenológico.value,
    horaInicio: horaInicio.value,
    horaFin: horaFin.value,
    dosis: dosis.value,
    cantidadAgua: cantidadAgua.value,

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
  diasTransplante.value = riego.diasTransplante;
  estadoFenológico.value = riego.estadoFenológico;
  horaInicio.value = riego.horaInicio;
  horaFin.value = riego.horaFin;
  dosis.value = riego.dosis;
  cantidadAgua.value = riego.cantidadAgua;
}

function validarEdicionRiego() {
  let validacionnumeros = /^[0-9]+$/;
  if (idCultivo.value == "") {
    Notify.create("Se debe seleccionar cultivo");
  } else if (idEmpleado.value == "") {
    Notify.create("Se debe seleccionar el Empleado");
  } else if (diasTransplante.value == "" || diasTransplante.value.trim().length === 0) {
    Notify.create("Se debe agregar dias Transplante");
  } else if (!validacionnumeros.test(diasTransplante.value)) {
      Notify.create("Los dias de Transplante solo debe llevar numeros"); 
  } else if (estadoFenológico.value == "" || estadoFenológico.value.trim().length === 0) {
    Notify.create("Se debe agregar estado Fenológico");
  } else if (horaInicio.value == "" || horaInicio.value.trim().length === 0) {
    Notify.create("Se debe agregar hora Inicio");
  } else if (horaFin.value == "" || horaFin.value.trim().length === 0) {
    Notify.create("Se debe agregar hora Final");
  } else if (dosis.value == "") {
    Notify.create("Se debe agregar dosis"); 
  } else if (!validacionnumeros.test(dosis.value)) {
    Notify.create("La dosis solo debe llevar numeros");  
  } else if (cantidadAgua.value == "") {
    Notify.create("Se debe agregar cantidad de Agua");
  } else if (!validacionnumeros.test(cantidadAgua.value)) {
    Notify.create("La cantidad de Agua solo debe llevar numeros");  
  } else  {
    editarRiego();
    Limpiar();
    cerrar();
    Notify.create({
      type: "positive",
      message: "Edicion de Riego agregado exitosamente",
    });
  }
}

async function editarRiego() {
  try {
    await useRiego.putRiegos(id.value, {
      idCultivo: idCultivo.value.value,
      idEmpleado: idEmpleado.value.value,
      diasTransplante: diasTransplante.value,
      estadoFenológico: estadoFenológico.value,
      horaInicio: horaInicio.value,
      horaFin: horaFin.value,
      dosis: dosis.value,
      cantidadAgua: cantidadAgua.value,
    });
    listarRiegos();
  } catch (error) {
    console.error("Error de actualizar Riego", error);
    Notify.create("Ocurrio un error al editar datos del Riego");
  }
}

function Limpiar() {
  idCultivo.value = "";
  idEmpleado.value = "";
  diasTransplante.value = "";
  estadoFenológico.value = "";
  horaInicio.value = "";
  horaFin.value = "";
  dosis.value = "";
  cantidadAgua.value;
}

onMounted(() => {
  listarRiegos();
  listarCultivos();
  listarEmpleados();
});

</script>
