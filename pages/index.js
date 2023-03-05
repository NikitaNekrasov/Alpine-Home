import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import CSVFileValidator from 'csv-file-validator'

export default function Home() {
  const requiredError = (headerName, rowNumber, columnNumber) => {
    return `${headerName} is required in row: ${rowNumber}`
  }

  const stringError = (headerName, rowNumber, columnNumber) => {
    return `${headerName} is not a string in row: ${rowNumber}`
  }

  const floatError = (headerName, rowNumber, columnNumber) => {
    return `${headerName} is not a float in row: ${rowNumber}`
  }

  const integerError = (headerName, rowNumber, columnNumber) => {
    return `${headerName} is not an integer in row: ${rowNumber}`
  }

  const isInputString = function (input) {
    return typeof input === "string"
  }

  const isInputFloat = function (input) {
    const floatRegex = /^-?\d+(?:[.,]\d*?)?$/
    if (!floatRegex.test(input)) return false

    const floatVal = parseFloat(input)
    if (isNaN(floatVal)) return false
    return true;
  }

  const isInputInteger = function (input) {
    const intRegex = /^-?\d+$/
    if (!intRegex.test(input))
        return false;

    const intVal = parseInt(input, 10)
    return parseFloat(input) == intVal && !isNaN(intVal)
  }

  const csvSchema = {
    headers: [
      { name: 'Model Number', inputName: 'modelNumber', required: true, requiredError, validate: isInputString, validateError: stringError },
      { name: 'Unit Price', inputName: 'lastName', required: true, requiredError, validate: isInputFloat, validateError: floatError },
      { name: 'Quantity', inputName: 'quantity', required: true, requiredError, validate: isInputInteger, validateError: integerError },
    ],
    isColumnIndexAlphabetic: true
  }

  async function isValidCsv(file, createError, path) {
    return new Promise(async (resolve, reject) => {
      CSVFileValidator(file, csvSchema)
        .then(csvData => {
          let errors = ''
          csvData.inValidData.forEach(item => {
            errors += (item.message + '\n')
          })
          if(errors === '') {
            resolve(true)
          } else {
            resolve(createError({ 
              path,
              message: errors
            }))
          }
        })
    }, )
  }

  const formSchema = Yup.object().shape({
    date: Yup.date().required('Date is required'),
    vendorName: Yup.string().required('Vendor name is required'),
    file: Yup.mixed().required('File (CSV) is required')
      .test('required', 'You need to provide a file', (fileList) => fileList[0] ? true : false)
      .test('is-valid-type', 'Only CSV files are supported', fileList => {
        const fileExtension = fileList[0]?.name?.split('.').pop()
        return ['csv', 'CSV'].includes(fileExtension)
      })
      .test(
        'valid-csv-schema', 
        async (value, { createError, path }) => {
          const valid = await isValidCsv(value[0], createError, path)
          return valid
        }
      ),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(formSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        '/.netlify/functions/formHandler',
        {
          method: 'POST',
          body: JSON.stringify({
            query: data,
          }),
        }
      );
    } catch (err) {
      console.log(err);
    } finally {
      setValue('date', '');
      setValue('vendorName', '');
      setValue('file', '');
    }
  }

  return (
    <>
      <Head>
        <title>Nikita Alpine Form</title>
        <meta name="description" content="Alpine Home Air Project" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <main> */}
      <main className={styles.main}>
        <div className={styles.center}>
        {/* <div> */}
          <form
            className="mt-8 space-y-6"
            action="#"
            method="POST"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* date field */}
            <div className="form-group mb-4">
              <label
                htmlFor="dateInput"
                className="form-label inline-block mb-2 text-gray-700 font-medium"
              >
                Date
              </label>
              <input
                type="datetime-local"
                className="form-control
                block
                w-full
                px-3
                py-1.5
                text-base
                font-normal
                text-gray-700
                bg-white bg-clip-padding
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
                required
                {...register('date')}
                id="dateInput"
                aria-describedby="dateInfo"
                data-test-id="dateInput"
              />
              {errors.date && (
                <small
                  id="dateInfo"
                  data-test-id="dateInfo"
                  className="block mt-1 text-sm text-red-600"
                >
                  { errors.date.message }
                </small>
              )}
            </div>
            {/* vendorName field */}
            <div className="form-group mb-4">
              <label
                htmlFor="vendorNameInput"
                className="form-label inline-block mb-2 text-gray-700 font-medium"
              >
                Vendor Name
              </label>
              <input
                type="text"
                className="form-control
                block
                w-full
                px-3
                py-1.5
                text-base
                font-normal
                text-gray-700
                bg-white bg-clip-padding
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
                required
                {...register('vendorName')}
                id="vendorNameInput"
                aria-describedby="vendorNameInfo"
                data-test-id="vendorNameInput"
              />
              {errors.vendorName && (
                <small
                  id="vendorNameInfo"
                  data-test-id="vendorNameInfo"
                  className="block mt-1 text-sm text-red-600"
                >
                  { errors.vendorName.message }
                </small>
              )}
            </div>
            {/* file field */}
            <div className="form-group mb-4">
              <label
                htmlFor="fileInput"
                className="form-label inline-block mb-2 text-gray-700 font-medium"
              >
                File
              </label>
              <input
                type="file"
                className="form-control
                block
                w-full
                px-3
                py-1.5
                text-base
                font-normal
                text-gray-700
                bg-white bg-clip-padding
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
                required
                {...register('file')}
                id="fileInput"
                aria-describedby="fileInfo"
                data-test-id="fileInput"
              />
              {errors.file && (
                <small
                  id="fileInfo"
                  data-test-id="fileInfo"
                  className="block mt-1 text-sm text-red-600 whitespace-pre-wrap"
                >
                  { errors.file.message }
                </small>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                data-test-id="submitFormButton"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}
