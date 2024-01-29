<template>
  <input
    class=""
    :value="modelValue"
    @input="updateModelValue"
    :type="type"
    :id="id"
    :placeholder="placeholder"
  />
</template>

<script setup>
import { defineProps, ref } from 'vue'

let { modelValue, type, placeholder, id } = defineProps([
  'modelValue',
  'type',
  'id',
  'placeholder',
  'isValid'
])

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits()

const updateModelValue = (event) => {
  if (typeof modelValue === 'string') {
    console.log(modelValue)
    const refModelValue = ref(modelValue)

    emit('update:modelValue', refModelValue.value)

    modelValue = refModelValue
  }

  modelValue.value = event.target.value

  emit('update:modelValue', modelValue.value)
}
</script>
