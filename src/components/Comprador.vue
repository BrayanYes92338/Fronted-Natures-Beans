<template>
    <div>
        <div style="display: flex; justify-content: flex-end;margin-left: 5%;  margin-right: 5%">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Registrar Comprador</q-btn> <q-btn-dropdown
                color="blue" icon="visibility" label="Filtrar"
                style="display: flex; justify-content: center; align-items: center; margin-left: 16px;height: 20px;"
                class="q-my-md q-ml-md">
                <q-list>
                    <q-item clickable v-ripple @click="listarComprador()">
                        <q-item-section>Listar Todos</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="ListarCompradorActivo()">
                        <q-item-section>Listar Activos</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="listarCompradorInactivo()">
                        <q-item-section>Listar Inactivos</q-item-section>
                    </q-item>
                </q-list>
            </q-btn-dropdown>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color:#009B44; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar Comprador" : "Editar Comprador " }}
                        </div>
                    </q-card-section>
                    <q-select outlined v-model="idProduccion" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="options" @filter="filterFn"
                        label="Selecciona el nombre de la Produccion">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-input outlined v-model="especie" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="especie " type="text" />
                    <q-input outlined v-model="nombre" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Nombre del comprador" type="text" />
                        <q-select outlined v-model="tipoDocumento" :options="['Cédula Ciudadanía','NIT','Pasaporte','otro']" label="Seleccione el tipo de documento"
                        class="q-my-md q-mx-md" />
                    <q-input outlined v-model="documento" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="documento del comprador" type="tel" required pattern="[0-9]+"
                        maxlength="10" />
                    <q-input outlined v-model="telefono" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="telefono del comprador" type="tel" required pattern="[0-9]+"
                        maxlength="10" />   
                    <q-input outlined v-model="direccion" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Direccion del comprador" type="text" />
                        <q-input outlined v-model="cantidad" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="cantidad" type="number" />   
                    <q-input outlined v-model="nguiaTransporte" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="N° de guia de Transporte del comprador" type="text" /> 
                    <q-input outlined v-model="valor" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="valor" type="number" />    
                    <q-card-actions align="right">
                        <q-btn v-if="accion === 1" @click="validarComprador()" color="red" class="text-white"
                            :loading="useComprador.loading">Agregar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn v-if="accion !== 1" @click="validarEdicionComprador()" color="red" class="text-white"
                            :loading="useComprador.loading">
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
            <q-table title="Compradores" title-class="text-green text-weight-bolder text-h4"
                table-header-class="text-black font-weight-bold" :rows="rows" :columns="columns" row-key="name"
                style="width: 90%; margin-bottom: 5%;">
                <template v-slot:body-cell-estado="props">
                    <q-td :props="props">
                        <p style="color: green;" v-if="props.row.estado == 1">Activo</p>
                        <p style="color: red;" v-else>Inactivo</p>
                    </q-td>
                </template>
                <template v-slot:body-cell-opciones="props">
                    <q-td :props="props">
                        <div style="display: flex; gap:15px; justify-content: center; ">

                            <!-- boton de editar -->
                            <q-btn color="primary" @click="traerComprador(props.row)">
                                <q-tooltip>
                                    Editar
                                </q-tooltip>
                                <i class="fas fa-pencil-alt"> </i></q-btn>
                                <!-- botons de activado y desactivado -->
                                <q-btn v-if="props.row.estado == 1" @click="deshabilitarComprador(props.row)" color="negative">
                                  <q-tooltip> Desactivar </q-tooltip>
                                  <i class="fas fa-times"> </i></q-btn>
                                <q-btn v-else color="positive" @click="habilitarComprador(props.row)">
                                  <q-tooltip> Activar </q-tooltip><i class="fas fa-check"> </i></q-btn>
                        </div>
                    </q-td>
                </template>
            </q-table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Notify } from 'quasar';
import { useCompradorStore } from "../stores/comprador.js";
import { useProduccionStore } from "../stores/produccion.js"



const useComprador = useCompradorStore();
const useProduccion = useProduccionStore();

let rows = ref([]);
let alert = ref(false);
let id = ref('');
let accion = ref(1);
let idProduccion = ref('');
let especie = ref('');
let nombre = ref('');
let tipoDocumento = ref('');
let documento = ref('');
let telefono = ref('');
let direccion = ref('');
let cantidad = ref('');
let nguiaTransporte = ref('');
let valor = ref('');

function abrir() {
    accion.value = 1
    alert.value = true;
    Limpiar()
}

function cerrar() {
    alert.value = false;
}

