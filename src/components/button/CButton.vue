<template>
  <div>
    <button :class="[bgColor, textColor]" class="rounded-md w-full py-2 hover:opacity-85 ">{{ textValue }}</button>
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
  },
  textValue: {
    type: String,
    default: ''
  }
})
</script>
