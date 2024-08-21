<template>
  <div class="flex flex-col" >
    <label v-if="label" class="block text-blue-600 text-sm font-bold mb-0 pl-2">{{ label }}:</label>

    <input
      class="block w-full px-4 py-2 pr-8 leading-tight bg-white border border-gray-300 rounded shadow focus:outline-none focus:border-blue-500"
      :value="modelValue"
      @input="updateModelValue"
      :type="type"
      :id="id"
      :placeholder="placeholder"
    />
  </div>
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
  label: {
    type: String,
    required: false,
    default: ''
  }
})

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits()

const updateModelValue = (event) => {
  if (typeof props.modelValue === 'string') {
    console.log(props.modelValue)
    const refModelValue = ref(props.modelValue)
    emit('update:modelValue', refModelValue.value)
  }

  // Don't directly assign to props, emit an event instead
  emit('update:modelValue', event.target.value)
}
</script>
