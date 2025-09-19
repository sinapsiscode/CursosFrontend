const RegisterFooter = ({ onSwitchToLogin }) => {
  return (
    <div className="mt-6 text-center">
      <p className="text-text-secondary">
        ¿Ya tienes cuenta?{' '}
        <button
          onClick={onSwitchToLogin}
          className="text-accent hover:text-accent-light transition-colors font-medium"
        >
          Inicia sesión aquí
        </button>
      </p>
    </div>
  )
}

export default RegisterFooter