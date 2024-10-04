<template>
  <div>
    <div style=" display: flex;justify-content: flex-end; margin-left: 5%; margin-right: 5%;">
      <q-btn style="background-color: #00c04f; color: white" class="q-my-md q-ml-md" @click="abrir()">Registrar Insumos</q-btn>
    </div>

    <div>
      <q-dialog v-model="alert" persistent>
        <q-card class="" style="width: 700px">
          <q-card-section style="background-color: #009b44; margin-bottom: 20px">
            <div class="text-h6 text-white">
              {{ accion == 1 ? "Agregar Insumo" : "Editar Insumo " }}
            </div>
          </q-card-section>
          <q-select outlined v-model="idFinca" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="options" @filter="filterFn" label="Seleccionar  la Finca">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
          <q-input outlined v-model="nombre" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Nombre del Insumo" type="text" />
            <q-input outlined v-model="relacionNPK" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Ingrese la relacion NPK" type="tel" required pattern="[0-9]+" />
          <q-input outlined v-model="registro_ICA" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="registro ICA del Insumo" type="text" />
          <q-input outlined v-model="registro_Invima" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="registro Invima del Insumo" type="text" />
          <q-input outlined v-model="cantidad" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Ingrese la cantidad  del Insumo" type="tel" required pattern="[0-9]+"
            maxlength="10" />
          <q-input outlined v-model="precio" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Ingrese el precio del Insumo" type="tel" required pattern="[0-9]+"
            maxlength="100" /> 
          <q-input outlined v-model="observaciones" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="Observaciones" type="text" /> 
          <q-input outlined v-model="unidad" use-input hide-selected fill-input input-debounce="0"
            class="q-my-md q-mx-md" label="ingrese peso y Unidad de Medida" type="text" /> 
          <!-- <q-select outlined v-model="unidad"
            :options="['Gramos (g)', 'Kilogramos (kg)', 'Litros (L)', 'Mililitros (ml)', 'Onzas (oz)']"
            label="Seleccione la unidad de medida" class="q-my-md q-mx-md" /> -->
          
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
import { useFincaStore } from "../stores/finca.js";


const useInsumo = UseInsumoStore();
const useFinca = useFincaStore();


let rows = ref([]);
let alert = ref(false);
let id = ref("");
let accion = ref(1);
let idFinca = ref("");
let nombre = ref("");
let relacionNPK = ref("");
let registro_ICA = ref("");
let registro_Invima = ref("");
let cantidad = ref("");
let precio = ref("");
let observaciones = ref("");
let unidad = ref("");


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
        name: 'idFinca',
        required: true,
        label: 'Nombre de la Finca',
        align: 'center',
        field: (row) => row.idFinca.nombre,
        sortable: true
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
    name: "registro_ICA",
    required: true,
    label: "registro ICA",
    align: "center",
    field: "registro_ICA",
    sortable: true,
  },
  {
    name: "registro_Invima",
    required: true,
    label: "registro Invima",
    align: "center",
    field: "registro_Invima",
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
    name: "precio",
    required: true,
    label: "precio del Insumo",
    align: "center",
    field: "precio",
    sortable: true,
    format: (valor) => {
            // Formatear el precio como pesos colombianos
            return valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
        }
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
    name: "unidad",
    required: true,
    label: "peso y Unidad de Medida",
    align: "center",
    field: "unidad",
    sortable: true,
  },
  {
    name: "total",
    required: true,
    label: "Total ",
    align: "center",
    field: "total",
    sortable: true,
    format: (valor) => {
            // Formatear el precio como pesos colombianos
            return valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
        }
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



// Listar Fincas Activos

// let fincas = [];
// let datos = {};
// const opciones = ref(fincas);

// function filterFn(val, update, abort) {
//   update(() => {
//     const needle = val.toLowerCase();
//     opciones.value = fincas.filter((v) => v.label.toLowerCase().indexOf(needle) > -1);
//   });
// }


// async function listarFincas() {
//   const data = await useFinca.ListarFincasActivo();
//   data.data.FincaActiva.forEach((item) => {
//     datos = {
//       label: `${item?.nombre} - ${item.ruc} `,
//       value: item._id,
//     };
//     fincas.push(datos);
//   });
//   console.log(fincas);
// }

let fincas = []
let datos = {}
const options = ref(fincas)

function filterFn(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        options.value = fincas.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });
};

async function listarFincas() {
    const data = await useFinca.listarFincas()
    data.data.fincas.forEach(item => {
        datos = {
            label: `${item.nombre} - ${item.ruc}`,
            value: item._id


        };
        fincas.push(datos);
    });
    console.log(fincas);

}


// Listar Insumos

async function listarInsumos() {
    const r = await useInsumo.listarInsumos()
    rows.value = r.data.insumo.reverse()
    console.log(r.data.insumo);
};

