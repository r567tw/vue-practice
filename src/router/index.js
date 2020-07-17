import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/pages/Login'
import Dashboard from '@/components/Dashboard'
import Products from '@/components/pages/Products'
import Orders from '@/components/pages/Orders'
import Coupons from '@/components/pages/Coupons'
import CustomerOrder from '@/components/pages/CustomerOrders';
import CustomerCheckout from '@/components/pages/CustomerCheckout';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'products',
          name: 'products',
          component: Products,
          meta: { requiresAuth: true }
        },
        {
          path: 'orders',
          name: 'orders',
          component: Orders,
          meta: { requiresAuth: true }
        },
        {
          path: 'coupons',
          name: 'coupons',
          component: Coupons,
          meta: { requiresAuth: true }
        },
        {
          path: 'customer_order',
          name: 'CustomerOrder',
          component: CustomerOrder,
        }
      ]
    },
    {
      path: '/customer_checkout/:orderId',
      name: 'CustomerCheckout',
      component: CustomerCheckout,
    },
  ]
})
