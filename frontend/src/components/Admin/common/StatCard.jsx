import { CHART_COLORS } from '../../../config/admin.constants'

const StatCard = ({ title, value, change, color = 'primary', icon }) => {
  const bgColor = CHART_COLORS[color] || CHART_COLORS.primary
  const isPositive = change >= 0

  return (
    <div className="bg-surface rounded-xl p-6 shadow-lg border-2 border-text-secondary/10">
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${bgColor}20` }}
        >
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isPositive ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              )}
            </svg>
            <span className="text-sm font-medium">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-text-secondary text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
    </div>
  )
}

export default StatCard