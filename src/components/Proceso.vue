<template>
    <div>
      <div style="margin-left: 5%; text-align: end; margin-right: 5%">
        <q-btn style="background-color: #00C04F; color: white;" class="q-my-md q-ml-md" @click="abrir()">Registrar
          Proceso</q-btn>
      </div>
      <div>
        <q-dialog v-model="alert" persistent>
          <q-card class="" style="width: 700px">
            <q-card-section style="background-color: #009b44; margin-bottom: 20px">
              <div class="text-h6 text-white">
                {{ accion == 1 ? "Agregar Proceso" : "Editar Proceso " }}
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
            <q-input outlined v-model="tipo" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="tipo" type="text" />
          <q-input outlined v-model="descripcion" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="descripcion del proceso" type="text" />
          <q-input outlined v-model="fechaFinal" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="fecha Final" type="date" />
            <q-card-actions align="right">
              <q-btn v-if="accion === 1" @click="validarIngresoProceso()" color="red" class="text-white"
                :loading="useProceso.loading">Agregar
                <template v-slot:loading>
                  <q-spinner color="primary" size="1em" />
                </template>
              </q-btn>
              <q-btn v-if="accion !== 1" @click="validarEdicionProceso()" color="red" class="text-white"
                :loading="useProceso.loading">
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
        <q-table title="Procesos" title-class="text-green text-weight-bolder text-h4"
          table-header-class="text-black font-weight-bold" :rows="rows" :columns="columns" row-key="name"
          style="width: 90%; margin-bottom: 5%;">
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props">
              <div style="display: flex; gap: 15px; justify-content: center">
                <!-- boton de editar -->
                <q-btn color="primary" @click="traerProceso(props.row)">
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
  import { useProcesoStore } from "../stores/proceso.js";
  import { useCultivoStore } from "../stores/cultivo.js";
  import { useEmpleadoStore } from "../stores/empleado.js";
  
  const useProceso = useProcesoStore();
  const useCultivo = useCultivoStore();
  const useEmpleado = useEmpleadoStore();
  
  let rows = ref([]);
  let alert = ref(false);
  let id = ref("");
  let accion = ref(1);
  let idCultivo = ref("");
  let idEmpleado = ref("");
  let tipo = ref("");
  let descripcion = ref("");
  let estadoFenológico = ref("");
  let  fechaFinal = ref("");
  let today = new Date().toISOString().split('T')[0]
  
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
      name: "tipo",
      required: true,
      label: "tipo",
      align: "center",
      field: "tipo",
      sortable: true,
    },
    {
      name: "descripcion",
      required: true,
      label: "descripcion",
      align: "center",
      field: "descripcion",
      sortable: true,
    },
    {
      name: "fechaInicio",
      required: true,
      label: "fecha Inicio",
      align: "center",
      field: "fechaInicio",
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
    name: 'fechaFinal',
    required: true,
    label: 'Fecha Final',
    align: 'center',
    field: (row) => row.fechaFinal.split("T")[0],
    sortable: true,
    format: (val) => {
      const fechaFinal = new Date(val);
      return fechaFinal.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
});
}
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
  
  async function listarProcesos() {
    const r = await useProceso.listarProcesos();
    rows.value = r.data.procesos.reverse();
    console.log(r.data.procesos);
  }
  
  function validarIngresoProceso() {
    // let validacionnumeros = /^[0-9]+$/;
    if (idCultivo.value == "") {
      Notify.create("Se debe seleccionar cultivo");
    } else if (idEmpleado.value == "") {
      Notify.create("Se debe seleccionar el Empleado");
    } else if (tipo.value == "" || tipo.value.trim().length === 0) {
      Notify.create("Se debe agregar tipo");
    }  else if (descripcion.value == "" || descripcion.value.trim().length === 0) {
      Notify.create("Se debe agregar descripcion");
    } else if ( fechaFinal.value == "" ||  fechaFinal.value.trim().length === 0) {
      Notify.create("Se debe agregar  fechaFinal");
    } else {
      agregarProceso();
      Limpiar();
      cerrar();
      Notify.create({
        type: "positive",
        message: "Proceso agregado exitosamente",
      });
    }
  }
  
  async function agregarProceso() {
  
    const r = await useProceso.postProcesos({
      idCultivo: idCultivo.value.value,
      idEmpleado: idEmpleado.value.value,
      tipo: tipo.value,
      descripcion: descripcion.value,
      fechaFinal: fechaFinal.value,
        
    });
  
    cerrar();
    Limpiar();
    listarProcesos();
    console.log(r);
  }
  
  
  function traerProceso(proceso) {
    alert.value = true;
    accion.value = 2;
    id.value = proceso._id;
    idCultivo.value = {
      label: proceso.idCultivo.nombre,
      value: proceso.idCultivo._id,
    };
    idEmpleado.value = {
      label: proceso.idEmpleado.nombre,
      value: proceso.idEmpleado._id,
    };
    tipo.value = proceso.tipo;
    descripcion.value = proceso.descripcion;
    fechaFinal.value = proceso.fechaFinal.split("T")[0];
  }
  
  function validarEdicionProceso() {
    if (idCultivo.value == "") {
      Notify.create("Se debe seleccionar cultivo");
    } else if (idEmpleado.value == "") {
      Notify.create("Se debe seleccionar el Empleado");
    } else if (tipo.value == "" || tipo.value.trim().length === 0) {
      Notify.create("Se debe agregar tipo");
    }  else if (descripcion.value == "" || descripcion.value.trim().length === 0) {
      Notify.create("Se debe agregar descripcion");
    } else if ( fechaFinal.value == "" ||  fechaFinal.value.trim().length === 0) {
      Notify.create("Se debe agregar  fechaFinal");
    } else  {
      editarProceso();
      Limpiar();
      cerrar();
      Notify.create({
        type: "positive",
        message: "Edicion de Proceso agregado exitosamente",
      });
    }
  }
  
  async function editarProceso() {
    try {
      await useProceso.putProcesos(id.value, {
        idCultivo: idCultivo.value.value,
        idEmpleado: idEmpleado.value.value,
        tipo: tipo.value,
        descripcion: descripcion.value,
        fechaFinal: fechaFinal.value,
      });
      listarProcesos();
    } catch (error) {
      console.error("Error de actualizar Proceso", error);
      Notify.create("Ocurrio un error al editar datos del Proceso");
    }
  }
  
  function Limpiar() {
    idCultivo.value = "";
    idEmpleado.value = "";
    tipo.value = "";
    descripcion.value = "";
    fechaFinal.value = "";
  }
  
  onMounted(() => {
    listarProcesos();
    listarCultivos();
    listarEmpleados();
  });
  
  </script>
  