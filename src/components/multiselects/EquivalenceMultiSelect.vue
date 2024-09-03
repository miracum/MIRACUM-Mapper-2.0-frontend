<template>
    <CustomMultiSelect :options="equivalenceElements" />
</template>

<script setup lang="ts">
import CustomMultiSelect from '@/components/multiselects/CustomMultiSelect.vue';
import { equivalenceElements } from '../../utils/selectElement';

</script>