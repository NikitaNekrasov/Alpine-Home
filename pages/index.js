import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

export default function Home() {
  const formSchema = Yup.object().shape({
    date: Yup.date().required('Date is required'),
    vendorName: Yup.string().required('Vendor name is required'),
    file: Yup.mixed().required('File (CSV) is required')
      .test('required', 'You need to provide a file', (file) => file[0] ? true : false)
      .test('is-valid-type', 'Only CSV files are supported', fileList => {
        const fileExtension = fileList[0]?.name?.split('.').pop()
        return ['csv', 'CSV'].includes(fileExtension)
      })
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(formSchema),
  });

  const onSubmit = (data) => {
    console.log(JSON.stringify(data), "submitted")
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
                  className="block mt-1 text-sm text-red-600"
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
