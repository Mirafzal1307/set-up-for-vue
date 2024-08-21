// import { login } from '@/services/user.service'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const user = ref({})
  const loading = ref(false)
  const router = useRouter()

  const userLogin = async userCredentials => {
   
    try {
      loading.value = true

      // const { data } = await login(userCredentials)

      // user.value = data
     

      if (userCredentials.email === 'mkb@gmail.uz' && userCredentials.password === '12345') {
  
        localStorage.setItem(
          'token',
          'sdkjgflitjghlgkhglkjhgkjerhgpiutyjfneirhppierhfpierutweiourtoweqifdsfokjdklmfowefiportiperfgngeorigi',
        )
      }

      // toast.success('Muaffaqiyatli kirildi', {
      //   autoClose: 4000,

      //   position: toast.POSITION.TOP_RIGHT,
      // } as ToastOptions)

      await router.replace('/')

    //   return data
    } catch (error) {
      // toast.error('Xatolik sodir boldi', {
      //   autoClose: 4000,
      //   position: toast.POSITION.TOP_RIGHT,
      // } as ToastOptions)

      return error
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    userLogin,
  }
})