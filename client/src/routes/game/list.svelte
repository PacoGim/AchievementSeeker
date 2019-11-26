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
	import BaseGameHeader from 'components/base/BaseGameHeader.svelte'

	import { setFancyBG } from 'services/fancyBG.service.js'
	import { parseDate } from 'services/helper.service.js'
	import { getGameSearchGames } from 'services/graphql.service.js'

	import { sorting, filtering } from 'store/store.js'

	const componentName = 'Game List'

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
	<h1>Or choose options below</h1>
	<GameListSort />
	<GameListFilter />

	<games>

		{#if gameList !== undefined}
			{#each gameList as game (game['_id'])}
				<a href="/game/{game['_id']}" flex="direction-column align-center">

					<BaseGameHeader gameID={game['_id']} styleClass="game-list-header" />

					<span>{game['name']}</span>

					{#if game['difficulty']}
						<span>Difficulty:{game['difficulty']['average']}</span>
					{/if}

					{#if game['points']}
						<span>Points:{game['points']}</span>
					{/if}

					{#if game['achievementCount']}
						<span>Ach Count:{game['achievementCount']}</span>
					{/if}

					{#if game['score']}
						<span>Score:{game['score']}</span>
					{/if}

					{#if game['trend']}
						<span>Trend:{game['trend']}</span>
					{/if}

					{#if game['isFree'] !== undefined}
						<span>Free to play:{game['isFree']}</span>
					{/if}

					{#if game['platforms']}
						<span>
							Platforms:
							{#each game['platforms'] as platform, index (index)}{platform},{/each}
						</span>
					{/if}

					{#if game['releaseDate']}
						<span>RD:{parseDate(game['releaseDate'])}</span>
					{/if}

					{#if game['genres']}
						<span>
							Genres:
							{#each game['genres'] as genre, index (index)}{genre['type']},{/each}
						</span>
					{/if}
				</a>
			{/each}
		{/if}

	</games>
</game-list>

<svelte:head>
	<title>{componentName}</title>
</svelte:head>

<style lang="scss">
	game-list {
		--bg-color: rgba(255, 255, 255, 0.5);

		games {
			padding: 1rem;
			width: 100%;
			display: grid;
			grid-gap: 1rem;
			grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));

			a {
				background-color: #fff;
				padding: 0.5rem;
				border: outset 2px dodgerblue;
			}
		}
	}
</style>
