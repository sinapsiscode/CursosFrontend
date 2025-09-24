import { TRANSACTION_TYPES, LOYALTY_STYLES, LOYALTY_MESSAGES } from '../../constants/loyaltyProgramConstants.jsx'

const HistoryTab = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div>
        <h2 className={LOYALTY_STYLES.history.title}>
          {LOYALTY_MESSAGES.history.title}
        </h2>
        <div className={LOYALTY_STYLES.history.emptyState}>
          <p className={LOYALTY_STYLES.history.emptyTitle}>
            {LOYALTY_MESSAGES.history.noTransactions}
          </p>
          <p className={LOYALTY_STYLES.history.emptySubtitle}>
            {LOYALTY_MESSAGES.history.startEarning}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className={LOYALTY_STYLES.history.title}>
        {LOYALTY_MESSAGES.history.title}
      </h2>

      <div className={LOYALTY_STYLES.history.table}>
        <table className="w-full">
          <thead className={LOYALTY_STYLES.history.tableHead}>
            <tr>
              <th className={LOYALTY_STYLES.history.tableHeader}>
                {LOYALTY_MESSAGES.history.date}
              </th>
              <th className={LOYALTY_STYLES.history.tableHeader}>
                {LOYALTY_MESSAGES.history.description}
              </th>
              <th className={LOYALTY_STYLES.history.tableHeaderRight}>
                {LOYALTY_MESSAGES.history.points}
              </th>
              <th className={LOYALTY_STYLES.history.tableHeaderCenter}>
                {LOYALTY_MESSAGES.history.type}
              </th>
            </tr>
          </thead>
          <tbody className={LOYALTY_STYLES.history.tableBody}>
            {transactions.map(transaction => (
              <tr key={transaction.id} className={LOYALTY_STYLES.history.tableRow}>
                <td className={LOYALTY_STYLES.history.tableCellDate}>
                  {new Date(transaction.timestamp).toLocaleDateString('es-ES')}
                </td>
                <td className={LOYALTY_STYLES.history.tableCellDescription}>
                  {transaction.description}
                </td>
                <td className={`${LOYALTY_STYLES.history.tableCellPoints} ${
                  transaction.amount > 0
                    ? LOYALTY_STYLES.history.tableCellPointsPositive
                    : LOYALTY_STYLES.history.tableCellPointsNegative
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}
                </td>
                <td className={LOYALTY_STYLES.history.tableCellType}>
                  <span className={`${LOYALTY_STYLES.history.typeLabel} ${
                    TRANSACTION_TYPES[transaction.type]?.color || TRANSACTION_TYPES.default.color
                  }`}>
                    {TRANSACTION_TYPES[transaction.type]?.label || TRANSACTION_TYPES.default.label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default HistoryTab