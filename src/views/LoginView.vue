<template>
  <div class="">
    this is auth page <Icon icon="mdi-light:home" />

    <CInput
      type="text"
      placeholder="Project Description"
      v-model="val"
      id="projectDescription"
    />
    {{ val }}

    <CButton bg-color="bg-primary"  text-color="text-white" >la la la </CButton>
  </div>
</template>

<script setup>
import CButton from '@/components/button/CButton.vue';
import CInput from '@/components/form/input/CInput.vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const val = ref('')

console.log(val)
</script>
