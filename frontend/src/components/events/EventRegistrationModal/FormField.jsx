import { REGISTRATION_STYLES } from '../../../constants/eventRegistrationConstants'
import { getInputClassName } from '../../../utils/eventRegistrationUtils'

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  readOnly = false
}) => {
  return (
    <div className={REGISTRATION_STYLES.fieldContainer}>
      <label className={REGISTRATION_STYLES.label}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={getInputClassName(!!error, readOnly)}
        placeholder={placeholder}
      />
      {error && (
        <p className={REGISTRATION_STYLES.errorText}>{error}</p>
      )}
    </div>
  )
}

export default FormField