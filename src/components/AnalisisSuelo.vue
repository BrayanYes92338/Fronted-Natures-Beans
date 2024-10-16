<template>
    <div>
      <div style="margin-left: 5%; text-align: end; margin-right: 5%">
        <q-btn style="background-color: #00C04F; color: white;" class="q-my-md q-ml-md" @click="abrir()">Registrar
          Analisis de Suelos</q-btn>
      </div>
      <div>
        <q-dialog v-model="alert" persistent>
          <q-card class="" style="width: 700px">
            <q-card-section style="background-color: #009b44; margin-bottom: 20px">
              <div class="text-h6 text-white">
                {{ accion == 1 ? "Agregar Analisis" : "Editar Analisis " }}
              </div>
            </q-card-section>
            <q-select outlined v-model="idParcela" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="options" @filter="filterFn"
                        label="Selecciona el detalle de la Parcela">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
             <q-select
            outlined
            v-model="idEmpleado"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            class="q-my-md q-mx-md"
            :options="opciones"
            @filter="filtrarEmpleado"
            label="Seleccionar el empleado"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input outlined v-model="muestra" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="muestra del Analisis de suelos" type="text" /> 
          <q-input outlined v-model="laboratorio" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Laboratorio" type="text" />
          <q-input outlined v-model="resultados" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Resultados" type="text" /> 
          <q-input outlined v-model="recomendaciones" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Recomendaciones" type="text" />
            <q-card-actions align="right">
              <q-btn v-if="accion === 1" @click="validarIngresoAnalisis()" color="red" class="text-white"
                :loading="useAnalisisSuelo.loading">Agregar
                <template v-slot:loading>
                  <q-spinner color="primary" size="1em" />
                </template>
              </q-btn>
              <q-btn v-if="accion !== 1" @click="validarEdicionAnalisis()" color="red" class="text-white"
                :loading="useAnalisisSuelo.loading">
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
        <q-table title="Analisis de Suelos" title-class="text-green text-weight-bolder text-h4"
          table-header-class="text-black font-weight-bold" :rows="rows" :columns="columns" row-key="name"
          style="width: 90%; margin-bottom: 5%;">
          <template v-slot:body-cell-recomendaciones="props">
          <q-td :props="props">
            <!-- VDropdown para mostrar el tooltip al hacer clic -->
            <VDropdown :distance="6" v-model="props.row.showDropdown">
              <!-- Botón que activará el dropdown -->
              <q-btn flat dense @click="toggleDropdown(props.row)">
                <!-- Controlamos que no se muestre en mayúsculas -->
                <span style="text-transform: none;">
                  {{ props.row.recomendaciones.length > 10 ? props.row.recomendaciones.substring(0, 10) + '...' :
                    props.row.recomendaciones }}
                </span>
              </q-btn>

              <!-- Contenido del popper (dropdown) con estilos personalizados -->
              <template #popper>
                <div class="custom-tooltip-content"
                  style="max-height: 200px; max-width: 200px; overflow-y: auto; padding: 10px;">
                  {{ props.row.recomendaciones }}
                </div>
              </template>
            </VDropdown>
          </q-td>
        </template>
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props">
              <div style="display: flex; gap: 15px; justify-content: center">
                <!-- boton de editar -->
                <q-btn color="primary" @click="traerAnalisis(props.row)">
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
  import { useAnalisisSueloStore } from "../stores/analisisSuelo.js";
  import { useParcelaStore } from "../stores/parcelas.js"
  import { useEmpleadoStore } from "../stores/empleado.js";
  
  const useAnalisisSuelo = useAnalisisSueloStore();
  const useParcela = useParcelaStore();
  const useEmpleado = useEmpleadoStore();
  
  let rows = ref([]);
  let alert = ref(false);
  let id = ref("");
  let accion = ref(1);
  let idParcela = ref("");
  let idEmpleado = ref("");
  let muestra = ref("");
  let laboratorio = ref("");
  let resultados = ref("");
  let recomendaciones = ref("");
  
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
      name: "idParcela",
      required: true,
      label: "Nombre de la Parcela",
      align: "center",
      field: (row) => row.idParcela.detalle,
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
      name: "muestra",
      required: true,
      label: "Muestra",
      align: "center",
      field: "muestra",
      sortable: true,
    },
    {
      name: "laboratorio",
      required: true,
      label: "Laboratorio",
      align: "center",
      field: "laboratorio",
      sortable: true,
      format: val => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
    },
    {
      name: "resultados",
      required: true,
      label: "Resultados",
      align: "center",
      field: "resultados",
      sortable: true,
    },
    {
      name: "recomendaciones",
      required: true,
      label: "Recomendaciones",
      align: "center",
      field: "recomendaciones",
      sortable: true,
      format: val => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
    },
    {
      name: "fecha",
      required: true,
      label: "Fecha",
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
  
  //  listar parcelas
  
  let parcela = []
let datos = {}
const options = ref(parcela)

async function listarParcela() {
    const data = await useParcela.listarParcela()
    data.data.parcela.forEach(item => {
        datos = {
            label: `${item?.detalle} - ${item.numero} `,
            value: item._id

        };
        parcela.push(datos);
    })
    console.log(parcela);

}

function filterFn(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        options.value = parcela.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });
};


