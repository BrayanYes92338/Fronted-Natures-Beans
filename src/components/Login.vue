<template>
  <div class="contenedor1">
    <div class="carousel-container">
      <q-carousel class="responsive-carousel" animated v-model="slide" infinite :autoplay="autoplay"
        transition-prev="slide-right" transition-next="slide-left" @mouseenter="pauseAutoplay"
        @mouseleave="resumeAutoplay" navigation>
        <q-img class="carousel-image" :name="1" src="../img/fondo1.jpg" loading="lazy"></q-img>
        <q-img class="carousel-image" :name="2" src="../img/fondo2.jpg" loading="lazy"></q-img>
      </q-carousel>
    </div>
    <div class="wrapper">
      <div class="from-box login text-center">
        <img src="../img/Nature Beans Logo v5.png" alt="" class="logo1">
        <h2 class="ingresar">INGRESAR</h2>
        <q-form @submit="Login2">
          <q-input class="q-mt-sm" outlined v-model="documento" label="Documento de Identidad" lazy-rules
            :rules="[val => val && val.length > 0 || 'Por favor ingresa tu Número de Documento']" />
          <q-input outlined class="q-mt-md" v-model="passwordLogin" label="Contraseña"
            :type="isPwd ? 'password' : 'text'"
            :rules="[val => val !== null && val !== '' || 'Por favor ingresa tu contraseña']">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
          <div class="remember-forgot">
            <div class="q-pa-md q-gutter-sm">
              <q-dialog v-model="dialog" persistent transition-show="slide-up" transition-hide="slide-down">
                <q-card class="custom-modal-bg" style="width: 1200px !important;">
                  <q-bar class="hola">
                    <q-space />
                    <q-btn dense flat icon="close" @click="cerrar">
                      <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
                    </q-btn>
                  </q-bar>
                  <q-card-section class="text-center">
                    <img src="../img/Nature Beans Logo v3.png" alt="" class="logito">
                    <div class="text-h6">INGRESE CORREO</div>
                  </q-card-section>
                  <q-card-section class="q-pt-none">
                    <p>Por favor ingresar el Correo Electronico para iniciar el proceso de cambio de contraseña.</p>
                    <q-input class="q-mt-sm" outlined v-model="correo" label="Correo electronico" lazy-rules
                      :rules="[val => val && val.length > 0 || 'Por favor ingresa tu correo']" />
                    <button class="btn" @click="ActualizarContra()">Enviar</button>
                  </q-card-section>
                </q-card>
              </q-dialog>
            </div>
          </div>
          <button class="btn" type="submit">Ingresar</button>
        </q-form>
        <!-- <button @click="dialog = true"><a>¿Olvidaste tu contraseña?</a></button> -->
        <a href="#" @click="dialog = true" class="olv">¿Olvidaste tu contraseña?</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUsuarioStore } from '../stores/usuario.js';
import { useRouter } from "vue-router";
import { Notify } from 'quasar';

const router = useRouter();
const dialog = ref(false);
let useUsuario = useUsuarioStore();
let documento = ref('');
let passwordLogin = ref("");
let isPwd = ref(true);
let slide = ref(1);
let autoplay = ref(true);
let correo = ref("");

function cerrar() {
  dialog.value = false;
}

async function Login2() {
  try {
    const res = await useUsuario.Login({
      documento: documento.value,
      password: passwordLogin.value
    });

    useUsuario.token = res.data.token;
    useUsuario.user = res.data.usuario;
    router.push('/menu');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      Notify.create({
        message: error.response.data.msg ,
        position: "top",
        color: 'red',
        timeout: 4000
      });
    }else  if (error.response && error.response.data && error.response.data.errors) {
      Notify.create({
        message: error.response.data.errors[0].msg,
        color: "red",
      })}else {
      console.log(error);
      Notify.create({
        message: "Ocurrió un error desconocido.",
        position: "top",
        color: 'red',
        timeout: 4000
      });
    }
  }
}


function pauseAutoplay() {
  autoplay.value = false;
}

function resumeAutoplay() {
  autoplay.value = 15000;
}

async function ActualizarContra() {
  try {
    if (!correo.value) {
      Notify.create({
        message: "Por favor ingrese un correo",
        position: "top",
        color: 'red',
        timeout: 4000
      });
    } else {
      const res = await useUsuario.usuarioGetEmail(correo.value);
      if (res.data.usuario) {
        const ress = await useUsuario.enviarCorreo(correo.value);
        console.log(ress);

        Notify.create({
          message: "El correo ha sido enviado exitosamente",
          position: "top",
          color: 'green',
          timeout: 4000
        });
        dialog.value = false;
        limpiar();
      } else {
        Notify.create({
          message: "El correo no es válido",
          position: "top",
          color: 'red',
          timeout: 4000
        });
      }

    }
  } catch (error) {
    console.log(error);
  }
}

function limpiar() {
  correo.value = ""
}

</script>
<style scoped>
.logo1 {
  width: 280px;
  height: 130px;
}

.olv{
  font-size: 15px;
  color: #009B44;
  /* font-weight: bold; */
  text-decoration: underline;
  margin-bottom: 10px;
  transition: background-color 0.3s;
}
.olv:hover {
  color: #22c268;
 
}
.contenedor1 {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  height: 100vh;
  background: #feffff;
}

.custom-modal-bg {
  background-color: white;
  color: black;
}

a {
  color: #162938;
  text-decoration: none;
}

