export type SelectElement = {
  label: string
  value: string
  severity: string
}

export const getSeverity = (list: Array<SelectElement>, value: string): string => {
  return list.find((element) => element.value === value)?.severity || ''
}

export const getLabel = (list: Array<SelectElement>, value: string): string => {
  return list.find((element) => element.value === value)?.label || ''
}

/*
utils for equivalence
*/
export const equivalenceElements: SelectElement[] = [
  { label: 'Related To', value: 'related-to', severity: 'info' },
  { label: 'Equivalent', value: 'equivalent', severity: 'success' },
  { label: 'Narrower', value: 'source-is-narrower-than-target', severity: 'warn' },
  { label: 'Broader', value: 'source-is-broader-than-target', severity: 'warn' },
  { label: 'Not Related', value: 'not-related', severity: 'danger' }
]

export const getEquivalenceLabel = (value: string): string => {
  return getLabel(equivalenceElements, value)
}

export const getEquivalenceSeverity = (value: string): string => {
  return getSeverity(equivalenceElements, value)
}

/*
utils for status
*/
export const statusElements: SelectElement[] = [
  { label: 'Active', value: 'active', severity: 'success' },
  { label: 'Inactive', value: 'inactive', severity: 'danger' },
  { label: 'Pending', value: 'pending', severity: 'warn' }
]

export const getStatusLabel = (value: string): string => {
  return getLabel(statusElements, value)
}

export const getStatusSeverity = (value: string): string => {
  return getSeverity(statusElements, value)
}

/*
utils for role
*/
export const roleElements: SelectElement[] = [
  { label: 'Source', value: 'source', severity: 'info' },
  { label: 'Target', value: 'target', severity: 'info' }
]

export const getRoleLabel = (value: string): string => {
  return getLabel(roleElements, value)
}

export const getRoleSeverity = (value: string): string => {
  return getSeverity(roleElements, value)
}

/*
utils for user permissions
*/

export const userPermissionsElements: SelectElement[] = [
  { label: 'Reviewer', value: 'reviewer', severity: 'info' },
  { label: 'Project Owner', value: 'project_owner', severity: 'info' },
  { label: 'Editor', value: 'editor', severity: 'info' }
]

export const getUserPermissionsLabel = (value: string): string => {
  return getLabel(userPermissionsElements, value)
}

export const getUserPermissionsSeverity = (value: string): string => {
  return getSeverity(userPermissionsElements, value)
}

/*
utils for codesystem type
*/

export const codesystemTypeElements: SelectElement[] = [
  { label: 'GENERIC', value: 'GENERIC', severity: 'info' },
  { label: 'LOINC', value: 'LOINC', severity: 'info' },
  { label: 'ICD_10_GM', value: 'ICD_10_GM', severity: 'info' },
]

export const getCodesystemTypeLabel = (value: string): string => {
  return getLabel(codesystemTypeElements, value)
}

export const getCodesystemTypeSeverity = (value: string): string => {
  return getSeverity(codesystemTypeElements, value)
}
