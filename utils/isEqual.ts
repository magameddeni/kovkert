const { stringify } = JSON

const isEqual = (object1: object, object2: object) => stringify(object1) === stringify(object2)

export default isEqual
