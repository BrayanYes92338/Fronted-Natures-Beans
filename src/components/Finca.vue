<template>
    <div>
        <div style="display: flex; justify-content: flex-end;margin-left: 5%;  margin-right: 5%">
            <q-btn style="background-color: #00C04F; color: white;" class="q-my-md q-ml-md" @click="abrir()">Registrar
                Finca</q-btn>
            <q-btn-dropdown color="blue" icon="visibility" label="Filtrar"
                style="display: flex; justify-content: center; align-items: center; margin-left: 16px;height: 20px;"
                class="q-my-md q-ml-md">
                <q-list>
                    <q-item clickable v-ripple @click="listarFincas()">
                        <q-item-section>Listar Todos</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="listarFincasActivas()">
                        <q-item-section>Listar Activos</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="listarFincasInactivas()">
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
                            {{ accion == 1 ? "Agregar Finca" : "Editar Finca " }}
                        </div>
                    </q-card-section>
                    <q-select outlined v-model="idUsuario" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="options" @filter="filterFn"
                        label="Selecciona el Responsable de la Finca">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-input outlined v-model="nombre" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Nombre de la Finca" type="text" />
                    <q-input outlined v-model="ruc" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="R.U.C de la Finca" type="tel" required pattern="[0-9]+"
                        maxlength="10" />
                    <q-select outlined v-model="departamento" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="opcionesDepa" @filter="filterFnDepa"
                        @update:model-value="onDepartmentChange" label="Selecciona el Departamento donde está la Finca">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-select outlined v-model="ciudad" use-input hide-selected fill-input input-debounce="0"
                        :disable="!departamento" @filter="filterFnMun" :options="opcionesMun" class="q-my-md q-mx-md"
                        label="Selecciona la Ciudad donde está la Finca">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <q-input outlined v-model="direccion" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Direccion donde esta la Finca" type="text" />
                    <q-input outlined v-model="ubicacion" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ubicacion donde esta la Finca" type="text" />
                    <q-input outlined v-model="area" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Area de la Finca" type="text" />
                    <q-card-actions align="right">
                        <q-btn v-if="accion === 1" @click="validarIngresoFincas()" color="red" class="text-white"
                            :loading="useFinca.loading">Agregar
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>
                        <q-btn v-if="accion !== 1" @click="validarEdicionFinca()" color="red" class="text-white"
                            :loading="useFinca.loading">
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
        <!-- Modal para agregar Limites de la fFinca -->
        <div>
            <q-dialog persistent v-model="alerta">
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #009b44; margin-bottom: 20px">
                        <div class="text-h6 text-white">Agregar Limites de la Finca {{ nombreF }}</div>
                    </q-card-section>
                    <q-input outlined v-model="norte" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ingrese el Norte de la Finca" type="text" />
                    <q-input outlined v-model="sur" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ingrese el Sur de la Finca" type="text" />
                    <q-input outlined v-model="este" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ingrese el Este de la Finca" type="text" />
                    <q-input outlined v-model="oeste" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ingrese el Oeste de la Finca" type="text" />
                    <q-card-actions align="right">
                        <q-btn color="red" class="text-white" :loading="useFinca.loading" @click="agregarLimitesFinca()" >
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
        <!-- Modelo Para editar Datos de Limite de la Finca -->
        <div>
            <q-dialog persistent v-model="alerta2">
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #009b44; margin-bottom: 20px">
                        <div class="text-h6 text-white">Editar Limites de la Finca {{ nombreF }}</div>
                    </q-card-section>
                    <q-input outlined v-model="norte" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ingrese el Norte de la Finca" type="text" />
                    <q-input outlined v-model="sur" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ingrese el Sur de la Finca" type="text" />
                    <q-input outlined v-model="este" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ingrese el Este de la Finca" type="text" />
                    <q-input outlined v-model="oeste" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" label="Ingrese el Oeste de la Finca" type="text" />
                    <q-card-actions align="right">
                        <q-btn color="red" class="text-white" :loading="useFinca.loading" @click="editarLimitesFinca()" >
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
        <!-- Tabla de los seguimientos de la Finca -->
        <div>
            <q-dialog v-model="modalLimite" persistent full-width>
                <q-card class="">
                    <q-card-section style="background-color:#009B44; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            Limites de la finca {{ nombreF }}
                        </div>
                    </q-card-section>
                    <q-table v-if="limites.length > 0" table-header-class="text-black font-weight-bold" :rows="limites"
                        :columns="columnas" row-key="name">
                        <template v-slot:body-cell-opciones="props">
                            <q-td :props="props">
                                <div style="display: flex; gap:15px; justify-content: center; ">
                                    <!-- boton de editar -->
                                    <q-btn color="primary" @click="traerDatosLimites(props.row)">
                                        <q-tooltip>
                                            Editar Limites de Finca
                                        </q-tooltip>
                                        <i class="fas fa-pencil-alt">
                                        </i></q-btn>
                                </div>
                            </q-td>
                        </template>
                    </q-table>
                    <h4 v-else>La Finca {{ nombreF }}, aun no tiene registrado los limites</h4>
                    <q-card-actions align="right">
                        <q-btn @click="abrir2(props?.row)" color="green" class="text-white" :loading="useFinca.loading">
                            Agregar Limites de la Finca
                            <template v-slot:loading>
                                <q-spinner color="primary" size="1em" />
                            </template>
                        </q-btn>


                        <q-btn @click="cerrar2()" color="red" class="text-white" :loading="useFinca.loading">
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
            <q-table title="Fincas" title-class="text-green text-weight-bolder text-h4"
                table-header-class="text-black font-weight-bold" :rows="rows" :columns="columns" row-key="name"
                style="width: 90%;">
                <template v-slot:body-cell-estado="props">
                    <q-td :props="props">
                        <p style="color: green;" v-if="props.row.estado == 1">Activo</p>
                        <p style="color: red;" v-else>Inactivo</p>
                    </q-td>
                </template>
                <template v-slot:body-cell-opciones="props">
                    <q-td :props="props">
                        <div style="display: flex; gap:15px; justify-content: center; ">
                            <q-btn color="green" @click="abrirLimites(props.row)">
                                <q-tooltip>
                                    Ver Limites de la Finca
                                </q-tooltip>
                                <i class="fas fa-map-marker-alt"></i>
                            </q-btn>
                            <!-- boton de editar -->
                            <q-btn color="primary" @click="traerFincas(props.row)">
                                <q-tooltip>
                                    Editar
                                </q-tooltip>
                                <i class="fas fa-pencil-alt">
                                </i></q-btn>
                            <!-- botons de activado y desactivado -->
                            <q-btn v-if="props.row.estado == 1" @click="deshabilitarFinca(props.row)" color="negative">
                                <q-tooltip>
                                    Desacticar
                                </q-tooltip>
                                <i class="fas fa-times">
                                </i></q-btn>
                            <q-btn v-else color="positive" @click="habilitarFinca(props.row)">
                                <q-tooltip>
                                    Activar
                                </q-tooltip><i class="fas fa-check"></i>
                            </q-btn>
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
import { useUsuarioStore } from "../stores/usuario.js"
import { useFincaStore } from "../stores/finca.js"
import { useDepartamentoStore } from "../stores/departamento.js"

