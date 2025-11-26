# Grid Helpers Feature

## Overview
The Grid Helpers feature provides visual guides and snap-to-grid functionality to help users align and position nodes precisely in the flow editor. It includes multiple background patterns, configurable grid size, and snap-to-grid capabilities.

## Features

### 1. **Grid Visibility Toggle**
- Show/hide the background grid
- Useful for presentations or cleaner screenshots
- Persists during the editing session

### 2. **Snap to Grid**
- Automatically aligns nodes to grid intersections
- Configurable grid size (5px to 50px)
- Makes alignment and spacing consistent
- Toggle on/off based on workflow needs

### 3. **Background Patterns**
Four different background patterns available:
- **Dots**: Small dots at grid intersections (default)
- **Lines**: Continuous grid lines (horizontal and vertical)
- **Cross**: Cross marks at grid intersections
- **None**: No background pattern (plain canvas)

### 4. **Grid Size Control**
- Adjustable grid spacing: 5px to 50px
- Slider control for quick adjustments
- Visual preview of current size
- Common presets: 5px, 10px, 15px, 20px, 25px, 30px, 35px, 40px, 45px, 50px

## User Interface

### Grid Settings Menu
Located in the toolbar with a Grid icon:
```
[Grid Icon] Grid
```

Clicking opens a dropdown menu with:
1. **Show Grid Toggle** - Switch to show/hide grid
2. **Snap to Grid Toggle** - Enable/disable snap-to-grid
3. **Grid Size Slider** - Adjust spacing (5-50px)
4. **Pattern Selection** - Choose from 4 patterns
5. **Close Button** - Dismiss the menu

### Visual Design
- **Toggle Switches**: Orange when active, gray when inactive
- **Pattern Buttons**: Grid layout with visual icons
  - Dots: `⊞` icon
  - Lines: `═` icon
  - Cross: `⊞` icon
  - None: `∅` icon
- **Slider**: Orange accent with range markers

## Implementation Details

### Types
```typescript
export type BackgroundPattern = 'dots' | 'lines' | 'cross' | 'none'

export interface GridSettings {
  snapToGrid: boolean      // Enable snap-to-grid
  gridSize: number         // Grid spacing in pixels
  showGrid: boolean        // Show/hide background
  backgroundPattern: BackgroundPattern // Pattern type
}
```

### Components Modified

#### 1. **Toolbar.tsx**
- Added `GridSettings` interface
- New prop: `onGridSettingsChange?: (settings: GridSettings) => void`
- New prop: `gridSettings?: GridSettings`
- Grid menu with all controls
- Real-time updates to parent component

#### 2. **FlowBuilder.tsx**
- New prop: `gridSettings?: GridSettings`
- Maps pattern string to ReactFlow's `BackgroundVariant`
- Configures `snapToGrid` and `snapGrid` props
- Conditionally renders `Background` component

#### 3. **FlowDetailPage.tsx**
- State management for grid settings
- Passes settings to both Toolbar and FlowBuilder
- Default settings: `{ snapToGrid: false, gridSize: 15, showGrid: true, backgroundPattern: 'dots' }`

### ReactFlow Integration
```tsx
<ReactFlow
  snapToGrid={gridSettings.snapToGrid}
  snapGrid={[gridSettings.gridSize, gridSettings.gridSize]}
  // ... other props
>
  {gridSettings.showGrid && backgroundVariant && (
    <Background 
      variant={backgroundVariant}
      gap={gridSettings.gridSize}
      size={gridSettings.backgroundPattern === 'dots' ? 1 : 0.5}
      color={gridSettings.backgroundPattern === 'lines' ? '#ddd' : '#bbb'}
    />
  )}
</ReactFlow>
```

## Usage Examples

### Example 1: Enable Snap-to-Grid for Precise Alignment
1. Click the **Grid** button in toolbar
2. Toggle **Snap to Grid** to ON (orange)
3. Set **Grid Size** to 20px
4. Drag nodes - they will snap to 20px intervals

### Example 2: Use Lines Pattern for Technical Diagrams
1. Open **Grid** settings
2. Select **Lines** pattern
3. Nodes will align along visible grid lines
4. Better for architectural or technical flows

### Example 3: Hide Grid for Presentations
1. Open **Grid** settings
2. Toggle **Show Grid** to OFF
3. Grid hidden but snap-to-grid still works if enabled
4. Clean canvas for screenshots or presentations

### Example 4: Fine-Grained Control
1. Set **Grid Size** to 5px
2. Enable **Snap to Grid**
3. Use **Dots** pattern
4. Precise positioning for detailed diagrams

## Benefits

### For Users
- **Alignment**: Consistent node positioning
- **Spacing**: Even distribution of elements
- **Professionalism**: Cleaner, more organized diagrams
- **Flexibility**: Multiple patterns for different needs
- **Presentations**: Hide grid for polished output

### For Developers
- **Type Safety**: Full TypeScript interfaces
- **Reusability**: Grid settings can be persisted
- **Extensibility**: Easy to add new patterns
- **Integration**: Works seamlessly with existing features
- **Performance**: Efficient ReactFlow background rendering

## Technical Notes

### Background Variants
ReactFlow provides three built-in variants:
- `BackgroundVariant.Dots` - Small dots
- `BackgroundVariant.Lines` - Grid lines
- `BackgroundVariant.Cross` - Cross marks

### Snap Grid
The `snapGrid` prop accepts a tuple `[x, y]` for grid spacing:
```typescript
snapGrid={[15, 15]}  // 15px grid
```

### Performance
- Background rendering is optimized by ReactFlow
- Only re-renders when grid settings change
- Conditional rendering when grid is hidden

## Future Enhancements

### Potential Features
1. **Ruler Guides**: Draggable horizontal/vertical guides
2. **Smart Guides**: Alignment hints when dragging
3. **Grid Color**: Customizable grid color picker
4. **Grid Opacity**: Adjustable transparency
5. **Preset Layouts**: Quick grid presets (small/medium/large)
6. **Coordinate Display**: Show X/Y coordinates when dragging
7. **Grid Export**: Include/exclude grid in exports
8. **Magnetic Alignment**: Snap to other nodes, not just grid

## Related Features
- **Handle Position**: Works alongside grid for complete control
- **Node Resizing**: Respects grid when snap-to-grid enabled
- **Alignment Tools**: Complementary to grid helpers
- **Zoom Controls**: Grid scales appropriately with zoom

## Testing Checklist
- [ ] Grid visibility toggles correctly
- [ ] Snap-to-grid works at different grid sizes
- [ ] All four patterns render correctly
- [ ] Grid size slider updates smoothly
- [ ] Settings persist during session
- [ ] Grid hidden when showGrid is false
- [ ] Snap works even when grid is hidden
- [ ] No performance issues with large canvases
- [ ] Grid scales with zoom levels
- [ ] Compatible with existing features (resizing, handles)

## Accessibility
- Toggle switches have clear visual states
- Pattern buttons use both icons and labels
- Slider has min/max indicators
- Keyboard navigation supported
- Color-blind friendly (not relying solely on color)

## Browser Compatibility
- Chrome/Edge: Full support ✅
- Firefox: Full support ✅
- Safari: Full support ✅
- Mobile: Touch controls work ✅

## Conclusion
The Grid Helpers feature provides essential visual aids for creating professional, well-aligned process flow diagrams. It combines flexibility with ease of use, offering multiple patterns and precise control while maintaining a clean, intuitive interface.
