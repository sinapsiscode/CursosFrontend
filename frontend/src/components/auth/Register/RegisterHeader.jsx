import { CloseIcon } from '../../common/Icons'
import { authStyles } from '../../../styles/components'

const RegisterHeader = ({ onClose }) => {
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
        <h2 className={authStyles.title}>Crear Cuenta</h2>
        <p className={authStyles.subtitle}>Únete y comienza tu aprendizaje profesional</p>
      </div>
    </>
  )
}

export default RegisterHeader