const useUsuario = useUsuarioStore();
const useFinca = useFincaStore();
const useDepartamento = useDepartamentoStore()

let rows = ref([]);
let alert = ref(false);
let id = ref('');
let accion = ref(1);
let idUsuario = ref("");
let nombre = ref("");
let ruc = ref("");
let departamento = ref("");
let ciudad = ref("");
let direccion = ref("");
let ubicacion = ref("");
let limites = ref([]);
let norte = ref("");
let sur = ref("");
let este = ref("");
let oeste = ref("");
let area = ref("");
let nombreF = ref("")
let modalLimite = ref(false);
let alerta = ref(false)
let idLimite = ref("")
let idLimite2 = ref("")
let alerta2 = ref(false)


function abrir() {
    accion.value = 1
    alert.value = true;
}

function abrir2(data) {
    alerta.value = true;
    modalLimite.value = false;
}

function cerrar() {
    alert.value = false;
    Limpiar()
}

function cerrar2() {
    modalLimite.value = false;
    Limpiar()

}

function cerrar3() {
    alerta.value = false;
    modalLimite.value = true;
}


function cerrar4() {
    alerta2.value = false;
    modalLimite.value = true;

}

function abrirLimites(finca) {
    modalLimite.value = true;
    idLimite.value = finca._id
    limites.value = finca.limites
    nombreF.value = finca.nombre
}

