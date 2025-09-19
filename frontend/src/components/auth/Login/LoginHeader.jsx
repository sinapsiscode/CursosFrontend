import { CloseIcon } from '../../common/Icons'
import { authStyles } from '../../../styles/components'

const LoginHeader = ({ onClose }) => {
  return (
    <>
      <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors">
        <CloseIcon />
      </button>

      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className={authStyles.logo}>
            <span className={authStyles.logoText}>M</span>
          </div>
          <span className={authStyles.brandText}>MetSel</span>
        </div>
        <h2 className={authStyles.title}>Iniciar Sesión</h2>
        <p className={authStyles.subtitle}>Accede a tu cuenta para continuar aprendiendo</p>
      </div>
    </>
  )
}

export default LoginHeader