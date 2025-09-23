import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store'

export const useAreaSelection = () => {
  const navigate = useNavigate()
  const { setSelectedArea, generateDeviceId, setGuest } = useAuthStore()
  const [selectedAreaState, setSelectedAreaState] = useState(null)

  const handleAreaSelect = (areaId) => {
    setSelectedAreaState(areaId)
  }

  const handleContinue = () => {
    if (selectedAreaState) {
      const deviceId = generateDeviceId()
      setGuest(deviceId)
      setSelectedArea(selectedAreaState)
      navigate('/')
    }
  }

  return {
    selectedAreaState,
    handleAreaSelect,
    handleContinue
  }
}