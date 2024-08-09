<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white colorheader" height-hint="98">
      <q-toolbar>
        <q-btn v-if="useUsuario.token" dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title class="toolbar-title"></q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <div class="cuerpo">
        <div class="formulario" v-if="modal1">
          <q-form @submit="cambiar" class="form">
            <img src="../img/Nature Beans Logo v3.png" alt="Logo Natures Beans" class="loguito">
            <h3 class="titulo">Cambio de Contraseña</h3>
            <div class="input-group">
              <q-input outlined class="q-mt-md" v-model="passwordLogin" label="Ingrese nueva contraseña"
                :type="isPwd ? 'password' : 'text'" :rules="[
                  val => val !== null && val !== '' || 'Por favor ingresa una nueva contraseña'
                ]">
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="isPwd = !isPwd" />
                </template>
              </q-input>
              <q-input outlined class="q-mt-md" v-model="passwordLogin2" label="Confirme nueva contraseña"
                :type="isPwd2 ? 'password' : 'text'" :rules="[
                  val => val !== null && val !== '' || 'Por favor ingresa una nueva contraseña'
                ]">
                <template v-slot:append>
                  <q-icon :name="isPwd2 ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="isPwd2 = !isPwd2" />
                </template>
              </q-input>
            </div>
            <button class="btn" type="submit">Cambiar Contraseña</button>
          </q-form>
        </div>
        <div class="carta" v-if="modal2">
          <q-card class="q-mt-md carta-tarjeta">
            <q-card-section class="card-content">
              <img src="../img/Nature Beans Logo v3.png" alt="" class="loguito">
              <div class="text-content">
                <div class="text-h4">Cambio de contraseña</div>
                <div>
                  <p class="titulo-carta">¡Te informamos que tu contraseña ha sido cambiada con éxito! Por favor, cierra
                    esta
                    ventana y vuelve al inicio.</p>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-page-container>
    <q-footer bordered class="bg-grey-8 text-white colorfooter">
      <q-toolbar>
        <q-toolbar-title class="titulo-footer">
          <p>Copyright © 2024. Todos los derechos reservados.</p>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { Notify } from 'quasar';
import { useRoute, useRouter } from 'vue-router'
import { useUsuarioStore } from '../stores/usuario.js'

let useUsuario = useUsuarioStore()
let route = useRoute()
let router = useRouter()
const modal1 = ref(true);
const modal2 = ref(false);

const correo = ref(route.query.correo)
console.log(correo.value);

let passwordLogin = ref("")
let passwordLogin2 = ref("")
let isPwd = ref(true);
let isPwd2 = ref(true);


if (!correo.value || correo.value === undefined) {
  Notify.create("No tiene permisos")
  router.push("/")
}

function cambiar() {
  if (passwordLogin.value === passwordLogin2.value) {
    const res = useUsuario.actualizarContra(correo.value, passwordLogin.value)
    console.log(res);
    modal1.value = false;
    modal2.value = true;
  } else {
    Notify.create("Las contraseñas no coinciden")
  }
}


</script>

<style scoped>
.header {
  width: 100%;
  height: 190px;
}

.cuerpo {
  height: 70vh;
  display: grid;
  place-items: center;
}

.form {
  padding: 40px 40px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  text-align: center;
  width: 450px;
  background-color: white;
}

.titulo {
  color: #999999;
  font-size: 45px;
}

.loguito {
  width: 100px;
  height: 100px;
}

.formulario {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carta {
  margin-top: 20px;
}

.carta-tarjeta {
  width: 650px;
  background-color: #a5f3bc;
  color: black;
}

.card-content {
  display: flex;
  align-items: center;
  /* Alinea la imagen y el texto verticalmente */
}

.text-content {
  margin-left: 20px;
}

.colorheader {
  background-color: #009B44 !important;
}

.colorfooter {
  background-color: #3A3B3D !important;
}

.titulo-footer {
  font-size: 15px;
  text-align: right;
}
</style>
