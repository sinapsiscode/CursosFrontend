import { getUserRoleIcon, ArrowRightIcon } from '../../common/Icons'
import { getUserRoleColor, getAreaColor, capitalizeFirst } from '../../../utils/authUtils'

const QuickAccessUsers = ({ users, onQuickLogin, isLoading }) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-white mb-3 text-center">Acceso rápido:</h3>
      <div className="space-y-2">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => onQuickLogin(user.email)}
            disabled={isLoading}
            className={`w-full ${getUserRoleColor(user.role)} text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3`}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-white border-opacity-20"
            />
            <div className="flex-1 text-left">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{user.name}</span>
                <div className="flex items-center space-x-1">
                  {getUserRoleIcon(user.role)}
                  <span className="text-xs opacity-80 capitalize">{user.role}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs opacity-70">
                <span className={getAreaColor(user.selectedArea)}>
                  {capitalizeFirst(user.selectedArea)}
                </span>
                <span>•</span>
                <span className="capitalize">{user.subscription.type}</span>
              </div>
            </div>
            <ArrowRightIcon className="opacity-60" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickAccessUsers