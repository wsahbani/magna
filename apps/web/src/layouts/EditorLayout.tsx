import { ReactNode } from 'react'
import { Heading1 } from '@repo/ui'

interface EditorLayoutProps {
  title?: string
  palette: ReactNode
  canvas: ReactNode
  properties: ReactNode
  toolbar?: ReactNode
}

export function EditorLayout({ 
  title, 
  palette, 
  canvas, 
  properties, 
  toolbar 
}: EditorLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 flex-shrink-0">
        {title && <Heading1>{title}</Heading1>}
      </header>

      {/* Toolbar */}
      {toolbar && (
        <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-2 flex-shrink-0">
          {toolbar}
        </div>
      )}

      {/* Main Content - Three Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Palette */}
        <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
          {palette}
        </aside>

        {/* Center - Canvas */}
        <main className="flex-1 overflow-hidden bg-gray-50">
          {canvas}
        </main>

        {/* Right Sidebar - Properties */}
        <aside className="w-80 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
          {properties}
        </aside>
      </div>
    </div>
  )
}
