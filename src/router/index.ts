import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import TheRoom from '@/views/TheRoom.vue'
import TheIndex from '@/views/TheIndex.vue'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '/:id',
    name: 'room',
    component: TheRoom,
    props: true
  },
  {
    path: '/',
    name: 'index',
    component: TheIndex
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
