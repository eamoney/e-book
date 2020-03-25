import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/store/shelf'
  },
  {
    path: '/ebook',
    component: () => import('../views/ebook/index.vue'),
    children: [
      {
        path: ':fileName',
        component: () => import('../components/ebook/EbookReader.vue')
      }
    ]
  },
  {
    path: '/store',
    component: () => import('../views/store/index.vue'),
    children: [
      {
        path: 'shelf',
        component: () => import('../../src/views/store/StoreShelf.vue')
      },
      {
        path: 'category',
        component: () => import('../views/store/ShelfCategory.vue')
      },
      {
        path: 'home',
        component: () => import('../views/store/StoreHome.vue')
      },
      {
        path: 'list',
        component: () => import('../views/store/StoreList.vue')
      },
      {
        path: 'detail',
        component: () => import('../views/store/StoreDetail.vue')
      },
      {
        path: 'speaking',
        component: () => import('../views/store/StoreSpeaking.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
