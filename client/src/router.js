import Vue from 'vue'
import Router from 'vue-router'
import store from './store/store'

Vue.use(Router)

const router = new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'Home',
			meta: {
				routeName: 'Home',
				fancyBGColor: 'linear-gradient(to bottom right, #0052d4, #4364f7, #6fb1fc)',
			},
			component: () => import(/* webpackChunkName: "" */ './views/home/Home.vue'),
		},
		{
			path: '/game/list',
			name: 'Game List',
			component: () => import(/* webpackChunkName: "GameList" */ '@/views/game/list/List.vue'),
		},
		{
			path: '/game/:id',
			name: 'Game',
			meta: {
				routeName: 'Loading Game...',
				fancyBGColor: 'linear-gradient(to bottom right,  #ad5389, #3c1053)',
			},
			component: () => import(/* webpackChunkName: "Game" */ '@/views/game/Game.vue'),
		},
	],
})

router.beforeEach((to, from, next) => {
	store.set('currentRoute', to['meta']['routeName'])

	document.documentElement.style.setProperty('--fancy-bg-color', to['meta']['fancyBGColor'])

	next()
})

export default router
