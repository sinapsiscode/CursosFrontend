export const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div
        className="bg-accent h-2 rounded-full transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}