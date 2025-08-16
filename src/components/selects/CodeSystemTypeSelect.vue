<template>
    <CustomSelect :options="codesystemTypeElements" placeholder="Select Type *" />
</template>

<script setup lang="ts">
import CustomSelect from '@/components/selects/CustomSelect.vue';
import { codesystemTypeElements } from '../../utils/selectElement';

</script>