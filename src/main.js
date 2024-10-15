import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import { createVuestic } from "vuestic-ui";
import "vuestic-ui/css";
import VueCookies from 'vue-cookies'
import "material-design-icons-iconfont/dist/material-design-icons.min.css";
import router from './router'
import store from './store'
import i18n from './i18n'

createApp(App).use(store).use(router).use(createVuestic()).use(i18n).use(VueCookies, { expires: '20min'}).mount('#app')
