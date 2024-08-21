// axios plugin
import axios from 'axios'
// import { useUserStore } from '@/stores/user'

// axios.defaults.baseURL = import.meta.env.VITE_AXIOS_BASE_URL
axios.defaults.baseURL = 'http://localhost:1337/api'

axios.defaults.headers.Accept = 'application/json'
axios.defaults.headers['Content-Type'] = 'application/json'
axios.defaults.withCredentials = false

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token)
      config.headers.Authorization = `Bearer 76d4b2c4aed63d70faa4f3aca216cd478430f390b03ab750caf35f360ece4a7fffadd750ac105c5243ca7190254d4eac00e6505419ef65f65781efb8a3769564008036c7212f4ec1240aed6aa7c81c87e6b06afc315f449230f615ab0be0af4302996f0eb26ab33ba74498a8a53f09754994e889150564923ffef9163fe4847a`

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (config) => config,
  (error) => {
    // const { logout } = useUserStore()

    // if (error.response?.status === 400 && error.response.data?.message.includes('Already authenticated'))
    //   logout()

    // if (error.response?.status === 400 || error.response?.status === 500)
    //   toast.error(error.response.data?.message)

    // if (error.response?.status === 422)
    //   toast.error(error.response.data?.message)

    // if (error.response?.status === 401)
    //   logout()

    // if (error.message === 'Network Error')
    //   toast.error('Серверда хатолик юз берди, илтимос қайтадан уриниб кўринг')

    return error
  }
)

export default axios
