import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .min(2, 'Минимальная длина 2 символа')
    .max(20, 'Максимальная длина 20 символов')
    .required('Обязательное полe*'),
  lastName: Yup.string()
    .trim()
    .min(2, 'Минимальная длина 2 символа')
    .max(20, 'Максимальная длина 20 символов')
    .required('Обязательное полe*'),
  patronymic: Yup.string().trim().min(2, 'Минимальная длина 2 символа').max(20, 'Максимальная длина 20 символов'),
  sex: Yup.string().oneOf(['1', '2'])
})
