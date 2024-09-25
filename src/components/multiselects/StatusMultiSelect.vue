<template>
    <CustomMultiSelect :options="statusElements" />
</template>

<script setup lang="ts">
import CustomMultiSelect from '@/components/multiselects/CustomMultiSelect.vue';
import { statusElements } from '../../utils/selectElement';

</script>