function validarInsumos() {
  
  let validacionNumeros = /^[0-9]+$/;
  let validacionNPK = /^\d+\s\d+\s\d+$/;

  if (idFinca.value === "") {
    Notify.create("Se debe seleccionar la Finca");
  }  else if (nombre.value === "" || nombre.value.trim().length === 0) {
    Notify.create("Se debe ingresar el nombre del insumo");
  } else if (relacionNPK.value === "") {
    Notify.create("Se debe ingresar la relación NPK del insumo");
  } else if (registro_ICA.value === "" || registro_ICA.value.trim().length === 0) {
    Notify.create("Se debe ingresar el registro ICA del insumo");
  } else if (registro_Invima.value === "" || registro_Invima.value.trim().length === 0) {
    Notify.create("Se debe ingresar el registro Invima del insumo");
  } else if (cantidad.value === "") {
    Notify.create("Se debe ingresar la cantidad de insumo");
  } else if (!validacionNumeros.test(cantidad.value)) {
    Notify.create("La cantidad de insumo debe ser un número entero");
  }else if (precio.value === "") {
    Notify.create("Se debe ingresar el precio de insumo");
  } else if (!validacionNumeros.test(precio.value)) {
    Notify.create("La precio de insumo debe ser un número entero");
  } else if (observaciones.value === "" || observaciones.value.trim().length === 0) {
    Notify.create("Se debe ingresar las observaciones del insumo");
  } else if (unidad.value === "" || unidad.value.trim().length === 0) {
    Notify.create("Se debe ingresar el peso del insumo");
  }  else {
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
    idFinca: idFinca.value.value,
      nombre: nombre.value,
      relacionNPK: relacionNPK.value,
      registro_ICA: registro_ICA.value,
      registro_Invima: registro_Invima.value,
      cantidad: cantidad.value,
      precio: precio.value,
      observaciones: observaciones.value,
      unidad: unidad.value
    
  })
  cerrar()
  listarInsumos()
  console.log(r)
}

function traerInsumos(insumo){
  alert.value = true;
  accion.value = 2;
  id.value = insumo._id;
  idFinca.value = {
    label: insumo.idFinca.nombre,
    value: insumo.idFinca._id
  }
  nombre.value = insumo.nombre;
  relacionNPK.value = insumo.relacionNPK;
   registro_ICA.value = insumo. registro_ICA;
  registro_Invima.value = insumo.registro_Invima;
  cantidad.value = insumo.cantidad;
  precio.value = insumo.precio;
  observaciones.value = insumo.observaciones;
  unidad.value = insumo.unidad;
}

function validarEdicionInsumo(){
  let validacionNumeros = /^[0-9]+$/;
  let validacionNPK = /^\d+\s\d+\s\d+$/;

 if (idFinca.value === "") {
    Notify.create("Se debe seleccionar la Finca");
  }  else if (nombre.value === "" || nombre.value.trim().length === 0) {
    Notify.create("Se debe ingresar el nombre del insumo");
  } else if (relacionNPK.value === "") {
    Notify.create("Se debe ingresar la relación NPK del insumo");
  } else if (registro_ICA.value === "" || registro_ICA.value.trim().length === 0) {
    Notify.create("Se debe ingresar el registro ICA del insumo");
  } else if (registro_Invima.value === "" || registro_Invima.value.trim().length === 0) {
    Notify.create("Se debe ingresar el registro Invima del insumo");
  } else if (cantidad.value === "") {
    Notify.create("Se debe ingresar la cantidad de insumo");
  } else if (!validacionNumeros.test(cantidad.value)) {
    Notify.create("La cantidad de insumo debe ser un número entero");
  }else if (precio.value === "") {
    Notify.create("Se debe ingresar el precio de insumo");
  } else if (!validacionNumeros.test(precio.value)) {
    Notify.create("La precio de insumo debe ser un número entero");
  } else if (observaciones.value === "" || observaciones.value.trim().length === 0) {
    Notify.create("Se debe ingresar las observaciones del insumo");
  } else if (unidad.value === "" || unidad.value.trim().length === 0) {
    Notify.create("Se ingrear el peso  del insumo");
  }  else {
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
     idFinca: idFinca.value.value,
      nombre: nombre.value,
      relacionNPK: relacionNPK.value,
      registro_ICA: registro_ICA.value,
      registro_Invima: registro_Invima.value,
      cantidad: cantidad.value,
      precio: precio.value,
      observaciones: observaciones.value,
      unidad: unidad.value,
    })
listarInsumos()
  }catch (error){
    console.error("Error de actualizar Insumo", error);
    Notify.create("Ocurrio un error al editar datos del Insumo");
  }
}


function limpiar() {
  idFinca.value = "";
  nombre.value = "";
  relacionNPK.value = "";
  registro_ICA.value = "";
  registro_Invima.value = "";
  cantidad.value = "";
  precio.value = "";
  observaciones.value = "";
  unidad.value = "";
  

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

onMounted(() => {
 listarInsumos();
  listarFincas();
  
});
</script>