let empleados = [];
let dates = {};
const opciones = ref(empleados);
function filtrarEmpleado(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    opciones.value = empleados.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
}
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
    opciones.value = empleados.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
}
  
  async function listarAnalisis() {
    const r = await useAnalisisSuelo.listarAnalisis();
    rows.value = r.data.analisis.reverse();
    console.log(r.data.analisis);
  }
  
  function validarIngresoAnalisis() {
    // let validacionnumeros = /^[0-9]+$/;
    if (idParcela.value == "") {
      Notify.create("Se debe seleccionar Parcela");
    } else if (idEmpleado.value == "") {
      Notify.create("Se debe seleccionar el Empleado");
    } else if (muestra.value == "" || muestra.value.trim().length === 0) {
      Notify.create("Se debe agregar muestra");
    }  else if (laboratorio.value == "" || laboratorio.value.trim().length === 0) {
      Notify.create("Se debe agregar laboratorio");
    } else if ( resultados.value == "" ||  resultados.value.trim().length === 0) {
      Notify.create("Se debe agregar  resultados");
    } else if ( recomendaciones.value == "" ||  recomendaciones.value.trim().length === 0) {
      Notify.create("Se debe agregar  recomendaciones");
    }else {
      agregarAnalisis();
      Limpiar();
      cerrar();
      Notify.create({
        type: "positive",
        message: "Analisis agregado exitosamente",
      });
    }
  }
  
  async function agregarAnalisis() {
  
    const r = await useAnalisisSuelo.postAnalisis({
      idParcela: idParcela.value.value,
      idEmpleado: idEmpleado.value.value,
      muestra: muestra.value,
      laboratorio: laboratorio.value,
      resultados: resultados.value,
      recomendaciones: recomendaciones.value,
        
    });
  
    cerrar();
    Limpiar();
    listarAnalisis();
    console.log(r);
  }
  
  
  function traerAnalisis(analisis) {
    alert.value = true;
    accion.value = 2;
    id.value = analisis._id;

    idParcela.value = {
      label: analisis.idParcela.detalle,
      value: analisis.idParcela._id,
    };
    idEmpleado.value = {
      label: analisis.idEmpleado.nombre,
      value: analisis.idEmpleado._id,
    };
    muestra.value = analisis.muestra;
    laboratorio.value = analisis.laboratorio;
    resultados.value = analisis.resultados;
    recomendaciones.value = analisis.recomendaciones;
  }
  
  function validarEdicionAnalisis() {
    if (idParcela.value == "") {
      Notify.create("Se debe seleccionar Parcela");
    } else if (idEmpleado.value == "") {
      Notify.create("Se debe seleccionar el Empleado");
    } else if (muestra.value == "" || muestra.value.trim().length === 0) {
      Notify.create("Se debe agregar muestra");
    }  else if (laboratorio.value == "" || laboratorio.value.trim().length === 0) {
      Notify.create("Se debe agregar laboratorio");
    } else if ( resultados.value == "" ||  resultados.value.trim().length === 0) {
      Notify.create("Se debe agregar  resultados");
    } else if ( recomendaciones.value == "" ||  recomendaciones.value.trim().length === 0) {
      Notify.create("Se debe agregar  recomendaciones");
    } else  {
      editarAnalisis();
      Limpiar();
      cerrar();
      Notify.create({
        type: "positive",
        message: "Edicion de Analisis agregado exitosamente",
      });
    }
  }
  
  async function editarAnalisis() {
    try {
      await useAnalisisSuelo.putAnalisis(id.value, {
      idParcela: idParcela.value.value,
      idEmpleado: idEmpleado.value.value,
      muestra: muestra.value,
      laboratorio: laboratorio.value,
      resultados: resultados.value,
      recomendaciones: recomendaciones.value,
      });
      listarAnalisis();
    } catch (error) {
      console.error("Error de actualizar Analisis", error);
      Notify.create("Ocurrio un error al editar datos del Analisis");
    }
  }
  
  function Limpiar() {
    idParcela.value = "";
    idEmpleado.value = "";
    muestra.value = "";
    laboratorio.value = "";
    resultados.value = "";
    recomendaciones.value = "";
  }
  
  onMounted(() => {
    listarAnalisis();
    listarParcela();
    listarEmpleados();
  });
  
  </script>
  