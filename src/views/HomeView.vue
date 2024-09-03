<template>
  <div class="">
    <Navbar />

    <div class="px-36 flex flex-col gap-2 justify-center mt-10">
      <h2 class="mx-auto font-bold text-xl pb-4">Offer Letter Form</h2>

      <div class="flex gap-4">
        <CInput
          v-model="studentInfo.fullName"
          placeholder="Student Full Name"
          class="border-blue-500 w-full"
          label="Full name"
          required
        />
        <CInput
          v-model="studentInfo.LUC_ID"
          placeholder="Student LUC ID"
          class="border-blue-500 w-full"
          label="LUC ID"
          required
        />
      </div>
      <div v-if="countryList.length" class="flex gap-4">
        <CInput
          v-model="studentInfo.passport"
          placeholder="Student Passport"
          class="border-blue-500 w-full"
          label="Passport"
        />
        <CSelect
          v-model="selectedCountry"
          :options="countryList"
          @change="onCountryChange($event.target.value)"
          label="Choose a country:"
          placeholder="Please select a country"
          class="w-full"
        />
      </div>

      <div v-if="programmList.length && letterTypeLists.length" class="flex gap-4">
        <CSelect
          v-model="selectedProgramm"
          :options="programmList"
          label="Choose a program:"
          placeholder="Please select a program"
          class="w-full"
        />
        <CSelect
          v-model="studentInfo.letter_type"
          :options="letterTypeLists"
          label="Choose a letter type:"
          placeholder="Please select a letter type"
          class="w-full"
        />
      </div>

      <CButton @click="generatePDF" text-value="Download PDF"></CButton>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import CButton from '@/components/button/CButton.vue'
import CInput from '@/components/form/input/CInput.vue'
import Navbar from '@/layout/Navbar.vue'
import CSelect from '@/components/form/select/CSelect.vue'
import { useStudentStore } from '@/stores/student'
import { storeToRefs } from 'pinia'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

const studentInfo = ref({
  fullName: '',
  LUC_ID: '',
  passport: '',
  country: '',
  program: '',
  scholarship: '',
  beforeScholarship: '',
  tuition_fee: '',
  letter_type: '',
  duration: '',
  date: ''
})

const today = new Date()
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
studentInfo.value.date = new Intl.DateTimeFormat('en-US', options).format(today)

// Initialize store and reactive variables
const studentStore = useStudentStore()
const { getProgramsLists, getCountryLists, getLetterTypesList } = studentStore
const { programmLists, countriesList, letterTypeList } = storeToRefs(studentStore)

// const selectedProgramm = ref('')

const selectedCountry = ref('')
const selectedProgramm = ref('')

// Method to update scholarship based on selected country
function updateScholarship() {
  // eslint-disable-next-line no-debugger
  if (selectedCountry.value) {
    // Find the selected country
    const country = countriesList?.value.find((c) => c.country_name === selectedCountry.value)

    if (country) {
      // Find the selected program
      if (selectedProgramm?.value) {
        const program = programmLists?.value.find((p) => p.programm_name === selectedProgramm.value)

        console.log(program)

        if (program) {
          // eslint-disable-next-line no-debugger
          debugger
          // Determine scholarship based on country’s rich_status
          if (country.rich_status) {
            studentInfo.value.scholarship = program.scholarRichC
            studentInfo.value.tuition_fee = program.tutionFeeRichC
            studentInfo.value.beforeScholarship = program.tution_fee
            studentInfo.value.duration = program.duration
          } else {
            studentInfo.value.scholarship = program.scholarPoorC
            studentInfo.value.tuition_fee = program.tutionFeePoorC
            studentInfo.value.beforeScholarship = program.tution_fee
            studentInfo.value.duration = program.duration
          }
        }
      }
    }
  }
}

// Example usage
function onCountryChange(newCountry) {
  console.log(newCountry)

  selectedCountry.value = newCountry
  updateScholarship()
}

pdfMake.vfs = pdfFonts.pdfMake.vfs

// Compute `selectOptions` based on `programmLists`
const programmList = computed(() => {
  return programmLists.value.map((item) => ({
    value: item.id,
    text: item.programm_name
  }))
})

const countryList = computed(() => {
  return countriesList.value.map((item) => ({
    value: item.id,
    text: item.country_name
  }))
})

const letterTypeLists = computed(() => {
  return letterTypeList.value.map((item) => ({
    value: item.id,
    text: item.type
  }))
})

watch(selectedProgramm, (newValue) => {
  console.log('Selected Program:', newValue)
  updateScholarship()
})

onMounted(() => {
  getProgramsLists()
  getCountryLists()
  getLetterTypesList()
})

