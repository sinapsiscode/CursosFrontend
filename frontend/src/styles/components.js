export const formStyles = {
  input: "w-full px-4 py-2 bg-background border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent",
  inputError: "border-red-500",
  inputNormal: "border-gray-600",
  select: "w-full px-4 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent",
  textarea: "w-full px-4 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent",
  label: "block text-sm font-medium text-gray-300 mb-2",
  errorText: "text-red-400 text-sm mt-1",
  helpText: "text-gray-400 text-xs mt-1"
}

export const buttonStyles = {
  primary: "px-4 py-2 bg-accent text-background rounded-lg font-medium hover:bg-opacity-90 transition-colors",
  secondary: "px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors",
  danger: "text-red-400 hover:text-red-300 transition-colors",
  upload: {
    image: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",
    video: "px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors",
    document: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
  }
}

export const layoutStyles = {
  modal: "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4",
  modalContent: "bg-surface rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden",
  formContainer: "p-6 overflow-y-auto max-h-[calc(90vh-200px)]",
  section: "space-y-6",
  grid: "grid md:grid-cols-2 gap-6",
  card: "bg-background rounded-lg p-6 space-y-4",
  emptyState: "text-center py-8 text-gray-400"
}

export const tabStyles = {
  container: "border-b border-gray-700 bg-background",
  nav: "flex",
  tab: "flex-1 px-4 py-3 text-sm font-medium transition-colors",
  tabActive: "border-b-2 border-accent text-accent bg-surface",
  tabInactive: "text-gray-400 hover:text-white hover:bg-surface/50"
}

export const headerStyles = {
  container: "bg-gradient-to-r from-accent to-blue-600 p-6 relative",
  closeButton: "absolute top-4 right-4 text-white/80 hover:text-white transition-colors",
  title: "text-2xl font-bold text-white mb-2",
  subtitle: "text-white/90 text-sm"
}

export const modalStyles = {
  overlay: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
  container: "bg-surface rounded-xl p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto",
  closeButton: "absolute top-4 right-4 text-text-secondary hover:text-white transition-colors"
}

export const authStyles = {
  logo: "w-10 h-10 bg-accent rounded-lg flex items-center justify-center",
  logoText: "text-background font-bold text-xl",
  brandText: "text-2xl font-bold text-white",
  title: "text-xl font-bold text-white mb-2",
  subtitle: "text-text-secondary",
  divider: "flex-1 border-gray-600",
  dividerText: "px-4 text-text-secondary text-sm"
}