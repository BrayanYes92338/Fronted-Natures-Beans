<template>
   <div>
      <div style="margin-left: 5%; text-align: end; margin-right: 5%">
         <q-btn color="red" class="q-my-md q-ml-md" >Registrar Clima</q-btn>
      </div>
      
   </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Notify } from 'quasar';
import {useEmpleadoStore} from '../stores/empleado';
</script>