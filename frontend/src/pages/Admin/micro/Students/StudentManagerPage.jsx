import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'
import { useStudentManager } from '../../../../hooks/useStudentManager'
import { getStudentStats } from '../../../../utils/studentManagerUtils'
import { STUDENT_AREAS } from '../../../../constants/studentManagerConstants'
import StudentFormModal from '../../../../components/Students/StudentFormModal'

const StudentManagerPage = () => {
  const {
    students,
    loading,
    showCreateForm,
    searchTerm,
    filteredStudents,
    notification,
    formData,
    validationErrors,
    editingStudent,
    setShowCreateForm,
    setSearchTerm,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleSuspendToggle,
    handleCloseForm
  } = useStudentManager()

  const stats = getStudentStats(students)

  if (loading) {
    return <PageLayout.Loading />
  }

  return (
    <PageLayout title="Gestión de Estudiantes">
      <div className="space-y-6">
        {/* Notification */}
        {notification && (
          <div className={`p-4 rounded-lg ${
            notification.type === 'success' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
          }`}>
            {notification.message}
          </div>
        )}

        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nombre, email, área..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md bg-surface border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            + Agregar Estudiante
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface p-4 rounded-lg">
            <p className="text-text-secondary text-sm">Total</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-surface p-4 rounded-lg">
            <p className="text-text-secondary text-sm">Activos</p>
            <p className="text-2xl font-bold text-green-400">{stats.active}</p>
          </div>
          <div className="bg-surface p-4 rounded-lg">
            <p className="text-text-secondary text-sm">Suspendidos</p>
            <p className="text-2xl font-bold text-red-400">{stats.suspended}</p>
          </div>
          {stats.byArea.map(area => (
            <div key={area.value} className="bg-surface p-4 rounded-lg">
              <p className="text-text-secondary text-sm">{area.label}</p>
              <p className={`text-2xl font-bold ${area.value === 'metalurgia' ? 'text-blue-400' : area.value === 'mineria' ? 'text-green-400' : 'text-orange-400'}`}>
                {area.count}
              </p>
            </div>
          )).slice(0, 1)}
        </div>

        {/* Students Table */}
        <div className="bg-surface rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background">
                <tr>
                  <th className="text-left p-4 text-text-secondary font-medium">Estudiante</th>
                  <th className="text-left p-4 text-text-secondary font-medium">Área</th>
                  <th className="text-left p-4 text-text-secondary font-medium">Contacto</th>
                  <th className="text-left p-4 text-text-secondary font-medium">Estado</th>
                  <th className="text-left p-4 text-text-secondary font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.id} className="border-t border-gray-700">
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">{student.name}</p>
                        <p className="text-text-secondary text-sm">{student.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                        student.area === 'metalurgia' ? 'bg-blue-500' :
                        student.area === 'mineria' ? 'bg-green-500' : 'bg-orange-500'
                      }`}></span>
                      {STUDENT_AREAS.find(a => a.value === student.area)?.label || student.area}
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        {student.phone && <p className="text-white">📱 {student.phone}</p>}
                        {student.dni && <p className="text-text-secondary">DNI: {student.dni}</p>}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.suspended ? 'bg-red-900/20 text-red-400' : 'bg-green-900/20 text-green-400'
                      }`}>
                        {student.suspended ? 'Suspendido' : 'Activo'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-accent hover:text-accent/80 text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleSuspendToggle(student)}
                          className="text-yellow-400 hover:text-yellow-300 text-sm"
                        >
                          {student.suspended ? 'Activar' : 'Suspender'}
                        </button>
                        <button
                          onClick={() => handleDelete(student)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-text-secondary">
            {students.length === 0 ? 'No hay estudiantes registrados' : 'No se encontraron estudiantes con ese criterio'}
          </div>
        )}

        {/* Student Form Modal */}
        <StudentFormModal
          showCreateForm={showCreateForm}
          editingStudent={editingStudent}
          formData={formData}
          validationErrors={validationErrors}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleCloseForm={handleCloseForm}
        />
      </div>
    </PageLayout>
  )
}

export default StudentManagerPage