import Vue from 'vue'
import VueRouter from 'vue-router'
import Room from '@/views/Room.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/:id',
    name: 'room',
    component: Room,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
