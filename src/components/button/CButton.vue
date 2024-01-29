<template>
  <div>
    <button :class="bgColor">button</button>
    <slot></slot>
  </div>
</template>

<script setup>

// eslint-disable-next-line no-unused-vars
const props = defineProps({
    bgColor: {
      type: String,
      default: 'bg-primary-800',  
    }
})
</script>
