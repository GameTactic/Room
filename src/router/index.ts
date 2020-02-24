import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Room from '@/views/Room.vue'
import Index from '@/views/Index.vue'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    path: '/:id',
    name: 'room',
    component: Room,
    props: true
  },
  {
    path: '/',
    name: 'index',
    component: Index
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