const columns = ref([
    {
        name: 'idProduccion',
        required: true,
        label: 'Produccion',
        align: 'center',
        field: (row) => row.idProduccion.producto,
        sortable: true
    },
    {
    name: "createdAt",
    required: true,
    label: "Fecha ",
    align: "center",
    field: "createdAt",
    sortable: true,
    format: (val) => {
      if (!val) return "";

      const fechaIngreso = new Date(val);
      const fechaColombia = new Date(
        fechaIngreso.toLocaleString("en-US", { timeZone: "America/Bogota" })
      );

      return (
        fechaColombia.toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }) +
        " " +
        fechaColombia.toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    },
  },
   {
        name: 'especie',
        required: true,
        label: 'especie',
        align: 'center',
        field: 'especie',
        sortable: true
    },
    {
        name: 'nombre',
        required: true,
        label: 'Nombre del Comprador',
        align: 'center',
        field: 'nombre',
        sortable: true
    },
    
    {
        name: 'tipoDocumento',
        required: true,
        label: 'tipo Documento',
        align: 'center',
        field: 'tipoDocumento',
        sortable: true
    },
    {
        name: 'documento',
        required: true,
        label: 'N° documento',
        align: 'center',
        field: 'documento',
        sortable: true
    },
    {
        name: 'telefono',
        required: true,
        label: 'telefono',
        align: 'center',
        field: 'telefono',
        sortable: true
    },
    
    {
        name: 'direccion',
        required: true,
        label: 'direccion',
        align: 'center',
        field: 'direccion',
        sortable: true
    },
    {
        name: 'cantidad',
        required: true,
        label: ' cantidad',
        align: 'center',
        field: 'cantidad',
        sortable: true
    },
    {
        name: 'nguiaTransporte',
        required: true,
        label: 'nguiaTransporte',
        align: 'center',
        field: 'nguiaTransporte',
        sortable: true
    },
    
    {
        name: 'valor',
        required: true,
        label: 'valor',
        align: 'center',        
        field: 'valor',
        sortable: true,
            format: (val) => {
            if (val === null || val === undefined) return '';
            return Number(val).toLocaleString('es-ES'); 
        }
    },
    {
        name: 'estado',
        required: true,
        label: 'Estado',
        align: 'center',
        field: 'estado',
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



let produccion = []
let datos = {}
const options = ref(produccion)

async function listarProduccion() {
    const data = await useProduccion.listarProduccion()
    data.data.produccion.forEach(item => {
        datos = {
            label: `${item?.producto} - ${item.numLote} `,
            value: item._id

        };
        produccion.push(datos);
    })
    console.log(produccion);

}

function filterFn(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        options.value = produccion.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });
};




async function listarComprador() {
    const r = await useComprador.listarComprador()
    rows.value = r.data.comprador.reverse()
    console.log(r.data.comprador)
}
const ListarCompradorActivo = async () => {
    try {
        const res = await useComprador.ListarCompradorActivo();
        rows.value =  res.compradores.reverse();
        Notify.create({
            message: "Listado de Compradores Activos",
            color: "green",
        });
        // console.log("hola");


    } catch (error) {
        console.error("Error al listar Compradores activos:", error);
        Notify.create("Error al obtener Comprador de Usuarios activos");
    }
};

const listarCompradorInactivo = async () => {
    try {
        const res = await useComprador.ListarCompradorInactivo();
        rows.value = res.compradores.reverse();
        Notify.create({
            message: "Listado de Compradores Inactivos",
            color: "green",
        });
    } catch (error) {
        console.error("Error al listar Compradores inactivos:", error);
        Notify.create("Error al obtener listado de Compradores inactivos");
    }
};
function validarComprador() {
    let validacionnumeros = /^[0-9]+$/; 
    if (idProduccion.value == "") {
        Notify.create("Se debe agregar el numero de la Produccion");
    } else if (especie.value == "" || especie.value.trim().length === 0) {
        Notify.create("Se debe agregar especie");
    } else if (nombre.value == "" || nombre.value.trim().length === 0) {
      Notify.create("Se debe agregar un nombre de Comprdor");
    } else if (tipoDocumento.value == "" || tipoDocumento.value.trim().length === 0) {
        Notify.create("Se debe agregar el tipo de Documento ");
    }else if (documento.value == "" || documento.value.trim().length === 0) {
      Notify.create("Se debe agregar un documento del Comprador");
    } else if (!validacionnumeros.test(documento.value)) {
      Notify.create("El documento solo debe llevar numeros");
    } else if (telefono.value == "" ) {
      Notify.create("Se debe agregar un telefono del Comprador");
    } else if (!validacionnumeros.test(telefono.value)) {
      Notify.create("El telefono solo debe llevar numeros");
    }  else if (direccion.value == "" || direccion.value.trim().length === 0) {
      Notify.create("Se debe agregar una direccion del comprador");
    } else if (cantidad.value == "" || cantidad.value.trim().length === 0) {
      Notify.create("Se debe agregar cantidad");
    } else if (!validacionnumeros.test(cantidad.value)) {
      Notify.create("El cantidad solo debe llevar numeros");
    } else if (nguiaTransporte.value == "" || nguiaTransporte.value.trim().length === 0) {
        Notify.create("Se debe agregar un N° guia Transporte");
    } else if (valor.value == "" ||valor.value.trim().length === 0) {
      Notify.create("Se debe agregar valor");
    } else if (!validacionnumeros.test(valor.value)) {
      Notify.create("El cantidad solo debe llevar numeros");
    } else {
        Notify.create({
            type: "positive",
            message: "Comprador agregado exitosamente",
        });
        cerrar()
        agregarComprador()

    }
}

