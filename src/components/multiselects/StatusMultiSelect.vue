<template>
    <CustomMultiSelect :options="statusElements" optionLabel="label" optionValue="value" />
</template>

<script setup lang="ts">
import CustomMultiSelect from '@/components/multiselects/CustomMultiSelect.vue';
import { statusElements } from '../../utils/selectElement';

</script>