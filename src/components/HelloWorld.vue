<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
    <h1 class="blue">{{ msg }}</h1>
    <h3>
      Easily create <code>n:m</code> mappings between elements of different code systems like
      <a href="https://loinc.org" target="_blank" rel="noopener">LOINC</a> or
      <a href="https://www.nlm.nih.gov/healthit/snomedct/international.html" target="_blank"
        rel="noopener">SNOMED-CT</a>.
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {

  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
