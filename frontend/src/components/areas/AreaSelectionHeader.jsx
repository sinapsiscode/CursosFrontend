import { APP_CONFIG } from '../../constants/areas'

const AreaSelectionHeader = () => {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center space-x-2 mb-8">
        <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
          <span className="text-background font-bold text-2xl">{APP_CONFIG.appInitial}</span>
        </div>
        <span className="text-3xl font-bold text-white">{APP_CONFIG.appName}</span>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
        {APP_CONFIG.welcomeTitle}
      </h1>

      <p className="text-xl text-secondary max-w-2xl mx-auto">
        {APP_CONFIG.welcomeSubtitle}
      </p>
    </div>
  )
}

export default AreaSelectionHeader