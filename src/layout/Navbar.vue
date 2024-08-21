<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <nav class="flex items-center justify-between flex-wrap bg-teal p-4 px-32 drop-shadow bg-white ">
      <div class="w-32 mr-8">
        <img src="../assets/images/logoplu.png" alt="lincoln img" class="w-full" />
      </div>
      <div class="block sm:hidden">
        <button
          @click="toggle()"
          class="flex items-center px-3 py-2 border rounded text-teal-lighter border-teal-light hover:text-blue-500 hover:border-blue-500"
        >
          <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div
        :class="open ? 'block' : 'hidden'"
        class="w-full flex-grow sm:flex sm:items-center sm:w-auto"
      >
        <div class="text-sm sm:flex-grow">
          <a
            href="#responsive-header"
            class="no-underline block mt-4 sm:inline-block sm:mt-0 text-teal-lighter hover:text-blue-500 mr-4"
          >
            Home    
          </a>
          <a
            href="#responsive-header"
            class="no-underline block mt-4 sm:inline-block sm:mt-0 text-teal-lighter hover:text-blue-500 mr-4"
          >
            Examples
          </a>
          <a
            href="#responsive-header"
            class="no-underline block mt-4 sm:inline-block sm:mt-0 text-teal-lighter hover:text-blue-500"
          >
            Blog
          </a>
        </div>
        <div>
          <a
            href="#"
            class="no-underline inline-block text-sm px-4 py-2 leading-none border rounded text-black border-black hover:border-transparent hover:text-teal hover:bg-slate-200 mt-4 sm:mt-0"
            >Download</a
          >
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const open = ref(false)

const toggle = () => {
  open.value = !open.value
}
</script>

<style scoped></style>
