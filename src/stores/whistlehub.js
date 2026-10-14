import { defineStore } from 'pinia'

const STORAGE_KEY = 'whistlehub-data'

const defaultState = {
  referees: [
    { id: 1, name: 'Alex Morgan', email: 'alex@league.org', level: 'Professional', status: 'Active' },
    { id: 2, name: 'Priya Shah', email: 'priya@league.org', level: 'Intermediate', status: 'Active' },
    { id: 3, name: 'Luis Ortega', email: 'luis@league.org', level: 'Beginner', status: 'Inactive' },
  ],
  matches: [
    { id: 1, title: 'Harbor FC vs City United', venue: 'Northfield Arena', date: '2026-10-20', time: '18:00' },
    { id: 2, title: 'Riverside Rovers vs Eastside', venue: 'Rivergate Stadium', date: '2026-10-20', time: '19:30' },
    { id: 3, title: 'Summit Athletic vs Maple FC', venue: 'Cedar Park', date: '2026-10-21', time: '17:00' },
  ],
  assignments: [
    { id: 1, matchId: 1, refereeId: 1, role: 'Center' },
    { id: 2, matchId: 2, refereeId: 2, role: 'Assistant 1' },
  ],
}

const getSnapshot = () => {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (!saved) {
    return defaultState
  }

  try {
    const parsed = JSON.parse(saved)
    return {
      referees: Array.isArray(parsed.referees) ? parsed.referees : defaultState.referees,
      matches: Array.isArray(parsed.matches) ? parsed.matches : defaultState.matches,
      assignments: Array.isArray(parsed.assignments) ? parsed.assignments : defaultState.assignments,
    }
  } catch {
    return defaultState
  }
}

const generateId = () => Date.now() + Math.floor(Math.random() * 1000)

export const useWhistleHubStore = defineStore('whistlehub', {
  state: () => getSnapshot(),
  actions: {
    persist() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          referees: this.referees,
          matches: this.matches,
          assignments: this.assignments,
        }),
      )
    },

    addReferee(referee) {
      this.referees.push({ id: generateId(), ...referee })
      this.persist()
    },

    updateReferee(id, updates) {
      const index = this.referees.findIndex((referee) => referee.id === Number(id))

      if (index !== -1) {
        this.referees[index] = { ...this.referees[index], ...updates }
        this.persist()
      }
    },

    deleteReferee(id) {
      const refereeId = Number(id)
      this.referees = this.referees.filter((referee) => referee.id !== refereeId)
      this.assignments = this.assignments.filter((assignment) => assignment.refereeId !== refereeId)
      this.persist()
    },

    addMatch(match) {
      this.matches.push({ id: generateId(), ...match })
      this.persist()
    },

    updateMatch(id, updates) {
      const index = this.matches.findIndex((match) => match.id === Number(id))

      if (index !== -1) {
        this.matches[index] = { ...this.matches[index], ...updates }
        this.persist()
      }
    },

    deleteMatch(id) {
      const matchId = Number(id)
      this.matches = this.matches.filter((match) => match.id !== matchId)
      this.assignments = this.assignments.filter((assignment) => assignment.matchId !== matchId)
      this.persist()
    },

    addAssignment(assignment) {
      this.assignments.push({ id: generateId(), ...assignment })
      this.persist()
    },

    deleteAssignment(id) {
      this.assignments = this.assignments.filter((assignment) => assignment.id !== Number(id))
      this.persist()
    },

    getRefereeById(id) {
      return this.referees.find((referee) => referee.id === Number(id))
    },

    getMatchById(id) {
      return this.matches.find((match) => match.id === Number(id))
    },

    validateAssignment(refereeId, matchId) {
      const selectedReferee = this.getRefereeById(refereeId)
      const selectedMatch = this.getMatchById(matchId)

      if (!selectedReferee) {
        return { valid: false, message: 'Select a valid referee.' }
      }

      if (!selectedMatch) {
        return { valid: false, message: 'Select a valid match.' }
      }

      const isConflict = this.assignments.some((assignment) => {
        if (assignment.refereeId !== selectedReferee.id || assignment.matchId === selectedMatch.id) {
          return false
        }

        const assignedMatch = this.getMatchById(assignment.matchId)
        return assignedMatch && assignedMatch.date === selectedMatch.date && assignedMatch.time === selectedMatch.time
      })

      if (isConflict) {
        return {
          valid: false,
          message: `${selectedReferee.name} is already assigned to another match at ${selectedMatch.date} ${selectedMatch.time}.`,
        }
      }

      return { valid: true, message: 'Assignment saved successfully.' }
    },
  },
})
