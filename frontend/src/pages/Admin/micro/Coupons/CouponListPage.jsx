import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'

const CouponListPage = () => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    // Simular carga de cupones
    const timer = setTimeout(() => {
      setCoupons([
        { id: 1, code: 'WELCOME2024', discount: 20, type: 'percentage', uses: 45, maxUses: 100, status: 'active', expiry: '2024-12-31' },
        { id: 2, code: 'STUDENT50', discount: 50, type: 'percentage', uses: 12, maxUses: 50, status: 'active', expiry: '2024-06-30' },
        { id: 3, code: 'PROMO10', discount: 10, type: 'fixed', uses: 89, maxUses: 100, status: 'used', expiry: '2024-03-15' }
      ])
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const filteredCoupons = coupons.filter(coupon => {
    if (filter === 'all') return true
    return coupon.status === filter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400'
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
      default: return 'Desconocido'
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
                      onClick={() => console.log('Duplicar cupón:', coupon.id)}
                      className="text-text-secondary hover:text-white text-sm"
                    >
                      Duplicar
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