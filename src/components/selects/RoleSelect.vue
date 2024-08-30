<template>
    <CustomSelect :options="roleElements" placeholder="Select Role" />
</template>

<script setup lang="ts">
import CustomSelect from '@/components/selects/CustomSelect.vue';
import { roleElements } from '../../utils/selectElement';

</script>