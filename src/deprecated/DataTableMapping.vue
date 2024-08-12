<template>
    <div style="margin-top: 20px;"> <!-- Add space above the table -->
        <DataTable :value="dataTableEntries" stripedRows removableSort showGridlines paginator :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]" editMode="row" tableStyle="min-width: 50rem">
            <ColumnGroup type="header">
                <Row>
                    <Column header="Snomed Codes" :colspan="2" />
                    <Column header="Loinc Codes" :colspan="2" />
                    <Column header="" />
                    <Column header="" />
                    <Column header="" />
                </Row>
                <Row>
                    <!-- Snomed Codes -->
                    <Column header="Code" sortable field="snomedCode" />
                    <Column header="Meaning" sortable field="snomedMeaning" />
                    <!-- Loinc Codes -->
                    <Column header="Code" sortable field="loincCode" />
                    <Column header="Meaning" sortable field="loincMeaning" />
                    <!-- Placeholder for Status, Equivalence, and Comment columns -->

                    <Column header="Status" sortable field="status" />
                    <Column header="Equivalence" sortable field="equivalence" />
                    <Column header="Comment" sortable field="comment" />
                </Row>
            </ColumnGroup>
            <Column field="status" />
            <Column field="equivalence" />
            <Column field="comment" />
            <Column field="snomedCode" />
            <Column field="snomedMeaning">
                <template #body="slotProps">
                    {{ slotProps.data.snomedMeaning }}
                </template>
            </Column>
            <Column field="loincCode" />
            <Column field="loincMeaning">
                <template #body="slotProps">
                    {{ slotProps.data.loincMeaning }}
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref } from 'vue';


const dataTableEntries = ref([
    {
        status: 'Active',
        equivalence: 'Exact Match',
        comment: 'Reviewed',
        snomedCode: '123456',
        snomedMeaning: 'Hypertension',
        loincCode: '78910',
        loincMeaning: 'Blood Pressure Measurement'
    },
    {
        status: 'Inactive',
        equivalence: 'Partial Match',
        comment: 'Pending Review',
        snomedCode: '234567',
        snomedMeaning: 'Diabetes Mellitus',
        loincCode: '891011',
        loincMeaning: 'Blood Glucose Level'
    },
    {
        status: 'Active',
        equivalence: 'No Match',
        comment: 'Confirmed',
        snomedCode: '345678',
        snomedMeaning: 'Asthma',
        loincCode: '9101112',
        loincMeaning: 'Peak Expiratory Flow Rate'
    },
    {
        status: 'Active',
        equivalence: 'Exact Match',
        comment: 'Reviewed',
        snomedCode: '456789',
        snomedMeaning: 'Hyperlipidemia',
        loincCode: '10111213',
        loincMeaning: 'Cholesterol Measurement'
    },
    {
        status: 'Inactive',
        equivalence: 'Partial Match',
        comment: 'Pending Review',
        snomedCode: '567890',
        snomedMeaning: 'Obesity',
        loincCode: '11121314',
        loincMeaning: 'Body Mass Index'
    },
    {
        status: 'Active',
        equivalence: 'No Match',
        comment: 'Confirmed',
        snomedCode: '678901',
        snomedMeaning: 'Depression',
        loincCode: '12131415',
        loincMeaning: 'Mental Health Assessment'
    },
    {
        status: 'Active',
        equivalence: 'Exact Match',
        comment: 'Reviewed',
        snomedCode: '789012',
        snomedMeaning: 'Osteoporosis',
        loincCode: '13141516',
        loincMeaning: 'Bone Density Measurement'
    },
    {
        status: 'Inactive',
        equivalence: 'Partial Match',
        comment: 'Pending Review',
        snomedCode: '890123',
        snomedMeaning: 'Chronic Kidney Disease',
        loincCode: '14151617',
        loincMeaning: 'Glomerular Filtration Rate'
    },
    {
        status: 'Active',
        equivalence: 'No Match',
        comment: 'Confirmed',
        snomedCode: '901234',
        snomedMeaning: 'Rheumatoid Arthritis',
        loincCode: '15161718',
        loincMeaning: 'Anti-Cyclic Citrullinated Peptide Antibody'
    },
    {
        status: 'Active',
        equivalence: 'Exact Match',
        comment: 'Reviewed',
        snomedCode: '012345',
        snomedMeaning: 'Chronic Obstructive Pulmonary Disease',
        loincCode: '16171819',
        loincMeaning: 'Forced Expiratory Volume'
    },
    // Add more entries as needed
]);

// const formatCurrency = (value) => {
//     return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
// };

// const lastYearTotal = computed(() => {
//     let total = 0;
//     for (let sale of sales.value) {
//         total += sale.lastYearProfit;
//     }

//     return formatCurrency(total);
// });

// const thisYearTotal = computed(() => {
//     let total = 0;
//     for (let sale of sales.value) {
//         total += sale.thisYearProfit;
//     }

//     return formatCurrency(total);
// });

</script>