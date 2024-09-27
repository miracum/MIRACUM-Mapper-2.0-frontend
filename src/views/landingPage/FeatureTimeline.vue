<template>
    <Timeline :value="props.value" align="alternate" class="customized-timeline">
        <template #marker="slotProps">
            <Button :disabled="true" :icon="slotProps.item.icon" severity="secondary" raised />
        </template>
        <template #content="slotProps">
            <Card class="mt-4">
                <template #title>
                    {{ slotProps.item.title }}
                </template>
                <template #subtitle>
                    {{ slotProps.item.subtitle }}
                </template>
                <template #content>
                    <Image v-if="slotProps.item.image" :src="slotProps.item.image" :alt="slotProps.item.name"
                        class="shadow-sm rounded-image" preview />
                    <p v-if="slotProps.item.description">{{ slotProps.item.description }}</p>
                    <!-- <Button label="Read more" text></Button> -->
                </template>
            </Card>
        </template>
    </Timeline>
</template>

<script lang="ts" setup>

const props = defineProps({
    value: {
        type: Array,
        required: true
    }
});

</script>

<style scoped>
.customized-timeline {
    max-width: 1600px;
    margin: 0 auto;
}

.rounded-image {
    border-radius: 1.5%;
}
</style>