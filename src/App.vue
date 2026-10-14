<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <nav class="topbar">
      <div class="brand-wrap">
        <div class="brand-mark">W</div>
        <span class="brand-name">WhistleHub</span>
      </div>

      <div class="nav-links">
        <RouterLink class="nav-link" to="/">Home</RouterLink>
        <RouterLink class="nav-link" to="/referees">Referees</RouterLink>
        <RouterLink class="nav-link" to="/matches">Matches</RouterLink>
        <RouterLink class="nav-link" to="/assignments">Assignments</RouterLink>
      </div>
    </nav>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>
