// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import VeeValidate from 'vee-validate';
// import zhTW from 'vee-validate/dist/locale/zh_TW';
import zhTW from 'vee-validate/dist/locale/zh_TW'
import VueI18n from 'vue-i18n';

import App from './App'
import router from './router'
import './bus'
import currencyFilter from './filters/currency'

Vue.config.productionTip = false
Vue.component('Loading', Loading)
Vue.filter('currency', currencyFilter)

Vue.use(VueAxios, axios)

Vue.use(require('vue-moment'));
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'zhTW'
});

Vue.use(VeeValidate, {
  i18n,
  dictionary: {
    zhTW
  }
});

axios.defaults.withCredentials = true;

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const api = `${process.env.APIPATH}/api/user/check`;
    axios.post(api).then(response => {
      if (response.data.success) {
        next();
      } else {
        next({ path: '/login' })
      }
    });
  } else {
    next();
  }
});

/* eslint-disable no-new */
new Vue({
  i18n,
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});