function traerComprador(comprador) {
    accion.value = 2
    alert.value = true
    id.value = comprador._id
    idProduccion.value = {
        label: comprador.idProduccion.producto,
        value: comprador.idProduccion._id
    }
    especie.value = comprador.especie
    nombre.value = comprador.nombre
    tipoDocumento.value = comprador.tipoDocumento
    documento.value = comprador.documento
    telefono.value = comprador.telefono
    direccion.value = comprador.direccion
    cantidad.value = comprador.cantidad
    nguiaTransporte.value = comprador.nguiaTransporte
    valor.value = comprador.valor
}

function validarEdicionComprador() {
    
    let validacionnumeros = /^[0-9]+$/; 
    if (idProduccion.value == "") {
        Notify.create("Se debe agregar el numero de la Produccion");
    } else if (especie.value == "" || especie.value.trim().length === 0) {
        Notify.create("Se debe agregar especie");
    } else if (nombre.value == "" || nombre.value.trim().length === 0) {
      Notify.create("Se debe agregar un nombre de Comprdor");
    } else if (tipoDocumento.value == "" || tipoDocumento.value.trim().length === 0) {
        Notify.create("Se debe agregar el tipo de Documento ");
    }else if (documento.value == "" ) {
      Notify.create("Se debe agregar un documento del Comprador");
    } else if (!validacionnumeros.test(documento.value)) {
      Notify.create("El documento solo debe llevar numeros");
    } else if (telefono.value == "" ) {
      Notify.create("Se debe agregar un telefono del Comprador");
    } else if (!validacionnumeros.test(telefono.value)) {
      Notify.create("El telefono solo debe llevar numeros");
    }  else if (direccion.value == "" || direccion.value.trim().length === 0) {
      Notify.create("Se debe agregar una direccion del comprador");
    } else if (cantidad.value == "" ) {
      Notify.create("Se debe agregar cantidad");
    } else if (!validacionnumeros.test(cantidad.value)) {
      Notify.create("El cantidad solo debe llevar numeros");
    } else if (nguiaTransporte.value == "" || nguiaTransporte.value.trim().length === 0) {
        Notify.create("Se debe agregar un N° guia Transporte");
    } else if (valor.value == "" ) {
      Notify.create("Se debe agregar valor");
    } else if (!validacionnumeros.test(valor.value)) {
      Notify.create("El cantidad solo debe llevar numeros");
    } else {
        Notify.create({
            type: "positive",
            message: "Comprador agregado exitosamente",
        });
        cerrar()
        editarComprador()

    }
}


async function editarComprador() {
    try {
        await useComprador.putcomprador(id.value, {
            idProduccion: idProduccion.value.value,
            especie: especie.value,
            nombre: nombre.value,
            tipoDocumento: tipoDocumento.value,
            documento: documento.value,
            telefono: telefono.value,
            direccion: direccion.value,
            cantidad: cantidad.value,
            nguiaTransporte: nguiaTransporte.value,
            valor: valor.value
        })
        listarComprador()

    } catch (error) {
        console.error('Error de actualizar Comprador', error)
        Notify.create('Ocurrio un error al editar datos del Comprador')
    }
}

async function agregarComprador() {
    const r = await useComprador.postComprador({
        idProduccion: idProduccion.value.value,
            especie: especie.value,
            nombre: nombre.value,
            tipoDocumento: tipoDocumento.value,
            documento: documento.value,
            telefono: telefono.value,
            direccion: direccion.value,
            cantidad: cantidad.value,
            nguiaTransporte: nguiaTransporte.value,
            valor: valor.value
    })
    cerrar()
    listarComprador()
    console.log(r);
}



async function habilitarComprador(comprador) {
    const res = await useComprador.putCompradorActiva(comprador._id)
        .then((response) => {
            console.log(response);
            listarComprador()
        })

        .catch((error) => {
            console.error('Error de Comprador', error);
            Notify.create('Error al habilitar el Comprador')
        })
}

async function deshabilitarComprador(comprador) {
    const res = await useComprador.putCompradorInactiva(comprador._id)
        .then((response) => {
            console.log(response);
            listarComprador()
        })

        .catch((error) => {
            console.error('Error de Comprador', error);
            Notify.create('Error al deshabilitar el Comprador')
        })
}

function Limpiar() {
    idProduccion.value = ""
    especie.value = ""
    nombre.value = ""
    tipoDocumento.value = ""
    documento.value = ""
    telefono.value = ""
    direccion.value = ""
    cantidad.value = ""
    nguiaTransporte.value = ""
    valor.value = ""
}

onMounted(() => {
    listarComprador()
    listarProduccion()



})

</script>