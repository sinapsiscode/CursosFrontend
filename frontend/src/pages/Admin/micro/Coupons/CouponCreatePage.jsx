import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'
import cuponesService from '../../../../services/cuponesService'
import Swal from 'sweetalert2'

const CouponCreatePage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  const isEditing = Boolean(editId)

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    maxUses: '',
    expiryDate: '',
    description: '',
    active: true
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEditing) {
      loadCouponData()
    }
  }, [isEditing])

  const loadCouponData = async () => {
    setLoading(true)
    try {
      const coupon = await cuponesService.getById(editId)
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue.toString(),
        maxUses: coupon.maxUses.toString(),
        expiryDate: coupon.expiryDate,
        description: coupon.description || '',
        active: coupon.active
      })
    } catch (error) {
      console.error('Error cargando cupón:', error)
      Swal.fire({
        title: 'Error',
        text: 'No se pudo cargar el cupón',
        icon: 'error',
        customClass: {
          popup: 'bg-gray-800 text-white',
          title: 'text-white'
        }
      })
      navigate('/admin/coupons')
    } finally {
      setLoading(false)
    }
  }

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData(prev => ({ ...prev, code }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (isEditing) {
        await cuponesService.updateGeneralCoupon(editId, formData)
        Swal.fire({
          title: '¡Cupón actualizado!',
          text: 'El cupón se actualizó correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'bg-gray-800 text-white',
            title: 'text-white'
          }
        })
      } else {
        await cuponesService.createGeneralCoupon(formData)
        Swal.fire({
          title: '¡Cupón creado!',
          text: 'El cupón se creó correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'bg-gray-800 text-white',
            title: 'text-white'
          }
        })
      }
      navigate('/admin/coupons')
    } catch (error) {
      console.error('Error:', error)
      Swal.fire({
        title: 'Error',
        text: 'No se pudo guardar el cupón',
        icon: 'error',
        customClass: {
          popup: 'bg-gray-800 text-white',
          title: 'text-white'
        }
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <PageLayout title={isEditing ? 'Editar Cupón' : 'Nuevo Cupón'}>
        <div className="flex justify-center py-12">
          <div className="text-white">Cargando...</div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title={isEditing ? 'Editar Cupón' : 'Nuevo Cupón'}>
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Código del Cupón
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className="flex-1 p-3 bg-surface border border-gray-600 rounded-lg text-white font-mono"
                placeholder="CODIGO123"
                required
              />
              <button
                type="button"
                onClick={generateCode}
                className="px-4 py-2 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors"
              >
                Generar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tipo de Descuento
              </label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value }))}
                className="w-full p-3 bg-surface border border-gray-600 rounded-lg text-white"
                required
              >
                <option value="percentage">Porcentaje (%)</option>
                <option value="fixed">Monto Fijo ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Valor del Descuento
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountValue: e.target.value }))}
                  className="w-full p-3 bg-surface border border-gray-600 rounded-lg text-white"
                  placeholder={formData.discountType === 'percentage' ? '20' : '100'}
                  min="1"
                  max={formData.discountType === 'percentage' ? '100' : undefined}
                  required
                />
                <span className="absolute right-3 top-3 text-secondary">
                  {formData.discountType === 'percentage' ? '%' : '$'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Máximo de Usos
              </label>
              <input
                type="number"
                value={formData.maxUses}
                onChange={(e) => setFormData(prev => ({ ...prev, maxUses: e.target.value }))}
                className="w-full p-3 bg-surface border border-gray-600 rounded-lg text-white"
                placeholder="100"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Fecha de Vencimiento
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                className="w-full p-3 bg-surface border border-gray-600 rounded-lg text-white"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Descripción (opcional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-3 bg-surface border border-gray-600 rounded-lg text-white"
              rows="3"
              placeholder="Descripción del cupón y condiciones de uso"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
              className="w-4 h-4 text-accent"
            />
            <label htmlFor="active" className="text-white">
              Cupón activo (disponible para uso)
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/coupons')}
              className="px-6 py-2 border border-gray-600 rounded-lg text-white hover:bg-surface transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-accent text-background rounded-lg hover:bg-accent/80 transition-colors disabled:opacity-50"
            >
              {saving ? 'Guardando...' : (isEditing ? 'Actualizar Cupón' : 'Crear Cupón')}
            </button>
          </div>
        </form>
      </div>
    </PageLayout>
  )
}

export default CouponCreatePage