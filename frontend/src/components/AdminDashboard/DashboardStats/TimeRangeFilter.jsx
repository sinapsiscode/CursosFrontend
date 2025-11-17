import { TIME_RANGES, TIME_RANGE_LABELS } from '../../../constants/adminDashboardConstants'

const TimeRangeFilter = ({ currentRange, onChangeRange }) => {
  const ranges = [
    { value: TIME_RANGES.WEEK, label: TIME_RANGE_LABELS.week, icon: '📅' },
    { value: TIME_RANGES.MONTH, label: TIME_RANGE_LABELS.month, icon: '📆' },
    { value: TIME_RANGES.SEMESTER, label: TIME_RANGE_LABELS.semester, icon: '📊' },
    { value: TIME_RANGES.YEAR, label: TIME_RANGE_LABELS.year, icon: '🗓️' }
  ]

  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-secondary text-sm font-medium mr-2">Período:</span>
      <div className="flex gap-2">
        {ranges.map((range) => (
          <button
            key={range.value}
            onClick={() => onChangeRange(range.value)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${currentRange === range.value
                ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-105'
                : 'bg-surface text-secondary hover:bg-gray-700 hover:text-white border border-gray-700'
              }
            `}
          >
            <span className="mr-1.5">{range.icon}</span>
            {range.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TimeRangeFilter
