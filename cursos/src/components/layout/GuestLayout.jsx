import React from 'react'
import { LeadMagnet } from '../marketing'
import { Toast } from '../ui'
import { WhatsAppWidget } from '../whatsapp'

const GuestLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header básico para guests */}
      <header className="bg-surface border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex justify-between items-center">
            <div className="text-xl font-bold gradient-text">
              MetSel Academy
            </div>
            <div className="text-sm text-text-secondary">
              Modo Guest
            </div>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>

      {/* Lead Magnet for guest users */}
      <LeadMagnet />
      
      {/* WhatsApp Widget */}
      <WhatsAppWidget />

      {/* Toast notifications */}
      <Toast />
    </div>
  )
}

export default GuestLayout