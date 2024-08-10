<template>
  <input
    class="border border-white p-2 rounded "
    :value="modelValue"
    @input="updateModelValue"
    :type="type"
    :id="id"
    :placeholder="placeholder"
  />
</template>

<script setup>
import { defineProps, ref } from 'vue'

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  id: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },

})

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits()

const updateModelValue = (event) => {
  if (typeof props.modelValue === 'string') {
    console.log(props.modelValue);
    const refModelValue = ref(props.modelValue);
    emit('update:modelValue', refModelValue.value);
  }

  // Don't directly assign to props, emit an event instead
  emit('update:modelValue', event.target.value);
}
</script>
