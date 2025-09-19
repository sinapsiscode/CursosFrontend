import { REGISTRATION_STYLES, FORM_LABELS, ICON_PATHS } from '../../../constants/eventRegistrationConstants'

const RegistrationHeader = ({ event, onClose }) => {
  return (
    <div className={REGISTRATION_STYLES.header}>
      <button
        onClick={onClose}
        className={REGISTRATION_STYLES.closeButton}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON_PATHS.close} />
        </svg>
      </button>

      <h2 className={REGISTRATION_STYLES.title}>{FORM_LABELS.title}</h2>
      <p className={REGISTRATION_STYLES.subtitle}>{event.title}</p>
    </div>
  )
}

export default RegistrationHeader