const generatePDF = () => {
  const docDefinition = {
    content: [
      {
        margin: [0, 0, 0, 0],
        columns: [
          {
            image: img,
            width: 140,
            height: 60
          },
          {
            style: 'normal',
            width: '100%  ',
            table: {
              body: [
                [{ text: 'Our Reference:', bold: true }, studentInfo?.value?.LUC_ID],
                [{ text: 'Date:', bold: true }, studentInfo?.value?.date]
              ]
            },
            layout: 'Borders',
            margin: [170, 60, 10, 10]
          }
        ]
      },
      {
        text: studentInfo?.value.fullName,
        style: 'normal',
        alignment: 'left',
        margin: [0, 0, 0, 2]
      },
      {
        text: studentInfo.value.passport,
        style: 'normal',
        alignment: 'left',
        padding: [0, 2, 0, 2]
      },
      { text: selectedCountry.value, style: 'normal', alignment: 'left', margin: [0, 2, 0, 10] },
      {
        text: 'Dear Sir/Madam,',
        style: 'normal'
      },
      {
        text: studentInfo.value.letter_type,
        style: 'subheader',
        decoration: 'underline',
        alignment: 'left',
        margin: [0, 10, 0, 5] // Adjust margins as needed
      },
      {
        text: [
          { text: 'CONGRATULATIONS!', bold: true },
          ' It gives us immense pleasure to inform you that your application for admission has been accepted. However, this letter is ',
          { text: 'ONLY', bold: true, italics: true, decoration: 'underline' },
          ' valid for 21 days from the issuance date.'
        ],
        fontSize: 10,
        margin: [0, 5, 0, 5] // Adjust margins as needed
      },
      {
        style: 'tableWithBackground',
        table: {
          widths: ['*', '*', '*', '*', '*', '*'],
          body: [
            // Program details
            [
              {
                text: 'Program Name',
                bold: true,
                fontSize: 10,
                fontWeight: 'black',
                margin: [0, 6, 0, 6]
              },
              {
                text: selectedProgramm.value,
                colSpan: 3,
                fontSize: 9,
                margin: [0, 6, 0, 2]
              },
              {},
              {},
              {
                text: 'Duration',
                bold: true,
                fontSize: 10,

                margin: [0, 6, 0, 6]
              },
              { text: `${studentInfo.value.duration} Months`, colSpan: 1, fontSize: 9, margin: [0, 6, 0, 6] }
            ],
            [
              {
                text: 'Intake',
                bold: true,
                fontSize: 10,
                margin: [0, 6, 0, 6]
              },
              {
                text: 'As per EMGS approval letter and E-Val Registration',
                colSpan: 3,
                fontSize: 9,
                margin: [0, 6, 0, 2]
              },
              {},
              {},
              {
                text: 'Registration Date',
                bold: true,
                fontSize: 10,
                margin: [0, 2, 0, 2]
              },
              { text: 'Upon Arrival in Malaysia', colSpan: 1, fontSize: 9, margin: [0, 2, 0, 2] }
            ],
            [
              { text: '', colSpan: 4, fontSize: 9 },
              {},
              {},
              {},
              {
                text: 'Financer',
                bold: true,
                fontSize: 10,
                margin: [0, 6, 0, 6]
              },
              { text: 'Self-Finance', colSpan: 1, fontSize: 9, margin: [0, 6, 0, 6] }
            ],
            // Section header
            [
              {
                text: 'TUITION FEE PAYMENT BREAKDOWN',
                bold: true,
                colSpan: 6,
                fontSize: 9,
                alignment: 'center',
                fillColor: '#000',
                color: '#fff',
                margin: [0, 4, 0, 0]
              },
              {},
              {},
              {},
              {},
              {}
            ],
            [
              {
                text: 'For the above-mentioned duration',
                colSpan: 6,
                fillColor: '#000',
                fontSize: 8,
                color: '#fff',
                alignment: 'center',
                italics: true, // Make the text italic
                margin: [0, 0, 0, 4] // Margin added for spacing
              },
              {},
              {},
              {},
              {},
              {}
            ],
            // Program details
            [
              {
                text: 'Tuition Fee',
                bold: true,
                fontSize: 10,
                fontWeight: 'black',
                margin: [0, 10, 0, 8]
              },
              {
                text: `USD ${studentInfo.value.beforeScholarship}`,
                colSpan: 1,
                fontSize: 9,
                margin: [0, 10, 0, 8],
                alignment: 'center'
              },
              {
                text: 'Scholarship',
                colSpan: 1,
                bold: true,
                fontSize: 10,
                margin: [0, 10, 0, 8],
                alignment: 'center'
              },
              {
                text: studentInfo.value.scholarship,
                colSpan: 1,
                fontSize: 9,
                margin: [0, 10, 0, 8],
                alignment: 'center'
              },
              {
                text: 'Payable after scholarship',
                bold: true,
                fontSize: 10,

                margin: [0, 4, 0, 4]
              },
              {
                text: `USD ${studentInfo.value.tuition_fee}`,
                colSpan: 1,
                fontSize: 9,
                margin: [0, 10, 0, 8],
                alignment: 'center',
                fillColor: '#98FF98'
              }
            ],
            // Section header
            [
              {
                text: 'MISCELLANEOUS FEES PAYMENT BREAKDOWN',
                bold: true,
                colSpan: 6,
                alignment: 'center',
                fillColor: '#000',
                color: '#fff',
                fontSize: 9,
                margin: [0, 4, 0, 0]
              },
              {},
              {},
              {},
              {},
              {}
            ],
            [
              {
                text: 'Required to be paid before registration',
                colSpan: 6,
                fillColor: '#000',
                color: '#fff',
                fontSize: 8,
                alignment: 'center',
                italics: true, // Make the text italic
                margin: [0, 0, 0, 4] // Margin added for spacing
              },
              {},
              {},
              {},
              {},
              {}
            ],
            [
              {
                text: 'Particulars',
                bold: true,
                colSpan: 4,
                alignment: 'left',
                fontSize: 10
              },
              {},
              {},
              {},
              {
                text: 'Amount',
                bold: true,
                colSpan: 2,
                alignment: 'left',
                fontSize: 10
              },
              {}
            ],
            [
              {
                text: 'Administrative and Registration Fees',
                colSpan: 4,
                alignment: 'left',
                fontSize: 9
              },
              {},
              {},
              {},
              {
                text: 'USD 1000',
                colSpan: 2,
                alignment: 'left',
                fontSize: 9
              },
              {}
            ],
            [
              {
                text: 'EMGS Visa, Medical Check-up, and Medical Insurance ',
                colSpan: 4,
                alignment: 'left',
                fontSize: 9
              },
              {},
              {},
              {},
              {
                text: 'USD 600',
                colSpan: 2,
                alignment: 'left',
                fontSize: 9
              },
              {}
            ],
            [
              {
                text: 'Refundable Security Fee',
                colSpan: 4,
                alignment: 'left',
                fontSize: 9
              },
              {},
              {},
              {},
              {
                text: 'USD 400',
                colSpan: 2,
                alignment: 'left',
                fontSize: 9
              },
              {}
            ],
            [
              {
                text: 'EMGS Visa, Medical Check-up, and Medical Insurance Lab Fee (Per Year) * (if applicable)',
                colSpan: 4,
                alignment: 'left',
                fontSize: 9
              },
              {},
              {},
              {},
              {
                text: 'USD 250',
                colSpan: 2,
                alignment: 'left',
                fontSize: 9,
                margin: [0, 5, 0, 5]
              },
              {}
            ],
            [
              {
                text: 'Pre-requisite Fee * (if applicable) ',
                colSpan: 4,
                alignment: 'left',
                fontSize: 9
              },
              {},
              {},
              {},
              {
                text: 'USD 500',
                colSpan: 2,
                alignment: 'left',
                fontSize: 9
              },
              {}
            ],
            [
              {
                text: 'English Course Fee per level *(if applicable)',
                colSpan: 4,
                alignment: 'left',
                fontSize: 9
              },
              {},
              {},
              {},
              {
                text: 'USD 375',
                colSpan: 2,
                alignment: 'left',
                fontSize: 9
              },
              {}
            ]
          ]
        },
        layout: 'Borders',
        margin: [0, 8, 0, 8]
      },
      {
        text: [
          'This offer is only applicable if you accept our admission offer, together with the payment of the EMGS visa processing fee, registration, and administrative fees. All payments made are neither transferable nor refundable. To accept this offer, please sign this Conditional Offer Letter and forward it to us along with the documents and proof of payment. Please refer to page number 3 for the list of documents required for our onward action. Upon receiving your documents, the International Students Office will contact and furnish you with further details on the course schedule and date of commencement.'
        ],
        alignment: 'justify',
        bold: false,
        fontSize: 9,
        margin: [0, 5, 0, 5]
      },
      {
        text: [
          'We take this opportunity to congratulate you on your successful application to study with us and look forward to welcoming you to the Lincoln University College fraternity.'
        ],
        alignment: 'justify',
        bold: false,
        fontSize: 9,
        margin: [0, 5, 0, 7]
      },
      {
        text: ['Registrar'],
        alignment: 'left',
        bold: true,
        fontSize: 10,
        margin: [0, 5, 0, 0]
      },
      {
        text: ['Lincoln University College'],
        alignment: 'left',
        bold: true,
        fontSize: 10,
        margin: [0, 0, 0, 5]
      },
      {
        text: ['This is computer generated document. No signature is necessary by the registrar.'],
        alignment: 'center',
        bold: false,
        fontSize: 7,
        margin: [0, 0, 0, 5]
      },
      {
        text: [
          'I hereby acknowledge that I have read and understood the content of the page very clearly and will abide by the conditions mentioned.'
        ],
        alignment: 'justify',
        bold: false,
        fontSize: 9,
        margin: [0, 3, 0, 0]
      },
      {
        text: ['Student’s signature: …………………………………….'],
        alignment: 'right',
        bold: false,
        fontSize: 9,
        margin: [0, 3, 0, 2]
      },
      {
        text: ['Date: …………………………………….'],
        alignment: 'right',
        bold: false,
        fontSize: 9,
        margin: [0, 0, 0, 0]
      },
      {
        text: ['1'],
        alignment: 'center',
        bold: true,
        fontSize: 9,
        margin: [0, 25, 0, 0]
      },
      {
        image: img,
        width: 140,
        height: 60
      },
      {
        alignment: 'justify',
        columns: [
          {
            width: '45%',
            stack: [
              {
                text: 'CONDITIONS OF ENTRY REQUIREMENTS',
                decoration: 'underline',
                bold: true,
                margin: [0, 30, 0, 10],
                fontSize: 11
              },
              {
                text: 'A conditional offer of admission is subject to the following terms and conditions being met to be officially admitted as a student at Lincoln University College',
                margin: [0, 0, 0, 10],
                fontSize: 9
              },
              {
                columns: [
                  {
                    width: 'auto',
                    text: '1.',
                    alignment: 'left',
                    margin: [0, 0, 10, 0]
                  },
                  {
                    width: '*',
                    text: 'As English is the medium of instruction for all programs from EMGS and LUC, you are required to provide certified evidence of your competency in English Language (IELTS, TOEFL, or MUET) as per the requirements of your program of study, particularly if English was not the medium of instruction in your earlier education. The university reserves the right to assess your language skills by using the English Placement Test to establish the extent of further development required through the LUC Intensive English Program, which must be completed before the commencement of your intended course of study.',
                    alignments: 'justify'
                  }
                ],
                margin: [0, 0, 0, 10],
                fontSize: 9
              },
              {
                columns: [
                  {
                    width: 'auto',
                    text: '2.',
                    alignment: 'left',
                    margin: [0, 0, 10, 0]
                  },
                  {
                    width: '*',
                    text: `For those students who are applying for a program with a poor CGPA, they are required to provide a minimum of 5 years of working experience or take pre-requisite courses.`
                  }
                ],
                margin: [0, 0, 0, 10],
                fontSize: 9
              },
              {
                columns: [
                  {
                    width: 'auto',
                    text: '3.',
                    alignment: 'left',
                    margin: [0, 0, 10, 0]
                  },
                  {
                    width: '*',
                    text: `The applicant must meet the minimum requirements and qualifications by the guidelines approved by:`
                  }
                ],
                margin: [0, 0, 0, 2],
                fontSize: 9
              },
              {
                text: 'I. Ministry of Higher Education (MOHE)',
                margin: [30, 0, 0, 0],
                fontSize: 9
              },
              {
                text: 'II. Malaysian Qualifications Agency (MQA)',
                margin: [30, 0, 0, 20],
                fontSize: 9
              },
              {
                text: 'PAYMENTS AND REFUNDS',
                decoration: 'underline',
                bold: true,
                margin: [0, 0, 0, 10],
                fontSize: 11
              },
              {
                text: `These items need to be paid for by the student in addition to their program fee, if applicable, such as: Airport Pick Up, Bank Letter, Travel Letter, Release Letter, Confirmation Letter, Certificate & Transcript, Student ID Card, Visa Renewal Fee, change of program, Dependent Pass, Special Pass, Endorsement Transfer, Penalties, Visa Cancellation, Re-Admission, Examination Slip, Supplementary Additional Semester, Accommodation, Food, and Living Expenses`,
                margin: [0, 0, 0, 10],
                fontSize: 9
              },
              {
                text: 'REFUND & PAYMENT POLICY',
                decoration: 'underline',
                bold: true,
                margin: [0, 0, 0, 0],
                fontSize: 11
              },
              {
                text: '(INTERNATIONAL STUDENT)',
                decoration: 'underline',
                bold: true,
                margin: [0, 0, 0, 10],
                fontSize: 11
              },
              {
                columns: [
                  {
                    width: 'auto',
                    text: '1.',
                    alignment: 'left',
                    margin: [10, 0, 10, 0]
                  },
                  {
                    width: '*',
                    text: 'Students must pay all fees due before they arrive in Malaysia.',
                    alignments: 'justify'
                  }
                ],
                margin: [0, 0, 0, 10],
                fontSize: 9
              },
              {
                columns: [
                  {
                    width: 'auto',
                    text: '2.',
                    alignment: 'left',
                    margin: [10, 0, 10, 0]
                  },
                  {
                    width: '*',
                    text: 'The EMGS visa processing fee, registration, and administrative fees paid are strictly NON-REFUNDABLE under any circumstances.',
                    alignments: 'justify'
                  }
                ],
                margin: [0, 0, 0, 10],
                fontSize: 9
              },
              {
                columns: [
                  {
                    width: 'auto',
                    text: '3.',
                    alignment: 'left',
                    margin: [10, 0, 10, 0]
                  },
                  {
                    width: '*',
                    text: 'Students must pay back the scholarship amount used up to date and all the administrative fees that have been waived in case of withdrawal',
                    alignments: 'justify'
                  }
                ],
                margin: [0, 0, 0, 10],
                fontSize: 9
              }
            ]
          },
          {
            width: '10%', // Bu bo'sh joy bo'lib xizmat qiladi
            text: ' '
          },
          {
            width: '45%',
            stack: [
              {
                columns: [
                  {
                    width: 'auto',
                    text: '4.',
                    alignment: 'left',
                    margin: [10, 0, 10, 0]
                  },
                  {
                    width: '*',
                    text: 'Lincoln University College reserves the right to utilize refundable deposits to offset outstanding amounts due to the university in the computation of refunds.',
                    alignments: 'justify'
                  }
                ],
                margin: [0, 0, 0, 10],
                fontSize: 9
              },
              {
                columns: [
                  {
                    width: 'auto',
                    text: '5.',
                    alignment: 'left',
                    margin: [10, 0, 10, 0]
                  },
                  {
                    width: '*',
                    text: 'If students fail to settle their fees by the respective due date, they shall be liable to pay late payment charges that shall be levied accordingly by the university. Also, in this case, LUC has the right to revoke or suspend any of the services, including examination and the Lincoln Learning System',
                    alignments: 'justify'
                  }
                ],
                margin: [0, 0, 0, 10],
                fontSize: 9
              },
              {
                columns: [
                  {
                    width: 'auto',
                    text: '6.',
                    alignment: 'left',
                    margin: [10, 0, 10, 0]
                  },
                  {
                    width: '*',
                    text: 'The student’s responsibility is to finish the program within the specified period in the offer letter. Failure to do so means the student will pay for every additionalsemester or subject.',
                    alignments: 'justify'
                  }
                ],
                margin: [0, 0, 0, 10],
                fontSize: 9
              },
              {
                text: 'ACKNOWLEDGEMENTS',
                decoration: 'underline',
                bold: true,
                margin: [0, 0, 0, 10],
                fontSize: 11
              },
              {
                columns: [
                  {
                    width: 'auto',
                    text: '1.',
                    alignment: 'left',
                    margin: [10, 0, 10, 0]
                  },
                  {
                    width: '*',
                    text: 'I acknowledge that once my visa application has been approved by Malaysian immigration, I’m required to pay the firstyear tuition fees plus the miscellaneous fees before arriving in Malaysia.',
                    alignments: 'justify'
                  }
                ],
                margin: [0, 0, 0, 10],
                fontSize: 9
              },
              {
                columns: [
                  {
                    width: 'auto',
                    text: '2.',
                    alignment: 'left',
                    margin: [10, 0, 10, 0]
                  },
                  {
                    width: '*',
                    text: 'I acknowledge that I am required to appear immediately at the LUC International Students Office Department (INSO) within 3 working days from my arrival date. If I delay, Lincoln University has the right to impose a penalty and lodge a police report against me.',
                    alignments: 'justify'
                  }
                ],
                margin: [0, 0, 0, 10],
                fontSize: 9
              },
              {
                columns: [
                  {
                    width: 'auto',
                    text: '3.',
                    alignment: 'left',
                    margin: [10, 0, 10, 0]
                  },
                  {
                    width: '*',
                    text: 'I acknowledge that I must inform my representative or counselor 14 working days before I arrive in Malaysia, and I or my representative must fill up the LUC online arrival form. As well as ensuring that I have obtained my Single Entry Visa from the Malaysian Embassy if required.',
                    alignments: 'justify'
                  }
                ],
                margin: [0, 0, 0, 10],
                fontSize: 9
              },
              {
                columns: [
                  {
                    width: 'auto',
                    text: '4.',
                    alignment: 'left',
                    margin: [10, 0, 10, 0]
                  },
                  {
                    width: '*',
                    text: 'I acknowledge that I must maintain a minimum of 80% class attendance in each subject. I also acknowledge that a warning letter will be issued if I become absent from three classes, a police report will be filed, and a checkout memo will be issued by LUC. (Cancellation of visa).',
                    alignments: 'justify'
                  }
                ],
                margin: [0, 0, 0, 10],
                fontSize: 9
              },
              {
                columns: [
                  {
                    width: 'auto',
                    text: '5.',
                    alignment: 'left',
                    margin: [10, 0, 10, 0]
                  },
                  {
                    width: '*',
                    text: 'I acknowledge that working in Malaysia is not allowed, only part-time during the semester break, and it is subject to immigration approval.',
                    alignments: 'justify'
                  }
                ],
                margin: [0, 0, 0, 10],
                fontSize: 9
              }
            ]
          }
        ]
      },
      {
        text: ['This is computer generated document. No signature is necessary by the registrar.'],
        alignment: 'center',
        bold: false,
        fontSize: 7,
        margin: [0, 20, 0, 5]
      },
      {
        text: [
          'I hereby acknowledge that I have read and understood the content of the page very clearly and will abide by the conditions mentioned.'
        ],
        alignment: 'justify',
        bold: false,
        fontSize: 9,
        margin: [0, 3, 0, 0]
      },
      {
        text: ['Student’s signature: …………………………………….'],
        alignment: 'right',
        bold: false,
        fontSize: 9,
        margin: [0, 3, 0, 2]
      },
      {
        text: ['Date: …………………………………….'],
        alignment: 'right',
        bold: false,
        fontSize: 9,
        margin: [0, 0, 0, 0]
      },
      {
        text: ['2'],
        alignment: 'center',
        bold: true,
        fontSize: 9,
        margin: [0, 25, 0, 0]
      },
      {
        image: img,
        width: 140,
        height: 60
      },
      {
        text: 'LIST DOCUMENTS REQUIRED:',
        decoration: 'underline',
        bold: true,
        margin: [0, 20, 0, 10],
        fontSize: 11
      },
      {
        margin: [0, 10, 0, 0],
        table: {
          headerRows: 1,
          widths: ['8%', '52%', '20%', '20%'],
          body: [
            [
              { text: 'NO', bold: true, alignment: 'center', fontSize: 10, margin: [0, 5, 0, 0] },
              {
                text: 'DOCUMENT',
                bold: true,
                alignment: 'center',
                fontSize: 10,
                margin: [0, 5, 0, 0]
              },
              { text: 'UNDERGRADUATES PROGRAM', bold: true, alignment: 'center', fontSize: 10 },
              { text: 'POSTGRADUATES PROGRAM', bold: true, alignment: 'center', fontSize: 10 }
            ],
            [
              { text: '1', alignment: 'center', fontSize: 8, margin: [0, 5, 0, 0] },
              {
                text: 'Passport All pages including Blank Pages',
                fontSize: 8,
                margin: [0, 5, 0, 0]
              },
              { image: iconImg, width: 20, height: 20, alignment: 'center' },
              { image: iconImg, width: 20, height: 20, alignment: 'center' }
            ],
            [
              { text: '2', alignment: 'center', fontSize: 8, margin: [0, 5, 0, 0] },
              {
                text: 'Applicant’s Photo with WHITE Background (size 35mm x 45mm)',
                fontSize: 8,
                margin: [0, 5, 0, 0]
              },
              { image: iconImg, width: 20, height: 20, alignment: 'center' },
              { image: iconImg, width: 20, height: 20, alignment: 'center' }
            ],
            [
              { text: '3', alignment: 'center', fontSize: 8, margin: [0, 5, 0, 0] },
              {
                text: 'Academic Certificates (Original and Translated in English)',
                fontSize: 8,
                margin: [0, 5, 0, 0]
              },
              { image: iconImg, width: 20, height: 20, alignment: 'center' },
              { image: iconImg, width: 20, height: 20, alignment: 'center' }
            ],
            [
              { text: '4', alignment: 'center', fontSize: 8, margin: [0, 5, 0, 0] },
              {
                text: 'Academic Transcripts (Original and Translated in English)',
                fontSize: 8,
                margin: [0, 5, 0, 0]
              },
              { image: iconImg, width: 20, height: 20, alignment: 'center' },
              { image: iconImg, width: 20, height: 20, alignment: 'center' }
            ],
            [
              { text: '5', alignment: 'center', fontSize: 8, margin: [0, 5, 0, 0] },
              {
                text: [
                  'Health Status Declaration Form* ',
                  {
                    text: 'Download here',
                    link: 'https://visa.educationmalaysia.gov.my/media/docs/Lampiran_B_-_Health_Declaration_Form_For_Applicant.pdf', // Add your actual link here
                    color: '#1e90ff',
                    decoration: 'underline'
                  }
                ],
                fontSize: 8,
                margin: [0, 5, 0, 0]
              },
              { image: iconImg, width: 20, height: 20, alignment: 'center' },
              { image: iconImg, width: 20, height: 20, alignment: 'center' }
            ],
            [
              { text: '6', alignment: 'center', fontSize: 8, margin: [0, 5, 0, 0] },
              { text: 'Admission Form', fontSize: 8, margin: [0, 5, 0, 0] },
              { image: iconImg, width: 20, height: 20, alignment: 'center' },
              { image: iconImg, width: 20, height: 20, alignment: 'center' }
            ],
            [
              { text: '7', alignment: 'center', fontSize: 8, margin: [0, 5, 0, 0] },
              { text: 'Copy of payment fee receipt', fontSize: 8, margin: [0, 5, 0, 0] },
              { image: iconImg, width: 20, height: 20, alignment: 'center' },
              { image: iconImg, width: 20, height: 20, alignment: 'center' }
            ],
            [
              { text: '8', alignment: 'center', fontSize: 8, margin: [0, 5, 0, 0] },
              { text: 'CV/Resume', fontSize: 8, margin: [0, 5, 0, 0] },
              {},
              { image: iconImg, width: 20, height: 20, alignment: 'center' }
            ],
            [
              { text: '9', alignment: 'center', fontSize: 8, margin: [0, 5, 0, 0] },
              { text: 'Working Experience if available', fontSize: 8, margin: [0, 5, 0, 0] },
              {},
              { image: iconImg, width: 20, height: 20, alignment: 'center' }
            ]
          ]
        }
      },
      {
        text: [
          '* All documents must be color scanned (as per original size), including Passport pages and visa information pages, and emailed to ',
          {
            text: 'imd@lincoln.edu.my',
            link: 'mailto:imd@lincoln.edu.my', // Creates a mailto link
            color: '#1e90ff',
            decoration: 'underline'
          }
        ],
        fontSize: 10,
        margin: [0, 20, 0, 20]
      },
      {
        text: 'PAYMENT INSTRUCTION',
        decoration: 'underline',
        bold: true,
        margin: [0, 10, 0, 10],
        fontSize: 11
      },
      {
        table: {
          widths: ['50%', '50%'],
          body: [
            [
              {
                text: 'ACCOUNT TYPE: LOCAL (Malaysia)',
                bold: false,
                fontSize: 10,
                margin: [0, 5, 0, 5]
              },
              { text: 'ACCOUNT NO: 21234900055082', bold: true, fontSize: 10, margin: [0, 5, 0, 5] }
            ],
            [
              {
                text: 'ACCOUNT TYPE: INTERNATIONAL (USD)',
                bold: false,
                fontSize: 10,
                margin: [0, 5, 0, 5]
              },
              { text: 'ACCOUNT NO: 61234900001886', bold: true, fontSize: 10, margin: [0, 5, 0, 5] }
            ],
            [
              { text: 'NAME OF THE BANK:', bold: false, fontSize: 10, margin: [0, 5, 0, 5] },
              { text: 'RHB BANK', bold: true, fontSize: 10, margin: [0, 5, 0, 5] }
            ],
            [
              { text: 'BANK ACCOUNT NAME:', bold: false, fontSize: 10, margin: [0, 5, 0, 5] },
              {
                text: 'LINCOLN HIGHER LEARNING SDN BHD',
                bold: true,
                fontSize: 10,
                margin: [0, 5, 0, 5]
              }
            ],
            [
              { text: 'SWIFT CODE:', bold: false, fontSize: 10, margin: [0, 5, 0, 5] },
              { text: 'RHBBMYKL', bold: true, fontSize: 10, margin: [0, 5, 0, 5] }
            ],
            [
              { text: 'BANK ADDRESS:', bold: false, fontSize: 10, margin: [0, 5, 0, 5] },
              {
                text: '2G & 2M, Jalan SS21/ 39, Damansara Utama, 47400 Petaling Jaya, Selangor, Malaysia',
                bold: true,
                fontSize: 10,
                margin: [0, 5, 0, 5]
              }
            ],
            [
              { text: 'Tel:', bold: false, fontSize: 10, margin: [0, 5, 0, 5] },
              { text: '+ 60-3- 7726 2306', bold: true, fontSize: 10, margin: [0, 5, 0, 5] }
            ],
            [
              { text: 'Fax:', bold: false, fontSize: 10, margin: [0, 5, 0, 5] },
              { text: '+ 60-3- 7726 2305', bold: true, fontSize: 10, margin: [0, 5, 0, 5] }
            ]
          ]
        }
      },
      {
        text: ['This is computer generated document. No signature is necessary by the registrar.'],
        alignment: 'center',
        bold: false,
        fontSize: 7,
        margin: [0, 20, 0, 5]
      },
      {
        text: [
          'I hereby acknowledge that I have read and understood the content of the page very clearly and will abide by the conditions mentioned.'
        ],
        alignment: 'justify',
        bold: false,
        fontSize: 9,
        margin: [0, 3, 0, 0]
      },
      {
        text: ['Student’s signature: …………………………………….'],
        alignment: 'right',
        bold: false,
        fontSize: 9,
        margin: [0, 3, 0, 2]
      },
      {
        text: ['Date: …………………………………….'],
        alignment: 'right',
        bold: false,
        fontSize: 9,
        margin: [0, 0, 0, 0]
      },
      {
        text: ['3'],
        alignment: 'center',
        bold: true,
        fontSize: 9,
        margin: [0, 25, 0, 0]
      }
    ],
    styles: {
      header: { fontSize: 10, bold: true },
      subheader: { fontSize: 10, bold: true },
      normal: { fontSize: 10 },
      bold: { fontSize: 10, bold: true },
      tableExample: { margin: [0, 0, 0, 0] },
      tableWithBackground: {
        margin: [0, 0, 0, 0],
        fontSize: 10
      }
    },
    pageSize: 'A4',
    pageMargins: [40, 20, 40, 5]
  }

  pdfMake.createPdf(docDefinition).download('offerLetter.pdf')
}

