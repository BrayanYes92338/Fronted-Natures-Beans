<template>
  <q-page class="flex flex-center">
    <div class="row" style="width: 100%;">
      <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
        <q-card class="q-ma-sm q-pa-sm bg-my-custom-red my-card" dark bordered>
          <q-card-section horizontal>
            <q-card-section style="width: 60%;">
              <div class="text-h5 q-mt-sm q-mb-xs">Creación, activación y edición de Usuarios</div>
            </q-card-section>
            <q-card-section class="col-5 text-right">
              <q-avatar size="120px" class="bg-white">
                <img src="">
              </q-avatar>
            </q-card-section>
          </q-card-section>
          <q-card-section horizontal>
            <q-btn outline rounded icon="reply" color="white" label=" Visitar Usuarios" to="/usuario"></q-btn>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
        <q-card class="q-ma-sm q-pa-sm bg-my-custom-red my-card" dark bordered>
          <q-card-section horizontal>
            <q-card-section style="width: 60%;">
              <div class="text-h5 q-mt-sm q-mb-xs">Creación, activación y edición de Fincas</div>
            </q-card-section>
            <q-card-section class="col-5 text-right">
              <q-avatar size="120px" class="bg-white">
                <img src="">
              </q-avatar>
            </q-card-section>
          </q-card-section>
          <q-card-section horizontal>
            <q-btn outline rounded icon="reply" color="white" label=" Visitar Fincas" to="/finca"></q-btn>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
        <q-card class="q-ma-sm q-pa-sm bg-my-custom-red my-card" dark bordered>
          <q-card-section horizontal>
            <q-card-section style="width: 60%;">
              <div class="text-h5 q-mt-sm q-mb-xs">Creación, activación y edición de Parcelas</div>
            </q-card-section>
            <q-card-section class="col-5 text-right">
              <q-avatar size="120px" class="bg-white">
                <img src="">
              </q-avatar>
            </q-card-section>
          </q-card-section>
          <q-card-section horizontal>
            <q-btn outline rounded icon="reply" color="white" label=" Visitar Parcela" to="/parcela"></q-btn>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
        <q-card class="q-ma-sm q-pa-sm bg-my-custom-red my-card" dark bordered>
          <q-card-section horizontal>
            <q-card-section style="width: 60%;">
              <div class="text-h5 q-mt-sm q-mb-xs">Creación, activación y edición de Clima</div>
            </q-card-section>
            <q-card-section class="col-5 text-right">
              <q-avatar size="120px" class="bg-white">
                <img src="">
              </q-avatar>
            </q-card-section>
          </q-card-section>
          <q-card-section horizontal>
            <q-btn outline rounded icon="reply" color="white" label=" Visitar Clima" to="/clima"></q-btn>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useUsuarioStore } from "../stores/usuario";
import { useRouter } from "vue-router";
const router = useRouter();

let useUsuario = useUsuarioStore();

</script>

<style>
.bg-my-custom-red {
  background-color: #18bf61 !important;
}
</style>