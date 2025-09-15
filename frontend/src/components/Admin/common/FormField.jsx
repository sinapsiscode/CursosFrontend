import { VALIDATION_RULES, MESSAGES } from '../../../config/admin.constants'

const FormField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  error,
  validationType,
  options = [],
  disabled = false,
  className = ''
}) => {
  const handleValidation = (val) => {
    if (validationType && VALIDATION_RULES[validationType]) {
      const rule = VALIDATION_RULES[validationType]

      if (rule.pattern && !rule.pattern.test(val)) {
        return rule.message
      }

      if (rule.minLength && val.length < rule.minLength) {
        return rule.message
      }

      if (rule.maxLength && val.length > rule.maxLength) {
        return rule.message
      }

      if (rule.min !== undefined && Number(val) < rule.min) {
        return rule.message
      }

      if (rule.max !== undefined && Number(val) > rule.max) {
        return rule.message
      }
    }

    return null
  }

  const handleChange = (e) => {
    const newValue = e.target.value
    const validationError = handleValidation(newValue)

    onChange({
      target: {
        name,
        value: newValue,
        error: validationError
      }
    })
  }

  const fieldClasses = `
    w-full px-4 py-2 bg-background text-white rounded-lg
    border ${error ? 'border-red-500' : 'border-text-secondary/20'}
    focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-accent'}
    focus:border-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
    ${className}
  `

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={fieldClasses}
          required={required}
        >
          <option value="">Seleccionar...</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={fieldClasses}
          required={required}
          rows={4}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={fieldClasses}
          required={required}
        />
      )}

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

export default FormField