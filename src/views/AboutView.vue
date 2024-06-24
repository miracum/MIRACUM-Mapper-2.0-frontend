<template>
  <div class="about-page">
    <section class="content">
      <h2>About Miracum Mapper</h2>
      <p>Sample text about the project. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam id ipsum velit. Suspendisse in libero non mauris fermentum tempor. Nam in sapien fringilla, aliquet arcu nec, tempus ipsum. Nulla facilisi. Phasellus scelerisque eget ligula non lobortis. Aenean pharetra diam lacus, at euismod nibh viverra ac.</p>
      <div class="features">
        <div class="feature">
          <h3>Element 1</h3>
          <p>Test content 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
        <div class="feature">
          <h3>Element 2</h3>
          <p>Test content 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
        <div class="feature">
          <h3>Element 3</h3>
          <p>Test content 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>
    </section>
    <section class="team">
      <h2>Subheadline</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam id ipsum velit. Suspendisse in libero non mauris fermentum tempor.</p>
      <!-- Team members could be dynamically loaded here -->
    </section>
  </div>
</template>

<script>
export default {
  name: 'AboutView',
  // Component logic here
}
</script>

<style scoped>
.about-page {
  text-align: center;
  color: #333;
}

.hero {
  background-color: #f0f0f0;
  padding: 4rem 2rem;
}

.content, .team {
  padding: 2rem;
}

.features {
  display: flex;
  justify-content: space-around;
  margin-top: 2rem;
}

.feature {
  max-width: 300px;
}

h1 {
  font-size: 2.5rem;
  color: #007BFF;
}

h2 {
  margin-top: 2rem;
  color: #0056b3;
}

p {
  line-height: 1.6;
}

@media (max-width: 768px) {
  .features {
    flex-direction: column;
    align-items: center;
  }

  .feature {
    margin-bottom: 2rem;
  }
}
</style>