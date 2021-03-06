/* eslint-disable prettier/prettier */
import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import ElementUI from "element-ui" //引入js
import "element-ui/lib/theme-chalk/index.css" //引入css
import { axios } from "@/utils/request"
Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app")
