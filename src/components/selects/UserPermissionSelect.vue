<template>
    <CustomSelect :options="userPermissionsElements" placeholder="Select Permission" />
</template>

<script setup lang="ts">
import CustomSelect from '@/components/selects/CustomSelect.vue';
import { userPermissionsElements } from '../../utils/selectElement';

</script>