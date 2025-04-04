import React, { FC, useMemo } from 'react'
import { UseMutateFunction } from '@tanstack/react-query'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FormikProps, useFormik } from 'formik'
import { useRouter } from 'next/router'
import Image from 'next/image'
import cn from 'classnames'
import * as Yup from 'yup'
import { meta } from '@/constants'
import { Button, Checkbox, Container, Icon, Input, Text } from '@/components/UI'
import { useWindowSize, useMessage } from '@/hooks'
import { IProduct, IReviewCard, IReviewForm } from '@/models'
import { ProductImage } from '@/components/product'
import Layout from '@/components/layout/Main'
import StarRating from '@/components/StarRating/StarRating'
import 'swiper/css'
import 'swiper/css/free-mode'
import s from './reviews-content.module.scss'

interface ICustomText {
  text: string
  classname?: string
  padding?: string
  family?: 'primary' | 'secondary'
}

interface IReviewPageProps {
  product: IProduct
  data: IReviewForm | IReviewCard
  onSubmit: (values: IReviewForm, images?: string[]) => void
  uploadImages: UseMutateFunction<
    string | number | { images: any; values: any; prevImages: string[] },
    any,
    { files: any; values: any; prevImages: string[] },
    unknown
  >
  mode: 'create' | 'edit'
  isLoading: boolean
}

const ReviewContent: FC<IReviewPageProps> = ({ product, data, onSubmit, uploadImages, mode, isLoading }) => {
  const { deviceWidth } = useWindowSize()
  const { back } = useRouter()

  const formik: FormikProps<IReviewForm | IReviewCard> = useFormik<IReviewForm | IReviewCard>({
    initialValues: data,
    validationSchema: Yup.object().shape({
      value: Yup.number().required('Необходимо поставить оценку').min(1, 'Необходимо поставить оценку').max(5)
    }),
    onSubmit: async (values) => {
      const newImageFiles: File[] = []
      const oldImages: string[] = []

      for (const image of values.images) {
        if (typeof image !== 'string') {
          newImageFiles.push(image)
        } else {
          oldImages.push(image)
        }
      }

      if (newImageFiles.length) {
        const formDataImages = new FormData()

        for (let index = 0; index < newImageFiles.length; index++) {
          formDataImages.append('images', newImageFiles[index])
        }

        uploadImages({ files: formDataImages, values, prevImages: oldImages })
      } else {
        onSubmit(values, oldImages)
      }
    }
  })

  const ratingHandler = async (e: number) => formik.setFieldValue('value', e)

  const onUnloadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    const selectImages = [...formik.values.images, ...e.target.files]
    if (selectImages.length > 5) useMessage('Вы выбрали больше 5 файлов', 'error')
    await formik.setFieldValue('images', selectImages.slice(0, 5))
  }

  const onDeleteImage = async (index: number) => {
    const images = formik.values.images.filter((_, i) => i !== index)
    await formik.setFieldValue('images', images)
  }

  const customText = useMemo(
    () =>
      ({ text, classname, padding = '32px 0 16px', family = 'secondary' }: ICustomText) => (
        <Text
          style={{ padding }}
          family={family as 'primary' | 'secondary'}
          className={cn(s.reviews__section_title, classname)}
          as='p'
        >
          {text}
        </Text>
      ),
    []
  )

  if (!data) return null

  return (
    <Layout meta={{ ...meta.REVIEWS_SLUG }} hasHeader={deviceWidth !== 'small'}>
      {deviceWidth === 'small' && (
        <div className={s.reviews_header}>
          <Icon onClick={() => back()} name='arrow-left2' /> Отзыв к товару
        </div>
      )}
      <Container>
        <div className={s.reviews}>
          {deviceWidth !== 'small' && <Text as='h2'>Отзыв к товару</Text>}
          {product && (
            <div className={s.reviews__product_card}>
              <div>
                <ProductImage className={s.reviews__product_image} asLink={false} link={product?.images[0]?.link} />
              </div>
              <div className={s.reviews__product_name}>
                <span>{product?.productName}</span>
              </div>
            </div>
          )}
          <div className={s.reviews__product_rating}>
            {customText({ text: 'Оцените товар', padding: '44px 0 16px' })}
            <div className={s.reviews__rating_stars}>
              <StarRating
                maxStars={5}
                emptyColor='#DADCE5'
                activeColor='#FFA32D'
                width={48}
                height={48}
                defaultState={formik.values.value}
                onChangeHover={() => {}}
                onChangeValue={ratingHandler}
                readOnly={false}
                hoverEvent={false}
              />
            </div>
            {formik.touched.value && <div className={s.reviews__rating_error}>{formik.errors.value}</div>}
          </div>
          <div className={s.reviews__advantages}>
            {customText({ text: 'Достоинства' })}
            <Input
              view='base'
              placeholder='Что понравилось'
              fluid
              value={formik.values.advantages}
              onChange={formik.handleChange}
              name='advantages'
            />
          </div>
          <div className={s.reviews__deficiencies}>
            {customText({ text: 'Недостатки' })}
            <Input
              view='base'
              placeholder='Что не понравилось'
              className={s.reviews__input}
              fluid
              value={formik.values.deficiencies}
              onChange={formik.handleChange}
              name='deficiencies'
            />
          </div>
          <div className={s.reviews__comment}>
            {customText({ text: 'Комментарий' })}
            <Input
              view='base'
              placeholder='Общие впечатления'
              fluid
              value={formik.values.comment}
              onChange={formik.handleChange}
              name='comment'
            />
            <p className={s.reviews__comment_limit}>{formik?.values?.comment?.length} / 1000</p>
          </div>
          <div className={s.reviews__image}>
            {customText({ text: 'Фото', padding: '32px 0 8px' })}
            <div className={s.reviews__image_sub_title}>Загрузите до 5 фотографий JPEG или PNG до 10 Мб</div>
            <div className={s.reviews__image_list}>
              <Swiper slidesPerView='auto' spaceBetween={8}>
                <SwiperSlide style={{ width: '108px', height: '94px' }}>
                  <label>
                    <input
                      className={s.input_file_upload}
                      type='file'
                      name='image'
                      onChange={onUnloadImage}
                      multiple
                      max={5}
                      accept='image/png, image/jpeg'
                    />
                    <div className={s.reviews__add_image}>
                      <Icon name='camera' size='xl' />
                    </div>
                  </label>
                </SwiperSlide>
                {formik.values.images.map((image: File | string, i: number) => (
                  <SwiperSlide key={Math.random()} style={{ width: '108px', height: '94px' }}>
                    <div className={s.reviews__selected_image}>
                      <div onClick={() => onDeleteImage(i)} className={s.reviews__delete_image}>
                        <Icon size='xs' name='close' />
                      </div>
                      <Image
                        width={100}
                        height={86}
                        src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                        style={{ objectFit: 'cover' }}
                        alt=''
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          <label className={s.reviews__add_anonym}>
            <Checkbox
              name='anonym'
              checked={formik.values.anonym}
              onChange={(e) => formik.setFieldValue('anonym', e.target.checked)}
              style={{ border: '2px solid #DADCE5', background: '0', borderRadius: '2px' }}
            />
            {customText({ text: 'Оставить отзыв анонимно', padding: '0', family: 'primary' })}
          </label>
          <div className={s.reviews__send_button}>
            <Button onClick={formik.handleSubmit} disabled={isLoading} fluid>
              {mode === 'create' ? 'Оставить отзыв' : 'Сохранить'}
            </Button>
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export default ReviewContent
