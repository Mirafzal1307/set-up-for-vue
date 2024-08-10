<template>
  <div class="w-full h-full py-24 bg-cover bg-no-repeat bg-[url('../assets/images/bgImage.jpg')]">
    <div class="w-1/4 mx-auto mt-20 bg-red-600 p-10 rounded-md">
      <div class="flex flex-col overflow-hidden gap-2">
        <div class="mx-auto">
          <img class="h-32 w-32 rounded-full  border-white border-2 " src="../assets/images/Lincoln.jpg" alt="" />
        </div>
        <div class="text-center mb-4">
          <h1 class="text-center text-xl text-white font-black">Lincoln University Collage</h1>
          <span class="text-center text-white font-bold"> Offer letter </span>
        </div>

        <CInput
          type="text"
          placeholder="Login"
          v-model="form.email"
          id="projectDescription"
        />

        <CInput
          type="text"
          placeholder="Password"
          v-model="form.password"
          id="projectDescription"
        />

        <CButton
          class=""
          bg-color="bg-primary"
          text-color="text-white"
          :text-value="'Login'"
          @click="submit()"
        ></CButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import CButton from '@/components/button/CButton.vue'
import CInput from '@/components/form/input/CInput.vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
// import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const userCredentials = ref({
  login: '',
  password: ''
})




const { userLogin } = useUserStore()
const userStore = useUserStore()
const { loading } = storeToRefs(userStore)
// const isPasswordVisible = ref(false)


const form = ref({
  email: '',
  password: '',
})

const submit = async () => {
  const usercredentials = {
    email: form.value.email,
    password: form.value.password,
  }
  console.log(usercredentials)
  try {
    await userLogin(usercredentials)
  } catch (error) {
    return error
  }
}

console.log(form)


console.log(userCredentials)
</script>
