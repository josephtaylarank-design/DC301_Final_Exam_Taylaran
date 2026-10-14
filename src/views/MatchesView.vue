<script setup>
import { computed, ref } from 'vue'
import { useWhistleHubStore } from '../stores/whistlehub'

const store = useWhistleHubStore()
const editingId = ref(null)
const initialForm = () => ({
  title: '',
  venue: '',
  date: '',
  time: '',
})
const form = ref(initialForm())

const sortedMatches = computed(() =>
  [...store.matches].sort((a, b) => {
    const first = new Date(`${a.date}T${a.time}`)
    const second = new Date(`${b.date}T${b.time}`)
    return first - second
  }),
)

const submitMatch = () => {
  if (!form.value.title || !form.value.venue || !form.value.date || !form.value.time) {
    return
  }

  if (editingId.value !== null) {
    store.updateMatch(editingId.value, form.value)
  } else {
    store.addMatch(form.value)
  }

  resetForm()
}

const resetForm = () => {
  form.value = initialForm()
  editingId.value = null
}

const startEdit = (match) => {
  form.value = { ...match }
  editingId.value = match.id
}

const deleteMatch = (matchId) => {
  store.deleteMatch(matchId)

  if (editingId.value === matchId) {
    resetForm()
  }
}
</script>

<template>
  <section class="page">
    <header class="section-header">
      <div>
        <p class="eyebrow">Schedule administration</p>
        <h1>Matches</h1>
      </div>
    </header>

    <div class="content-grid">
      <div class="panel">
        <h2>{{ editingId !== null ? 'Edit match' : 'Add match' }}</h2>

        <form class="form-grid" @submit.prevent="submitMatch">
          <label>
            Match title
            <input v-model="form.title" type="text" placeholder="e.g. Team A vs Team B" required />
          </label>

          <label>
            Venue
            <input v-model="form.venue" type="text" placeholder="Stadium or field" required />
          </label>

          <label>
            Date
            <input v-model="form.date" type="date" required />
          </label>

          <label>
            Time
            <input v-model="form.time" type="time" required />
          </label>

          <div class="button-row">
            <button type="submit" class="primary-btn">{{ editingId !== null ? 'Save changes' : 'Add match' }}</button>
            <button v-if="editingId !== null" type="button" class="secondary-btn" @click="resetForm">Cancel</button>
          </div>
        </form>
      </div>

      <div class="panel">
        <h2>Match schedule</h2>

        <div class="table-wrapper" v-if="sortedMatches.length">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Venue</th>
                <th>Date</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="match in sortedMatches" :key="match.id">
                <td>{{ match.title }}</td>
                <td>{{ match.venue }}</td>
                <td>{{ match.date }}</td>
                <td>{{ match.time }}</td>
                <td class="action-group">
                  <button type="button" class="secondary-btn small" @click="startEdit(match)">Edit</button>
                  <button type="button" class="danger-btn small" @click="deleteMatch(match.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-else class="empty-state">No matches are scheduled yet.</p>
      </div>
    </div>
  </section>
</template>
