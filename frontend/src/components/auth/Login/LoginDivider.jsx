import { authStyles } from '../../../styles/components'

const LoginDivider = () => {
  return (
    <div className="flex items-center mb-4">
      <hr className={authStyles.divider} />
      <span className={authStyles.dividerText}>o inicia sesión manualmente</span>
      <hr className={authStyles.divider} />
    </div>
  )
}

export default LoginDivider