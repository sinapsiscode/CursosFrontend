const RecentUsers = ({ recentUsers }) => {
  return (
    <div className="bg-surface rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Usuarios Recientes</h3>
      <div className="space-y-3">
        {recentUsers && recentUsers.length > 0 ? (
          recentUsers.map(user => {
            const userName = user.nombre || user.name || 'Usuario'
            const userAvatar = user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40'
            const userArea = user.selectedArea || user.areaPreferida || 'Sin área'
            const userSub = user.subscription?.type || 'free'
            const userDate = user.fechaCreacion || user.createdAt

            return (
              <div key={user.id} className="flex items-center w-full" style={{ gap: '12px' }}>
                {/* Avatar */}
                <div className="flex-shrink-0" style={{ width: '40px', height: '40px' }}>
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40' }}
                  />
                </div>

                {/* User Info */}
                <div className="flex-1" style={{ minWidth: 0, maxWidth: 'calc(100% - 150px)' }}>
                  <div className="text-white font-medium text-sm" style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {userName}
                  </div>
                  <div className="text-secondary text-xs" style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {userArea} • {userSub}
                  </div>
                </div>

                {/* Date */}
                <div className="flex-shrink-0 text-secondary text-xs" style={{
                  whiteSpace: 'nowrap',
                  marginLeft: 'auto'
                }}>
                  {userDate ? new Date(userDate).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }) : 'N/A'}
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center text-secondary py-8">
            <p>No hay usuarios registrados</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecentUsers