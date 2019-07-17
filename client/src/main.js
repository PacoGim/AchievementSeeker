import Vue from 'vue'
import {plugin as VueFunctionAPI} from 'vue-function-api'
import App from './App.vue'
import router from './router'
import store from './store/store.js'
import './registerServiceWorker'

Vue.config.productionTip = false
Vue.config.ignoredElements = [/\w/]

Vue.use(VueFunctionAPI)

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')
