import { useState, useEffect } from 'react'
import { PAGINATION, MESSAGES } from '../../../config/admin.constants'

const DataTable = ({
  columns,
  data,
  searchable = true,
  sortable = true,
  paginated = true,
  actions,
  onRowClick,
  loading = false,
  emptyMessage = MESSAGES.no_data
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(PAGINATION.defaultItemsPerPage)

  // Filtrar datos
  const filteredData = searchable
    ? data.filter(row =>
        columns.some(col =>
          String(row[col.key])
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      )
    : data

  // Ordenar datos
  const sortedData = sortable && sortConfig.key
    ? [...filteredData].sort((a, b) => {
        const aVal = a[sortConfig.key]
        const bVal = b[sortConfig.key]

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    : filteredData

  // Paginar datos
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = paginated
    ? sortedData.slice(startIndex, startIndex + itemsPerPage)
    : sortedData

  // Reset página cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-lg shadow-lg">
      {/* Header con búsqueda */}
      {searchable && (
        <div className="p-4 border-b border-text-secondary/10">
          <input
            type="text"
            placeholder={MESSAGES.search_placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 px-4 py-2 bg-background text-white rounded-lg focus:ring-2 focus:ring-accent"
          />
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background">
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider ${
                    sortable && column.sortable !== false ? 'cursor-pointer hover:text-white' : ''
                  }`}
                  onClick={() => sortable && column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {sortable && column.sortable !== false && sortConfig.key === column.key && (
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        {sortConfig.direction === 'asc' ? (
                          <path d="M5 12l5-5 5 5H5z" />
                        ) : (
                          <path d="M15 8l-5 5-5-5h10z" />
                        )}
                      </svg>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-text-secondary/10">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-8 text-center text-text-secondary"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={row.id || index}
                  className={`hover:bg-background/50 ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map(column => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      <div className="flex space-x-2">
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={(e) => {
                              e.stopPropagation()
                              action.onClick(row)
                            }}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              action.variant === 'danger'
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-accent hover:bg-accent-dark'
                            } text-background transition-colors`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {paginated && totalPages > 1 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-text-secondary/10">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">Mostrar</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-2 py-1 bg-background text-white rounded border border-text-secondary/20"
            >
              {PAGINATION.itemsPerPage.map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <span className="text-sm text-text-secondary">elementos</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-background text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            <span className="text-sm text-white">
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-background text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable