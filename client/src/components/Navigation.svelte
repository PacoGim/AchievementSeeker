<script>
	import { stores } from '@sapper/app'
	const { page } = stores()

	import nanoid from 'nanoid'

	const pageNameHook = nanoid(6)

	const routes = [
		{
			name: 'Home',
			path: '/',
		},
		{
			name: 'Game Search',
			path: '/game/search',
		},
	]

	let pagePath = $page.path
	$: pagePath = $page.path

	let pageName = getPageNameFromPagePath(pagePath, routes)

	// Page Change Watcher
	$: {
		if (process.browser === true) {
			let pageTitleElement = document.querySelector(`[hook='${pageNameHook}']`)
			if (pageTitleElement !== null) {
				pageTitleElement.setAttribute('style', 'opacity:0')
				setTimeout(() => {
					pageName = getPageNameFromPagePath(pagePath, routes)
					pageTitleElement.setAttribute('style', 'opacity:1')
				}, 300)
			}
		}
	}

	function getPageNameFromPagePath(pagePath, routesArray) {
		let foundRoute = routesArray.find(route => route['path'] === pagePath)
		if (foundRoute !== undefined) return foundRoute['name']
		else return 'No route found!'
	}
</script>

<nav text="white weight-5 size-3">
	<main flex="justify-between">
		<titles>
			<app-name>Steam Achievement Hunter</app-name>
			<separator text="weight-10">-</separator>
			<page-title text="weight-7" hook={pageNameHook}>{pageName}</page-title>
		</titles>
		<links>
			{#each routes as route, index (index)}
				<a href={route['path']} selected={pagePath === route['path']}>{route['name']}</a>
			{/each}
		</links>
	</main>
</nav>

<style lang="scss">
	nav {
		padding: 2rem;
		background-image: linear-gradient(to bottom right, #b0d2f0, #3ca7e9);
	}

	main {
		background-color: rgba(255, 255, 255, 0.25);
		padding: 1.25rem 1.75rem;
		backdrop-filter: blur(2px);
		border-radius: 5px;

		page-title {
			display: inline-block;
			transition: opacity 0.3s ease-in-out;
		}

		a {
			transition-property: font-variation-settings border-bottom;
			transition-duration: 0.3s;
			transition-timing-function: ease-in-out;
			border-bottom: 2px solid transparent;
			margin: 0.25rem 0.75rem;

			&[selected='true'],
			&:hover {
				border-bottom: 2px solid #fff;
				font-variation-settings: 'wght' var(--font-weight-8);
			}
		}
	}
</style>
