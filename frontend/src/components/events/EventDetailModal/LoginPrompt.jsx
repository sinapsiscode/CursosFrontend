import { useAuthStore } from '../../../store'
import { EVENT_STYLES, EVENT_LABELS } from '../../../constants/eventDetailConstants'

const LoginPrompt = () => {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) return null

  return (
    <p className={EVENT_STYLES.loginPrompt}>
      {EVENT_LABELS.loginMessage}
    </p>
  )
}

export default LoginPrompt