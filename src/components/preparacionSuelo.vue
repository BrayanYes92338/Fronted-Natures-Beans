<template>
    <div>
        <div style="display: flex; justify-content: flex-end;margin-left: 5%;  margin-right: 5%">
            <q-btn style="background-color: #00C04F; color: white;" class="q-my-md q-ml-md" @click="abrir()">Registrar
                Preparacion Suelos</q-btn>


        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color:#009B44; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Agregar PreparacionSuelo" : "Editar PreparacionSuelo " }}
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
                    <q-select outlined v-model="idEmpleadooperario" use-input hide-selected fill-input
                        input-debounce="0" class="q-my-md q-mx-md" :options="opciones" @filter="filtrarFn"
                        label="Selecciona el oprerario">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey"> Sin resultados </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-input outlined v-model="observaciones" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Observaciones" type="text" />

                    <q-card-actions align="right">
                        <q-btn v-if="accion === 1" @click="validarIngresoPreparacionSuelo()" color="red"
                            class="text-white" :loading="usePreparacionSuelo.loading">Agregar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn v-if="accion !== 1" @click="validarEdicionPreparacionSuelo()" color="red"
                            class="text-white" :loading="usePreparacionSuelo.loading">
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
        <!-- Modal para agregar productos -->
        <div>
            <q-dialog persistent v-model="alerta">
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #009b44; margin-bottom: 20px">
                        <div class="text-h6 text-white">Agregar Productos {{ nombreF }}</div>
                    </q-card-section>
                    <q-input outlined v-model="ingredienteActivo" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ingrese el ingrediente Activo" type="text" />
                    <q-input outlined v-model="dosis" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ingrese la dosis" type="text" />
                    <q-input outlined v-model="metodoAplicacion" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ingrese el metodo Aplicacion" type="text" />
                    <q-card-actions align="right">
                        <q-btn color="red" class="text-white" :loading="usePreparacionSuelo.loading"
                            @click="agregarProductos()">
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
        <!-- Modelo Para editar Datos de productos -->
        <div>
            <q-dialog persistent v-model="alerta2">
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #009b44; margin-bottom: 20px">
                        <div class="text-h6 text-white">Editar productos {{ nombreF }}</div>
                    </q-card-section>
                    <q-input outlined v-model="ingredienteActivo" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ingrese el ingrediente Activo" type="text" />
                    <q-input outlined v-model="dosis" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ingrese la dosis" type="text" />
                    <q-input outlined v-model="metodoAplicacion" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ingrese el metodo Aplicacion" type="text" />

                    <q-card-actions align="right">
                        <q-btn color="red" class="text-white" :loading="usePreparacionSuelo.loading"
                            @click="editarProductos()">
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
        <!-- Tabla de los seguimientos de la productos-->
        <div>
            <q-dialog v-model="modalProducto" persistent full-width>
                <q-card class="">
                    <q-card-section style="background-color:#009B44; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            Producto {{ nombreF }}
                        </div>
                    </q-card-section>
                    <!----><q-table v-if="productos.length > 0" table-header-class="text-black font-weight-bold"
                        :rows="productos" :columns="columnas" row-key="name">
                        <template v-slot:body-cell-opciones="props">
                            <q-td :props="props">
                                <div style="display: flex; gap:15px; justify-content: center; ">
                                    <!-- boton de editar -->
                                    <q-btn color="primary" @click="traerDatosProductos(props.row)">
                                        <q-tooltip>
                                            Editar productos
                                        </q-tooltip>
                                        <i class="fas fa-pencil-alt">
                                        </i></q-btn>
                                </div>
                            </q-td>
                        </template>
                    </q-table>
                    <h4 v-else>La Preparacion de Suelo {{ nombreF }}, aun no tiene registrado los productos</h4>
                    <q-card-actions align="right">
                        <q-btn @click="abrir2(props?.row)" v-if="productos.length === 0" color="green"
                            class="text-white" :loading="usePreparacionSuelo.loading">
                            Agregar productos
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn @click="cerrar2()" color="red" class="text-white" :loading="usePreparacionSuelo.loading">
                            Cerrar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>

        <div style="display: flex; justify-content: center">
            <q-table title="Preparacion Suelo" title-class="text-green text-weight-bolder text-h4"
                table-header-class="text-black font-weight-bold" :rows="rows" :columns="columns" row-key="name"
                style="width: 90%;">
                <template v-slot:body-cell-observaciones="props">
                    <q-td :props="props">
                        <!-- VDropdown para mostrar el tooltip al hacer clic -->
                        <VDropdown :distance="6" v-model="props.row.showDropdown">
                            <!-- Botón que activará el dropdown -->
                            <q-btn flat dense @click="toggleDropdown(props.row)">
                                <!-- Controlamos que no se muestre en mayúsculas -->
                                <span style="text-transform: none;">
                                    {{ props.row.observaciones.length > 10 ? props.row.observaciones.substring(0, 10) +
                                    '...' : props.row.observaciones }}
                                </span>
                            </q-btn>

                            <!-- Contenido del popper (dropdown) con estilos personalizados -->
                            <template #popper>
                                <div class="custom-tooltip-content"
                                    style="max-height: 200px; max-width: 200px; overflow-y: auto; padding: 10px;">
                                    <!-- Eliminamos 'https://' y aplicamos el color azul automáticamente como los enlaces -->
                                    <a :href="props.row.observaciones" target="_blank">
                                        {{ props.row.observaciones }}
                                    </a>
                                </div>
                            </template>
                        </VDropdown>
                    </q-td>
                </template>
                <template v-slot:body-cell-opciones="props">
                    <q-td :props="props">
                        <div style="display: flex; gap:15px; justify-content: center; ">
                            <q-btn color="green" @click="abrirProducto(props.row)">
                                <q-tooltip>
                                    Ver productos
                                </q-tooltip>
                                <i class="fas fa-map-marker-alt"></i>
                            </q-btn>
                            <!-- boton de editar -->
                            <q-btn color="primary" @click="traerPreparacionSuelo(props.row)">
                                <q-tooltip>
                                    Editar
                                </q-tooltip>
                                <i class="fas fa-pencil-alt">
                                </i></q-btn>
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
import { usePreparacionSueloStore } from "../stores/preparacionSuelo.js"
import { useParcelaStore } from "../stores/parcelas.js"
import { useEmpleadoStore } from "../stores/empleado.js"


