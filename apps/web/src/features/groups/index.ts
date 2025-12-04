/**
 * Groups Feature Exports
 */

export { GroupsPage } from './pages/GroupsPage'
export { GroupCard } from './components/GroupCard'
export { GroupTable } from './components/GroupTable'
export { GroupForm } from './components/GroupForm'
export { useGroups, useGroup, useCreateGroup, useUpdateGroup, useDeleteGroup } from './hooks/useGroups'
export { groupsApi } from './api/groupsApi'
export type { Group, CreateGroupDto, UpdateGroupDto, GroupPermission } from './types/group.types'
