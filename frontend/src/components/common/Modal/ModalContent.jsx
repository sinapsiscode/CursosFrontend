import { MODAL_STYLES } from '../../../constants/modalConstants'

const ModalContent = ({ children, hasHeader }) => {
  return (
    <div className={hasHeader ? MODAL_STYLES.content : MODAL_STYLES.contentWithoutHeader}>
      {children}
    </div>
  )
}

export default ModalContent