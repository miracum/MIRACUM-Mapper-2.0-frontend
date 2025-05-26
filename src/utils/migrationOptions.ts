const DEFAULT_OPTION= { label: 'Use default option', value: 'default_option' };
const NONE_OPTION_CONCEPT = { label: 'Review later / Decide individually for each mapping', value: 'none' };
const NONE_OPTION_MAPPING = { label: 'Review later', value: 'none' };
const KEEP_OPTION = { label: 'Accept changes', value: 'keep' };
const KEEP_OPTION_DEPRECATED = { label: 'Keep as deprecated', value: 'keep' };
const KEEP_OPTION_DISCOURAGED = { label: 'Keep as discouraged', value: 'keep' };
const REPLACE_OPTION = { label: 'Replace concept', value: 'new' };
const DELETE_OPTION_CONCEPT = { label: 'Delete mappings', value: 'delete' };
const DELETE_OPTION_MAPPING = { label: 'Delete mapping', value: 'delete' };


const standardConceptOptions: Array<{ label: string; value: string }> = [
    NONE_OPTION_CONCEPT,
    KEEP_OPTION,
    REPLACE_OPTION,
    DELETE_OPTION_CONCEPT,
];

const deletedConceptOptions: Array<{ label: string; value: string }> = [
    NONE_OPTION_CONCEPT,
    REPLACE_OPTION,
    DELETE_OPTION_CONCEPT,
];

const deprecatedConceptOptions: Array<{ label: string; value: string }> = [
    NONE_OPTION_CONCEPT,
    KEEP_OPTION_DEPRECATED,
    REPLACE_OPTION,
    DELETE_OPTION_CONCEPT,
];

const discouragedConceptOptions: Array<{ label: string; value: string }> = [
    NONE_OPTION_CONCEPT,
    KEEP_OPTION_DISCOURAGED,
    REPLACE_OPTION,
    DELETE_OPTION_CONCEPT,
];


export function getConceptOptions(changesType: string) {
    switch (changesType) {
        case 'deleted':
            return deletedConceptOptions;
        case 'deprecated':
            return deprecatedConceptOptions;
        case 'discouraged':
            return discouragedConceptOptions;
        default:
            return standardConceptOptions;
    }
}


const standardMappingOptions: Array<{ label: string; value: string }> = [
    DEFAULT_OPTION,
    NONE_OPTION_MAPPING,
    KEEP_OPTION,
    REPLACE_OPTION,
    DELETE_OPTION_MAPPING,
];

const deletedMappingOptions: Array<{ label: string; value: string }> = [
    DEFAULT_OPTION,
    NONE_OPTION_MAPPING,
    REPLACE_OPTION,
    DELETE_OPTION_MAPPING,
];

const deprecatedMappingOptions: Array<{ label: string; value: string }> = [
    DEFAULT_OPTION,
    NONE_OPTION_MAPPING,
    KEEP_OPTION_DEPRECATED,
    REPLACE_OPTION,
    DELETE_OPTION_MAPPING,
];

const discouragedMappingOptions: Array<{ label: string; value: string }> = [
    DEFAULT_OPTION,
    NONE_OPTION_MAPPING,
    KEEP_OPTION_DISCOURAGED,
    REPLACE_OPTION,
    DELETE_OPTION_MAPPING,
];


export function getMappingOptions(changesType: string) {
    switch (changesType) {
        case 'deleted':
            return deletedMappingOptions;
        case 'deprecated':
            return deprecatedMappingOptions;
        case 'discouraged':
            return discouragedMappingOptions;
        default:
            return standardMappingOptions;
    }
}
