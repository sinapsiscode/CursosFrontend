import { getUserRoleIcon } from '../../common/Icons'
import { capitalizeFirst } from '../../../utils/authUtils'
import { DEFAULT_SUBSCRIPTION } from '../../../constants/subscriptionConstants'

const QuickAccessUsers = ({ users, onQuickLogin, isLoading }) => {
  const getRoleBadgeColor = (role) => {
    if (role === 'admin') return 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border-orange-500/30'
    return 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30'
  }

  const getSubscriptionColor = (subscription) => {
    const type = subscription?.type || DEFAULT_SUBSCRIPTION
    if (type === 'premium') return 'text-amber-400'
    if (type === 'basic') return 'text-gray-400'
    return 'text-gray-400'
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Acceso Rápido</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => onQuickLogin(user.email, user.password)}
            disabled={isLoading}
            className="group w-full bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/50 hover:border-gray-600/50 backdrop-blur-sm rounded-xl p-4 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              {/* Avatar con ring animado */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="relative w-12 h-12 rounded-full object-cover ring-2 ring-gray-700 group-hover:ring-blue-500/50 transition-all"
                />
              </div>

              {/* Info del usuario */}
              <div className="flex-1 text-left min-w-0">
                {/* Nombre y rol */}
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-white truncate">
                    {user.name}
                  </h4>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                    {getUserRoleIcon(user.role)}
                    <span className="capitalize">{user.role}</span>
                  </span>
                </div>

                {/* Área y suscripción */}
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="capitalize">{capitalizeFirst(user.selectedArea)}</span>
                  <span>•</span>
                  <span className={`capitalize font-medium ${getSubscriptionColor(user.subscription)}`}>
                    {user.subscription?.type || DEFAULT_SUBSCRIPTION}
                  </span>
                </div>
              </div>

              {/* Arrow icon */}
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickAccessUsers