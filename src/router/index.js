import { createRouter, createWebHistory } from 'vue-router'
import { safeLocalStorageGet, validateUserData } from '../utils/security'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: () => import('../views/OnboardingView.vue'),
    meta: { requiresAuth: true, isOnboarding: true }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/sintomas',
    name: 'Sintomas',
    component: () => import('../views/SintomasView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/historico',
    name: 'Historico',
    component: () => import('../views/HistoricoView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/insights',
    name: 'Insights',
    component: () => import('../views/InsightsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/configuracoes',
    name: 'Configuracoes',
    component: () => import('../views/ConfiguracoesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/ficha-medica',
    name: 'FichaMedica',
    component: () => import('../views/FichaMedicaView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/bem-estar',
    name: 'BemEstar',
    component: () => import('../views/WellnessView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard para autenticação com validação segura
router.beforeEach((to, from, next) => {
  // Usa validação segura do localStorage para verificar autenticação
  const user = safeLocalStorageGet('aurora_user', null, validateUserData)
  const token = localStorage.getItem('aurora_token')
  const isAuthenticated = user !== null && token !== null

  // Verifica se precisa de onboarding
  const needsOnboarding = user && !user.onboardingCompleted

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Não autenticado, redireciona para login
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    // Já autenticado tentando acessar página de guest
    if (needsOnboarding) {
      next('/onboarding')
    } else {
      next('/')
    }
  } else if (isAuthenticated && needsOnboarding && !to.meta.isOnboarding) {
    // Autenticado mas precisa fazer onboarding
    next('/onboarding')
  } else if (isAuthenticated && !needsOnboarding && to.meta.isOnboarding) {
    // Já fez onboarding, não pode acessar página de onboarding
    next('/')
  } else {
    next()
  }
})

export default router
