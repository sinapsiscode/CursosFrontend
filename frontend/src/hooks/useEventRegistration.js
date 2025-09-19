import { useState } from 'react'
import { useAuthStore, useUIStore } from '../store'
import {
  isUserRegistered,
  createRegistration,
  saveEventRegistration,
  openExternalUrl,
  simulateRegistrationDelay
} from '../utils/eventDetailUtils'
import {
  EVENT_MESSAGES,
  REGISTRATION_DELAY
} from '../constants/eventDetailConstants'

export const useEventRegistration = (event, onSuccess, onClose) => {
  const { isAuthenticated, user } = useAuthStore()
  const { showToast } = useUIStore()
  const [isRegistering, setIsRegistering] = useState(false)

  const handleRegister = async () => {
    if (!isAuthenticated) {
      showToast(EVENT_MESSAGES.loginRequired, 'info')
      return
    }

    setIsRegistering(true)
    console.log(EVENT_MESSAGES.registrationStart, event.title)

    try {
      await simulateRegistrationDelay(REGISTRATION_DELAY)

      const existingRegistration = isUserRegistered(event.id, user.id)

      if (!existingRegistration) {
        const newRegistration = createRegistration(event, user)
        saveEventRegistration(newRegistration)
        console.log(EVENT_MESSAGES.registrationSaved)
      }

      showToast(EVENT_MESSAGES.successRegistration, 'success')

      if (event.redirectUrl) {
        console.log(EVENT_MESSAGES.redirecting, event.redirectUrl)
        openExternalUrl(event.redirectUrl)
      }

      if (onSuccess) {
        onSuccess()
      }

      onClose()
    } catch (error) {
      console.error(EVENT_MESSAGES.registrationError, error)
      showToast(EVENT_MESSAGES.errorRegistration, 'error')
    } finally {
      setIsRegistering(false)
    }
  }

  return {
    isRegistering,
    handleRegister
  }
}