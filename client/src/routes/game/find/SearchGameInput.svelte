<script>
	import { onDestroy } from 'svelte'
	import nanoid from 'nanoid'

	import FetchService from '../../../services/fetch.service.js'

	import GameImage from '../../../components/Base/GameImage.svelte'

	import { searchInputValue } from '../../../store/main.store.js'

	const inputHook = nanoid(6)
	let searchTimeout = undefined
	let searchedGameList = undefined
	let resultsInfoText = ''
	let iconName = 'search'

	$: {
		$searchInputValue
		if (process.browser === true) {
			setInputValue()
			fetchGamesFromInput()
		}
	}

	onDestroy(() => {
		$searchInputValue = ''
	})

	function fetchGamesFromInput() {
		clearTimeout(searchTimeout)
		if ($searchInputValue !== '') {
			iconName = 'delete'
			resultsInfoText = 'Searching for Games...'
			searchTimeout = setTimeout(() => {
				FetchService.get(`games/search/${$searchInputValue}/20`).then(response => {
					if (response['status'] === 200) {
						searchedGameList = response['data']
						let totalFound = response['details']['totalFound']
						resultsInfoText = `Showing ${searchedGameList.length} Game${searchedGameList.length !== 1 ? 's' : ''}${totalFound <= 20 ? '.' : ` of ${totalFound}. Please, type more or use alias.`}`
					} else if (response['status'] === 204) {
						searchedGameList = []
						resultsInfoText = 'No Games found.'
					}
				})
			}, 1000)
		} else {
			iconName = 'search'
			searchedGameList = undefined
		}
	}

	function setInputValue() {
		let element = document.querySelector(`[hook='${inputHook}']`)
		if (element !== null) {
			if ($searchInputValue !== '') {
				element.setAttribute('value', $searchInputValue)
			} else {
				element.removeAttribute('value')
			}
		} else {
			setTimeout(() => {
				setInputValue()
			}, 10)
		}
	}
</script>

<game-search>
	<search-input display="block dynawidth" padding="t-10 b-10">

		<input-container grid="overlap">
			<input type="text" hook={inputHook} text="blue size-7" padding="xy-2" bind:value={$searchInputValue} />
			<input-placeholder margin="xy-2" text="blue size-7" flex="align-center">
				Type
				<span text="weight-9" margin="x-1" />
				to search for a Game
			</input-placeholder>
		</input-container>

		<icon cursor="pointer" flex="justify-center align-center" on:click={() => ($searchInputValue = '')}>
			<img icon="white" margin="xy-1" src="icons/{iconName}.svg" alt="" />
		</icon>

	</search-input>

	<search-results>
		<results-info text="white size-5 weight-6" padding="xy-2" style={$searchInputValue !== '' ? 'display:block' : 'display:none'}>{resultsInfoText}</results-info>
		<results flex="direction-column" text="white">
			{#if searchedGameList !== undefined && searchedGameList.length > 0}
				{#each searchedGameList as game, index (index)}
					<a href="/game/id/{game['_id']}" flex="align-center justify-between" text="weight-6">
						<GameImage appid={game['appid']} klass="searchGame" imageType="smallCapsule" />
						<name>{game['name']}</name>
						<alias flex="direction-column align-center">{game['alias']}</alias>
					</a>
				{/each}
			{/if}
		</results>
	</search-results>
</game-search>

<style lang="scss">
	game-search {
		background-color: var(--background-color-separator);

		search-input {
			--common-height: 4rem;
			display: grid;
			grid-template-columns: auto min-content;
			input-container {
				grid-column: 1;
				grid-row: 1;
				height: var(--common-height);
				input {
					height: var(--common-height);
					text-align: center;
					font-family: inherit;
					background-color: var(--background-color-separator);
					border: 2px solid var(--blue);
				}

				input[value] ~ input-placeholder,
				input:focus ~ input-placeholder {
					transform: translateY(-2rem);
					font-size: var(--font-size-5);

					span::after {
						content: 'down';
					}
				}

				span::after {
					content: 'here';
				}

				input-placeholder {
					justify-self: center;
					padding: 0 0.5rem;

					pointer-events: none;
					background-color: var(--background-color-separator);
					width: max-content;

					border-radius: 50px;

					transition-property: transform font-size;
					transition-duration: 0.3s;
					transition-timing-function: ease;
				}
			}

			icon {
				grid-column: 2;
				grid-row: 1;
				background-color: var(--blue);
				height: var(--common-height);
				width: var(--common-height);

				img {
					height: 2.5rem;
				}
			}
		}

		search-results {
			transform: translateY(-2.5rem);
			position: absolute;
			z-index: 2;
			display: block;
			background-color: rgba(0, 0, 0, 0.95);
			width: 100%;

			results-info {
				text-align: center;
			}

			results {
				margin: 0 calc(500 * (100vw - 320px) / (1920 - 320));

				@media (max-width: 768px) {
					margin: 0;
				}

				a {
					box-shadow: inset 1px 0 0 1px #fff;

					// border-width: 2px 0 2px 0;
					// border-color: #fff;
					// border-style: solid;
					margin: 0.2rem 0;
					min-height: 42px;

					transition-property: box-shadow, color;
					transition-duration: .3s;

					@media (max-width: 768px) {
						// border-radius: 0;
						// border-width: 2px 0 2px 0;
					}

					&:first-of-type {
						alias::before {
							content: 'Alias';
							font-variation-settings: 'wght' var(--font-weight-9);
						}
					}

					&:last-of-type {
						margin-bottom: 0.5rem;
					}

					name {
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						padding: 0 0.5rem;
					}

					alias {
						padding: 0 0.5rem;
						white-space: nowrap;
					}

					&:hover {
						box-shadow: inset 25px 0 0 25px #fff;
						color: #000;
					}
				}
			}
		}
	}
</style>
