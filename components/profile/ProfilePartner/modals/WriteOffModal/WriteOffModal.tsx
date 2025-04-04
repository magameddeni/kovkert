import React from 'react'

import { Button, Row, Text, Gap } from '@/components/UI'
import s from './styles.module.scss'
import { useGetProgramDetail, useWriteOffBalance } from '../../hooks'

interface WriteOffModalProps {
  programId: string
  affiliateLinkId: string
  shopId: string
}

const WriteOffModal: React.FC<WriteOffModalProps> = ({ programId, affiliateLinkId, shopId }) => {
  const { headerData, refetchDetails } = useGetProgramDetail({
    programId,
    affiliateLinkId,
    shopId
  })

  const { mutate, isSuccess } = useWriteOffBalance({ callBackFunc: refetchDetails })

  const onSubmit = async () => {
    mutate({
      shopId: headerData?.shopId,
      programId,
      affiliateLink: {
        linkId: affiliateLinkId,
        amount: headerData?.reward
      }
    })
  }

  if (isSuccess) {
    return (
      <div className={s.WriteOffModal__success}>
        <Text weight='medium' align='center' size='sm'>
          Ожидаем подтверждения от магазина
        </Text>
      </div>
    )
  }
  return (
    <div className={s.WriteOffModal}>
      <Text weight='medium' size='lg'>
        Баллы
      </Text>
      <Gap size={8} />
      <Text as='h3' weight='medium'>
        {headerData?.reward}
      </Text>
      <Gap size={24} />
      <Row justify='end'>
        <Button onClick={onSubmit}>Списать</Button>
      </Row>
    </div>
  )
}

export default WriteOffModal
