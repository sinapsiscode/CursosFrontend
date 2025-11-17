import { getAreaColor, capitalizeFirst } from '../../../utils/authUtils'
import { DEMO_PASSWORD } from '../../../constants/authConstants'

const DemoUsersInfo = ({ users }) => {
  return (
    <div className="mt-6 p-4 bg-background rounded-lg">
      <h4 className="text-sm font-medium text-white mb-3">Información de usuarios:</h4>
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="flex items-center space-x-3 text-xs">
            <div className={`w-3 h-3 rounded-full ${user.role === 'admin' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
            <div className="flex-1">
              <span className="text-white font-medium">{user.name}</span>
              <span className="text-secondary ml-2">({user.email})</span>
            </div>
            <span className={`${getAreaColor(user.selectedArea)} font-medium`}>
              {capitalizeFirst(user.selectedArea)}
            </span>
          </div>
        ))}
        <div className="mt-3 pt-3 border-t border-gray-600">
          <p className="text-secondary text-xs">
            <strong>Contraseña para todos:</strong> {DEMO_PASSWORD}
          </p>
        </div>
      </div>
    </div>
  )
}

export default DemoUsersInfo