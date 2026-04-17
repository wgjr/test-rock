import { createRouter, createWebHistory } from 'vue-router';
import { auth } from './lib/auth';
import AdminView from './views/AdminView.vue';
import LoginView from './views/LoginView.vue';
import NotFoundView from './views/NotFoundView.vue';
import ProductDetailsView from './views/ProductDetailsView.vue';
import ProductsView from './views/ProductsView.vue';
import RegisterView from './views/RegisterView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'products',
      component: ProductsView,
    },
    {
      path: '/products/:id',
      name: 'product-details',
      component: ProductDetailsView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !auth.isAuthenticated.value) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    };
  }

  if (to.meta.requiresAdmin && auth.state.user?.role !== 'admin') {
    return { name: 'products' };
  }

  return true;
});