const usePreparacionSuelo = usePreparacionSueloStore();
const useParcela = useParcelaStore();
const useEmpleado = useEmpleadoStore();



const showTooltip = ref(false);
let rows = ref([]);
let alert = ref(false);
let id = ref('');
let accion = ref(1);
let idParcela = ref("");
let idEmpleadooperario = ref("");
let ingredienteActivo = ref("");
let dosis = ref("");
let metodoAplicacion = ref("");
let productos = ref([]);
let observaciones = ref("");
let nombreF = ref("")
let modalProducto = ref(false);
let alerta = ref(false)
let idProducto = ref("")
let idDeProductos = ref("")
let alerta2 = ref(false)


function abrir() {
    accion.value = 1
    alert.value = true;
}

function abrir2() {
    alerta.value = true;
    modalProducto.value = false;
}

function cerrar() {
    alert.value = false;
    Limpiar()
}

function cerrar2() {
    modalProducto.value = false;
    Limpiar()

}

function cerrar3() {
    alerta.value = false;
    modalProducto.value = true;
}


function cerrar4() {
    alerta2.value = false;
    modalProducto.value = true;

}

function abrirProducto(preparacion) {
    modalProducto.value = true;
    idDeProductos.value = preparacion._id
    productos.value = preparacion.productos
    nombreF.value = preparacion.nombre
}

