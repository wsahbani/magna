# How to Build Process Diagrams Like the HR Example

## Overview
This guide shows you how to recreate the HR process diagram using FlowBuilder's palette and grouping features.

## Target Diagram Structure
```
┌─────────────────────────────────────────────────────────┐
│ Processus Stratégiques                                  │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │ Process  │ │ Process  │ │ Process  │ │ Process  │   │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Processus de Réalisation / Opérationnels               │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│ │ Process  │ │ Process  │ │ Process  │                │
│ └──────────┘ └──────────┘ └──────────┘                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Processus de Support                                     │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│ │ Process  │ │ Process  │ │ Process  │                │
│ └──────────┘ └──────────┘ └──────────┘                │
└─────────────────────────────────────────────────────────┘
```

## Step-by-Step Guide

### Method 1: Build Groups First (Recommended)

#### Step 1: Create Group Containers
1. Find **"Group"** in the Palette under **"Processes"** category
2. Drag 3 Group nodes onto the canvas
3. Position them vertically with some spacing
4. Select each group and resize to desired width/height

#### Step 2: Rename Groups
1. Click on first group
2. In the properties panel (or later via editing), set label to:
   - **"Processus Stratégiques"**
3. Repeat for second group: **"Processus de Réalisation / Opérationnels"**
4. Third group: **"Processus de Support"**

#### Step 3: Add Process Boxes
1. Find **"Task"** or **"Sub-Process"** in the Palette
2. For **Processus Stratégiques** group:
   - Drag 5 task nodes directly **into** the first group
   - They will automatically become children
   - Arrange them horizontally inside the group
   - Label them:
     * "Définir la stratégie RH-G"
     * "Définir la politique RH-G"
     * "Piloter le déploiement de la stratégie RH"
     * "Communiquer aux parties prenantes"
     * "Elaborer le Strategic Workforce Planning"

3. For **Processus de Réalisation / Opérationnels** group:
   - Drag 6 task nodes into the second group
   - Arrange them in 2 rows (4 top, 2 bottom)
   - Label them:
     * Row 1: "Elaborer le Workforce Planning Opérationnel", "Recruter des candidats", "Gérer les compétences des salariés", "Gérer les emplois"
     * Row 2: "Gérer la rémunération salariés", "Reconnaître la performance des salariés"

4. For **Processus de Support** group:
   - Drag 4 task nodes into the third group
   - Arrange them horizontally
   - Label them:
     * "Gérer le Système d'Information RH Groupe"
     * "Gérer la formation"
     * "Gérer la santé et la sécurité au travail"
     * "Améliorer les conditions de travail"

#### Step 4: Style Important Processes (Blue/Italic)
1. Select processes like "Elaborer le Strategic Workforce Planning"
2. Use node styling options to:
   - Change text color to blue
   - Add italic formatting (if available in node customization)

### Method 2: Build Nodes First, Then Group

#### Step 1: Create All Process Boxes
1. Drag multiple **Task** nodes from palette onto canvas
2. Position them roughly in 3 horizontal rows
3. Label each one according to the process names

#### Step 2: Group by Selection
1. **Select Strategic Processes**:
   - Hold `Ctrl` and click:
     * "Définir la stratégie RH-G"
     * "Définir la politique RH-G"
     * "Piloter le déploiement de la stratégie RH"
     * "Communiquer aux parties prenantes"
     * "Elaborer le Strategic Workforce Planning"
2. **Click "Group" button** in toolbar
3. A group container will automatically wrap around them
4. Label the group "Processus Stratégiques"

5. **Repeat for Operational Processes**:
   - Select the 6 operational process nodes
   - Click "Group" button
   - Label "Processus de Réalisation / Opérationnels"

6. **Repeat for Support Processes**:
   - Select the 4 support process nodes
   - Click "Group" button
   - Label "Processus de Support"

## Quick Tips

### Selecting Multiple Nodes
- **Ctrl+Click**: Add/remove individual nodes from selection
- **Box Selection**: Click and drag on empty canvas to select multiple nodes

### Moving Groups
- Click and drag the **group header** to move the entire group with all children
- Children maintain their relative positions

### Resizing Groups
- Click a group to select it
- Orange resize handles appear on corners and edges
- Drag to resize the container

### Adjusting Layout Inside Groups
- Click individual child nodes to move them within the group
- They stay constrained to the group boundaries
- Arrange horizontally, vertically, or in grid patterns

