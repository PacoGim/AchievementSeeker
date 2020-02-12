<script>
	import { onMount, onDestroy } from 'svelte'
	import nanoid from 'nanoid'

	import GameImage from '../../../components/Base/GameImage.svelte'

	import { parseDate, parseDateReduced } from '../../../services/helper.service.js'
	import FetchService from '../../../services/fetch.service.js'
	import GraphqlService from '../../../services/graphql.service.js'

	import { sortReleaseDate, sortScore, sortPoints, sortAchievements, sortDifficulty } from '../../../store/index.store.js'

	let loadingGamesHook = nanoid(6)

	let games = []
	let skip = 0
	let isLoading = false

	let isSmallViewport = true

	$: {
		if (process.browser === true) {
			$sortReleaseDate
			$sortScore
			$sortPoints
			$sortAchievements
			$sortDifficulty
			fetchGames().then(fetchedGames => (games = fetchedGames))
		}
	}

	function scrollEventHandler() {
		let scrollMaxY = document.documentElement.scrollHeight - document.documentElement.clientHeight

		if (isLoading === false && window.scrollY + 100 > scrollMaxY) {
			let hook = document.querySelector(`[hook='${loadingGamesHook}']`)
			hook.style.opacity = 1
			isLoading = true
			skip = skip + 20
			fetchGames(skip).then(fetchedGames => {
				games = [...games, ...fetchedGames]
				hook.style.opacity = 0
				isLoading = false
			})
		}
	}

	function fetchGames(skip = 0) {
		return new Promise((resolve, reject) => {
			FetchService.get(`api?query=${GraphqlService.buildQuery('games', ['_id', 'appid', 'name', 'releaseDate', 'score', 'points', 'achievementCount', 'difficulty{average}'], { releaseDate: $sortReleaseDate, score: $sortScore, points: $sortPoints, achievementCount: $sortAchievements, difficulty: $sortDifficulty }, {}, skip)}`)
				.then(response => {
					resolve(response['data']['games'])
				})
				.catch(error => console.log('Oopsie', error))
		})
	}

	onMount(() => {
		if (window.innerWidth <= 620) {
			isSmallViewport = true
		} else {
			isSmallViewport = false
		}

		if (process.browser) {
			window.addEventListener('scroll', scrollEventHandler)
		}
	})

	onDestroy(() => {
		if (process.browser) {
			window.removeEventListener('scroll', scrollEventHandler)
		}
	})

	function reduceNumber(value) {
		if (value / 1000 >= 1) {
			return `${(value / 1000).toFixed(1)} K`
		} else {
			return value.toFixed(1)
		}
	}
</script>

