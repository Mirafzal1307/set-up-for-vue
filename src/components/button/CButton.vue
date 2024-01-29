<template>
  <div>
    <button :class="[ bgColor, textColor ]" class="rounded-md  py-2 px-6  " >button</button>
    <slot></slot>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  bgColor: {
    type: String,
    default: 'bg-primary'
  },
  textColor: {
    type: String,
    default: 'text-white'
  }
})
</script>
