import { Button, Input } from '@/components/UI'
import React from 'react'
import { useFormik } from 'formik'
import { IPersonalInfoInput } from '@/components/Interface/modals'
import { validationSchema } from '@/components/profile/ProfileInfo/schema'
import { useAppSelector } from '@/redux/hook'
import { AppState } from '@/redux/store'
import { useUpdateUserInfoMutation } from '@/redux/user/userApi'
import { disabledForm } from '@/components/profile/ProfileInfo/utils'
import { ProfileFormFields } from '@/components/profile/ProfileForm/types'
import styles from './styles.module.scss'

const ProfileForm = () => {
  const auth = useAppSelector(({ beru }: AppState) => beru.user)
  const [updateUser, { isLoading }] = useUpdateUserInfoMutation()

  const formik = useFormik<IPersonalInfoInput>({
    initialValues: {
      firstName: auth.data?.name ?? '',
      lastName: auth?.data?.lastName ?? '',
      patronymic: auth?.data?.patronymic ?? '',
      sex: auth?.data?.sex ?? ''
    },
    validationSchema,
    onSubmit: async () => {
      try {
        await updateUser(formik.values).unwrap()
      } catch {
        /* empty */
      }
    }
  })

  const {
    setFieldValue,
    handleSubmit,
    errors,
    values: { firstName, lastName, patronymic }
  } = formik

  // @ts-ignore
  const disabled = disabledForm(auth?.data, { name: firstName, lastName, patronymic })

  return (
    <form className={styles.form}>
      <Input
        name={ProfileFormFields.firstName}
        className={styles.form__field}
        onChange={(e) => setFieldValue(ProfileFormFields.firstName, e.target.value)}
        label='Имя'
        view='base'
        value={firstName}
        errors={
          errors?.[ProfileFormFields.firstName] && {
            [ProfileFormFields.firstName]: { message: errors[ProfileFormFields.firstName] }
          }
        }
        required
      />
      <Input
        name={ProfileFormFields.lastName}
        onChange={(e) => setFieldValue(ProfileFormFields.lastName, e.target.value)}
        label='Фамилия'
        view='base'
        value={lastName}
        errors={
          errors?.[ProfileFormFields.lastName] && {
            [ProfileFormFields.lastName]: { message: errors[ProfileFormFields.lastName] }
          }
        }
        required
      />
      <Input
        name={ProfileFormFields.patronymic}
        onChange={(e) => setFieldValue(ProfileFormFields.patronymic, e.target.value)}
        label='Отчество'
        view='base'
        value={patronymic}
        errors={
          errors?.[ProfileFormFields.patronymic] && {
            [ProfileFormFields.patronymic]: { message: errors[ProfileFormFields.patronymic] }
          }
        }
      />
      <div className={styles.form__footer}>
        <Button className={styles.form__btn} disabled={disabled || isLoading} onClick={handleSubmit}>
          Сохранить изменения
        </Button>
      </div>
    </form>
  )
}

export default ProfileForm
