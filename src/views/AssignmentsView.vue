<script setup>
import { computed, ref, watch } from 'vue'
import { useWhistleHubStore } from '../stores/whistlehub'

const store = useWhistleHubStore()
const selectedRefereeId = ref('')
const selectedMatchId = ref('')
const selectedRole = ref('Center')
const message = ref('')

const roles = ['Center', 'Assistant 1', 'Assistant 2']

const assignmentRows = computed(() =>
  store.assignments
    .map((assignment) => ({
      ...assignment,
      referee: store.getRefereeById(assignment.refereeId),
      match: store.getMatchById(assignment.matchId),
    }))
    .filter((assignment) => assignment.referee && assignment.match),
)

watch(
  () => store.referees,
  (referees) => {
    if (!referees.length) {
      selectedRefereeId.value = ''
      return
    }

    if (!selectedRefereeId.value || !referees.some((referee) => referee.id === Number(selectedRefereeId.value))) {
      selectedRefereeId.value = String(referees[0].id)
    }
  },
  { immediate: true },
)

watch(
  () => store.matches,
  (matches) => {
    if (!matches.length) {
      selectedMatchId.value = ''
      return
    }

    if (!selectedMatchId.value || !matches.some((match) => match.id === Number(selectedMatchId.value))) {
      selectedMatchId.value = String(matches[0].id)
    }
  },
  { immediate: true },
)

const submitAssignment = () => {
  if (!selectedRefereeId.value || !selectedMatchId.value) {
    message.value = 'Choose both a referee and a match before assigning.'
    return
  }

  const referee = store.getRefereeById(selectedRefereeId.value)
  const match = store.getMatchById(selectedMatchId.value)
  const result = store.validateAssignment(selectedRefereeId.value, selectedMatchId.value)

  if (!result.valid) {
    message.value = result.message
    return
  }

  store.addAssignment({
    refereeId: Number(selectedRefereeId.value),
    matchId: Number(selectedMatchId.value),
    role: selectedRole.value,
  })

  message.value = `${referee.name} assigned to ${match.title} as ${selectedRole.value}.`
}

const deleteAssignment = (assignmentId) => {
  store.deleteAssignment(assignmentId)
}
</script>

<template>
  <section class="page">
    <header class="section-header">
      <div>
        <p class="eyebrow">Coverage planning</p>
        <h1>Assignments</h1>
      </div>
    </header>

    <div class="content-grid">
      <div class="panel">
        <h2>Create assignment</h2>

        <form class="form-grid" @submit.prevent="submitAssignment">
          <label>
            Referee
            <select v-model="selectedRefereeId" :disabled="!store.referees.length">
              <option v-for="referee in store.referees" :key="referee.id" :value="String(referee.id)">
                {{ referee.name }} ({{ referee.level }})
              </option>
            </select>
          </label>

          <label>
            Match
            <select v-model="selectedMatchId" :disabled="!store.matches.length">
              <option v-for="match in store.matches" :key="match.id" :value="String(match.id)">
                {{ match.title }} · {{ match.date }} {{ match.time }}
              </option>
            </select>
          </label>

          <label>
            Role
            <select v-model="selectedRole">
              <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
            </select>
          </label>

          <div class="button-row">
            <button type="submit" class="primary-btn" :disabled="!store.referees.length || !store.matches.length">
              Assign referee
            </button>
          </div>
        </form>

        <p v-if="message" class="assignment-message">{{ message }}</p>
      </div>

      <div class="panel">
        <h2>Assignment board</h2>

        <div class="table-wrapper" v-if="assignmentRows.length">
          <table>
            <thead>
              <tr>
                <th>Match</th>
                <th>Referee</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="assignment in assignmentRows" :key="assignment.id">
                <td>{{ assignment.match.title }}</td>
                <td>{{ assignment.referee.name }}</td>
                <td>{{ assignment.role }}</td>
                <td class="action-group">
                  <button type="button" class="danger-btn small" @click="deleteAssignment(assignment.id)">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-else class="empty-state">No assignments have been created yet.</p>
      </div>
    </div>
  </section>
</template>