let columnas = ref([
    {
        name: 'ingredienteActivo',
        required: true,
        label: 'Ingrediente Activo',
        align: 'center',
        field: 'ingredienteActivo',
        sortable: true,
        format: val => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
    },
    {
        name: 'dosis',
        required: true,
        label: 'Dosis',
        align: 'center',
        field: 'dosis',
        sortable: true,
        format: val => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
    },
    {
        name: 'metodoAplicacion',
        required: true,
        label: 'Metodo Aplicacion',
        align: 'center',
        field: 'metodoAplicacion',
        sortable: true,
        format: val => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
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

// Listar productos


function traerDatosProductos(data) {
    alerta2.value = true;
    ingredienteActivo.value = data.ingredienteActivo;
    dosis.value = data.dosis;
    metodoAplicacion.value = data.metodoAplicacion;
    idProducto.value = data._id
    console.log(data)

}



async function agregarProductos() {
    try {
        if (ingredienteActivo.value == "" || ingredienteActivo.value.trim().length === 0) {
            Notify.create("Se debe agregar el ingrediente Activo");
        } else if (dosis.value == "" || dosis.value.trim().length === 0) {
            Notify.create("Se debe agregar la dosis");
        } else if (metodoAplicacion.value == "" || metodoAplicacion.value.trim().length === 0) {
            Notify.create("Se debe agregar el metodo Aplicacion");
        } else {
            let nuevosProductos = {
                ingredienteActivo: ingredienteActivo.value,
                dosis: dosis.value,
                metodoAplicacion: metodoAplicacion.value,
            }
            productos.value.push(nuevosProductos)
            await usePreparacionSuelo.putPreparacionSuelo(idDeProductos.value, {
                productos: productos.value
            })
            listarPreparacionSuelo()
            cerrar3()

        }
    } catch (error) {
        console.error('Error de productos', error)
        Notify.create('Ocurrio un error al ingresar datos de productos')
    }
}

async function editarProductos() {
    try {
        if (ingredienteActivo.value == "" || ingredienteActivo.value.trim().length === 0) {
            Notify.create("Se debe agregar el ingrediente Activo");
        } else if (dosis.value == "" || dosis.value.trim().length === 0) {
            Notify.create("Se debe agregar la dosis");
        } else if (metodoAplicacion.value == "" || metodoAplicacion.value.trim().length === 0) {
            Notify.create("Se debe agregar el metodo Aplicacion");
        } else {
            for (let i = 0; i < productos.value.length; i++) {
                const info = productos.value[i]

                if (info._id === idProducto.value) {
                    info.ingredienteActivo = ingredienteActivo.value
                    info.dosis = dosis.value
                    info.metodoAplicacion = metodoAplicacion.value
                    break
                }
            }
            alerta2.value = false
            await usePreparacionSuelo.putPreparacionSuelo(idDeProductos.value, {
                productos: productos.value
            })
            listarPreparacionSuelo()
        }

    } catch (error) {
        console.error('Error de Preparacion Suelo', error)
        Notify.create('Ocurrio un error al editar datos de la Preparacion Suelo')
    }
}


const columns = ref([
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
        name: "idParcela",
        required: true,
        label: "Nombre de la Parcela",
        align: "center",
        field: (row) => row.idParcela.detalle,
        sortable: true,
    },
    {
        name: "idEmpleadooperario",
        required: true,
        label: "Nombre del Operario",
        align: "center",
        field: (row) => row.idEmpleadooperario.nombre,
        sortable: true,
    },
    {
        name: 'observaciones',
        required: true,
        label: 'Observaciones',
        align: 'center',
        field: 'observaciones',
        sortable: true,
        format: (val) => {
            // Capitalizar la primera letra del responsable
            return val.charAt(0).toUpperCase() + val.slice(1);
        }
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


//  listar empleados
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


// Listar PreparacionSuelo Estados PreparacionSuelo


async function listarPreparacionSuelo() {
    const r = await usePreparacionSuelo.listarPreparacionSuelo()
    rows.value = r.data.preparacion.reverse()
    console.log(r.data.preparacion);
};



function validarIngresoPreparacionSuelo() {
    if (idParcela.value == "") {
        Notify.create("Se debe seleccionar Parcela");
    } else if (idEmpleadooperario.value == null) {
        Notify.create("Se debe seleccionar el Operario");
    } else if (observaciones.value == "" || observaciones.value.trim().length === 0) {
        Notify.create("Se debe agregar observaciones");
    } else {
        agregarPreparacionSuelo();
        cerrar();
        Notify.create({
            type: "positive",
            message: "PreparacionSuelo agregada exitosamente",
        });
    }
}



async function agregarPreparacionSuelo() {
    const r = await usePreparacionSuelo.postPreparacionSuelo({
        idParcela: idParcela.value.value,
        idEmpleadooperario: idEmpleadooperario.value.value,
        observaciones: observaciones.value,
    })
    cerrar()
    Limpiar()
    listarPreparacionSuelo()
    console.log(r);
}

function traerPreparacionSuelo(preparacion) {
    alert.value = true;
    accion.value = 2;
    id.value = preparacion._id;
    idParcela.value = {
        label: preparacion.idParcela.detalle,
        value: preparacion.idParcela._id
    };
    idEmpleadooperario.value = {
        label: preparacion.idEmpleadooperario.nombre,
        value: preparacion.idEmpleadooperario._id,
    };
    observaciones.value = preparacion.observaciones;
}



function validarEdicionPreparacionSuelo() {
    if (idParcela.value == "") {
        Notify.create("Se debe seleccionar Parcela");
    } else if (idEmpleadooperario.value == null) {
        Notify.create("Se debe seleccionar el Operario");
    } else if (observaciones.value == "" || observaciones.value.trim().length === 0) {
        Notify.create("Se debe agregar observaciones");
    } else {
        editarPreparacionSuelo()
        Limpiar()
        cerrar()
        Notify.create({
            type: "positive",
            message: "Edicion de Preparacion Suelo agregada exitosamente",
        });
    }
}

async function editarPreparacionSuelo() {
    try {
        await usePreparacionSuelo.putPreparacionSuelo(id.value, {

            idParcela: idParcela.value.value,
            idEmpleadooperario: idEmpleadooperario.value.value,
            observaciones: observaciones.value,
        })
        listarPreparacionSuelo()
    } catch (error) {
        console.error('Error de actualizar Preparacion Suelo', error)
        Notify.create('Ocurrio un error al editar datos de la Preparacion Suelo')
    }
}

function Limpiar() {
    idParcela.value = ""
    idEmpleadooperario.value = ""
    productos.value = ""
    ingredienteActivo.value = ""
    dosis.value = ""
    metodoAplicacion.value = ""
    observaciones.value = ""
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
    listarPreparacionSuelo()
    listarParcela()
    listarEmpleados()

})

</script>