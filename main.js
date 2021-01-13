import Vue from 'vue'
import App from './App'
import store from './store'
import uView from 'uview-ui';

Vue.prototype.$store = store
Vue.config.productionTip = false

App.mpType = 'app'
Vue.use(uView);

const app = new Vue({
	...App,
	store
})

import httpInterceptor from './utils/http.interceptor.js'
// 这里需要写在最后，是为了等Vue创建对象完成，引入"app"对象(也即页面的"this"实例)
Vue.use(httpInterceptor, app)
// 引入uview的api集中管理引入部分
import httpApi from './utils/http.api.js'
Vue.use(httpApi, app)

app.$mount()
