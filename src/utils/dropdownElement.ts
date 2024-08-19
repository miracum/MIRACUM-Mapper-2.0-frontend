export type DropdownElement = {
    label: string
    value: string
    severity: string
  }

export const equivalenceElements: DropdownElement[] = [
    { label: 'Related To', value: 'related-to', severity: 'info' },
    { label: 'Equivalent', value: 'equivalent', severity: 'success' },
    { label: 'Narrower', value: 'source-is-narrower-than-target', severity: 'warning' },
    { label: 'Broader', value: 'source-is-broader-than-target', severity: 'warning' },
    { label: 'Not Related', value: 'not-related', severity: 'danger' }
];

export const statusElements: DropdownElement[] = [
    { label: 'Active', value: 'active', severity: 'success' },
    { label: 'Inactive', value: 'inactive', severity: 'danger' },
    { label: 'Pending', value: 'pending', severity: 'warning' }
];

export const getSeverity = (list: Array<DropdownElement>, value: string): string => {
    return list.find((element) => element.value === value)?.severity || '';
};

export const getLabel = (list: Array<DropdownElement>, value: string): string => {
    return list.find((element) => element.value === value)?.label || '';
};

export const getEquivalenceLabel = (value: string): string => {
    return getLabel(equivalenceElements, value);
}

export const getEquivalenceSeverity = (value: string): string => {
    return getSeverity(equivalenceElements, value);
}

export const getStatusLabel = (value: string): string => {
    return getLabel(statusElements, value);
}

export const getStatusSeverity = (value: string): string => {
    return getSeverity(statusElements, value);
}