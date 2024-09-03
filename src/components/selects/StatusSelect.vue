<template>
    <CustomSelect :options="statusElements" optionLabel="label" optionValue="value" />
</template>

<script setup lang="ts">
import CustomSelect from '@/components/selects/CustomSelect.vue';
import { statusElements } from '../../utils/selectElement';

</script>