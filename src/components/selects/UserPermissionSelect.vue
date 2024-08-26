<template>
    <CustomSelect :options="userPermissionsElements" />
</template>

<script setup lang="ts">
import CustomSelect from '@/components/selects/CustomSelect.vue';
import { userPermissionsElements } from '../../utils/selectElement';

</script>