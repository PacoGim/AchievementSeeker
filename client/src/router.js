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
				fancyBGColor: {
					1: '#cb2d3e',
					2: '#ef473a',
				},
				transform: {
					1: 'skewY(2deg) translateY(-60px)',
					2: 'skewY(-2deg) translateY(-60px)',
				},
			},
			component: () => import(/* webpackChunkName: "" */ './views/Home.vue'),
		},
		{
			path: '/game/list',
			name: 'Game List',
			meta: {
				routeName: 'Game List',
				fancyBGColor: {
					1: '#4364f7',
					2: '#6fb1fc',
				},
				transform: {
					1: 'skewY(-2.5deg) translateY(-45px)',
					2: 'skewY(1deg)',
				},
			},
			component: () => import(/* webpackChunkName: "GameList" */ '@/views/game/GameList.vue'),
		},
		{
			path: '/game/search',
			name: 'Game Search',
			meta: {
				routeName: 'Search Game',
				fancyBGColor: {
					1: '#41295a',
					2: '#2f0743',
				},
				transform: {
					1: 'skewY(-5deg) translateY(-70px)',
					2: 'skewY(20deg) translateY(-100px)',
				},
			},
			component: () => import(/* webpackChunkName: "Search" */ '@/views/game/GameSearch.vue'),
		},
		{
			path: '/game/:id',
			name: 'Game',
			meta: {
				routeName: 'Loading Game...',
				fancyBGColor: {
					1: '#3a6186',
					2: '#89253e',
				},
				transform: {
					1: 'skewY(4deg) translateY(-70px)',
					2: 'skewY(-2deg) translateY(-50px)',
				},
			},
			component: () => import(/* webpackChunkName: "Game" */ '@/views/game/Game.vue'),
		},
	],
})

router.beforeEach((to, from, next) => {
	console.log(to)
	store.set('currentRoute', to['meta']['routeName'])

	document.documentElement.style.setProperty('--fancy-bg-color-1', to['meta']['fancyBGColor'][1])
	document.documentElement.style.setProperty('--fancy-bg-color-2', to['meta']['fancyBGColor'][2])
	document.documentElement.style.setProperty('--transform-1', to['meta']['transform'][1])
	document.documentElement.style.setProperty('--transform-2', to['meta']['transform'][2])

	next()
})

export default router
