const UserChart = ({ newUsersThisWeek, chartData }) => {
  return (
    <div className="bg-surface rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Nuevos Usuarios</h3>
        <div className="text-accent font-medium">
          +{newUsersThisWeek || 0} esta semana
        </div>
      </div>

      <div className="h-64 bg-background rounded-lg flex items-end space-x-2 p-4">
        {chartData.map((data, index) => (
          <div key={index} className="flex-1 space-y-1">
            <div
              className="bg-accent rounded-sm"
              style={{ height: data.height }}
            />
            <div className="text-xs text-text-secondary text-center">
              {data.day}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserChart