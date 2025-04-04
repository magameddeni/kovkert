import React from 'react'
import { Button, ButtonGroup, Text } from '@/components/UI'
import s from './delete.module.scss'

interface DeleteReviewProps {
  onDelete: () => void
  onCLose: () => void
}

const DeleteReview: React.FC<DeleteReviewProps> = ({ onDelete, onCLose }) => (
  <div className={s.modal}>
    <Text as='div' size='xl' weight='medium'>
      Удаление отзыва
    </Text>
    <Text as='div' className='offset-top-16'>
      Вы уверены что хотите удалить отзыв?
    </Text>

    <ButtonGroup className={s.modal__buttons} justifyContent='end' gap={16}>
      <Button view='link' onClick={onCLose}>
        Отмена
      </Button>
      <Button onClick={onDelete}>Удалить</Button>
    </ButtonGroup>
  </div>
)

export default DeleteReview
