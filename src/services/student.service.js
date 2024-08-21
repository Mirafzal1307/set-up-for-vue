import axios from '@/plugin/axios/axios'

//  Students services
export const getProgrammLists = async () => {
  const { data } = await axios.get('/get-programm-names')

  return data
}

export const getCountriesList = async () => {
  const { data } = await axios.get('/get-country-lists')

  return data
}

export const getLetterTypeList = async () => {
  const { data } = await axios.get('/letter-types')

  return data
}
