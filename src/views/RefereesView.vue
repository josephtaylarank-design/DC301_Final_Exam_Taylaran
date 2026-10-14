<script setup>
import { computed, ref } from 'vue'
import { useWhistleHubStore } from '../stores/whistlehub'

const store = useWhistleHubStore()
const query = ref('')
const editingId = ref(null)
const initialForm = () => ({
  name: '',
  email: '',
  level: 'Beginner',
  status: 'Active',
})
const form = ref(initialForm())

const filteredReferees = computed(() => {
  const term = query.value.trim().toLowerCase()

  return store.referees.filter((referee) => {
    if (!term) return true

    return (
      referee.name.toLowerCase().includes(term) ||
      referee.level.toLowerCase().includes(term) ||
      referee.email.toLowerCase().includes(term)
    )
  })
})

const submitReferee = () => {
  if (!form.value.name || !form.value.email) {
    return
  }

  if (editingId.value !== null) {
    store.updateReferee(editingId.value, form.value)
  } else {
    store.addReferee(form.value)
  }

  resetForm()
}

const resetForm = () => {
  form.value = initialForm()
  editingId.value = null
}

const startEdit = (referee) => {
  form.value = { ...referee }
  editingId.value = referee.id
}

const deleteReferee = (refereeId) => {
  store.deleteReferee(refereeId)

  if (editingId.value === refereeId) {
    resetForm()
  }
}
</script>

<template>
  <section class="page">
    <header class="section-header">
      <div>
        <p class="eyebrow">Roster management</p>
        <h1>Referees</h1>
      </div>
    </header>

    <div class="content-grid">
      <div class="panel">
        <h2>{{ editingId !== null ? 'Edit referee' : 'Add referee' }}</h2>

        <form class="form-grid" @submit.prevent="submitReferee">
          <label>
            Name
            <input v-model="form.name" type="text" placeholder="e.g. Jordan Lee" required />
          </label>

          <label>
            Email
            <input v-model="form.email" type="email" placeholder="name@example.com" required />
          </label>

          <label>
            Level
            <select v-model="form.level">
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Professional">Professional</option>
            </select>
          </label>

          <label>
            Status
            <select v-model="form.status">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>

          <div class="button-row">
            <button type="submit" class="primary-btn">{{ editingId !== null ? 'Save changes' : 'Add referee' }}</button>
            <button v-if="editingId !== null" type="button" class="secondary-btn" @click="resetForm">Cancel</button>
          </div>
        </form>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h2>Referee directory</h2>
          <input v-model="query" type="search" placeholder="Search by name or level" class="search-box" />
        </div>

        <div class="table-wrapper" v-if="filteredReferees.length">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Level</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="referee in filteredReferees" :key="referee.id">
                <td>{{ referee.name }}</td>
                <td>{{ referee.email }}</td>
                <td>{{ referee.level }}</td>
                <td>
                  <span :class="['status-pill', referee.status.toLowerCase()]">{{ referee.status }}</span>
                </td>
                <td class="action-group">
                  <button type="button" class="secondary-btn small" @click="startEdit(referee)">Edit</button>
                  <button type="button" class="danger-btn small" @click="deleteReferee(referee.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-else class="empty-state">No referees match your current search.</p>
      </div>
    </div>
  </section>
</template>
