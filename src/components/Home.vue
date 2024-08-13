<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal elevated class="bg-primary text-white colorheader" height-hint="98">
      <q-toolbar>
        <q-btn v-if="useUsuario.token" dense flat round icon="menu" @click="toggleLeftDrawer" />
        <!-- Rol del usuario -->
        <q-toolbar-title class="toolbar-title">
          <p class="rol-user">{{ usuario.nombre }}</p>
        </q-toolbar-title>
        <!-- Espacio flexible para empujar el contenido al final -->
        <div class="q-mx-auto"></div>

        <!-- Separador -->
        <span class="separator">|</span>
        <!-- Ícono de casa con enlace al dashboard -->
        <router-link to="/menu" class="home-icon">
          <q-btn dense flat round icon="home" class="home-btn" />
        </router-link>
      </q-toolbar>
    </q-header>
    <q-drawer v-if="useUsuario.token" v-model="leftDrawerOpen" side="left" overlay behavior="desktop" bordered>
      <header class="header">
        <div class="fondoimagen">
          <img src="../img/user.jpg" alt="" class="perfil-prueba">
          <p class="name-user">{{ usuario.rol }}</p>
        </div>
      </header>
      <div class="menu">
        <div class="item">
          <router-link class="item opciones" to="/menu">
            <i class="fas fa-tachometer-alt"></i> DashBoard
          </router-link>
        </div>
        <div class="item">
          <router-link class="opciones" to="/usuario">
            <i class="fas fa-user"></i> Usuario
          </router-link>
        </div>
        <div class="item">
          <a class="opciones sub" href="#" @click.prevent="toggleSubMenu('finca')">
            <i class="fas fa-home"></i> Informacion Finca
            <i v-if="subMenus.finca" class="fas fa-angle-down dropdown"></i>
            <i v-else class="fas fa-angle-right dropdown"></i>
          </a>
          <div class="sub-menu" v-show="subMenus.finca">
            <router-link class="opciones" to="/finca">
              <i class="fas fa-home"></i>Fincas
            </router-link>
          </div>
          <div class="sub-menu" v-show="subMenus.finca">
            <router-link class="opciones" to="/parcela">
              <i class="fas fa-tree"></i>Parcela
            </router-link>
          </div>
          <div class="sub-menu" v-show="subMenus.finca">
            <router-link class="opciones" to="/clima">
              <i class="fas fa-cloud-sun"></i>Clima
            </router-link>
          </div>
          <div class="sub-menu" v-show="subMenus.finca">
            <router-link class="opciones" to="/empleado">
              <i class="fas fa-users"></i>Empleados
            </router-link>
          </div>
          <div class="sub-menu" v-show="subMenus.finca">
            <router-link class="opciones" to="/cultivo">
              <i class="fas fa-seedling"></i>Cultivos
            </router-link>
          </div>
          <div class="sub-menu" v-show="subMenus.finca">
          <router-link class="opciones" to="/riego">
            <i class="fas fa-tint"></i>Riego
          </router-link>
        </div>
        </div>
        <div class="item">
          <router-link class="opciones" to="/proveedor">
            <i class="fas fa-truck"></i>Proveedor
          </router-link>
        </div>

      </div>
      <div class="btn-cerrar">
        <button class="cerrar-sesion" @click="cerrarSesion()">
          <i class="fa fa-sign-out-alt"></i> Cerrar Sesión
        </button>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view></router-view>
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
import { useRouter } from 'vue-router'
import { useUsuarioStore } from '../stores/usuario.js'

let router = useRouter()
let useUsuario = useUsuarioStore()
let usuario = useUsuario.user

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const toggleSubMenu = (menu) => {
  subMenus.value[menu] = !subMenus.value[menu]
}

const subMenus = ref({
  finca: false
})

const cerrarSesion = () => {
  useUsuario.user = {}
  useUsuario.token = ''
  router.push('/')
}
</script>

<style scoped>
.header {
  width: 100%;
  height: 190px;
  position: relative;
}

.fondoimagen {
  background-image: url('../img/Boceto.png');
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 190px;
  position: relative;
}

.perfil-prueba {
  height: 100px;
  width: 100px;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  border: #e9c62d solid 3px;
  border-radius: 50%;
}

.name-user {
  color: white;
  font-size: 18px;
  text-align: center;
  font-weight: bold;
  position: absolute;
  top: 130px;
  left: 50%;
  text-shadow:
    -2px -2px 0 #000,
    2px -2px 0 #000,
    -2px 2px 0 #000,
    2px 2px 0 #000;
  transform: translateX(-50%);
}

.menu {
  width: 100%;
  margin-top: 20px;
}

.menu .item {
  position: relative;
  cursor: pointer;
}

.menu .item .opciones {
  color: #211F25;
  text-decoration: none;
  font-size: 16px;
  font-weight: bold;
  display: block;
  padding: 4px 15px;
  line-height: 60px;
}

.item i {
  margin-right: 8px;
}

.colorheader {
  background-color: #009B44 !important;
}

.colorfooter {
  background-color: #3A3B3D !important;
}

.rol-user {
  margin-top: 15px;
}

.titulo-footer {
  font-size: 15px;
  text-align: right;
}


.btn-cerrar {
  margin-top: 40px; 
  margin-bottom: 20px; 
  text-align: center;
}

.cerrar-sesion {
  color: white;
  border: none;
  background: #DC0000;
  width: 250px;
  height: 50px;
  font-size: 15px;
  font-weight: bold;
  display: inline-block;
  text-align: center;
  cursor: pointer;
}

.cerrar-sesion:hover {
  background-color: #e61d1d;
}

.home-icon {
  margin-left: 16px;
}

.home-btn {
  color: white;
  font-size: 24px;
}

.separator {
  margin: 0 18px;
  color: white;
  font-size: 28px;
}

.toolbar-title {
  margin-left: 16px;
}

@media(max-width: 1366px) {

  .cerrar-sesion {
    margin-bottom: 30%;
  }
}
</style>