let columnas = ref([
    {
        name: 'norte',
        required: true,
        label: 'Norte Finca',
        align: 'center',
        field: 'norte',
        sortable: true
    },
    {
        name: 'sur',
        required: true,
        label: 'Sur Finca',
        align: 'center',
        field: 'sur',
        sortable: true
    },
    {
        name: 'este',
        required: true,
        label: 'Este Finca',
        align: 'center',
        field: 'este',
        sortable: true
    },
    {
        name: 'oeste',
        required: true,
        label: 'Oeste Finca',
        align: 'center',
        field: 'oeste',
        sortable: true
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

// Listar Limites de cada Finca


function traerDatosLimites(data) {
    alerta2.value = true;
    norte.value = data.norte;
    sur.value = data.sur;
    este.value = data.este;
    oeste.value = data.oeste;
    idLimite.value = data._id

}



async function agregarLimitesFinca() {
    try {
        if (norte.value == "" || norte.value.trim().length === 0) {
            Notify.create("Se debe agregar la Logintud de la zona norte de la Finca");
        } else if (sur.value == "" || sur.value.trim().length === 0) {
            Notify.create("Se debe agregar la Logintud de la zona sur de la Finca");

        } else if (este.value == "" || este.value.trim().length === 0) {
            Notify.create("Se debe agregar la Logintud de la zona este de la Finca");
        } else if (oeste.value == "" || oeste.value.trim().length === 0) {
            Notify.create("Se debe agregar la Logintud de la zona oeste de la Finca");
        } else {
            let nuevosLimites = {
                norte: norte.value,
                sur: sur.value,
                este: este.value,
                oeste: oeste.value,
            }
            limites.value.push(nuevosLimites)
            await useFinca.putFincas(idLimite.value, {
                limites: limites.value
            })
            listarFincas()
            cerrar3()

        }
    } catch (error) {
        console.error('Error de Finca', error)
        Notify.create('Ocurrio un error al ingresar datos de la Finca')
    }
}

async function editarLimitesFinca() {
    try {
        if (norte.value == "" || norte.value.trim().length === 0) {
            Notify.create("Se debe agregar la Logintud de la zona norte de la Finca");
        } else if (sur.value == "" || sur.value.trim().length === 0) {
            Notify.create("Se debe agregar la Logintud de la zona sur de la Finca");

        } else if (este.value == "" || este.value.trim().length === 0) {
            Notify.create("Se debe agregar la Logintud de la zona este de la Finca");
        } else if (oeste.value == "" || oeste.value.trim().length === 0) {
            Notify.create("Se debe agregar la Logintud de la zona oeste de la Finca");
        } else {
            for (let i = 0; i < limites.value.length; i++) {
                const info = limites.value[i]
                if (info._id === idLimite) {
                    info.norte = norte.value
                    info.sur = sur.value
                    info.este = este.value
                    info.oeste = oeste.value
                    console.log(info);
                    break
                }
            }
            await useFinca.putFincas(idLimite.value, {
                limites: limites.value
            })
            listarFincas()
        }

    } catch (error) {
        console.error('Error de Finca', error)
        Notify.create('Ocurrio un error al editar datos de la Finca')
    }
}


const columns = ref([
    {
        name: 'idUsuario',
        required: true,
        label: 'Responsable de la Finca',
        align: 'center',
        field: (row) => row.idUsuario.nombre,
        sortable: true
    },
    {
        name: 'nombre',
        required: true,
        label: 'Nombre Finca',
        align: 'center',
        field: 'nombre',
        sortable: true
    },
    {
        name: 'ruc',
        required: true,
        label: 'R.U.C Finca',
        align: 'center',
        field: 'ruc',
        sortable: true
    },
    {
        name: 'departamento',
        required: true,
        label: 'Departamento',
        align: 'center',
        field: 'departamento',
        sortable: true
    },
    {
        name: 'ciudad',
        required: true,
        label: 'Municipio',
        align: 'center',
        field: 'ciudad',
        sortable: true
    },
    {
        name: 'direccion',
        required: true,
        label: 'Direccion Finca',
        align: 'center',
        field: 'direccion',
        sortable: true
    },
    {
        name: 'ubicacion',
        required: true,
        label: 'Ubicacion Finca',
        align: 'center',
        field: 'ubicacion',
        sortable: true
    },
    {
        name: 'area',
        required: true,
        label: 'Area Finca',
        align: 'center',
        field: 'area',
        sortable: true
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

// Listar Usuarios

let usuarios = []
let datos = {}
const options = ref(usuarios)

function filterFn(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        options.value = usuarios.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });
};

async function listarUsuarios() {
    const data = await useUsuario.listarUsuarioRol()
    data.data.usuario.forEach(item => {
        datos = {
            label: `${item?.nombre} - ${item.rol} `,
            value: item._id


        };
        usuarios.push(datos);
    });
    console.log(usuarios);

}

// Listar Departamentos

let Departamentos = []
let dateDep = {}
const opcionesDepa = ref(Departamentos)

function filterFnDepa(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        opcionesDepa.value = Departamentos.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });
};


async function ListarDepartamentos() {
    const data = await useDepartamento.listarDepartamento();
    Departamentos = data.data.map(item => ({
        label: item.departamento,
        value: item.ciudades
    }));
    opcionesDepa.value = [...Departamentos];
}

// Listar Municipios

let Municipios = [];
let dateMun = {};
const opcionesMun = ref(Municipios);

function onDepartmentChange(departamentoSeleccionado) {
    Municipios = departamentoSeleccionado ? departamentoSeleccionado.value.map(ciudad => ({
        label: ciudad,
        value: ciudad
    })) : [];
    opcionesMun.value = [...Municipios];
    ciudad.value = null;
}

function filterFnMun(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        opcionesMun.value = Municipios.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    });
}


