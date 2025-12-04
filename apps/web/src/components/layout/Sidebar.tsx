/**
 * Admin Sidebar Component
 * Navigation sidebar with MAGNA branding
 */

import { Link, useLocation } from '@tanstack/react-router'
import { cn } from '@repo/ui'
import {
  LayoutDashboard,
  FolderKanban,
  Workflow,
  Users,
  Settings,
  FileText,
  Building2,
  Tags,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  Shield,
} from 'lucide-react'
import { useAuth } from '../../features/auth'
import { appConfig } from '../../config'
import { LogoOrange } from '@repo/ui/components/logo-orange'

interface NavItem {
  label: string
  icon: any
  href: string
  badge?: number
}

const navigationItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'Processes', icon: Workflow, href: '/processes' },
  { label: 'Workspaces', icon: Building2, href: '/workspaces' },
  { label: 'Documents', icon: FileText, href: '/documents' },
  { label: 'Projects', icon: FolderKanban, href: '/projects' },
  { label: 'Tags', icon: Tags, href: '/tags' },
  { label: 'Users', icon: Users, href: '/users' },
  { label: 'Groups', icon: Shield, href: '/groups' },
  { label: 'Notifications', icon: Bell, href: '/notifications', badge: 3 },
  { label: 'Settings', icon: Settings, href: '/settings' },
]

interface SidebarProps {
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ collapsed = false, onCollapse, mobileOpen = false, onMobileClose }: SidebarProps) {
  const location = useLocation()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen bg-black border-r border-gray-800 transition-all duration-300',
          'flex flex-col',
          collapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                <LogoOrange />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-base tracking-wide">{appConfig.name}</span>
                <span className="text-[10px] text-orange-400">{appConfig.description}</span>
              </div>
            </div>
          )}
          
          {collapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto shadow-lg">
              <span className="text-white font-bold text-xl">{appConfig.logo.icon}</span>
            </div>
          )}

          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
            className="lg:hidden p-2 hover:bg-gray-800 rounded-lg text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative group',
                      active
                        ? 'bg-orange-600 text-white font-medium'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    )}
                  >
                    <Icon className={cn('w-5 h-5 flex-shrink-0', active && 'text-white')} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-sm">{item.label}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-[10px] font-medium bg-orange-600 text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {collapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                        {item.label}
                        {item.badge && (
                          <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-orange-600 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t border-gray-800 p-4">
          {!collapsed && user && (
            <div className="mb-3">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-xs">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-orange-500 transition-colors group',
              collapsed && 'justify-center'
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm">Déconnexion</span>}
            
            {/* Tooltip for collapsed state */}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                Déconnexion
              </div>
            )}
          </button>
        </div>

        {/* Collapse Toggle (Desktop only) */}
        <button
          onClick={() => onCollapse?.(!collapsed)}
          className={cn(
            'hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-gray-800 border border-gray-700 rounded-full items-center justify-center hover:bg-orange-600 transition-colors',
            'shadow-sm'
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </aside>
    </>
  )
}
