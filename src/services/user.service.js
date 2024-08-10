import axios from '@/plugin/axios/axios'

//  User services
export const login = async userCredentials => {
  const data = await axios.post('user/login', userCredentials)

  return data
}