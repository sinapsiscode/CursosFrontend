import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'
import cuponesService from '../../../../services/cuponesService'
import Swal from 'sweetalert2'

const CouponListPage = () => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadCoupons()
  }, [])

  const loadCoupons = async () => {
    setLoading(true)
    try {
      const data = await cuponesService.getAll()

      // Procesar cupones y calcular su estado
      const processedCoupons = data.map(coupon => {
        const now = new Date()
        const expiryDate = new Date(coupon.expiryDate)
        const currentUses = coupon.currentUses || 0
        const maxUses = coupon.maxUses || 0

        let status = 'active'
        if (currentUses >= maxUses) {
          status = 'used'
        } else if (expiryDate < now) {
          status = 'expired'
        } else if (!coupon.active) {
          status = 'inactive'
        }

        return {
          ...coupon,
          status,
          uses: currentUses,
          discount: coupon.discountValue,
          type: coupon.discountType,
          expiry: coupon.expiryDate
        }
      })

      setCoupons(processedCoupons)
    } catch (error) {
      console.error('Error cargando cupones:', error)
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los cupones',
        icon: 'error',
        customClass: {
          popup: 'bg-gray-800 text-white',
          title: 'text-white'
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredCoupons = coupons.filter(coupon => {
    if (filter === 'all') return true
    return coupon.status === filter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400'
      case 'inactive': return 'bg-yellow-500/20 text-yellow-400'
      case 'used': return 'bg-red-500/20 text-red-400'
      case 'expired': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Activo'
      case 'used': return 'Agotado'
      case 'expired': return 'Expirado'
      case 'inactive': return 'Inactivo'
      default: return 'Desconocido'
    }
  }

  const handleDuplicate = async (coupon) => {
    try {
      const result = await Swal.fire({
        title: 'Duplicar Cupón',
        text: `¿Deseas duplicar el cupón ${coupon.code}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#22c55e',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, duplicar',
        cancelButtonText: 'Cancelar',
        customClass: {
          popup: 'bg-gray-800 text-white',
          title: 'text-white'
        }
      })

      if (result.isConfirmed) {
        const newCode = cuponesService.generateCouponCode()
        const duplicatedCoupon = {
          code: newCode,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          maxUses: coupon.maxUses,
          expiryDate: coupon.expiryDate,
          description: coupon.description,
          active: true
        }

        await cuponesService.createGeneralCoupon(duplicatedCoupon)

        Swal.fire({
          title: '¡Cupón duplicado!',
          text: `Nuevo código: ${newCode}`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'bg-gray-800 text-white',
            title: 'text-white'
          }
        })

        loadCoupons()
      }
    } catch (error) {
      console.error('Error duplicando cupón:', error)
      Swal.fire({
        title: 'Error',
        text: 'No se pudo duplicar el cupón',
        icon: 'error',
        customClass: {
          popup: 'bg-gray-800 text-white',
          title: 'text-white'
        }
      })
    }
  }

  const handleDelete = async (coupon) => {
    try {
      const result = await Swal.fire({
        title: '¿Eliminar cupón?',
        text: `Se eliminará el cupón ${coupon.code}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        customClass: {
          popup: 'bg-gray-800 text-white',
          title: 'text-white'
        }
      })

      if (result.isConfirmed) {
        await cuponesService.delete(coupon.id)

        Swal.fire({
          title: '¡Eliminado!',
          text: 'El cupón se eliminó correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'bg-gray-800 text-white',
            title: 'text-white'
          }
        })

        loadCoupons()
      }
    } catch (error) {
      console.error('Error eliminando cupón:', error)
      Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar el cupón',
        icon: 'error',
        customClass: {
          popup: 'bg-gray-800 text-white',
          title: 'text-white'
        }
      })
    }
  }

  if (loading) {
    return <PageLayout.Loading />
  }

  return (
    <PageLayout
      title="Gestión de Cupones"
      action={{
        label: "Nuevo Cupón",
        href: "/admin/coupons/create"
      }}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-text-secondary">
            Administración de códigos y cupones de descuento
          </p>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-background border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent"
          >
            <option value="all">Todos los cupones</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
            <option value="used">Agotados</option>
            <option value="expired">Expirados</option>
          </select>
        </div>

        <div className="bg-surface rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-background">
              <tr>
                <th className="text-left p-4 text-white">Código</th>
                <th className="text-left p-4 text-white">Descuento</th>
                <th className="text-left p-4 text-white">Usos</th>
                <th className="text-left p-4 text-white">Vencimiento</th>
                <th className="text-left p-4 text-white">Estado</th>
                <th className="text-left p-4 text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map(coupon => (
                <tr key={coupon.id} className="border-t border-gray-700">
                  <td className="p-4">
                    <code className="bg-background px-2 py-1 rounded text-accent font-mono">
                      {coupon.code}
                    </code>
                  </td>
                  <td className="p-4 text-white">
                    {coupon.type === 'percentage' ? `${coupon.discount}%` : `$${coupon.discount}`}
                  </td>
                  <td className="p-4 text-white">
                    {coupon.uses}/{coupon.maxUses}
                    <div className="w-full bg-background rounded-full h-2 mt-1">
                      <div
                        className="bg-accent h-2 rounded-full"
                        style={{ width: `${(coupon.uses / coupon.maxUses) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="p-4 text-text-secondary">
                    {new Date(coupon.expiry).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(coupon.status)}`}>
                      {getStatusText(coupon.status)}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => window.location.href = `/admin/coupons/create?edit=${coupon.id}`}
                      className="text-accent hover:underline text-sm mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDuplicate(coupon)}
                      className="text-blue-400 hover:text-blue-300 text-sm mr-3"
                    >
                      Duplicar
                    </button>
                    <button
                      onClick={() => handleDelete(coupon)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface p-4 rounded-lg">
            <h3 className="font-medium text-white mb-2">📊 Estadísticas</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Total cupones:</span>
                <span className="text-white">{coupons.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Activos:</span>
                <span className="text-green-400">{coupons.filter(c => c.status === 'active').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Usos totales:</span>
                <span className="text-white">{coupons.reduce((sum, c) => sum + c.uses, 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default CouponListPage