import { useRegisterForm } from '../../hooks/useRegisterForm'
import { useRegisterModal } from '../../hooks/useRegisterModal'
import { modalStyles } from '../../styles/components'
import RegisterHeader from './Register/RegisterHeader'
import RegisterForm from './Register/RegisterForm'
import RegisterFooter from './Register/RegisterFooter'

const RegisterModal = () => {
  const { formData, errors, validateForm, handleChange, resetForm } = useRegisterForm()
  const { handleSubmit, handleClose, handleSwitchToLogin, isLoading } = useRegisterModal(validateForm, resetForm)


  return (
    <div className={modalStyles.overlay}>
      <div className={modalStyles.container}>
        <RegisterHeader onClose={handleClose} />

        <RegisterForm
          formData={formData}
          errors={errors}
          isLoading={isLoading}
          onChange={handleChange}
          onSubmit={(e) => handleSubmit(e, formData)}
        />

        <RegisterFooter onSwitchToLogin={handleSwitchToLogin} />
      </div>
    </div>
  )
}

export default RegisterModal