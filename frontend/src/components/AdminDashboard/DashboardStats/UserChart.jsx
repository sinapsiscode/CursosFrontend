import { TIME_RANGE_LABELS } from '../../../constants/adminDashboardConstants'

const UserChart = ({ newUsersThisWeek, chartData, timeRange = 'month' }) => {
  const periodLabel = TIME_RANGE_LABELS[timeRange] || 'Mes'

  // Calcular estadísticas
  const totalUsers = chartData.reduce((sum, data) => sum + data.value, 0)
  const maxValue = Math.max(...chartData.map(d => d.value), 1)
  const avgValue = totalUsers / chartData.length

  // Calcular tendencia (comparar primera mitad vs segunda mitad)
  const firstHalf = chartData.slice(0, Math.floor(chartData.length / 2))
  const secondHalf = chartData.slice(Math.floor(chartData.length / 2))
  const firstHalfAvg = firstHalf.reduce((sum, d) => sum + d.value, 0) / firstHalf.length
  const secondHalfAvg = secondHalf.reduce((sum, d) => sum + d.value, 0) / secondHalf.length
  const trend = secondHalfAvg > firstHalfAvg ? 'up' : secondHalfAvg < firstHalfAvg ? 'down' : 'stable'
  const trendPercent = firstHalfAvg > 0 ? Math.round(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100) : 0

  return (
    <div className="bg-surface rounded-xl p-6 border border-gray-700/50">
      {/* Header con estadísticas */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Nuevos Usuarios</h3>
          <div className="flex items-center gap-3">
            {/* Tendencia */}
            <div className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
              trend === 'up' ? 'bg-green-500/20 text-green-400' :
              trend === 'down' ? 'bg-red-500/20 text-red-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {trend === 'up' && '↗'}
              {trend === 'down' && '↘'}
              {trend === 'stable' && '→'}
              <span className="text-sm font-semibold">{Math.abs(trendPercent)}%</span>
            </div>
            {/* Total del período */}
            <div className="bg-accent/20 text-accent px-4 py-1 rounded-lg">
              <span className="text-2xl font-bold">+{newUsersThisWeek || 0}</span>
              <span className="text-xs ml-1">{periodLabel.toLowerCase()}</span>
            </div>
          </div>
        </div>

        {/* Métricas adicionales */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-background/50 rounded-lg p-3">
            <div className="text-xs text-secondary mb-1">Promedio</div>
            <div className="text-lg font-bold text-white">{avgValue.toFixed(1)}</div>
          </div>
          <div className="bg-background/50 rounded-lg p-3">
            <div className="text-xs text-secondary mb-1">Máximo</div>
            <div className="text-lg font-bold text-white">{maxValue}</div>
          </div>
          <div className="bg-background/50 rounded-lg p-3">
            <div className="text-xs text-secondary mb-1">Total</div>
            <div className="text-lg font-bold text-white">{totalUsers}</div>
          </div>
        </div>
      </div>

      {/* Gráfico mejorado */}
      <div className="relative">
        {/* Líneas de referencia horizontales */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none px-4 pb-8">
          {[100, 75, 50, 25, 0].map((percent) => (
            <div key={percent} className="flex items-center gap-2">
              <span className="text-xs text-secondary/50 w-8">{Math.round((maxValue * percent) / 100)}</span>
              <div className="flex-1 border-t border-gray-700/30"></div>
            </div>
          ))}
        </div>

        {/* Barras del gráfico */}
        <div className="relative h-64 flex items-end gap-2 px-4 pt-4">
          {chartData.map((data, index) => {
            const isHighPerformance = data.value >= avgValue * 1.2
            const isLowPerformance = data.value < avgValue * 0.5 && data.value > 0

            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                {/* Valor encima de la barra */}
                {data.value > 0 && (
                  <div className="text-xs font-bold text-white mb-1">
                    {data.value}
                  </div>
                )}

                {/* Barra */}
                <div className="relative group flex-1 w-full flex items-end">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 relative ${
                      isHighPerformance ? 'bg-gradient-to-t from-green-600 to-green-400' :
                      isLowPerformance ? 'bg-gradient-to-t from-orange-600 to-orange-400' :
                      data.value > 0 ? 'bg-gradient-to-t from-accent to-green-400' :
                      'bg-gray-700/30'
                    }`}
                    style={{
                      height: data.value > 0 ? data.height : '4px',
                      minHeight: data.value > 0 ? '12px' : '4px',
                      boxShadow: data.value > 0 ? '0 4px 12px rgba(152, 217, 50, 0.3)' : 'none'
                    }}
                  >
                    {/* Indicador de alto rendimiento */}
                    {isHighPerformance && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <span className="text-green-400 text-lg">★</span>
                      </div>
                    )}

                    {/* Tooltip detallado */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 hidden group-hover:block z-10">
                      <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-2xl border border-gray-700">
                        <div className="font-bold mb-1">{data.day}</div>
                        <div className="text-accent">{data.value} {data.value === 1 ? 'usuario' : 'usuarios'}</div>
                        {data.value > 0 && (
                          <div className="text-secondary text-[10px] mt-1">
                            {((data.value / totalUsers) * 100).toFixed(1)}% del total
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Etiqueta del día */}
                <div className={`text-xs text-center font-medium ${
                  data.value > 0 ? 'text-white' : 'text-secondary/50'
                }`}>
                  {data.day}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Leyenda */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-t from-green-600 to-green-400"></div>
          <span className="text-secondary">Alto rendimiento (★)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-t from-accent to-green-400"></div>
          <span className="text-secondary">Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-t from-orange-600 to-orange-400"></div>
          <span className="text-secondary">Bajo rendimiento</span>
        </div>
      </div>
    </div>
  )
}

export default UserChart