import { createRouter, createWebHistory } from 'vue-router'
import VueCookies from 'vue-cookies';


import AdminView from '../views/AdminView.vue'
import MainView from '@/views/MainView.vue'
import AuthView from '@/views/AuthView.vue'
import ProfileView from '@/views/ProfileView.vue'

const routes = [
  {
    path: '/auth',
    name: 'auth',
    component: AuthView,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/',
    redirect: '/home',
    meta: {
      requiresAuth: false
    },
    component: MainView,
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue')
      },
      {
        path: '/categories',
        name: 'categories',
        component: () => import(/* webpackChunkName: "categories" */ '../views/CategoriesView.vue')
      },
      {
        path: '/categories/:title/:id',
        name: 'categories_name',
        component: () => import(/* webpackChunkName: "categories_name" */ '../views/CategoryProductsView.vue')
      },
      {
        path: '/wallpaper/:title/:id',
        name: 'wallpaper',
        component: () => import(/* webpackChunkName: "wallpaper" */ '../views/ImageView.vue')
      },
      {
        path: '/search',
        name: 'search',
        component: () => import(/* webpackChunkName: "search" */ '../views/SearchView.vue')
      },
      {
        path: '/profile',
        name: 'profile',
        component: ProfileView,
      }
    ]
  },
  {
    path: '/admin',
    name: 'admin',
    redirect: '/admin/dashboard',
    meta: {
      requiresAuth: true
    },
    component: AdminView,
    children: [
      {
        path: '/admin/dashboard',
        name: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/DashboardView.vue')
      },
      {
        path: '/admin/categories',
        name: 'admin_categories',
        component: () => import(/* webpackChunkName: "admin_categories" */ '../views/CategoriesAdminView.vue')
      },
      {
        path: '/admin/product',
        name: 'admin_product',
        component: () => import(/* webpackChunkName: "admin_product" */ '../views/ProductAdminView.vue')
      },
      {
        path: '/admin/about',
        name: 'admin_about',
        component: () => import(/* webpackChunkName: "admin_about" */ '../views/AboutAdminView.vue')
      },
      {
        path: '/admin/users',
        name: 'admin_users',
        component: () => import(/* webpackChunkName: "admin_users" */ '../views/UsersView.vue')
      },
      {
        path: '/admin/allusers',
        name: 'admin_allusers',
        component: () => import(/* webpackChunkName: "admin_allusers" */ '../views/UsersAdminView.vue')
      },
      {
        path: '/admin/user/:id',
        name: 'admin_user',
        component: () => import(/* webpackChunkName: "admin_user" */ '../views/ShowAdminUser.vue')
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Authentication

const isAuthenticated = () => {
  const cookieToken = VueCookies.get('accessToken');
  const rToken = VueCookies.get('r_token');
  const localStorageToken = localStorage.getItem('eagle_token');

  return !!cookieToken && !!localStorageToken && !!rToken;
};


router.beforeEach((to, from, next) => {
  const isLoggedIn = isAuthenticated();
  const uToken = localStorage.getItem('u_token');
  if (!uToken && to.path === '/profile') {
    next({ name: 'auth' });
  } else if (uToken && to.path.startsWith('/admin')) {
    next({ name: 'profile' });
  } else if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'auth' });
  } else if (isLoggedIn && to.name === 'auth') {
    next({ name: 'admin' });
  } else {
    next();
  }
});


export default router
