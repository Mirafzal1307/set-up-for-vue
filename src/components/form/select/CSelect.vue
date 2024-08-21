<template>
    <div class="">
      <label v-if="label" class="block text-blue-600 text-sm font-bold mb-0 pl-2">{{ label }}</label>
      <select
        v-model="selectedValue"
        @change="emitChange"
        class="block w-full px-4 py-2 pr-8 leading-tight bg-white border border-gray-300 rounded shadow focus:outline-none focus:border-blue-500 focus:border"
      >
        <option disabled value="">{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          class="text-gray-700"
        >
          {{ option.text }}
        </option>
      </select>
    </div>
  </template>
  
  <script setup>
  import { ref, toRefs, watch } from 'vue';
  
  const props = defineProps({
    options: {
      type: Array,
      required: true,
      default: () => [],
    },
    modelValue: {
      type: [String, Number],
      required: false,
      default: '',
    },
    label: {
      type: String,
      required: false,
      default: '',
    },
    placeholder: {
      type: String,
      required: false,
      default: 'Select an option',
    },
  });
  
  const emits = defineEmits(['update:modelValue']);
  
  const { options, modelValue } = toRefs(props);
  const selectedValue = ref(modelValue.value);
  
  watch(modelValue, (newValue) => {
    selectedValue.value = newValue;
  });
  
  const emitChange = () => {
    emits('update:modelValue', selectedValue.value);
  };
  </script>
  
  <style scoped>
  /* Add any scoped CSS if necessary */
  </style>
  