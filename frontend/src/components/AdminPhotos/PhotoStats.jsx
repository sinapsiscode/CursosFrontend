/**
 * PhotoStats component - Display statistics for photos
 */
const PhotoStats = ({ photos }) => {
  const activePhotos = photos.filter(photo => photo.active !== false).length
  const inactivePhotos = photos.filter(photo => photo.active === false).length

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-surface rounded-xl p-6">
        <div className="flex items-center">
          <div className="p-3 bg-blue-600 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-secondary text-sm">Total de Fotos</p>
            <p className="text-2xl font-bold text-white">{photos.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl p-6">
        <div className="flex items-center">
          <div className="p-3 bg-green-600 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-secondary text-sm">Fotos Activas</p>
            <p className="text-2xl font-bold text-white">{activePhotos}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl p-6">
        <div className="flex items-center">
          <div className="p-3 bg-red-600 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-secondary text-sm">Fotos Inactivas</p>
            <p className="text-2xl font-bold text-white">{inactivePhotos}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhotoStats
