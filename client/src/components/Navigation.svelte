<script>
	import { dynamicPageName } from '../store/main.store.js'

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
			name: 'Find Game',
			path: '/game/find',
		},
	]

	let pagePath = $page.path
	$: pagePath = $page.path

	// Calls the fn now because when the reactive statement triggers, the pageTitle element doesn't exist yet.
	let pageName = getPageNameFromPagePath(pagePath, routes)

	// Page Change Watcher
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

<!--
<nav text="white weight-5 size-3">
	<main flex="justify-between">
		<titles>
			<app-name>Steam Achievement Hunter</app-name>
			<separator text="weight-10">-</separator>
		</titles>
		<links>
			{#each routes as route, index (index)}
				<a href={route['path']} selected={pagePath === route['path']}>{route['name']}</a>
			{/each}
		</links>
		<page-title text="weight-8" hook={pageNameHook}>{pageName}</page-title>
	</main>
</nav>
-->

<navigation>
	<navigation-background />
	<main-navigation>
		<home>
			<a href="/">Steam Achievement Hunter</a>
		</home>
		<links>
			{#each routes as route, index (index)}
				<a href={route['path']} selected={pagePath === route['path']}>{route['name']}</a>
			{/each}
		</links>
		<page-name flex="" hook={pageNameHook}>{pageName}</page-name>
	</main-navigation>
</navigation>

<style lang="scss">
	navigation-background {
		display: block;
		width: 100%;
		height: 7rem;
		background-image: linear-gradient(to bottom right, #4476fd, #3ca7e9);
	}

	main-navigation {
		display: grid;
		grid-template-columns: auto max-content;
		align-items: center;
		padding: 1rem;
		width: calc(100% - 3rem);
		height: 4rem;
		position: fixed;
		top: 1.5rem;
		left: 1.5rem;
		background-color: rgba(255, 255, 255, 0.25);
		backdrop-filter: blur(4px);
		z-index: 4;

		home {
			grid-area: 1 / 1 / 1 / 1;
		}

		links {
			justify-self: end;
			grid-area: 1 / 2 / 1 / 2;
			height: 42px;
			a {
				cursor: pointer;
				background-color: rgba(255, 255, 255, 0.5);
				height: 100%;
			}
		}

		page-name {
			justify-self: center;
			grid-area: 2 / 1 / 2 / span 2;
		}
	}

	// main {
	// 	background-color: rgba(255, 255, 255, 0.25);
	// 	padding: 1.25rem 1.75rem;
	// 	backdrop-filter: blur(2px);
	// 	border-radius: 5px;
	// 	position: sticky;
	// 	top: 0;

	// 	page-title {
	// 		display: inline-block;
	// 		transition: opacity 0.3s ease-in-out;
	// 	}

	// 	a {
	// 		transition-property: font-variation-settings border-bottom;
	// 		transition-duration: 0.3s;
	// 		transition-timing-function: ease-in-out;
	// 		border-bottom: 2px solid transparent;
	// 		margin: 0.25rem 0.75rem;

	// 		&[selected='true'],
	// 		&:hover {
	// 			border-bottom: 2px solid #fff;
	// 			font-variation-settings: 'wght' var(--font-weight-8);
	// 		}
	// 	}
	// }
</style>
