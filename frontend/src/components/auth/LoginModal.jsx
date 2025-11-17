import { mockUsers } from '../../services/mockUsers'
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700/50">
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