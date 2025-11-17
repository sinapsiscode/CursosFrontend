const LoginFooter = ({ onSwitchToRegister }) => {
  return (
    <div className="mt-6 text-center">
      <p className="text-secondary">
        ¿No tienes cuenta?{' '}
        <button
          onClick={onSwitchToRegister}
          className="text-accent hover:text-accent-light transition-colors font-medium"
        >
          Regístrate aquí
        </button>
      </p>
    </div>
  )
}

export default LoginFooter