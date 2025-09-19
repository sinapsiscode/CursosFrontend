import { LoadingSpinner } from '../../common/Icons'
import { formStyles } from '../../../styles/components'

const LoginForm = ({ formData, errors, isLoading, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Email Field */}
      <div>
        <label htmlFor="email" className={formStyles.label}>
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          className={`${formStyles.input} ${errors.email ? formStyles.inputError : formStyles.inputNormal}`}
          placeholder="tu@email.com"
          disabled={isLoading}
        />
        {errors.email && (
          <p className={formStyles.errorText}>{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className={formStyles.label}>
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          className={`${formStyles.input} ${errors.password ? formStyles.inputError : formStyles.inputNormal}`}
          placeholder="••••••••"
          disabled={isLoading}
        />
        {errors.password && (
          <p className={formStyles.errorText}>{errors.password}</p>
        )}
      </div>

      {/* Remember me and forgot password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="w-4 h-4 text-accent bg-background border-gray-600 rounded focus:ring-accent focus:ring-2"
          />
          <span className="ml-2 text-sm text-text-secondary">Recordarme</span>
        </label>
        <button
          type="button"
          className="text-sm text-accent hover:text-accent-light transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-accent text-background py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <LoadingSpinner className="-ml-1 mr-3 text-background" />
            Iniciando sesión...
          </>
        ) : (
          'Iniciar Sesión'
        )}
      </button>
    </form>
  )
}

export default LoginForm