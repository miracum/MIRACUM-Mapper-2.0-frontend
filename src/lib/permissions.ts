import type { AuthState } from '@/stores/auth'
import { type ProjectRole, type ProjectState } from '@/stores/project'
import type { Store } from 'pinia'

export const ProjectViewPermission: ProjectRole[] = ['reviewer', 'project_owner', 'editor']
export const ProjectUpdatePermission: ProjectRole[] = ['project_owner']
export const MappingViewPermission: ProjectRole[] = ['reviewer', 'project_owner', 'editor']
export const MappingUpdatePermission: ProjectRole[] = ['project_owner', 'editor']
export const MappingDeletePermission: ProjectRole[] = ['project_owner', 'editor']
export const MappingCreatePermission: ProjectRole[] = ['project_owner', 'editor']
export const MappingUpdateCommentPermission: ProjectRole[] = ['project_owner', 'editor']

export const adminRoles: ProjectRole[] = ['editor', 'project_owner', 'reviewer']

function checkUserHasPermissions(
  neededPermissionRoles: ProjectRole[],
  actualPermissions: ProjectRole[]
): boolean {
  return actualPermissions.some((role) => neededPermissionRoles.includes(role))
}

export function userHasPermission(
  permission: ProjectRole[],
  projectStore: Store<'projects', ProjectState>,
  authStore: Store<'auth', AuthState>
): boolean {
  // If the user is an admin, first check for their permissions defined in the adminRoles array (In this case, the adminRoles contain all possible project roles so they can do everything)
  if (authStore.isAdmin) {
    const authorized = checkUserHasPermissions(permission, adminRoles)
    // if they are not authorized, check their individual project roles (Currently, admins can do anything)
    if (authorized) return true
  }
  if (!projectStore.projectRole) return false
  return checkUserHasPermissions(permission, [projectStore.projectRole])
}
