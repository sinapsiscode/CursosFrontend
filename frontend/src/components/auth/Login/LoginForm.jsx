import { LoadingSpinner } from '../../common/Icons'
import { useState } from 'react'

const LoginForm = ({ formData, errors, isLoading, onChange, onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Email Field */}
      <div className="relative">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-300 mb-2 ml-1"
        >
          Email
        </label>
        <div className="relative group">
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'email' ? 'text-blue-400' : 'text-gray-500'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            className={`w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border ${
              errors.email
                ? 'border-red-500 focus:border-red-400'
                : focusedField === 'email'
                ? 'border-blue-500'
                : 'border-gray-700'
            } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
              errors.email ? 'focus:ring-red-400/20' : 'focus:ring-blue-400/20'
            } transition-all duration-200 backdrop-blur-sm`}
            placeholder="tu@email.com"
            disabled={isLoading}
          />
        </div>
        {errors.email && (
          <p className="text-red-400 text-sm mt-2 ml-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="relative">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-300 mb-2 ml-1"
        >
          Contraseña
        </label>
        <div className="relative group">
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'password' ? 'text-blue-400' : 'text-gray-500'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            className={`w-full pl-12 pr-12 py-3.5 bg-gray-800/50 border ${
              errors.password
                ? 'border-red-500 focus:border-red-400'
                : focusedField === 'password'
                ? 'border-blue-500'
                : 'border-gray-700'
            } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
              errors.password ? 'focus:ring-red-400/20' : 'focus:ring-blue-400/20'
            } transition-all duration-200 backdrop-blur-sm`}
            placeholder="••••••••"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-400 text-sm mt-2 ml-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.password}
          </p>
        )}
      </div>

      {/* Remember me and forgot password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer transition-all"
          />
          <span className="ml-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            Recordarme
          </span>
        </label>
        <button
          type="button"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {/* Submit Button con gradiente */}
      <button
        type="submit"
        disabled={isLoading}
        className="relative w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
      >
        {isLoading ? (
          <>
            <LoadingSpinner className="-ml-1 mr-3 text-white" />
            <span>Iniciando sesión...</span>
          </>
        ) : (
          <>
            <span>Iniciar Sesión</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
    </form>
  )
}

export default LoginForm