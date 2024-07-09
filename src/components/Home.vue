<template>
  <q-layout view="hHh lpR fFf">

    <q-header reveal elevated class="bg-primary text-white colorheader" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <p class="rol-user">hola</p>
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">

      </q-tabs>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay behavior="desktop" bordered>
      <header class=header>
        <img src="../img/user.jpg" alt="" class="perfil-prueba">
        <p class="name-user">Hola</p>
      </header>
      <div class="menu">
        <div class="item"> <router-link class="item opciones" to="/menu"><i class="fas fa-tachometer-alt"></i>
            DashBoard</router-link>
        </div>
        <div class="item"> <router-link class="opciones" to="/usuario"><i class="fas fa-user"></i>Usuario</router-link>
          
        </div>
      </div>
      <div class="btn-cerrar">
        <button class="cerrar-sesion" @click="singOut()"> <i class="fa fa-sign-out-alt "></i> Cerrar Sesion</button>
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
import { ref, onMounted } from 'vue'

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
const toggleSubMenu = (menu) => {
  subMenus.value[menu] = !subMenus.value[menu]
}
</script>

<style scoped>
.header {
  background: #33363a;
  width: 100%;
  height: 190px;
}

header img {
  width: 100%;
  margin: 15px;
  margin-left: 110px;
  border-radius: 50%;
}

.perfil-prueba {
  height: 100px;
  width: 100px;
}

.name-user {
  color: white;
  font-size: 15px;
  text-align: center;
  font-weight: bold;
  margin-left: 34px;
}

.menu {
  width: 100%;
  margin-top: 20px;
}
.menu .item{
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

.item i{
  margin-right: 8px;
}

.item a .dropdown{
  position: absolute;
  right: 0;
  margin: 20px;
  transition: 0.3 ease;
}

.item .sub-menu{
  background: #F0F0F0;
}

.colorheader {
  background-color: #32b532 !important;
}

.colorfooter {
  background-color: #2d2c30 !important;
}

.rol-user {
  margin-top: 15px;
}

.titulo-footer {
  font-size: 15px;
  text-align: right;
}

.btn-cerrar {
  margin-top: 160px;
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
</style>