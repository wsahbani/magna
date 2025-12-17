/**
 * Admin Layout Component
 * Main layout wrapper with sidebar and header
 */

import { useState, ReactNode } from 'react'
import { Sidebar } from '../components/layout/Sidebar'
import { Header } from '../components/layout/Header'
import { cn } from '@repo/ui'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          'transition-all duration-300',
          sidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-64',
        )}
      >
        {/* Header */}
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Page Content */}
        <main className="p-2">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white py-6 px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © 2025 Orange Group. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-600 hover:text-orange-600">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-orange-600">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-orange-600">
                Documentation
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