const img =
  'data:image/png;base64,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'
const iconImg =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfoAAAGiCAYAAAAPyATTAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAB4gSURBVHhe7d0H9J7j3Qfwy3qN1o5RW21atdWOGElkSIiICGrW3lTQcqqoGTM2ESNkSIwgMkQirdUaLXqMGgdFbUoVfd9ed6/0bVXyPPeT/3ie6/l8zulJn9852tOef/LNfd3X8/vO9r//EACALM2efgUAMiToASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboASBjgh4AMiboAaCkL7/8MgwZMiR9qm+CHgBK+Oyzz0Lv3r3D3nvvHU444YQ0rV+z/e8/pH8PAMzERx99FHr06BGmTJmSJiGcddZZ4fjjj0+f6o+gB4AqvP3226FLly7h8ccfT5P/d8UVV4QDDjggfaovgh4AKnj11VfDdtttF5577rk0+U+zzz57GDZsWOjbt2+a1A9BDwAz8eyzz4btt98+vPbaa2nyzeaaa65wxx13FE/99UTQA8AMPPbYY6Fr167hnXfeSZOZm2+++cK4cePC5ptvnibtz617APgGkydPDp06dao65KMY9PPMM0/6VB8EPQB8ze233148yX/88cdpUtkyyyxT3MbfYIMN0qQ+CHoA+DfXX3992HnnncNf//rXNKls1VVXDdOmTQtrrLFGmtQPQQ8AyQUXXFAswvnqq6/SpLJ11103TJ06NSy33HJpUl8EPQD8w09/+tNw1FFHhTJ31LfYYoviXf7iiy+eJvXHrXsAmlqMwcMOOyxceumlaVKdbt26hREjRoR55503TeqToAegacVymr322ivcfPPNaVKd/v37F+/y55xzzjSpX47uAWhKsZymV69epUP+0EMPDTfeeGNDhHwk6AFoOh9++GHo3LlzGDt2bJpU52c/+1m4+OKLw2yzzZYm9c/RPQBNZWblNDMSg33QoEHhiCOOSJPGIegBaBqvvPJKUU7z/PPPp0ll8Yj+mmuuCXvuuWeaNBZBD0BTqLac5t/Fdba33npr6NmzZ5o0HkEPQPZiOU08rn/33XfTpLL555+/aKPr2LFjmjQml/EAyNr9999flNOUCfkOHToU/1yjh3wk6AHIVi3lNMsuu2yx0nb99ddPk8Ym6AHI0pAhQ4pyms8//zxNKovlNA8++GBYffXV06TxCXoAshPLafbZZ5/S5TQx5Ou1nKZWgh6ArNRSTrPlllsW5TSLLbZYmuTDrXsAshDjLK6nHTx4cJpUp0ePHmH48OHFV+lyJOgBaHhffPFFUU4zbNiwNKnOgAEDwnXXXdcwe+tr4egegIY2vZymbMjHatqhQ4dmHfKRoAegYU0vp7n77rvTpDqnnHJKuOiiixqqnKZWju4BaEixnCaG/BNPPJEmlcVgjzfyDz/88DTJn6AHoOHUWk5z7bXXhj322CNNmoOgB6ChxHKaGPKvv/56mlSWQzlNrQQ9AA3j0UcfLVbaltlbv8ACCxTlNFtttVWaNBeX8QBoCJMmTSpdThMX4MRymmYN+UjQA1D3xowZE3bYYYfwySefpEll08tp1ltvvTRpToIegLoWF9r06dOnVDnNaqutFqZNm1b82uwEPQB1a9CgQWHfffctVU4Tn+Djk3x8okfQA1CnTj755HD00UeXKqeJ7+LjO/kcy2lq5dY9AHXl73//e1FOc9lll6VJdXIvp6mVoAegbsRymj333DPccsstaVKduAQnLsPJfW99LRzdA1AXppfTlA35uM72+uuvF/IzIOgBaHexnGb77bcvXU5z6qmnhgsvvLApymlq5egegHb11ltvhS5dupQup4kBH6tmmTlBD0C7efnll4u99S+88EKaVBaP6ON36wcMGJAmzIygB6BdPPPMM8VxfdlymhEjRoTu3bunCZUIegDaXK3lNHfeeWfYcsst04RquIwHQJuaOHFizeU0Qr48QQ9Amxk9enTo1q1bqXKa5ZZbTjnNLBD0ALSJeIFul112KVVOs/rqq4cHH3xQOc0sEPQAtLrzzz+/dDnN+uuvr5ymBQh6AFrVSSedFI455phS5TQdO3Ys3sl36NAhTaiVW/cAtIpYTnPIIYeEyy+/PE2q07Nnz3Drrbcqp2khnugBaHGxnGb33XcvHfKx0GbUqFFCvgUJegBaVCyn2XHHHUuX0xxxxBFhyJAhymlamKAHoMV88MEHxUrbe+65J02q8/Of/zxccMEFymlagXf0ALSIWE7TuXPn8OSTT6ZJZTHYL7roonDooYemCS1N0AMwy2otp4lH9fFdPq1H0AMwS2I5TQz5N954I00qm3feecPw4cOV07QBQQ9AzR555JGwww47lNpbv+CCCxblNFtssUWa0JpcxgOgJrGcZptttikV8osvvnixCEfItx1BD0Bpt912W03lNHFv/brrrpsmtAVBD0ApsZymb9++pcpp1lhjjTBt2rSwyiqrpAltRdADULXzzjuvdDnNBhtsEKZMmRKWWWaZNKEtCXoAqnLiiSeGY489tlQ5zdZbbx0mTZqknKYduXUPwEzVWk4T1+DGcpq55547TWgPgh6AGYrlNHvssUcR2GXstdde4ZprrglzzDFHmtBeHN0D8I0+/fTTfz2Vl3HkkUcWF/aEfH0Q9AD8l1hOs/3225cupznttNPCoEGDlNPUEUf3APyHN998syineeqpp9Kkshjsl1xySTj44IPThHoh6AH4l1rLaa6//vrQv3//NKGeCHoACk8//XRxXF+2nGbEiBHFljzqk6AHIDz88MNFOc17772XJpUpp2kMLuMBNLkJEyaEbbfdtlTIx3KayZMnC/kGIOgBmtioUaNKl9Msv/zyRTnNOuuskybUM0EP0KSuvfbasOuuu4a//e1vaVKZcprGI+gBmtC5555bupxmww03DFOnTg1LL710mtAIBD1Akxk4cGA47rjj0qfqdOrUqSinWXTRRdOERuHWPUCTiOU0caHNFVdckSbV6dWrV7jllluU0zQoT/QATSCW0+y2226lQ37vvfcOI0eOFPINTNADZC6W0/Ts2TMMHz48Tapz1FFHaaDLgKAHyFgsp4krbe+99940qU4spzn//POV02TAO3qATNVSTjP77LMX5TQHHXRQmtDoBD1Ahl566aXiSf7FF19Mk8rmmmuuMHTo0NCvX780IQeCHiAztZbTxC15Xbt2TRNyIegBMlJrOc1dd90VNt988zQhJy7jAWQiltNss802pUJ+iSWWKMpphHy+BD1ABqaX0/zlL39Jk8pWWGEF5TRNQNADNLj4Xfey5TRrrrlmEfIrr7xympArQQ/QwM4555yw3377lSqn2WijjcKUKVOU0zQJQQ/QoE444YRw/PHHp0/Vie/wJ06cqJymibh1D9BgYjlNXGhz5ZVXpkl1evfuHYYNG2ZvfZPxRA/QQKaX05QN+VhOM2LECCHfhAQ9QIOI5TQ9evQoXU5zzDHHKKdpYoIeoAG8//77xUrbcePGpUl1Tj/99HDuuecqp2li3tED1LlYThNX2v7ud79Lk8piOc2ll14aDjzwwDShWQl6gDqmnIZZJegB6tTvf//7oma2TDnNfPPNF0aOHKmchn8R9AB16KGHHirKaeK7+WottNBCRTnNZpttlibgMh5A3Rk/fnzYdtttS4X8kksuGR544AEhz38R9AB1JB67d+/evXQ5zdSpU8Paa6+dJvD/BD1Anbj66quLC3RlymnWWmutMG3aNOU0zJCgB6gDZ599dth///1LldNsvPHGRTnNUkstlSbw3wQ9QDv7yU9+UvyrjPgOf8KECWGRRRZJE/hmbt0DtJNYThMX2lx11VVpUp2dd9453HzzzeF//ud/0gRmzBN9G3n22WeLMgqAKL6Hj+U0ZUN+n332CbfeequQp2qCvg08+uijYZNNNgl9+/YV9kBxo76Wcppjjz1WOQ2lObpvZTHk4/rKDz/8sPjcq1ev4jd3XFEJNJ/43fhu3bqFX//612lSnTPOOCMMHDgwfYLqCfpW9PWQn07YQ3OqtZxm8ODB4cc//nGaQDmCvpXMKOSnE/bQXP74xz8WfybEX6sV/3y48cYbi9d+UCtB3woqhfx0wh6aQyyniU/yf/rTn9KkslhOM2rUqNClS5c0gdoI+hZWbchPJ+whb/FdfHwnX7acZuzYsWHTTTdNE6idW/ctbJ555in1tZcxY8a4jQ+Zuu+++4q/+NdSTiPkaSmCvoV9//vfDxMnTgyLLbZYmlQm7CE/sZwmfoWuTDnNiiuuGB588EHlNLQoQd8KhD00t1hOs+uuu5Yup4khv9JKK6UJtAxB30qEPTSns846qyiniettq6WchtYk6FtRrWEfnwSEPTSeWExzwgknpE/VieU08c8J5TS0Frfu20BcjrHNNtuEP//5z2lSWe/evYt91m7jQ/2LT+9xoU08si9DOQ1twRN9G6jlyX706NGe7KEBxPfw/fr1Kx3y++23n3Ia2oSgbyPCHvIzvZxmxIgRaVKd4447rmitU05DW3B038Yc40Me4nfjd9hhh/DQQw+lSXXOPPPM0u/xYVYI+nYg7KGxxVW2caVtXG1brVhOc9lll4UDDjggTaBtCPp2EsO+U6dO4Z133kmTyoQ9tL9aymnie/gbbrhBOQ3tQtC3I2EPjSX+nu3cuXOpcppvfetb4bbbbitOAKA9CPp2JuyhMdRSTrPwwgsX5TSbbLJJmkDbc+u+ncXb+JMmTQodOnRIk8ribfz4dR638aFtxHKauNimlnIaIU97E/R1oJawj0eBwh5aX/zqXPwK3aeffpomlX33u98N06ZNK35vQ3sT9HVC2EP9id91j7/HypTTfO973yvKaWLYQz0Q9HVE2EP9+OUvf1l8Fa5MOU08po/lNN/5znfSBNqfoK8zwh7aXyynGThwYPpUnXirfvz48cUFPKgnbt3XqVpu4++0007hlltucRsfalRrOU2fPn3CTTfdZG89dckTfZ3yZA9tK76Hj90SymnIjaCvY8Ie2kYsp+nevXsYOXJkmlTn+OOPLy7sxfW2UK8c3TcAx/jQemotpznrrLOKoId6J+gbxFNPPVUU4ZQN+3ikOOecc6YJ8O9qLae54ooriiN7aASCvoEIe2g5L774YlFO89JLL6VJZfE9/I033hh22WWXNIH6J+gbjLCHWRdfh8Un+TfffDNNKlNOQ6MS9A1I2EPtai2nufvuu8MPf/jDNIHG4apoA1p77bXDxIkTS9/Gj18d+vLLL9MEms+4ceNKl9PELXdx252Qp1EJ+gYl7KGc4cOHh549e9ZUThP310OjEvQNTNhDda688sqw2267lSqniXssYjnNiiuumCbQmAR9gxP2MHNnnnlmsda2bDlN7JJXTkMOBH0GhD18s7jQ5sQTT0yfqtO5c+cwYcIE5TRkw637jLiND//01VdfFU/x11xzTZpUp2/fvuGGG26wt56sCPrMCHuaXXwP379//zBq1Kg0qc7+++8fLr/8cnvryY6f6MxMP8ZfdNFF06SyeIwfi3Ac49PoPvnkk+I78mVDPvbPxwt7Qp4ceaLPVHyyj0U47777bppUtvPOOxdFOJ7saUTvvfdeUU7z8MMPp0l1zj777HDcccelT5AfQZ8xYU+zeOONN4rVtE8//XSaVDbHHHMU5TT77rtvmkCeBH3mhD25q7Wc5uabby5+1iF3gr4JCHtyFX+249fhypbTjB49uvjLATQDQd8khD25+dWvflVcvPvggw/SpLJFFlkkjB071t56moorpk0i3safNGlSqdv48eay2/jUo1hOE5/Iy4T8UkstpZyGpiTom4iwJwdx50OPHj1KldOstNJKxd76tdZaK02geQj6JiPsaWTxlnxchvPFF1+kSWXxZ145Dc1M0DehWsM+tn8Je9pLLKc58MADS5XTbLrppkU5zZJLLpkm0HwEfZOqJexHjhwp7GkXcaFNLeU048ePDwsttFCaQHNy677JPfnkk8Vu/DK38fv06ROGDRvmNj6trtZymtjMGMtp5pprrjSB5uWJvsn94Ac/KL0b35M9beHzzz8v2uTKhnz8i0FchiPk4Z8EPcKeuhPLabp3714ULpUxcOBADXTwNY7u+RfH+NSDWstpzjnnnHDsscemT8B0gp7/IOxpT8ppoOUJev6LsKc9vPDCC8W2u5dffjlNKpt77rmL9/E77bRTmgBfJ+j5RsKethR/3uLX4d566600qezb3/52GDNmTPFzCsyYoGeGhD1tYdq0acXFu7LlNPfcc0/YaKON0gSYEVdTmaFab+PHFaVu41ONe++9t3gnX0s5jZCH6gh6ZqqWsB8xYoSwp6JYgdyzZ89S5TQrr7xycQKgnAaqJ+ipSNjT0uJ33XffffdS5TTx5zCW06ywwgppAlRD0FOV+IfshAkThD2z7IwzzggHHXRQqXKazTbbLEyePDksscQSaQJUS9BTtXXWWUfYM0viQpuTTjopfapO165dw3333aecBmrk1j2lPfHEE2HbbbctdRt/l112Kb7v7DZ+c4rlNAcccEC49tpr06Q6/fr1C0OHDrW3HmaBJ3pK82RPGbGcJv5Fr2zIx+75m266ScjDLBL01ETYU41YTtOtW7cwevToNKlO7J6/7LLLlNNAC3B0zyxxjM+MxHKa+H79kUceSZPKZptttnDuueeGo48+Ok2AWSXomWXCnq97/fXXi0U4zzzzTJpUFstprrrqqrD33nunCdASBD0topaw79u3b/EOVtjnpdZymrg6uXfv3mkCtBRBT4sR9iingfrjpgstppYLesOHDy82pLmg1/jiatqOHTuWCvn4sxK3Lgp5aD2CnhYl7JtTbJIrW06z9NJLK6eBNiDoaXHTwz5WiVZL2DeuWE6z44471lROs+aaa6YJ0FoEPa0ihn08khX2eYvfda+1nGb55ZdPE6A1CXpajbDP2+mnnx4OPvjgUuU0m2++eXjggQeU00AbEvS0KmGfn/hFnWOOOSacfPLJaVKdHXbYoSinWXDBBdMEaAu+XkebiF+9izer47a0avnqXf2J5TT7779/uO6669KkOsppoP14oqdNeLJvfNPLacqGfOyeV04D7UfQ02ZmJezjkyTtJ5bTxKP3suU0sXt+8ODBymmgHTm6p83Veowfd+PHfei0rbjpMIZ82XKa8847Lxx11FFpArQXQU+7EPaNodZymquvvjr86Ec/ShOgPQl62o2wr2/PP/98UU7zyiuvpEllsZwmLtDp1atXmgDtTdDTroR9faq1nOb2228PnTp1ShOgHrghQ7uq9YJe//79XdBrJXFr3VZbbVW6nGbSpElCHuqQoKfdxbCvZTe+sG95d999d/FO/sMPP0yTypZZZpkwderUsOGGG6YJUE8EPXVh3XXXFfbtbNiwYcW79c8++yxNKltllVWKE4A11lgjTYB6I+ipG8K+/cRymgEDBpQqp4knMcppoP4JeupKrWFvqU7tfvGLX9RUTjN58uSw+OKLpwlQr9y6py49/vjjYdttty11G3/XXXctVq26jV+d+Fs/ltMMGjQoTaoTl+eMHDkyzDvvvGkC1DNBT90S9q0nnn7st99+YciQIWlSnfiaJP4z9tZD43B0T92q5Rj/1ltvdYxfQSyn6dOnT+mQP+SQQ8KNN94o5KHBCHrqmrBvWdPLacaMGZMm1Ynd85dcckmxwx5oLI7uaQiO8WddLKfp2rVrePTRR9Okshjs559/fjjyyCPTBGg0gp6GIexr99prrxWLcJ599tk0qSz+f3bNNdeEvfbaK02ARiToaSjCvrxay2niK5Add9wxTYBGJehpOL/97W+LsH///ffTpLJmDftYGhTLad5+++00qWz++ecvymm23nrrNAEamct4NJz11luvuKC38MILp0llzXhBL26t69ixY6mQ79ChQ1FOI+QhH4KehlRr2Mc1r80Q9rWW00yZMiVssMEGaQLkQNDTsGoJ+1tuuSX7sI9d/WXLaVZdddUwbdo05TSQIUFPQxP2/2nw4MGly2niroJYM7vccsulCZATQU/DE/b/dNpppxXb68rcr91yyy2V00Dm3LonG7Xcxu/Xr1+x1rWRb+PH38JHH310uOCCC9KkOt26dQsjRoxQTgOZE/RkpdnCPp5I7LvvvuH6669Pk+rEcpr4z8w555xpAuTK0T1ZaaZj/FhOs/POO5cO+UMPPbT4i42Qh+Yg6MlOM4T9xx9/XJTTxMU2ZfzsZz8LF198sXIaaCKO7slWrsf477zzTlFO89hjj6VJZTHYBw0aFI444og0AZqFoCdruYV9LeU08Yg+ltPsueeeaQI0E0FP9moJ+9122y3ccMMNdRX2sZwm/u949dVX06SyeeaZp9gI2LNnzzQBmo2gpyk0etjH1r4uXbqULqe54447in33QPNyGY+mUMsFvWHDhoU99tij3S/oxa11sWSmbDnN/fffL+QBQU/zaMSwHzt2bFEzW6acZtllly3+crD++uunCdDMBD1NpZHCvtZymlhPu/rqq6cJ0OwEPU2nEcL+0ksvLb7X/+WXX6ZJZbGcJoa8chrg3wl6mlI9h30sp4nb68rck51eTrPYYoulCcA/uXVPU6un2/jxt+JRRx0VLrzwwjSpTo8ePcLw4cOLr9IBfJ2gp+nVQ9jHU4Jaymni8f51111nbz0wQ47uaXq1HuPHTXMtcYxfaznNYYcdFoYOHSrkgZkS9PAPMezHjx9fKuzjrfhZDftYThP31pctpznllFPCRRddpJwGqMjRPfyb3/zmN2G77bYrdYwfu93jk3XZY/xay2kuuOCCcPjhh6cJwMwJeviatgj7WE4T/zv+8Ic/pEll8Yj+2muvLW7+A1RL0MM3aM2wf+6554r/7LLlNPFmfbxhD1CGoIcZaI2wr6WcZoEFFijKabbaaqs0Aaiey3gwA3FXfEte0JsyZUpRMlMm5OMCnFhOI+SBWgl6mImWCvu77rqreJL/6KOP0qSy6eU08RsBALUS9FDBrIb9TTfdFHr37l2qnGa11VYL06ZNK34FmBXe0UOVanlnv/HGG4dHHnmk1N76+AR/77332lsPtAhBDyXUEvZlxHfx8eJdvIAH0BIc3UMJtRzjVyt+dS4+yQt5oCUJeihpetgvtNBCaTLr4hKc2267TQMd0OIEPdQghn0swmmJsI/rbGOhjXIaoDUIeqhRS4T9qaeeWvTPK6cBWovLeDCL4gW92Gf/wQcfpEllMdhjwMeqWYDWJOihBZQJ+3hEf91114UBAwakCUDrEfTQQqoJ+3jZbsSIEaF79+5pAtC6BD20oJmFffza3J133hm23HLLNAFofYIeWtg3hX3ccjdu3Liw7rrrpglA23DrHlrY12/jL7fcckU5jZAH2oOgh1YwPew32WST8OCDDyqnAdqNo3sAyJgnegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgIwJegDImKAHgGyF8H+bCYY0VY111QAAAABJRU5ErkJggg=='
;
</script>