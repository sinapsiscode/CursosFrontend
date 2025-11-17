const LoginDivider = () => {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-600 to-gray-700"></div>
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider px-2">
        O continúa con
      </span>
      <div className="h-px flex-1 bg-gradient-to-r from-gray-700 via-gray-600 to-transparent"></div>
    </div>
  )
}

export default LoginDivider