.remember {
  font-size: 15px;
  margin-top: 18px;
}

.carousel-container {
  width: 80%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.responsive-carousel {
  flex: 1;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wrapper {
  position: relative;
  width: 25%;
  height: 100%;
  background: #F3F3F3;
  border: solid 2px rgba(255, 255, 255, .5);
  backdrop-filter: blur(20px);
  box-shadow: 0 0 30px rgba(0, 0, 0, .5);
  display: flex;
  justify-content: center;
  align-items: center;

}

.wrapper .from-box {
  width: 100%;
  padding: 40px;
}

.wrapper .from-box.register {
  position: relative
}

.from-box h2 {
  font-size: 2.5em;
  color: #52585b;
  text-align: center;
  font-weight: 500;
  margin-top: 10px;
}

.input-box {
  position: relative;
  width: 100%;
  height: 50px;
  border-bottom: 2px solid #162938;
  margin: 30px 0;
}

.input-box label {
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
  font-size: 1em;
  color: #162938;
  font-weight: 500;
  pointer-events: none;
  transition: .5s;
}

.input-box input:focus~label,
.input-box input:valid~label {
  top: -5px;
}

.input-box input {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #162938;
  font-size: 1em;
  font-weight: 600;
  padding: 0 35px 0 5px;
}

.input-box .icon {
  position: absolute;
  right: 8px;
  font-size: 1.2em;
  color: #162938;
  line-height: 57px;
}

.remember-forgot {
  font-size: .9em;
  color: #162938;
  font-weight: 500;
  margin: -15px 0 15px;
  display: flex;
  justify-content: space-between;
}

.remember-forgot label input {
  color: #162938;
  margin-right: 3px;
}

.remember-forgot a {
  color: #162938;
  text-decoration: none;
}

.remember-forgot a:hover {
  text-decoration: underline;
}

.btn {
  width: 100%;
  height: 45px;
  background: linear-gradient(to bottom, #50cf50, #238523);
  border: none;
  outline: none;
  border-radius: 6px;
  cursor: pointer;
  color: #fff;
  font-size: 1em;
  font-weight: 700;
  margin: 20px 0;
}

.login-register {
  font-size: .9em;
  color: #162938;
  font-weight: 500;
  text-align: center;
  margin: 25px 0 10px;
}

.login-register p a {
  color: #162938;
  text-decoration: none;
}

.login-register p a:hover {
  text-decoration: underline;
}

.hola {
  background: none !important;
  color: gray;
}

.text-h6 {
  margin-top: 30px;
  font-size: 30px !important;
}

.logito {
  width: 100px;
  height: 100px;
  display: block;
  margin: 0 auto;
}

.text-center {
  text-align: center;
}

@media(max-width: 1240px) {
  .wrapper {
    width: 30%;
  }
}

@media(max-width: 905px) {
  .wrapper {
    width: 40%;
  }

  .logo1 {
    width: 250px;
    height: 130px;
  }
}

@media(max-width: 725px) {

  .logo1 {
    width: 220px;
    height: 130px;
  }

}

@media(max-width: 650px) {

  .logo1 {
    width: 150px;
    height: 130px;
  }

}

@media(max-width: 535px) {

  h2 {
    font-size: medium;
  }

}


@media(max-width: 1100px) {
  .logo1 {
      width: 220px;
      height: 130px;
    }
}

@media(max-width: 905px) {

  .carousel-container{
    width: 600px;
  }
  .wrapper {

    width: 40%;
  }

  .logo1 {
    width: 250px;
    height: 130px;
  }
}

@media(max-width: 730px) {

  .carousel-container{
    width: 400px;
  }

  .logo1 {
    width: 220px;
    height: 130px;
  }

}

@media(max-width: 650px) {

  .logo1 {
    width: 150px;
    height: 130px;
  }

}

@media(max-width: 535px) {

  .carousel-container{
    width: 400px;
  }

  h2 {
    font-size: medium;
  }
}

@media(max-width: 760px) {
  .wrapper {
    width: 40%;
  }

  .logo1 {
    width: 200px;
    height: 130px;
  }
}

@media(max-width: 620px) {
  .wrapper {
    width: 40%;
  }

  h2{
    font-size: medium;
  }
  .logo1 {
    width: 180px;
    height: 100px;
  }
}

@media(max-width: 570px) {
  .wrapper {
    width: 40%;
    font-size: small;
  }
h2{
    font-size: small;
  }
  .logo1 {
    width: 150px;
    height: 100px;
  }
}

@media(max-width: 500px) {
  .carousel-container{
    width: 65% !important
  }

  .carousel-image{
    width: 300px;
  }

  h2{
    font-size: 90px;
  }

  .wrapper {
    width: 40%;
    font-size: x-small;
  }

  .logo1 {
    width: 100px;
    height: 90px;
  }
}

@media(max-width: 410px) {
  .carousel-container{
    width: 30%;
  }
      
    

.from-box h2 {
  font-size: 1.7em;
  color: #52585b;
  text-align: center;
}

.wrapper .from-box {
  width: 250%;
  
  
}
  .carousel-image{
    width: 100%;
  }
  .wrapper {
    width: 70%;
    font-size: small;

  }



  .logo1 {
    width: 90px;
    height: 70px;
  }
}

@media(max-width: 300px) {
  .carousel-container{
    width: 250px;
  }

  .wrapper {
    width: 20%;
    font-size: xx-small;
  }

  .logo1 {
    width: 80px;
    height: 60px;
  }
}
</style>