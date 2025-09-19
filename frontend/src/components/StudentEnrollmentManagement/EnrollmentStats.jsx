// ===================================
// ENROLLMENT STATS COMPONENT
// ===================================

import React from 'react'
import { ENROLLMENT_STYLES, STATS_CONFIG, ICONS } from '../../constants/studentEnrollmentManagementConstants'

const EnrollmentStats = ({ stats }) => {
  const statsData = [
    {
      icon: ICONS.STUDENTS,
      label: STATS_CONFIG.TOTAL_STUDENTS.label,
      value: stats.totalStudents,
      colorClass: STATS_CONFIG.TOTAL_STUDENTS.colorClass
    },
    {
      icon: ICONS.COURSES,
      label: STATS_CONFIG.TOTAL_COURSES.label,
      value: stats.totalCourses,
      colorClass: STATS_CONFIG.TOTAL_COURSES.colorClass
    },
    {
      icon: ICONS.ENROLLMENTS,
      label: STATS_CONFIG.TOTAL_ENROLLMENTS.label,
      value: stats.totalEnrollments,
      colorClass: STATS_CONFIG.TOTAL_ENROLLMENTS.colorClass
    },
    {
      icon: ICONS.ANALYTICS,
      label: STATS_CONFIG.AVERAGE_ENROLLMENTS.label,
      value: stats.averageEnrollments,
      colorClass: STATS_CONFIG.AVERAGE_ENROLLMENTS.colorClass
    }
  ]

  return (
    <div className={ENROLLMENT_STYLES.CARD_CONTAINER}>
      <div className={ENROLLMENT_STYLES.STATS_GRID}>
        {statsData.map((stat, index) => (
          <div key={index} className={ENROLLMENT_STYLES.STAT_CARD}>
            <div className="flex items-center">
              <div className={`${stat.colorClass} ${ENROLLMENT_STYLES.STAT_ICON_CONTAINER}`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              <div>
                <p className={ENROLLMENT_STYLES.STAT_LABEL}>{stat.label}</p>
                <p className={ENROLLMENT_STYLES.STAT_VALUE}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EnrollmentStats