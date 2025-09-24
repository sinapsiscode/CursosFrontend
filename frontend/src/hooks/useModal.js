import { useEffect, useCallback } from 'react'
import { useUIStore } from '../store'
import { MODAL_KEYS } from '../constants/modalConstants.jsx'

export const useModal = () => {
  const { isModalOpen, openModal, closeModal } = useUIStore()

  return {
    isOpen: (modalName) => isModalOpen(modalName),
    open: (modalName) => openModal(modalName),
    close: (modalName) => closeModal(modalName)
  }
}

export const useModalEffects = (isOpen, onClose) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === MODAL_KEYS.escape && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])
}

export const useConfirmModal = (onConfirm, onClose) => {
  const handleConfirm = useCallback(() => {
    onConfirm()
    onClose()
  }, [onConfirm, onClose])

  return { handleConfirm }
}