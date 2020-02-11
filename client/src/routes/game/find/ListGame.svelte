<script>
	import { onMount } from 'svelte'

	import GameImage from '../../../components/Base/GameImage.svelte'

	import { parseDate, parseDateReduced } from '../../../services/helper.service.js'
	import FetchService from '../../../services/fetch.service.js'
	import GraphqlService from '../../../services/graphql.service.js'

	import { sortReleaseDate } from '../../../store/index.store.js'

	let games = []

	let isSmallViewPort = true

	$: {
		if (process.browser === true) {
			FetchService.get(`api?query=${GraphqlService.buildQuery('games', ['_id', 'appid', 'name', 'releaseDate', 'score', 'points', 'achievementCount', 'difficulty{average}'], { releaseDate: $sortReleaseDate })}`)
				.then(response => {
					games = response['data']['games']
				})
				.catch(error => console.log('Oopsie', error))
		}
	}

	onMount(() => {
		if (window.innerWidth <= 620) {
			isSmallViewPort = true
		} else {
			isSmallViewPort = false
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
		<field>Game</field>
		<field cursor="pointer" flex="direction-row align-center justify-center" on:click={() => sortReleaseDate.set()}>
			{#if isSmallViewPort}
				<img class="icon" icon="size-6 white" src="icons/calendar.svg" alt="" />
			{:else}Release Date{/if}

			{#if $sortReleaseDate === 1}
				<img class="icon" margin="l-1" icon="size-6 white" src="icons/angle-down.svg" alt="" />
			{:else if $sortReleaseDate === -1}
				<img class="icon" margin="l-1" icon="size-6 white" src="icons/angle-up.svg" alt="" />
			{:else}
				<img class="icon" margin="l-1" icon="size-6 white" style="opacity:0" src="icons/angle-down.svg" alt="" />
			{/if}
		</field>
		<field>Score</field>
		<field>Points</field>
		<field>
			{#if isSmallViewPort}
				<img class="icon" icon="size-6 white" src="icons/trophy.svg" alt="" />
			{:else}Achievements{/if}
		</field>
		<field>Difficulty</field>
	</grid-header>
	{#if games !== null && games.length > 0}
		{#each games as game, index (index)}
			<a class="grid-body" href="/game/{game['_id']}">
				<field flex="align-center">
					{#if isSmallViewPort}
						<GameImage appid={game['appid']} imageType="smallCapsule" />
					{:else}
						<GameImage appid={game['appid']} imageType="header" />
					{/if}
				</field>
				<field class="name">{game['name']}</field>
				<field>
					{#if isSmallViewPort}{parseDateReduced(game['releaseDate'])}{:else}{parseDate(game['releaseDate'])}{/if}
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
</game-grid-table>

<style lang="scss">
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

	@media (max-width: 768px) {
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
