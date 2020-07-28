<script>
	import { onMount, onDestroy } from 'svelte'
	import nanoid from 'nanoid'

	import GameImage from '@/components/Base/GameImage.svelte'

	import { parseDate, parseDateReduced } from '@/services/helper.service.js'
	import FetchService from '@/services/fetch.service.js'

	import { sortReleaseDate, sortScore, sortPoints, sortAchievements, sortDifficulty } from '@/store/sort.store.js'
	import { searchInputValue } from '@/store/main.store.js'

	let loadingGamesHook = nanoid(6)

	let games = []
	let skip = 0
	let isLoading = false

	let isMediumViewport = true
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

		if (isLoading === false && $searchInputValue === '' && window.scrollY + 100 > scrollMaxY) {
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

	function fetchGames() {
		return new Promise((resolve, reject) => {
			FetchService.post('games', {
				project: {
					_id: 1,
					appid: 1,
					platforms: 1,
					points: 1,
					name: 1,
					releaseDate: 1,
					score: 1,
					achievementCount: 1,
					'difficulty.average': 1
				},
				sort: {
					releaseDate: $sortReleaseDate,
					score: $sortScore,
					points: $sortPoints,
					achievementCount: $sortAchievements,
					'difficulty.average': $sortDifficulty
				},
				skip,
				limit: Math.floor(window.innerHeight / (3 * 16))
			})
				.then(data => {
					resolve(data)
				})
				.catch(error => {
					console.log(error)
				})
		})
	}

	onMount(() => {
		if (window.innerWidth <= 1024) {
			isMediumViewport = true
		} else {
			isMediumViewport = false
		}

		if (window.innerWidth <= 768) {
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

		<image-header />

		<game-header flex="align-center justify-center">Game</game-header>

		<platforms-header class="header">Platforms</platforms-header>

		<score-header cursor="pointer" class="header" on:click={() => sortScore.set()}>
			<span>Score</span>
			<img class="icon" icon="size-6 white" src="icons/angle-{$sortScore === 1 ? 'up' : $sortScore === -1 ? 'down' : 'neutral'}.svg" alt="" />
		</score-header>

		<achievements-count-header cursor="pointer" class="header" on:click={() => sortAchievements.set()}>
			{#if isMediumViewport}
				<img class="icon" icon="size-6 white" src="icons/trophy.svg" alt="" />
			{:else}
				<span>Achievements</span>
			{/if}
			<img class="icon" icon="size-6 white" src="icons/angle-{$sortAchievements === 1 ? 'up' : $sortAchievements === -1 ? 'down' : 'neutral'}.svg" alt="" />
		</achievements-count-header>

		<difficulty-header cursor="pointer" class="header" on:click={() => sortDifficulty.set()}>
			<span>Difficulty</span>
			<img class="icon" icon="size-6 white" src="icons/angle-{$sortDifficulty === 1 ? 'up' : $sortDifficulty === -1 ? 'down' : 'neutral'}.svg" alt="" />
		</difficulty-header>

		<points-header cursor="pointer" class="header" on:click={() => sortPoints.set()}>
			<span>Points</span>
			<img class="icon" icon="size-6 white" src="icons/angle-{$sortPoints === 1 ? 'up' : $sortPoints === -1 ? 'down' : 'neutral'}.svg" alt="" />
		</points-header>

		<release-date-header cursor="pointer" class="header" on:click={() => sortReleaseDate.set()}>
			{#if isMediumViewport}
				<img class="icon" icon="size-6 white" src="icons/calendar.svg" alt="" />
			{:else}
				<span>Release Date</span>
			{/if}
			<img class="icon" icon="size-6 white" src="icons/angle-{$sortReleaseDate === 1 ? 'up' : $sortReleaseDate === -1 ? 'down' : 'neutral'}.svg" alt="" />
		</release-date-header>

	</grid-header>
	{#if games !== null && games.length > 0}
		{#each games as game, index (index)}
			<a class="grid-body" href="/game/id/{game['_id']}">

				<image-field class="field" flex="align-center">
					{#if window.innerWidth <= 768}
						<GameImage appid={game['appid']} klass="listGame" imageType="smallCapsule" alt={game['name']} />
					{:else}
						<GameImage appid={game['appid']} klass="listGame" imageType="header" alt={game['name']} />
					{/if}
				</image-field>

				<name-field>{game['name']}</name-field>

				<platforms-field flex="justify-center">
					{#each game['platforms'] as platform, index (index)}
						<img class="icon" icon={isSmallViewport ? 'size-1 white' : 'size-5 dark-chocolate'} margin="x-1" src="icons/{platform}.svg" alt="" />
					{/each}
				</platforms-field>

				<score-field text="weight-7" flex="align-center justify-center">
					<circle-shape style="filter:hue-rotate({360 - (game['score'] - 40) * 4.25}deg)" />
					<score>{Math.round(game['score'])}</score>
				</score-field>

				<achievement-count-field>{game['achievementCount']}</achievement-count-field>

				<difficulty-field>{game['difficulty']['average']}</difficulty-field>

				<points-field>{reduceNumber(game['points'])}</points-field>

				<release-date-field padding="r-2">
					{#if isMediumViewport}{parseDateReduced(game['releaseDate'])}{:else}{parseDate(game['releaseDate'])}{/if}
				</release-date-field>

			</a>
		{/each}
	{/if}

	{#if $searchInputValue !== ''}
		<scroll-locked-message flex="align-center justify-center" text="size-5 weight-6 white" padding="xy-2">
			<img class="icon" icon="white size-5" margin="r-1" src="icons/info.svg" alt="" />
			The infinite scroll is locked while searching. Clear search to continue.
		</scroll-locked-message>
	{/if}

	<loading-info hook={loadingGamesHook} flex="align-center justify-center" text="weight-7 white">
		Loading more games
		<img class="icon" margin="l-1" icon="fit-height white" src="icons/oval.svg" alt="" />
	</loading-info>
</game-grid-table>

<style lang="scss">
	loading-info {
		position: fixed;
		bottom: 0;
		background-color: var(--dark-chocolate);
		padding: 0.5rem 1rem;
		width: 100%;
		opacity: 0;

		transition: opacity 0.3s;
	}
	game-grid-table {
		color: var(--dark-chocolate);

		@media (prefers-color-scheme: light) {
			--text-color: var(--dark-chocolate);
		}

		@media (prefers-color-scheme: dark) {
			--text-color: #fff;
			font-variation-settings: 'wght' var(--font-weight-6);
		}

		--image-field-width: 10vw;
		--name-field-width: 30vw;
		--platforms-field-width: 10vw;
		--score-field-width: 10vw;
		--achievements-field-width: 10vw;
		--difficulty-field-width: 10vw;
		--points-field-width: 5vw;
		--release-date-field-width: 15vw;

		grid-header {
			grid-template-columns:
				var(--image-field-width) var(--name-field-width) var(--platforms-field-width)
				var(--score-field-width) var(--achievements-field-width) var(--difficulty-field-width)
				var(--points-field-width) var(--release-date-field-width);

			color: #fff;
			top: 5rem;
			position: sticky;
			display: grid;
			text-align: center;
			padding: 10px 0;
			background-color: var(--dark-chocolate);
			z-index: 1;

			.header {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;

				.icon {
					margin-left: 0.25rem;
				}
			}
		}

		.grid-body {
			min-height: 3rem;

			display: grid;

			grid-template-columns:
				var(--image-field-width) var(--name-field-width) var(--platforms-field-width)
				var(--score-field-width) var(--achievements-field-width) var(--difficulty-field-width)
				var(--points-field-width) var(--release-date-field-width);

			text-align: center;
			align-items: center;

			transition-property: background-color color font-variation-settings;
			transition-duration: 0.3s;
			transition-timing-function: ease-in-out;

			&:hover {
				background-color: var(--dark-chocolate) !important;
				color: #fff;
				font-variation-settings: 'wght' var(--font-weight-9);
			}

			image-field {
				grid-area: 1 / 1 / 1 / 1;
			}

			name-field {
				grid-area: 1 / 2 / 1 / 2;

				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			platforms-field {
				grid-area: 1 / 3 / 1 / 3;
			}

			score-field {
				grid-area: 1 / 4 / 1 /4;

				color: #fff;

				position: relative;

				score {
					position: absolute;
				}

				circle-shape {
					padding: 1rem;
					position: relative;
					border-radius: 50px;
					background: linear-gradient(to bottom, #ff8b8b 31%, #ff7070 100%);

					&:before {
						content: '';
						width: 90%;
						height: 20px;

						border-radius: 50px;

						display: block;
						position: absolute;
						left: 0.09rem;
						top: 0;
						background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.5) 8%, rgba(255, 255, 255, 0) 100%);
					}
				}
			} //Score Field

			achievement-count-field {
				grid-area: 1 / 5 / 1 / 5;
			}

			difficulty-field {
				grid-area: 1 / 6 / 1 / 6;
			}

			points-field {
				grid-area: 1 / 7 / 1 / 7;
			}

			release-date-field {
				grid-area: 1 / 8 / 1 / 8;
			}
		}

		.grid-body:nth-child(odd) {
			background-color: var(--odd-table-bg-color);
		}

		.grid-body:nth-child(even) {
			background-color: var(--even-table-bg-color);
		}
	}

	scroll-locked-message {
		background-color: var(--dark-chocolate);
		text-align: center;
	}

	@media (max-width: 1024px) {
		game-grid-table {
			--points-field-width: 10vw;
			--release-date-field-width: 10vw;
		}
	}

	@media (max-width: 768px) {
		game-grid-table {
			grid-header {
				grid-template-columns: 10rem 10vw 7vw 17vw 12vw 20vw;
				image-header,
				platforms-header {
					display: none !important;
				}

				.header {
					flex-direction: column;

					.icon {
						margin-left: 0;
					}
				}
			}

			.grid-body {
				grid-template-columns: 10rem 10vw 7vw 17vw 12vw 20vw;
				image-field {
					grid-area: 1 / 1 / 1 / 1;
				}

				name-field {
					grid-area: 1 / 1 / 1 / 1;

					color: #fff;
					align-self: flex-end;
					font-variation-settings: 'wght' var(--font-weight-7);
					background-color: rgba(0, 0, 0, 0.75);
					padding: 0 0.5rem;
				}

				platforms-field {
					grid-area: 1 / 1 / 1 / 1;
					background-color: rgba(0, 0, 0, 0.75);
					align-self: flex-start;
					justify-self: flex-end;
					width: max-content;

					padding: 0.2rem;
					margin-top: 4px;

					.icon {
						margin: 0 0.2rem;
					}
				}

				score-field {
					grid-area: 1 / 2 / 1 / 2;
				}

				achievement-count-field {
					grid-area: 1 / 3 / 1 / 3;
				}

				difficulty-field {
					grid-area: 1 / 4 / 1 / 4;
				}

				points-field {
					grid-area: 1 / 5 / 1 / 5;
				}

				release-date-field {
					grid-area: 1 / 6 / 1 / 6;
				}
			}
		}
	}
</style>
