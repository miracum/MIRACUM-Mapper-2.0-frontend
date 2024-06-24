
<script setup lang="ts">
import HelloWorld from '../components/HelloWorld.vue'
import { RouterLink } from 'vue-router'


// TODO: Temporary fix: mount styles form main.css to the body. This should be handled in the <style scoped> section.
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  document.body.style.display = 'flex';
  document.body.style.placeItems = 'center';
  
  const app = document.getElementById('app');
  if (app) {
    app.style.maxWidth = '1280px';
    app.style.margin = '0 auto';
    app.style.padding = '2rem';
    app.style.fontWeight = 'normal';
    app.style.display = 'grid';
    app.style.gridTemplateColumns = '1fr 1fr';
    app.style.padding = '0 2rem';
  }
})

onBeforeUnmount(() => {
  document.body.style.display = '';
  document.body.style.placeItems = '';
  
  const app = document.getElementById('app');
  if (app) {
    app.style.maxWidth = '';
    app.style.margin = '';
    app.style.padding = '';
    app.style.fontWeight = '';
    app.style.display = '';
    app.style.gridTemplateColumns = '';
    app.style.padding = '';
  }
})
</script>

<template>
    <header>
      <img alt="Vue logo" class="logo" src="@/assets/logo.png" width="125" height="125" />
      <div class="wrapper">
        <HelloWorld msg="Miracum Mapper" />
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
          <RouterLink to="/login">Get Started</RouterLink>
        </nav>
      </div>
    </header>
    <RouterView />
 
</template>

<style scoped>
/* @media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }
}

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  font-weight: normal;
} */


header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
