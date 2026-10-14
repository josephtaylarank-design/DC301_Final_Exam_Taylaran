<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useWhistleHubStore } from '../stores/whistlehub'

const store = useWhistleHubStore()

const totalReferees = computed(() => store.referees.length)
const totalMatches = computed(() => store.matches.length)
const totalAssignments = computed(() => store.assignments.length)
const activeReferees = computed(() => store.referees.filter((referee) => referee.status === 'Active').length)

const upcomingMatches = computed(() =>
  [...store.matches].sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)).slice(0, 4),
)
</script>

<template>
  <section class="page home-page">
    <header class="hero-panel">
      <div>
        <p class="eyebrow">League operations dashboard</p>
        <h1>WhistleHub</h1>
        <p class="hero-copy">
          Manage referees, matches, and assignment coverage in one place without spreadsheet chaos.
        </p>
      </div>

      <div class="hero-actions">
        <RouterLink class="primary-btn" to="/referees">Manage referees</RouterLink>
        <RouterLink class="secondary-btn" to="/matches">Review matches</RouterLink>
      </div>
    </header>

    <div class="stats-grid">
      <article class="stat-card">
        <span class="stat-label">Referees</span>
        <strong>{{ totalReferees }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">Matches</span>
        <strong>{{ totalMatches }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">Assignments</span>
        <strong>{{ totalAssignments }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">Active</span>
        <strong>{{ activeReferees }}</strong>
      </article>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h2>Upcoming matches</h2>
        <RouterLink class="text-link" to="/matches">Open schedule</RouterLink>
      </div>

      <ul class="match-list" v-if="upcomingMatches.length">
        <li v-for="match in upcomingMatches" :key="match.id">
          <div>
            <h3>{{ match.title }}</h3>
            <p>{{ match.venue }}</p>
          </div>
          <span>{{ match.date }} · {{ match.time }}</span>
        </li>
      </ul>

      <p v-else class="empty-state">No upcoming matches are scheduled yet.</p>
    </div>
  </section>
</template>
