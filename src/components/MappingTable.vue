<template>
    <div class="col">
        <div class="form-group d-flex m-3 justify-content-center">
            <div class="col-6 pr-1 position-relative">
                <div class="d-flex">
                    <input type="text" id="customSearchInput" class="form-control"
                        placeholder="Filter the Mapping Table...">
                            <div v-if="mappings.length === 0" class="text-center">
                                <h3>No data to show yet.</h3>
                            </div>
                            <table class="table" v-else>
                                <thead>
                                    <tr>
                                        <th v-for="role in codesystemroles" :key="`head-${role.id}`" colspan="2">
                                            {{ role.system.name }} {{ role.name }} ({{ role.type }})
                                        </th>
                                    </tr>
                                    <tr>
                                        <th v-for="role in codesystemroles" :key="`code-${role.id}`">
                                            Code
                                        </th>
                                        <th v-for="role in codesystemroles" :key="`meaning-${role.id}`">
                                            Meaning
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Assuming mappings is an array of objects where each object represents a row in the table -->
                                    <tr v-for="(mapping, index) in mappings" :key="`mapping-${index}`">
                                        <td v-for="role in codesystemroles">
                                            <td :key="`code-${role}-${index}`">{{ mapping[`${role}Code`] }}</td>
                                            <td :key="`meaning-${role}-${index}`">{{ mapping[`${role}Meaning`] }}</td>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                    <!-- <select class="custom-select" id="columnFilter" v-model="selectedFilter">
                        <option value="all">Filter By All Columns</option>
                        <template v-if="mappings.length > 0 && mappings[0].Sources && mappings[0].Sources.length > 0">
                            <option v-for="source in mappings[0].Sources" :key="`source-${source.Name}`"
                                :value="`${source.Name} Code (Source)`">{{ `${source.Name} Code (Source)` }}</option>
                            <option v-for="source in mappings[0].Sources" :key="`source-meaning-${source.Name}`"
                                :value="`${source.Name} Meaning (Source)`">{{ `${source.Name} Meaning (Source)` }}
                            </option>
                        </template>
                        <template v-if="mappings.length > 0 && mappings[0].Targets && mappings[0].Targets.length > 0">
                            <option v-for="target in mappings[0].Targets" :key="`target-${target.Name}`"
                                :value="`${target.Name} Code (Target)`">{{ `${target.Name} Code (Target)` }}</option>
                            <option v-for="target in mappings[0].Targets" :key="`target-meaning-${target.Name}`"
                                :value="`${target.Name} Meaning (Target)`">{{ `${target.Name} Meaning (Target)` }}
                            </option>
                        </template>
                        <option v-if="displayStatus" value="Status">Status</option>
                        <option v-if="displayMappingEquivalence" value="Equivalence">Equivalence</option>
                        <option value="Comment">Comment</option>
                    </select> -->
                </div>
            </div>
        </div>

        <div v-if="mappings.length === 0" class="text-center">
            <h3>No data to show yet.</h3>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';


const props = defineProps({
    mappings: Array,
    project: Object
});

//const project = ref(null);
const codesystemroles = ref([]);

function getCodeSystemRoles() {
    console.log("AAAAAAAAAAAAAAAAAAAAA")
    console.log(props.project)
    console.log(props.project.code_system_roles)
    codesystemroles.value = project.code_system_roles;
}

onMounted(() => {
    getCodeSystemRoles();
});


</script>


<style scoped>
/* @import url('https://cdn.datatables.net/1.10.24/css/jquery.dataTables.css'); */
/* @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'); */
/* @import url('https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css'); */
/* @import url('./MIRACUM_Mapper.styles.css'); */

@import url('../assets/miracum-mapper-old.css')
</style>