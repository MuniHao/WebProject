import { createWebHistory, createRouter } from 'vue-router';
import ProductBook from '@/views/ProductBook.vue';
const routes = [
  {
    path: '/',
    name: 'productbook',
    component: ProductBook
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: () => import('@/views/NotFound.vue')
  },
  {
    path: '/products/:product_id',
    name: 'product.edit',
    component: () => import('@/views/ProductEdit.vue'),
    props: (route) => ({ productId: route.params.product_id })
  },
  {
    path: '/products/add',
    name: 'product.add',
    component: () => import('@/views/ProductAdd.vue'),
    //props: (route) => ({ contactId: route.params.id })
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});
export default router;
