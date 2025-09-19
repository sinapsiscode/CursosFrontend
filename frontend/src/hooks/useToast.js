import { useUIStore } from '../store'

export const useToast = () => {
  const { toast, hideToast } = useUIStore()

  return {
    toast,
    hideToast,
    isVisible: toast.show
  }
}