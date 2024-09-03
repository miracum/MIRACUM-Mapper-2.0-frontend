<template>
    <CustomSelect :options="equivalenceElements" />
</template>

<script setup lang="ts">
import CustomSelect from '@/components/selects/CustomSelect.vue';
import { equivalenceElements } from '../../utils/selectElement';

</script>