// Listar Fincas Estados Fincas


async function listarFincas() {
    const r = await useFinca.listarFincas()
    rows.value = r.data.fincas.reverse()
    console.log(r.data.fincas);
};

async function listarFincasActivas() {
    try {
        const r = await useFinca.ListarFincasActivo()
        rows.value = r.FincaActiva.reverse()
        Notify.create({
            message: "Listado de Fincas Activas",
            color: "green",
        });
        console.log(r.FincaActiva)
    } catch (error) {
        console.error("Error al listar Fincas activas:", error);
        Notify.create("Error al obtener Fincas de Usuarios activas");
    }

}

async function listarFincasInactivas() {
    try {
        const r = await useFinca.ListarFincasInactivo()
        rows.value = r.FincaInactiva.reverse()
        Notify.create({
            message: "Listado de Fincas Inactivas",
            color: "green",
        });
        console.log(r.FincaInactiva)

    } catch (error) {
        console.error("Error al listar Fincas Inactivas:", error);
        Notify.create("Error al obtener Fincas de Usuarios Inactivas");
    }

}


function validarIngresoFincas() {
    let validacionnumeros = /^[0-9]+$/;
    if (idUsuario.value == "") {
        Notify.create("Se debe agregar un Responsable de la Finca");
    } else if (nombre.value == "" || nombre.value.trim().length === 0) {
        Notify.create("Se debe agregar un Nombre de la Finca");
    } else if (ruc.value == "") {
        Notify.create("Se debe agregar un R.U.C de la Finca");
    } else if (!validacionnumeros.test(ruc.value)) {
        Notify.create("El R.U.C de la Finca debe ser un número");
    } else if (!departamento.value || departamento.value.label.trim().length === 0) {
        Notify.create("Se debe agregar un Departamento de la Finca");
    } else if (!ciudad.value || ciudad.value.label.trim().length === 0) {
        Notify.create("Se debe agregar una Ciudad de la Finca");
    } else if (direccion.value == "" || direccion.value.trim().length === 0) {
        Notify.create("Se debe agregar una Dirección de la Finca");
    } else if (ubicacion.value == "" || ubicacion.value.trim().length === 0) {
        Notify.create("Se debe agregar una Ubicación de la Finca");
    } else if (area.value == "" || area.value.trim().length === 0) {
        Notify.create("Se debe agregar un Área de la Finca");
    } else {
        agregarFincas();
        cerrar();
        Notify.create({
            type: "positive",
            message: "Finca agregada exitosamente",
        });
    }
}



