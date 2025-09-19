// ===================================
// ENROLLMENT HEADER COMPONENT
// ===================================

import React from 'react'
import { ENROLLMENT_STYLES, AREA_OPTIONS, SEARCH_CONFIG } from '../../constants/studentEnrollmentManagementConstants'

const EnrollmentHeader = ({
  searchTerm,
  selectedArea,
  onSearchChange,
  onAreaChange
}) => {
  return (
    <div className={ENROLLMENT_STYLES.CARD_CONTAINER}>
      <div className={ENROLLMENT_STYLES.HEADER_CONTAINER}>
        <h3 className={ENROLLMENT_STYLES.TITLE}>
          Gestión de Inscripciones
        </h3>
        <div className={ENROLLMENT_STYLES.SEARCH_CONTAINER}>
          <input
            type="text"
            placeholder={SEARCH_CONFIG.PLACEHOLDER}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={ENROLLMENT_STYLES.INPUT}
          />
          <select
            value={selectedArea}
            onChange={(e) => onAreaChange(e.target.value)}
            className={ENROLLMENT_STYLES.SELECT}
          >
            {AREA_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default EnrollmentHeader