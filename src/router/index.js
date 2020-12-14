import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const index = () => import('@/views/index.vue')
const database = () => import('@/views/database.vue')
const routes = [
  {
    path: '/',
    name: 'index',
    component: index,
    children: [
      {
        path: '/database',
        name: 'database',
        component: database,
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
