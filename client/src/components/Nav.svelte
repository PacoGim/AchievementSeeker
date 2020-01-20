<script>
	const routes = [
		{
			id: undefined,
			name: 'Home',
			href: '.',
		},
		{
			id: 'games@search',
			name: 'Game Search',
			href: 'games@search',
		},
		{
			id: 'games@list',
			name: 'Game List',
			href: 'games@list',
		},
	]
	export let segment
	export let pageTitle = getPageNameFromSegment(segment, routes)

	// Segment Watcher
	$: {
		if (process.browser) {
			let pageTitleElement = document.querySelector('nav main titles page-title')
			pageTitleElement.setAttribute('style', 'opacity:0')

			setTimeout(() => {
				pageTitle = getPageNameFromSegment(segment, routes)

				pageTitleElement.setAttribute('style', 'opacity:1')
			}, 300)
		}
	}

	function getPageNameFromSegment(segment, routesArray) {
		let foundRoute = routesArray.find(route => route['id'] === segment)
		if (foundRoute !== undefined) return foundRoute['name']
	}
</script>

<nav text="white weight-5 size-3">

	<main flex="justify-between">
		<titles>
			<app-name>Steam Achievement Hunter</app-name>
			<separator>-</separator>
			<page-title text="weight-7">{pageTitle}</page-title>
		</titles>
		<links>
			{#each routes as route, index (index)}
				<a href={route['href']} selected={segment === route['id']}>{route['name']}</a>
			{/each}
		</links>
	</main>
</nav>

<style lang="scss">
	nav {
		padding: 2rem;
		background-image: linear-gradient(to bottom right, #4476fd, #1eadb9);
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
				font-variation-settings: 'wght' var(--font-weight-10);
			}
		}
	}
</style>
