import { useRouter } from 'next/router'
import React from 'react'
import useSound from 'use-sound'
import { Scanner } from './Scanner'

type Props = {
  showScanner: any
}

function ScannerComponent({ showScanner }: Props) {
  const router = useRouter()
  const [playBeep] = useSound('../../public/scannerbeep.mp3', {
    volume: 0.5
  })
  const searchBarcode = async (barcode: string) => {
    try {
      // const response = await $api.get(
      //   `/api/card/searchbarcode?barcode=${barcode}`
      // );
      // const product_id = response.data.message[0]._id;
      // router.push(`/product/${product_id}`);

      router.push(`/searchresult/${barcode}`)
      showScanner()
      // @ts-ignore
      document.body.classList.remove('overFlow')
      // @ts-ignore
      document.querySelector('html').classList.remove('overFlow')
    } catch (error: any) {
      alert('товар не найден')
      console.error(error)
    }
  }

  const onResult = (ean: string) => {
    searchBarcode(ean)
    playBeep()
  }

  return <Scanner onResult={onResult} show={showScanner} />
}

export default ScannerComponent
