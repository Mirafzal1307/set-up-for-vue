import { getCountriesList, getLetterTypeList, getProgrammLists } from '@/services/student.service'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStudentStore = defineStore('student', () => {
  //   const user = ref({})
  const programmLists = ref([])
  const loading = ref(false)
  const countriesList = ref([])
  const letterTypeList = ref([])

  const getProgramsLists = async () => {
    try {
      const { data } = await getProgrammLists()

      programmLists.value = data
      loading.value = true
    } catch (error) {
      return error
    } finally {
      loading.value = false
    }
  }

  const getCountryLists = async () => {
    try {
      const { data } = await getCountriesList()

      countriesList.value = data
      loading.value = true
    } catch (error) {
      return error
    } finally {
      loading.value = false
    }
  }

  const getLetterTypesList = async () => {
    try {
      const { data } = await getLetterTypeList()

      letterTypeList.value = data
      loading.value = true
    } catch (error) {
      return error
    } finally {
      loading.value = false
    }
  }

  return {
    programmLists,
    countriesList,
    letterTypeList,
    getCountryLists,
    getProgramsLists,
    getLetterTypesList
  }
})