<game-grid-table>
	<grid-header text="weight-8" select="none">
		<field class="image" />
		<field flex="align-center justify-center">Game</field>

		<field cursor="pointer" flex="direction-{isSmallViewport ? 'column' : 'row'} align-center justify-center" on:click={() => sortReleaseDate.set()}>
			{#if isSmallViewport}
				<img class="icon" icon="size-6 white" src="icons/calendar.svg" alt="" />
			{:else}
				<span>Release Date</span>
			{/if}
			<img class="icon" margin={isSmallViewport ? '' : 'l-1'} icon="size-6 white" src="icons/angle-{$sortReleaseDate === 1 ? 'up' : $sortReleaseDate === -1 ? 'down' : 'neutral'}.svg" alt="" />
		</field>

		<field cursor="pointer" flex="direction-{isSmallViewport ? 'column' : 'row'} align-center justify-center" on:click={() => sortScore.set()}>
			<span>Score</span>
			<img class="icon" margin={isSmallViewport ? '' : 'l-1'} icon="size-6 white" src="icons/angle-{$sortScore === 1 ? 'up' : $sortScore === -1 ? 'down' : 'neutral'}.svg" alt="" />
		</field>
		<field cursor="pointer" flex="direction-{isSmallViewport ? 'column' : 'row'} align-center justify-center" on:click={() => sortPoints.set()}>
			<span>Points</span>
			<img class="icon" margin={isSmallViewport ? '' : 'l-1'} icon="size-6 white" src="icons/angle-{$sortPoints === 1 ? 'up' : $sortPoints === -1 ? 'down' : 'neutral'}.svg" alt="" />
		</field>

		<field cursor="pointer" flex="direction-{isSmallViewport ? 'column' : 'row'} align-center justify-center" on:click={() => sortAchievements.set()}>
			{#if isSmallViewport}
				<img class="icon" icon="size-6 white" src="icons/trophy.svg" alt="" />
			{:else}
				<span>Achievements</span>
			{/if}
			<img class="icon" margin={isSmallViewport ? '' : 'l-1'} icon="size-6 white" src="icons/angle-{$sortAchievements === 1 ? 'up' : $sortAchievements === -1 ? 'down' : 'neutral'}.svg" alt="" />
		</field>

		<field cursor="pointer" flex="direction-{isSmallViewport ? 'column' : 'row'} align-center justify-center" on:click={() => sortDifficulty.set()}>
			<span>Difficulty</span>
			<img class="icon" margin={isSmallViewport ? '' : 'l-1'} icon="size-6 white" src="icons/angle-{$sortDifficulty === 1 ? 'up' : $sortDifficulty === -1 ? 'down' : 'neutral'}.svg" alt="" />
		</field>

	</grid-header>
	{#if games !== null && games.length > 0}
		{#each games as game, index (index)}
			<a class="grid-body" href="/game/{game['_id']}">
				<field flex="align-center">
					{#if isSmallViewport}
						<GameImage appid={game['appid']} imageType="smallCapsule" />
					{:else}
						<GameImage appid={game['appid']} imageType="header" />
					{/if}
				</field>
				<field class="name">{game['name']}</field>
				<field>
					{#if isSmallViewport}{parseDateReduced(game['releaseDate'])}{:else}{parseDate(game['releaseDate'])}{/if}
				</field>
				<field class="score" text="weight-7" flex="align-center justify-center">
					<circle-shape style="filter:hue-rotate({360 - (game['score'] - 40) * 4.25}deg)" />
					<score>{Math.round(game['score'])}</score>
				</field>
				<field>{reduceNumber(game['points'])}</field>
				<field>{game['achievementCount']}</field>
				<field>{game['difficulty']['average']}</field>
			</a>
		{/each}
	{/if}

	<loading-info hook={loadingGamesHook} flex="align-center justify-center" text="weight-7 white">
		Loading more games
		<img class="icon" margin="l-1" icon="size-6 white" src="icons/oval.svg" alt="" />
	</loading-info>
</game-grid-table>

<style lang="scss">
	loading-info {
		position: fixed;
		bottom: 0;
		background-color: var(--chocolate-dark);
		padding: 0.5rem 1rem;
		width: 100%;
		opacity: 0;

		transition: opacity 0.3s;
	}
	game-grid-table {
		--chocolate-dark: #100b00;

		@media (prefers-color-scheme: light) {
			--odd-table-bg-color: #fff;
			--even-table-bg-color: #f7f7f7;
			--text-color: var(--chocolate-dark);
		}

		@media (prefers-color-scheme: dark) {
			--odd-table-bg-color: #000;
			--even-table-bg-color: #070707;
			--text-color: #fff;
			font-variation-settings: 'wght' var(--font-weight-6);
		}
		grid-header {
			color: #fff;
			top: 0;
			position: sticky;
			display: grid;
			text-align: center;
			grid-template-columns: 10vw 40vw repeat(5, 10vw);
			padding: 10px 0;
			background-color: var(--chocolate-dark);
			z-index: 1;
		}

		.grid-body {
			display: grid;
			text-align: center;
			grid-template-columns: 10vw 40vw repeat(5, 10vw);
			align-items: center;

			transition-property: background-color color font-variation-settings;
			transition-duration: 0.3s;
			transition-timing-function: ease-in-out;

			&:hover {
				background-color: var(--chocolate-dark) !important;
				color: #fff;
				font-variation-settings: 'wght' var(--font-weight-9);
			}

			field.name {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			field.score {
				color: #fff;
				width: 100%;
				height: 100%;
				position: relative;

				score {
					position: absolute;
				}

				circle-shape {
					padding: 1rem;
					position: absolute;
					border-radius: 50px;
					background-color: #ffaaaa;
				}
			}
		}

		.grid-body:nth-child(odd) {
			background-color: var(--odd-table-bg-color);
		}

		.grid-body:nth-child(even) {
			background-color: var(--even-table-bg-color);
		}
	}

	@media (max-width: 1023px) {
		game-grid-table {
			grid-header {
				grid-template-columns: 25vw 20vw 12vw 15vw 8vw 20vw;
				field.image {
					display: none;
				}
			}

			a.grid-body {
				grid-template-columns: 25vw 20vw 12vw 15vw 8vw 20vw;
				field.name {
					display: none;
				}
			}
		}
	}
</style>
