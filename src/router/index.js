import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RefereesView from '../views/RefereesView.vue'
import MatchesView from '../views/MatchesView.vue'
import AssignmentsView from '../views/AssignmentsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/referees', name: 'referees', component: RefereesView },
    { path: '/matches', name: 'matches', component: MatchesView },
    { path: '/assignments', name: 'assignments', component: AssignmentsView },
  ],
})

export default router
