<template>
  <Menubar :model="navigatorItems">
    <template #start>
      <div class="header-container">
        <img src="@/assets/logo.png" alt="Logo" width="50" class="logo-margin" />
        <span class="text-primary text-xl">Miracum</span><span class="text-xl font-semibold">Mapper</span>
        <div class="divider mx-2"></div>
        <!-- <Navigator /> -->
      </div>
    </template>
    <template #item="{ item, props, root }">
      <a class="flex items-center" v-bind="props.action" @click.prevent="scrollToSection(item.target)">
        <span :class="item.icon" />
        <span class="ml-2">{{ item.label }}</span>
        <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
        <span v-if="item.shortcut"
          class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{
            item.shortcut }}</span>
      </a>
    </template>
    <template #end>
      <div class="flex items-center space-x-2">
        <p class="mr-2 font-bold">Get started</p>
        <Button label="Log In" severity="secondary" @click="handleLoginClick" />
      </div>
    </template>
  </Menubar>

  <!-- Big Title Miracum Mapper centered in the middle and subtitle this is the subtitle-->
  <!-- <Panel> -->
  <div class="title-group text-center mt-10 max-w-4xl mx-auto mb-20">
    <h1 class="title text-6xl font-bold mb-4">Miracum Mapper <br> An Open Source Mapping Tool</h1>
    <p class="subtitle text-2xl text-gray-600">Miracum Mapper is a mapping tool to allow mappings from different
      CodeSystems like <code class="font-mono">Snomed CT</code> or <code class="font-mono">Loinc</code> to be
      associated in <code class="font-mono">n:m</code>
      relationships with each other </p>
  </div>
  <!-- </Panel> -->

  <div d="overview" class="title-group text-center mt-10 mb-5">
    <h2 class="title text-4xl font-bold">Overview</h2>
    <p class="subtitle text-1xl text-gray-600">Get an Overview of the Miracum Mapper</p>
  </div>

  <div class="mb-20">
    <FeaturesList :features="featureCardElements" />
  </div>

  <div id="features" class="title-group text-center mt-10 mb-5">
    <h2 class="title text-4xl font-bold">Features</h2>
    <p class="subtitle text-1xl text-gray-600">Discover the features of the Miracum Mapper</p>
  </div>

  <div class="mb-20">
    <FeatureTimeline :value="featureTimelineElements" />
  </div>

  <div id="about" class="title-group text-center mt-10 mb-5">
    <h2 class="title text-4xl font-bold">About</h2>
    <p class="subtitle text-1xl text-gray-600">Learn more about the Miracum Mapper</p>
  </div>

  <div class="about-section text-center mt-10 max-w-4xl mx-auto mb-20">
    <Fieldset legend="Miracum Mapper 2.0" :toggleable="true">
      <p class="m-0">
        This project is developed at the Friedrich Alexander University of Erlangen-Nürnberg (FAU) as part of the
        MIRACUM
        (Medical
        Informatics in Research and Care in University Medicine) project.
      </p>
    </Fieldset>
  </div>

  <Menubar>
    <template #start>
      <div class="header-container">
        <img src="@/assets/logo.png" alt="Logo" width="50" class="logo-margin" />
        <span class="text-primary text-xl">Miracum</span><span class="text-xl font-semibold">Mapper</span>
        <div class="divider mx-2"></div>
        <!-- <Navigator /> -->
      </div>
    </template>
    <template #end>
      <Button icon="pi pi-github" label="Source Code" text rounded aria-label="Github" @click="openGitHub" />
    </template>
  </Menubar>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FeatureTimeline from "./landingPage/FeatureTimeline.vue"
import FeaturesList from "./landingPage/FeatureList.vue"
import { useRouter } from 'vue-router';
import createProjectImage from '@/assets/create_project.png';
import projectOverviewImage from '@/assets/project_overview.png';
import mappingTableImage from '@/assets/mapping_table.png';
import createMappingImage from '@/assets/create_mapping.png';

const router = useRouter();

function handleLoginClick() {
  router.push('/login');
}

function openGitHub() {
  window.open('https://github.com/miracum/MIRACUM-Mapper-2.0-backend');
}

const navigatorItems = ref([
  {
    label: 'Overview',
    icon: 'pi pi-globe',
    target: 'overview'
  },
  {
    label: 'Features',
    icon: 'pi pi-star',
    target: 'features'
  },
  {
    label: 'About',
    icon: 'pi pi-info-circle',
    target: 'about'
  }
]);

const scrollToSection = (target: string) => {
  const element = document.getElementById(target);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}


const featureTimelineElements = ref([
  { title: 'Add Project', subtitle: 'easily create projects and set different settings to adjust the project to your needs', icon: 'pi pi-plus', image: createProjectImage },
  { title: 'View Projects', subtitle: 'Get an overview of all available project in the Dashboard View', icon: 'pi pi-eye', image: projectOverviewImage },
  { title: 'Mappings', subtitle: 'View all Mappings of a project, easily filter or sort them to find what you are looking for, add new mappings or edit multiple mappings at once with inline editing, export the current mapping project in a csv file,...', icon: 'pi pi-table', image: mappingTableImage },
  { title: 'Create Mappings', subtitle: 'When creating new Mappings, Miracum Mapper suggests relevant mappings for a CodeSystem while the user is typing to make it easy to find them', icon: 'pi pi-plus', image: createMappingImage }
]);

const featureCardElements = ref([
  {
    icon: 'pi pi-user',
    title: 'Web Interface',
    subtitle: 'Miracum Mapper offers an easy-to-use web interface, in order to make the mapping process efficient for the user',
  },
  {
    icon: 'pi pi-sitemap',
    title: 'Integration',
    subtitle: 'Integrate Miracum Mapper with an existing user management system using Keycloak for authentication and Postgres for data storage, which ensures secure user control and data storage.',
  },
  {
    icon: 'pi pi-clock',
    title: 'Early Stage',
    subtitle: 'The Miracum Mapper currently support basic functionality but more advanced features are not yet implemented',
  },
  {
    icon: 'pi pi-server',
    title: 'Self-Hosting',
    subtitle: ' Docker Images are available to easily host Miracum Mapper on an own server, ensuring full control over the data',
  },
  {
    icon: 'pi pi-github',
    title: 'Open Source',
    subtitle: 'Miracum Mapper is developed as an open source project and is licensed under the TODO license.',
  },
  {
    icon: 'pi pi-code',
    title: 'Contribution',
    subtitle: 'Further Development of the tool is supported by providing a DevContainer configuration as well as documentation on how to get started.',
  },
])

</script>


<style lang="css" scoped>
.p-menubar {
  display: flex;
  /* Ensure Menubar is a flex container */
  justify-content: space-between;
  /* Space between start and end templates */
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
}

.header-container {
  display: flex;
  align-items: center;
  /* Adjusts space between items, pushing them to start and end */
}


.logo-margin {
  margin-right: 10px;
}

.title-group {
  text-align: center;
  margin-top: 20px;
}
</style>