import { LoadingSpinner } from '../../common/Icons'
import { formStyles } from '../../../styles/components'
import { AREAS } from '../../../constants/authConstants'

const RegisterForm = ({ formData, errors, isLoading, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className={formStyles.label}>
          Nombre completo
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          className={`${formStyles.input} ${errors.name ? formStyles.inputError : formStyles.inputNormal}`}
          placeholder="Tu nombre completo"
          disabled={isLoading}
        />
        {errors.name && (
          <p className={formStyles.errorText}>{errors.name}</p>
        )}
      </div>

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

      {/* Phone Field */}
      <div>
        <label htmlFor="phone" className={formStyles.label}>
          WhatsApp (Opcional)
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          className={`${formStyles.input} ${errors.phone ? formStyles.inputError : formStyles.inputNormal}`}
          placeholder="+57 300 123 4567"
          disabled={isLoading}
        />
        <p className={formStyles.helpText}>
          📱 Para recibir ofertas y actualizaciones por WhatsApp
        </p>
        {errors.phone && (
          <p className={formStyles.errorText}>{errors.phone}</p>
        )}
      </div>

      {/* Area Selection */}
      <div>
        <label htmlFor="selectedArea" className={formStyles.label}>
          Área de interés
        </label>
        <select
          id="selectedArea"
          name="selectedArea"
          value={formData.selectedArea}
          onChange={onChange}
          className={formStyles.select}
          disabled={isLoading}
        >
          {Object.entries(AREAS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
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

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className={formStyles.label}>
          Confirmar contraseña
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={onChange}
          className={`${formStyles.input} ${errors.confirmPassword ? formStyles.inputError : formStyles.inputNormal}`}
          placeholder="••••••••"
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className={formStyles.errorText}>{errors.confirmPassword}</p>
        )}
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
            Creando cuenta...
          </>
        ) : (
          'Crear Cuenta'
        )}
      </button>
    </form>
  )
}

export default RegisterForm