### Removing from Group
- Drag a child node **outside** the group boundary
- It automatically becomes independent
- Position converts to absolute coordinates

### Ungrouping
- Select a group node
- Click "Ungroup" button in toolbar
- All children are released
- Group container is deleted

## Best Practices

### 1. **Plan Your Hierarchy First**
   - Sketch out the structure on paper
   - Identify main categories (Strategic, Operational, Support)
   - List sub-processes under each category

### 2. **Use Consistent Sizing**
   - Make all task boxes similar size
   - Keep group heights consistent
   - Leave padding inside groups (40px recommended)

### 3. **Label Clearly**
   - Use descriptive French/English labels
   - Keep labels concise (2-4 words)
   - Use consistent terminology

### 4. **Align Nodes**
   - Use helper lines (orange dotted lines appear when dragging)
   - Align nodes horizontally in rows
   - Maintain equal spacing between nodes

### 5. **Color Coding**
   - Use group colors to indicate type:
     * Orange (category) - Strategic processes
     * Blue (subprocess) - Operational processes  
     * Purple (container) - Support processes
   - Highlight important processes in blue text

### 6. **Save Frequently**
   - Click Save button in toolbar
   - Changes persist to backend
   - Can reload later for editing

## Node Types to Use

For the HR diagram, use these node types:

- **Group** (`type: 'group'`) - Main category containers
- **Task** (`type: 'task'`) - Individual process boxes
- **Sub-Process** (`type: 'process'`) - Alternative for process boxes
- **User Task** (`type: 'userTask'`) - For processes involving people

## Keyboard Shortcuts (Future Enhancement)

- `Ctrl+G` - Group selected nodes
- `Ctrl+Shift+G` - Ungroup selected group
- `Ctrl+D` - Duplicate selected nodes
- `Delete` - Delete selected nodes
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo

## Common Workflow

1. **Start with Groups**
   ```
   Drag 3 Group nodes → Resize → Label
   ```

2. **Add Children**
   ```
   Drag Task nodes into groups → Arrange → Label
   ```

3. **Fine-tune Layout**
   ```
   Align nodes → Adjust spacing → Resize groups
   ```

4. **Apply Styling**
   ```
   Select important nodes → Change colors → Add emphasis
   ```

5. **Save**
   ```
   Click Save button → Confirm
   ```

## Example: Creating "Processus Stratégiques"

```typescript
1. Drag "Group" from Palette
2. Position at top of canvas (x: 100, y: 100)
3. Resize to (width: 900, height: 200)
4. Drag 5 "Task" nodes into the group:
   - Space them horizontally with 20px gaps
   - Align vertically in center of group
5. Label each task:
   - Task 1: "Définir la stratégie RH-G"
   - Task 2: "Définir la politique RH-G"
   - Task 3: "Piloter le déploiement de la stratégie RH"
   - Task 4: "Communiquer aux parties prenantes"
   - Task 5: "Elaborer le Strategic Workforce Planning"
6. Highlight Task 5 in blue (important process)
7. Done! Group auto-saves with 5 children
```

## Troubleshooting

### Nodes Hidden Behind Group
- **Solution**: Nodes automatically get `zIndex: 1000` when added to group
- Group stays at `zIndex: -1`
- Children always appear in foreground

### Can't Select Group Header
- **Issue**: Group container has `pointer-events-none`
- **Solution**: Click on the header bar (has `pointer-events-auto`)

### Nodes Won't Stay in Group
- **Check**: Is the node center inside the group boundary?
- **Fix**: Drop the node more towards the center of the group

### Group Too Small
- **Solution**: Select group, drag corner handles to resize
- Minimum size: 200x150px
- Maximum size: 800x600px

## Advanced: Nested Groups

For complex hierarchies, you can create groups inside groups:

1. Create main category group (e.g., "Processus de Réalisation")
2. Add sub-category groups inside it (e.g., "Recrutement", "Formation")
3. Add task nodes into sub-category groups
4. Result: 3-level hierarchy

```
Main Group
├── Sub-Group 1
│   ├── Task A
│   └── Task B
└── Sub-Group 2
    ├── Task C
    └── Task D
```

## Next Steps

After building your diagram:
- **Connect processes** with edges (drag from node to node)
- **Add descriptions** to nodes via properties panel
- **Export** diagram as image or PDF
- **Share** with stakeholders
- **Version control** - save multiple versions
