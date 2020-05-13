<script>
	import { onMount } from 'svelte'
	import { dynamicPageName } from '../store/main.store.js'

	import { stores } from '@sapper/app'
	const { page } = stores()

	import nanoid from 'nanoid'

	const pageNameHook = nanoid(6)

	const routes = [
		{
			name: 'Home',
			path: '/'
		},
		{
			name: 'Find Game',
			path: '/game/find'
		},
		{
			name: 'Login',
			path: '/user/login'
		}
	]

	let isScrolledNav = false
	let pagePath = $page.path
	$: pagePath = $page.path

	let pageName = getPageNameFromPagePath(pagePath, routes)

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
			if (window.scrollY >= 28) {
				isScrolledNav = true
			} else {
				isScrolledNav = false
			}
		})

		document.querySelector(`#route-Login`).addEventListener('mouseenter', () => {
			localStorage.setItem('lastLocation', document.location.href)
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
	<main-navigation flex="align-center justify-between" is-scrolled-nav={isScrolledNav}>
		<a text="weight-7" padding="xy-2" href="/">Steam Achievement Hunter</a>
		<page-name text="weight-7 size-3" padding="xy-2" hook={pageNameHook}>{pageName}</page-name>
		<links>
			{#each routes as route, index (index)}
				<a id="route-{route['name']}" href={route['path']} selected={pagePath === route['path']}>{route['name']}</a>
			{/each}
		</links>
	</main-navigation>
</navigation>

<style lang="scss">
	navigation-background {
		display: block;
		width: 100%;
		height: 8rem;
		background-image: linear-gradient(to bottom right, #4476fd, #3ca7e9);
		z-index: -1;
	}

	main-navigation {
		align-items: center;
		padding: 1rem;
		width: calc(100% - 3rem);
		border-radius: 3px;
		position: fixed;
		top: 1.5rem;
		left: 1.5rem;
		background-color: rgba(255, 255, 255, 0.25);
		color: #fff;
		backdrop-filter: blur(4px);
		z-index: 4;

		transition-property: width border-radius top left color;
		transition-duration: 0.3s;
		transition-timing-function: ease-in-out;

		links {
			height: 42px;
			display: flex;
			align-items: center;
			a {
				display: flex;
				align-items: center;
				cursor: pointer;
				border-radius: 3px;
				font-variation-settings: 'wght' var(--font-weight-6);
				background-color: rgba(255, 255, 255, 0.15);
				padding: 0 1.5rem 0 0.5rem;
				margin: 0 0.5rem;
				height: 100%;

				transition-property: font-variation-settings background-color color border-bottom;
				transition-duration: 0.3s;
				transition-timing-function: ease-in-out;

				&::before {
					content: '•';
					margin-right: 0.25rem;
					opacity: 0;
					transition: opacity 0.3s ease-in-out;
				}
			}

			a[selected='true'],
			a:hover {
				font-variation-settings: 'wght' var(--font-weight-9);
				background-color: #fff;
				color: var(--blue);
			}
			a[selected='true'] {
				&::before {
					content: '•';
					opacity: 1;
				}
			}
		}

		page-name {
			transition: opacity 0.3s ease-in-out;
		}
	}

	main-navigation[is-scrolled-nav='true'] {
		background-color: rgba(255, 255, 255, 0.25);
		width: 100%;
		border-radius: 0 0 3px 3px;
		top: 0;
		left: 0;
		color: var(--bluetiful);
		border-bottom: 3px solid var(--bluetiful);

		a {
			background-color: #fff;
			border-radius: 3px;
		}

		page-name {
			background-color: #fff;
			border-radius: 3px;
		}
	}
</style>
