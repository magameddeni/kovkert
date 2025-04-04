import mitt from 'mitt'

export const EVENTS = {
  SHOW_LOGIN_MODAL: 'showLoginModal'
}

const emitter = mitt()

export default emitter