async function agregarFincas() {
    const r = await useFinca.postFincas({
        idUsuario: idUsuario.value.value,
        nombre: nombre.value,
        ruc: ruc.value,
        departamento: departamento.value.label,
        ciudad: ciudad.value.label,
        direccion: direccion.value,
        ubicacion: ubicacion.value,
        area: area.value
    })
    cerrar()
    Limpiar()
    listarFincas()
    console.log(r);
}

async function habilitarFinca(finca) {
    const res = await useFinca.putFincaActivar(finca._id)
        .then((response) => {
            console.log(response);
            listarFincas()
        })

        .catch((error) => {
            console.error('Error de Finca', error);
            Notify.create('Error al habilitar la Finca')
        })
}

async function deshabilitarFinca(finca) {
    const res = await useFinca.putFincaDesactivar(finca._id)
        .then((response) => {
            console.log(response);
            listarFincas()
        })

        .catch((error) => {
            console.error('Error de Finca', error);
            Notify.create('Error al deshabilitar la Finca')
        })
}


function traerFincas(finca) {
    alert.value = true;
    accion.value = 2;
    id.value = finca._id;
    idUsuario.value = {
        label: finca.idUsuario.nombre,
        value: finca.idUsuario._id
    };
    nombre.value = finca.nombre;
    ruc.value = finca.ruc;
    const departamentoSeleccionado = Departamentos.find(dep => dep.label === finca.departamento);
    departamento.value = departamentoSeleccionado;
    if (departamentoSeleccionado) {
        const ciudades = departamentoSeleccionado.value;
        const ciudadSeleccionada = ciudades.find(ciudad => ciudad === finca.ciudad);
        Municipios = ciudades.map(ciudad => ({ label: ciudad, value: ciudad }));
        opcionesMun.value = [...Municipios];
        ciudad.value = { label: ciudadSeleccionada, value: ciudadSeleccionada };
    }
    direccion.value = finca.direccion;
    ubicacion.value = finca.ubicacion;
    area.value = finca.area;
}



function validarEdicionFinca() {
    let validacionnumeros = /^[0-9]+$/;
    if (idUsuario.value == "") {
        Notify.create("Se debe agregar un Responsable de la Finca");
    } else if (nombre.value == "" || nombre.value.trim().length === 0) {
        Notify.create("Se debe agregar un Nombre de la Finca");
    } else if (ruc.value == "") {
        Notify.create("Se debe agregar un R.U.C de la Finca");
    } else if (!validacionnumeros.test(ruc.value)) {
        Notify.create("El R.U.C de la Finca debe ser un número");
    } else if (!departamento.value || departamento.value.label.trim().length === 0) {
        Notify.create("Se debe agregar un Departamento de la Finca");
    } else if (!ciudad.value || ciudad.value.label.trim().length === 0) {
        Notify.create("Se debe agregar una Ciudad de la Finca");
    } else if (direccion.value == "" || direccion.value.trim().length === 0) {
        Notify.create("Se debe agregar una Dirección de la Finca");
    } else if (ubicacion.value == "" || ubicacion.value.trim().length === 0) {
        Notify.create("Se debe agregar una Ubicación de la Finca");
    } else if (area.value == "" || area.value.trim().length === 0) {
        Notify.create("Se debe agregar un Área de la Finca");
    } else {
        editarFinca()
        Limpiar()
        cerrar()
        Notify.create({
            type: "positive",
            message: "Edicion de Finca agregada exitosamente",
        });
    }
}

async function editarFinca() {
    try {
        await useFinca.putFincas(id.value, {
            idUsuario: idUsuario.value.value,
            nombre: nombre.value,
            ruc: ruc.value,
            departamento: departamento.value.label,
            ciudad: ciudad.value.label,
            direccion: direccion.value,
            ubicacion: ubicacion.value,
            area: area.value
        })
        listarFincas()
    } catch (error) {
        console.error('Error de actualizar Finca', error)
        Notify.create('Ocurrio un error al editar datos de la finca')
    }
}

function Limpiar() {
    idUsuario.value = ""
    nombre.value = ""
    ruc.value = ""
    departamento.value = ""
    ciudad.value = ""
    direccion.value = ""
    ubicacion.value = ""
    area.value = ""
    norte.value = ""
    sur.value = ""
    este.value = ""
    oeste.value = ""
}


onMounted(() => {
    listarUsuarios()
    listarFincas()
    ListarDepartamentos()

})

</script>