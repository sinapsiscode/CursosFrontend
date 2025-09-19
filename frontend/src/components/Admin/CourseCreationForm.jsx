import { useState } from 'react'
import { useUIStore } from '../../store'
import { useCourseForm } from '../../hooks/useCourseForm'
import { useFileUpload } from '../../hooks/useFileUpload'
import FormHeader from './CourseForm/FormHeader'
import TabNavigation from './CourseForm/TabNavigation'
import BasicInfoTab from './CourseForm/BasicInfoTab'
import ContentTab from './CourseForm/ContentTab'
import MaterialsTab from './CourseForm/MaterialsTab'
import SettingsTab from './CourseForm/SettingsTab'
import { FORM_TABS } from '../../constants/formConstants'

const CourseCreationForm = ({ onClose, onSave, editingCourse = null, activeAreas = [], levels = [] }) => {
  const { showToast } = useUIStore()

  const [activeTab, setActiveTab] = useState('basic')

  const {
    formData,
    updateFormData,
    lessons,
    materials,
    errors,
    isSubmitting,
    addLesson,
    updateLesson,
    removeLesson,
    addMaterial,
    updateMaterial,
    removeMaterial,
    handleSubmit
  } = useCourseForm({ editingCourse, activeAreas, levels, onSave, onClose, showToast })

  const { uploadProgress, handleFileUpload } = useFileUpload({ showToast })








  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <FormHeader
          editingCourse={editingCourse}
          onClose={onClose}
        />

        <TabNavigation
          tabs={FORM_TABS}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'basic' && (
            <BasicInfoTab
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              activeAreas={activeAreas}
              levels={levels}
              handleFileUpload={handleFileUpload}
            />
          )}

          {activeTab === 'content' && (
            <ContentTab
              lessons={lessons}
              addLesson={addLesson}
              updateLesson={updateLesson}
              removeLesson={removeLesson}
              errors={errors}
              uploadProgress={uploadProgress}
              handleFileUpload={handleFileUpload}
            />
          )}

          {activeTab === 'materials' && (
            <MaterialsTab
              materials={materials}
              addMaterial={addMaterial}
              updateMaterial={updateMaterial}
              removeMaterial={removeMaterial}
              uploadProgress={uploadProgress}
              handleFileUpload={handleFileUpload}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              formData={formData}
              updateFormData={updateFormData}
              lessons={lessons}
              materials={materials}
            />
          )}

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-600">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-accent text-background rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Guardando...' : (editingCourse ? 'Actualizar Curso' : 'Crear Curso')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CourseCreationForm