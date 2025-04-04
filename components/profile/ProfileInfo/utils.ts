import isEqual from '@/utils/isEqual'

interface Info {
  name: string | undefined
  lastName: string | undefined
  patronymic: string | undefined
}

const serialize = ({ name, lastName, patronymic }: Info) => ({ name, lastName, patronymic })

export const disabledForm = (obj1: Info, obj2: Info) => isEqual(serialize(obj1), serialize(obj2))
