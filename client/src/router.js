import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'Home',
			component: () => import(/* webpackChunkName: "" */ './views/home/Home.vue'),
		},
		{
			path: '/game/list',
			name: 'Game List',
			component: () => import(/* webpackChunkName: "GameList" */ '@/views/game/list/List.vue'),
		},
		{
			path: '/game/:id',
			name: 'Dynamically inserted',
			component: () => import(/* webpackChunkName: "GameOne" */ '@/views/game/one/One.vue'),
		},
	],
})
