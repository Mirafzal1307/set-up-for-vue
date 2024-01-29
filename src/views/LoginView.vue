<template>
  <div class="bg-primary text-primaryLight">
    this is auth page <Icon icon="mdi-light:home" />

    <CInput
      type="text"
      placeholder="Project Description"
      v-model="val"
      id="projectDescription"
    />
    {{ val }}
  </div>
</template>

<script setup>
import CInput from '@/components/form/input/CInput.vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const val = ref('')

console.log(val)
</script>
