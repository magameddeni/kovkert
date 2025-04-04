import React, { PropsWithChildren, useEffect } from 'react'
import BaseModal from 'react-modal'
import cx from 'classnames'
import { CloseIcon } from '@/components/UI'

interface IModalProps extends PropsWithChildren {
  isOpen: boolean
  size?: '' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full'
  onAfterOpen?: VoidFunction
  onAfterClose?: VoidFunction
  onRequestClose?: VoidFunction
  closeTimeoutMS?: number | undefined
  contentLabel?: string | undefined
  shouldCloseOnOverlayClick?: boolean | undefined
  shouldCloseOnEsc?: boolean | undefined
  parentSelector?: () => HTMLElement
  style?: React.CSSProperties
  overflow?: boolean
  closePlace?: 'left' | 'right' | 'uptop-right' | null
  fixCloseIcon?: boolean
  contentWrapperClassName?: string
  wrapperClassName?: string
  maxContent?: boolean
  topBottomBorder?: boolean
}

const Modal = ({
  children,
  isOpen = false,
  size = 'md',
  onAfterOpen,
  onAfterClose,
  onRequestClose,
  closeTimeoutMS = 100,
  contentLabel,
  shouldCloseOnOverlayClick = true,
  shouldCloseOnEsc = true,
  parentSelector,
  style,
  overflow = true,
  closePlace = 'right',
  fixCloseIcon = false,
  contentWrapperClassName,
  wrapperClassName,
  maxContent,
  topBottomBorder = true
}: IModalProps) => {
  const classList = cx(
    'modal',
    {
      [size]: size,
      'fix-close-icon': fixCloseIcon,
      'max-content': maxContent,
      'uptop-right-close-icon': closePlace === 'uptop-right',
      'top-bottom-border': topBottomBorder
    },
    wrapperClassName
  )

  const getInlineStyle = () => {
    let inlineStyle: {
      overlay?: React.CSSProperties
      content?: React.CSSProperties
    } = {}

    if (!isOpen && closeTimeoutMS) {
      inlineStyle = {
        ...inlineStyle,
        overlay: {
          ...inlineStyle.overlay,
          transition: `opacity ${closeTimeoutMS}ms ease-in-out`
        }
      }
    }

    if (style) {
      inlineStyle = {
        ...inlineStyle,
        content: {
          ...inlineStyle.content,
          ...style
        }
      }
    }

    return inlineStyle
  }

  useEffect(() => {
    if (overflow) {
      const bodyStyle = document.body.style
      if (isOpen) {
        bodyStyle.overflow = 'hidden'
      } else {
        bodyStyle.overflow = ''
      }
    }
  }, [overflow, isOpen])

  return (
    <BaseModal
      isOpen={isOpen}
      onAfterClose={onAfterClose}
      onAfterOpen={onAfterOpen}
      onRequestClose={onRequestClose}
      closeTimeoutMS={closeTimeoutMS}
      contentLabel={contentLabel}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      shouldCloseOnEsc={shouldCloseOnEsc}
      parentSelector={parentSelector}
      className={classList}
      style={getInlineStyle()}
      ariaHideApp={false}
      bodyOpenClassName='modalBodyOpen'
      portalClassName='modalPortal'
      overlayClassName='overlay'
    >
      {closePlace && (
        <CloseIcon className={cx('close', { [`icon-close-${closePlace}`]: closePlace })} onClick={onRequestClose} />
      )}
      <div className={cx('content', contentWrapperClassName)}>
        <div>{children}</div>
      </div>
    </BaseModal>
  )
}

export default Modal
