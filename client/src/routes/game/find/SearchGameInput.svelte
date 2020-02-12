<script>
	import FetchService from '../../../services/fetch.service.js'
	import GameImage from '../../../components/Base/GameImage.svelte'
	import nanoid from 'nanoid'

	const inputHook = nanoid(6)
	let searchInputValue = ''
	let searchTimeout = undefined
	let searchedGameList = undefined
	let inputInfoText = ''
	let iconName = 'search'

	$: {
		searchInputValue
		if (process.browser === true) {
			setInputValue()
			fetchGamesFromInput()
		}
	}

	function fetchGamesFromInput() {
		clearTimeout(searchTimeout)
		if (searchInputValue !== '') {
			iconName = 'delete'
			inputInfoText = 'Searching for Games...'
			searchTimeout = setTimeout(() => {
				FetchService.get(`/games/search/${searchInputValue}/20`).then(response => {
					if (response['status'] === 200) {
						searchedGameList = response['data']
						let totalFound = response['details']['totalFound']
						inputInfoText = `Showing ${searchedGameList.length} Game${searchedGameList.length !== 1 ? 's' : ''}${totalFound <= 20 ? '.' : ` of ${totalFound}. Please, type more or use alias.`}`
					} else if (response['status'] === 204) {
						searchedGameList = []
						inputInfoText = 'No Games found.'
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
			if (searchInputValue !== '') {
				element.setAttribute('value', searchInputValue)
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

<game-search display="block dynawidth" padding="t-10 b-10">
	<search-input>

		<input-container grid="overlap">
			<input type="text" hook={inputHook} text="blue size-5" padding="xy-2" bind:value={searchInputValue} />
			<input-placeholder margin="xy-2" text="blue size-5" flex="align-center">
				Type
				<span text="weight-9" margin="x-1" />
				to search for a Game
			</input-placeholder>
		</input-container>

		<icon cursor="pointer" flex="justify-center align-center" on:click={() => (searchInputValue = '')}>
			<img icon="white" margin="xy-1" src="icons/{iconName}.svg" alt="" />
		</icon>

		<input-info text="blue size-2" margin="xy-2" style={searchInputValue !== '' ? 'opacity:1' : 'opacity:0'}>{inputInfoText}</input-info>
	</search-input>
	<search-results flex="direction-column">
		{#if searchedGameList !== undefined && searchedGameList.length > 0}
			{#each searchedGameList as game, index (index)}
				<a href="/game/{game['_id']}" flex="align-center justify-between" padding="r-3" text="blue" hover="text-weight-9" style="margin-top:{index * 4}rem">
					<GameImage appid={game['appid']} imageType="smallCapsule" />
					<name>{game['name']}</name>
					<alias>{game['alias']}</alias>
				</a>
			{/each}
		{/if}
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
					font-size: var(--font-size-2);

					span::after {
						content: 'now';
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
			input-info {
				grid-row: 2;
				grid-column: 1 / span 2;
				justify-self: flex-end;

				transition: opacity 0.3s;
			}
		}

		search-results {
			position: relative;

			a {
				background-color: #fff;
				position: absolute;
				width: 100%;
				border: 1px solid var(--blue);
				padding: 0.5rem 0;
			}
		}
	}

	@media (max-width: 360px) {
		game-search search-input input-container input-placeholder {
			font-size: var(--font-size-4);
		}
	}
</style>
