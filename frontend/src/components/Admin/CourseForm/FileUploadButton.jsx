export const FileUploadButton = ({ type, onUpload, handleFileUpload, children, className, accept }) => {
  const handleClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept || (type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : '*/*')
    input.style.display = 'none'

    input.onchange = (fileEvent) => {
      try {
        handleFileUpload(fileEvent, type, (url, fileId) => {
          onUpload(url, fileId)
        })
      } catch (error) {
        console.error('Error en subida de archivo:', error)
      } finally {
        if (input.parentNode) {
          input.parentNode.removeChild(input)
        }
      }
    }

    document.body.appendChild(input)
    input.click()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  )
}