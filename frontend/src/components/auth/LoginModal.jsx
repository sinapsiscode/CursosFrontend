import { mockUsers } from '../../services/mockData'
import { useLoginForm } from '../../hooks/useLoginForm'
import { useLoginModal } from '../../hooks/useLoginModal'
import { modalStyles } from '../../styles/components'
import LoginHeader from './Login/LoginHeader'
import QuickAccessUsers from './Login/QuickAccessUsers'
import LoginDivider from './Login/LoginDivider'
import LoginForm from './Login/LoginForm'
import LoginFooter from './Login/LoginFooter'
import DemoUsersInfo from './Login/DemoUsersInfo'

const LoginModal = () => {
  const { formData, errors, validateForm, handleChange, resetForm, setFormValues } = useLoginForm()
  const { handleSubmit, handleClose, handleQuickLogin, handleSwitchToRegister, isLoading } = useLoginModal(validateForm, resetForm, setFormValues)


  return (
    <div className={modalStyles.overlay}>
      <div className={modalStyles.container}>
        <LoginHeader onClose={handleClose} />

        <QuickAccessUsers
          users={mockUsers}
          onQuickLogin={handleQuickLogin}
          isLoading={isLoading}
        />

        <LoginDivider />

        <LoginForm
          formData={formData}
          errors={errors}
          isLoading={isLoading}
          onChange={handleChange}
          onSubmit={(e) => handleSubmit(e, formData)}
        />

        <LoginFooter onSwitchToRegister={handleSwitchToRegister} />

        <DemoUsersInfo users={mockUsers} />
      </div>
    </div>
  )
}

export default LoginModal