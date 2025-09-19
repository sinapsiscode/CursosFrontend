const RecentUsers = ({ recentUsers }) => {
  return (
    <div className="bg-surface rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Usuarios Recientes</h3>
      <div className="space-y-4">
        {recentUsers && recentUsers.length > 0 ? (
          recentUsers.map(user => (
            <div key={user.id} className="flex items-center space-x-4">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40'}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="text-white font-medium">{user.name}</h4>
                <p className="text-text-secondary text-sm">
                  {user.selectedArea} • {user.subscription?.type || 'free'}
                </p>
              </div>
              <div className="text-text-secondary text-sm">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-text-secondary py-8">
            <p>No hay usuarios registrados</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecentUsers