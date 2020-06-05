<script>
	import { onMount } from 'svelte'
	import { dynamicPageName } from '../store/main.store.js'
	import { isUserLogged } from '../store/user.store.js'

	import { stores } from '@sapper/app'
	const { page } = stores()

	import nanoid from 'nanoid'

	const pageNameHook = nanoid(6)

	let routes = [
		{
			name: 'Home',
			path: '/'
		},
		{
			name: 'Find Game',
			path: '/game/find'
		},
		{
			name: 'Logout',
			path: '/user/logout',
			onhover: () => saveLastRoute()
		}
	]

	let isScrolledNav = false
	let pagePath = $page.path
	$: pagePath = $page.path

	let pageName = getPageNameFromPagePath(pagePath, routes)

	function saveLastRoute() {
		if (document.location.href !== 'http://192.168.1.199:8080/user/login' && document.location.href !== 'http://192.168.1.199:8080/user/logout') {
			localStorage.setItem('lastLocation', document.location.href)
		}
	}

	$: {
		if (process.browser === true) {
			if ($isUserLogged === true) {
				let foundRoute = routes.find(i => i['name'] === 'Login')
				if (foundRoute) {
					foundRoute['name'] = 'Logout'
					foundRoute['path'] = '/user/logout'
				}
			} else if ($isUserLogged === false) {
				let foundRoute = routes.find(i => i['name'] === 'Logout')
				if (foundRoute) {
					foundRoute['name'] = 'Login'
					foundRoute['path'] = '/user/login'
				}
			}

			routes = routes
		}
	}

	$: {
		if (process.browser === true) {
			let pageName = getPageNameFromPagePath(pagePath, routes)

			if (pageName !== undefined && pageName !== '') {
				setPageName(pageName)
			} else {
				setPageName($dynamicPageName)
			}
		}
	}

	onMount(() => {
		window.addEventListener('scroll', () => {
			if (window.scrollY >= 16 * 2.5) {
				isScrolledNav = true
			} else {
				isScrolledNav = false
			}
		})
	})

	function setPageName(newName) {
		let pageTitleElement = document.querySelector(`[hook='${pageNameHook}']`)
		if (pageTitleElement !== null) {
			pageTitleElement.setAttribute('style', 'opacity:0')

			setTimeout(() => {
				pageName = newName
				pageTitleElement.setAttribute('style', 'opacity:1')
			}, 300)
		}
	}

	function getPageNameFromPagePath(pagePath, routesArray) {
		let foundRoute = routesArray.find(route => route['path'] === pagePath)
		if (foundRoute !== undefined) return foundRoute['name']
		else return ''
	}
</script>

<navigation>
	<navigation-background />
	<main-navigation shadow flex="align-center justify-between" is-scrolled-nav={isScrolledNav}>
		<a text="weight-10 size-7" padding="xy-2" href="/">Steam Achievement Hunter</a>
		<page-name text="weight-10 size-5" padding="xy-2" hook={pageNameHook}>{pageName}</page-name>
		<links>
			{#each routes as route, index (index)}
				<a text="weight-5" id="route-{route['name']}" href={route['path']} selected={pagePath === route['path']} on:click={route['onclick'] ? () => route['onclick']() : null} on:mouseenter={route['onhover'] ? () => route['onhover']() : null}>{route['name']}</a>
			{/each}
		</links>
	</main-navigation>
</navigation>

<style lang="scss">
	navigation-background {
		display: block;
		width: 100%;
		height: 5rem;
		background-image: linear-gradient(to bottom right, #4476fd, #3ca7e9);
		z-index: -1;
	}

	main-navigation {
		align-items: center;
		height: 5rem;
		padding: 1rem;
		border-radius: 3px;
		position: fixed;
		width: 100%;
		top: 0;
		background-color: transparent;
		color: #fff;
		backdrop-filter: blur(4px);
		z-index: 4;

		transition-property: color, background-color;
		transition-duration: 1s;

		page-name {
			transition: opacity 0.3s;
		}

		links {
			height: 42px;
			display: flex;
			align-items: center;
			a {
				display: flex;
				align-items: center;
				cursor: pointer;

				box-shadow: inset 0 -2px 0px 0px #fff;

				padding: 0 1.5rem 0 0.5rem;
				margin: 0 0.5rem;
				height: 100%;

				color: #fff;

				transition-property: color, font-variation-settings, box-shadow;
				transition-duration: 0.3s;
				transition-timing-function: ease-in-out;

				&::before {
					content: '•';
					margin-right: 0.25rem;
					opacity: 0;
				}
			}

			a[selected='true'],
			a:hover {
				box-shadow: inset 0 -45px 0px 0px #fff;
				color: var(--bluetiful);
			}
			a[selected='true'] {
				&::before {
					font-variation-settings: 'wght' var(--font-weight-10);
					content: '•';
					opacity: 1;
				}
			}
		}
	}

	main-navigation[is-scrolled-nav='true'] {
		background-color: rgba(255, 255, 255, 0.75);
		color: #414141;

		links {
			a {
				background-color: transparent;
				color: #414141;
				box-shadow: inset 0 -2px 0px 0px #414141;
			}

			a[selected='true'],
			a:hover {
				color: #fff;
				box-shadow: inset 0 -45px 0px 0px #414141;
				background-color: transparent;
			}
		}
	}
</style>
