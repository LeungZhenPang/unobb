import Vue from 'vue'
import VueRouter from 'vue-router'
import IconView from '../views/icon-view/IconView.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/tuijian' },	
  { path: '/:name', component: IconView,}
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
