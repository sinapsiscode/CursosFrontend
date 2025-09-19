// ===================================
// ENROLLMENT MODAL COMPONENT
// ===================================

import React from 'react'
import { MODAL_STYLES, COUPON_CONFIG, ICONS } from '../../constants/studentEnrollmentManagementConstants'

const EnrollmentModal = ({
  enrollmentModal,
  student,
  course,
  onValidateCoupon,
  onConfirmEnrollment,
  onCancel,
  onCouponCodeChange
}) => {
  return (
    <div className={MODAL_STYLES.OVERLAY}>
      <div className={MODAL_STYLES.CONTAINER}>
        <div className={MODAL_STYLES.HEADER}>
          <h3 className={MODAL_STYLES.TITLE}>
            Inscribir Estudiante
          </h3>
          <button
            onClick={onCancel}
            className={MODAL_STYLES.CLOSE_BUTTON}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICONS.CLOSE} />
            </svg>
          </button>
        </div>

        <div className={MODAL_STYLES.CONTENT}>
          {/* Información del estudiante y curso */}
          <div className={MODAL_STYLES.INFO_SECTION}>
            <div className="space-y-2 text-sm">
              <div className={MODAL_STYLES.INFO_ROW}>
                <span className={MODAL_STYLES.INFO_LABEL}>Estudiante:</span>
                <span className={MODAL_STYLES.INFO_VALUE}>
                  {student?.name}
                </span>
              </div>
              <div className={MODAL_STYLES.INFO_ROW}>
                <span className={MODAL_STYLES.INFO_LABEL}>Curso:</span>
                <span className={MODAL_STYLES.INFO_VALUE}>
                  {course?.title}
                </span>
              </div>
            </div>
          </div>

          {/* Sección de cupón */}
          <div>
            <label className={MODAL_STYLES.COUPON_LABEL}>
              Código de Cupón (opcional)
            </label>
            <div className={MODAL_STYLES.COUPON_INPUT_CONTAINER}>
              <input
                type="text"
                placeholder={COUPON_CONFIG.PLACEHOLDER}
                value={enrollmentModal.couponCode}
                onChange={(e) => onCouponCodeChange(e.target.value)}
                className={MODAL_STYLES.COUPON_INPUT}
              />
              <button
                onClick={onValidateCoupon}
                disabled={!enrollmentModal.couponCode.trim() || enrollmentModal.validatingCoupon}
                className={MODAL_STYLES.COUPON_VALIDATE_BUTTON}
              >
                {enrollmentModal.validatingCoupon ? 'Validando...' : 'Validar'}
              </button>
            </div>

            {/* Resultado de validación del cupón */}
            {enrollmentModal.couponResult && (
              <div className={`${MODAL_STYLES.COUPON_RESULT_BASE} ${
                enrollmentModal.couponResult.valid
                  ? MODAL_STYLES.COUPON_RESULT_VALID
                  : MODAL_STYLES.COUPON_RESULT_INVALID
              }`}>
                <p className={
                  enrollmentModal.couponResult.valid
                    ? MODAL_STYLES.COUPON_RESULT_TITLE_VALID
                    : MODAL_STYLES.COUPON_RESULT_TITLE_INVALID
                }>
                  {enrollmentModal.couponResult.valid
                    ? COUPON_CONFIG.VALIDATION_MESSAGES.VALID
                    : COUPON_CONFIG.VALIDATION_MESSAGES.INVALID
                  }
                </p>
                <p className={MODAL_STYLES.COUPON_RESULT_MESSAGE}>
                  {enrollmentModal.couponResult.message ||
                   (enrollmentModal.couponResult.valid
                     ? `Descuento: ${enrollmentModal.couponResult.coupon?.discountPercentage}%`
                     : COUPON_CONFIG.VALIDATION_MESSAGES.EMPTY)}
                </p>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className={MODAL_STYLES.ACTIONS_CONTAINER}>
            <button
              onClick={onConfirmEnrollment}
              className={MODAL_STYLES.CONFIRM_BUTTON}
            >
              Inscribir
              {enrollmentModal.couponResult?.valid && (
                <span className="ml-1">
                  (con {enrollmentModal.couponResult.coupon.discountPercentage}% desc.)
                </span>
              )}
            </button>
            <button
              onClick={onCancel}
              className={MODAL_STYLES.CANCEL_BUTTON}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnrollmentModal