import { IProductCharacteristicsCharacteristic, IProductImages, IProduct } from 'models'
import { useEffect, useState } from 'react'
import $api from '../components/Http/axios'

export const getProductById = (productId?: string) => {
  const [product, setProduct] = useState<IProduct | object>({})
  const [characteristics, setCharacteristics] = useState<IProductCharacteristicsCharacteristic[]>([])
  const [mainInfo, setMainInfo] = useState<IProduct | object>({})
  const [categoryId, setCategoryId] = useState<string | undefined>('')
  const [description, setDescription] = useState<string>('')
  const [images, setImages] = useState<IProductImages[] | []>([])
  const [requestError, setRequestError] = useState(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      if (productId) {
        try {
          setLoading(true)

          const response = await $api.get<{ message: IProduct }>(`/api/seller/get_product_card?productId=${productId}`)

          setProduct(response.data.message)
          setMainInfo({
            productName: response.data.message.productName,
            SKU: response.data.message.SKU,
            barcode: response.data.message.barcode,
            regularPrice: response.data.message.regularPrice,
            discountPrice: response.data.message.discountPrice,
            manufacturerSKU: response.data.message.manufacturerSKU,
            categories: response.data.message.categories.map((item) => ({ name: item.name, _id: item._id })),
            vat: response.data.message.vat,
            package: {
              weight: response.data.message.package?.weight,
              width: response.data.message.package?.width,
              height: response.data.message.package?.height,
              length: response.data.message.package?.length
            }
          })
          setCharacteristics(
            response.data.message.characteristics.map((v: any) => ({
              options: v.characteristic.value,
              required: v.characteristic.required,
              title: v.title,
              type: v.characteristic.type,
              value: v.value,
              _id: v.characteristic._id
            })) as unknown as IProductCharacteristicsCharacteristic[]
          )
          setCategoryId(response.data.message.categories[response.data.message.categories.length - 1]._id)
          setDescription(response.data.message.description)
          setImages(response.data.message.images as unknown as IProductImages[])
        } catch (error: any) {
          console.error(error)
          setRequestError(error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [productId])

  return { product, mainInfo, characteristics, description, images, categoryId, requestError, loading }
}
