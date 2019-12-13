<script context="module">
	import { buildQuery } from 'services/graphql.service.js'
	import { fetchServer } from 'services/fetch.service.js'
	export async function preload({ params, query: urlQuery }) {
		let { sort, filter, query } = await buildQuery()

		let gameList = await getGameSearchGames({
			query: query,
			sort: sort,
			filter: filter,
		}).catch(error => console.log('GameList Error', error))

		if (gameList) {
			gameList = gameList['games']

			return { gameList }
		} else {
			//TODO: Redirect if error with server
			return { gameList: [] }
		}
	}
</script>

<script>
	import { onMount } from 'svelte'

	import GameListSearch from 'components/game/GameListSearch.svelte'
	import GameListSort from 'components/game/GameListSort.svelte'
	import GameListFilter from 'components/game/GameListFilter.svelte'
	import BaseGameListCard from 'components/base/BaseGameListCard.svelte'

	import { setFancyBG } from 'services/fancyBG.service.js'
	import { getGameSearchGames } from 'services/graphql.service.js'
	import { smoothScrollTo } from 'services/helper.service.js'

	import { sorting, filtering } from 'store/store.js'

	const pageName = 'Game List'

	export let gameList

	// Checks if the reactive statements were run already. Avoids running the reactive statements at component mount/launch.
	let dirty = false

	$: {
		if (dirty === true) {
			console.log('Running reactive statements...')

			$sorting
			$filtering

			buildQuery().then(({ query, sort, filter }) => {
				getGameSearchGames({
					query,
					sort,
					filter,
				}).then(data => {
					const games = data['games']

					if (games.length > 0) {
						gameList = games
					} else {
						//TODO: Alert that no games were found
					}
				})
			})
		} else {
			dirty = true
		}
	}

	onMount(() => {
		setFancyBG({
			color1: '#8a58bf',
			color2: '#8613bf',
			transform1: 'skewY(-10deg) translateY(0)',
			transform2: 'skewY(10deg) translateY(0)',
			height1: '100%',
			height2: '100%',
		})
	})
</script>

<game-list flex="direction-column align-center">
	<GameListSearch />
	<h2 text="weight-5" margin="b-1">Or choose options below</h2>
	<GameListSort />
	<GameListFilter />

	<games padding="xy-4">
		{#if gameList !== undefined}
			{#each gameList as game, index (index)}
				<BaseGameListCard {game} />
			{/each}
		{/if}
	</games>
</game-list>

<svelte:head>
	<title>{pageName}</title>
</svelte:head>

<style lang="scss">
	game-list {
		--bg-color: rgba(255, 255, 255, 0.25);
		--font-color: #111;

		h1 {
			margin-bottom: 2rem;
		}

		games {
			// background: linear-gradient(to bottom , transparent 25% , rgba(0,0,0, 0.25));
			background: linear-gradient(to bottom, transparent 25%, rgba(142, 182, 241, 0.25));
			// background-color: rgba(255,255,255,.75);

			// display: block;
			// padding: 1rem;
			// width: 100%;
			// display: grid;
			// grid-gap: 1rem;
			// grid-template-columns: repeat(3, 1fr);
			// max-width: 1000px;
		}
	}
</style>
