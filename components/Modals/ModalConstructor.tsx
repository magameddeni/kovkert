import React, { useCallback, useEffect } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames/bind'
import { CSSTransition } from 'react-transition-group'
import styles from './modal.module.scss'

const cx = classNames.bind(styles)

type Props = {
  show: boolean
  onClose: VoidFunction
  children?: React.ReactNode
  rounded?: boolean
  fullScreen?: boolean
  style?: React.CSSProperties
}

const ModalCosntructor: React.FC<Props> = ({ show, onClose, children, rounded = false, style, fullScreen = false }) => {
  const closeOnEscKey = useCallback(
    (e: any) => {
      if ((e.charCode || e.keyCode) === 27) {
        onClose()
      }
    },
    [onClose]
  )
  const closeModalHandle = (event: any) => {
    if (event.target.getAttribute('data-type') === 'modal') {
      onClose()
    }
  }

  useEffect(() => {
    if (fullScreen && show) {
      // @ts-ignore
      document.querySelector('html').classList.add('overFlow')
    }
    return () => {
      // @ts-ignore
      document.querySelector('html').classList.remove('overFlow')
    }
  }, [fullScreen, show])

  useEffect(() => {
    document.body.addEventListener('keydown', closeOnEscKey)
    return function cleanup() {
      document.body.removeEventListener('keydown', closeOnEscKey)
    }
  }, [closeOnEscKey])

  const nodeRef = React.useRef(null)

  return ReactDOM.createPortal(
    <CSSTransition
      nodeRef={nodeRef}
      classNames={{
        enterDone: `${styles['enter-done']}`,
        exit: `${styles.exit}`
      }}
      in={show}
      unmountOnExit
      timeout={{ enter: 0, exit: 300 }}
    >
      <div ref={nodeRef} data-type='modal' className={styles.modal} onMouseDown={closeModalHandle}>
        <div
          style={style}
          className={cx({
            modal_content: true,
            modal_content_rounded: rounded,
            modal_content_fullScreen: fullScreen
          })}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </CSSTransition>,
    document.getElementById('__next') as any
  )
}

export default ModalCosntructor
