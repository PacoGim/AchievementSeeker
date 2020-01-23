<script>
	import FetchService from '../../../services/fetch.service.js'
	import nanoid from 'nanoid'

	const inputHook = nanoid(6)
	let searchInputValue = ''
	let searchTimeout = undefined
	let searchedGameList = undefined
	let inputInfoText = ''

	$: {
		searchInputValue
		setInputValue()
		fetchGamesFromInput()
	}

	function fetchGamesFromInput() {
		clearTimeout(searchTimeout)
		if (searchInputValue !== '') {
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
			searchedGameList = undefined
		}
	}

	function setInputValue() {
		if (process.browser === true) {
			let element = document.querySelector(`[hook='${inputHook}']`)
			if (element !== null) {
				if (searchInputValue !== '') {
					element.setAttribute('value', searchInputValue)
				} else {
					element.removeAttribute('value')
				}
			}
		}
	}
</script>

<game-search display="block dynawidth" padding="t-18 b-18">
	<search-input flex="direction-column">
		<input-box grid="overlap">
			<input type="text" hook={inputHook} text="blue size-6" padding="xy-2" bind:value={searchInputValue} />
			<input-placeholder margin="xy-3" text="blue size-6" flex="align-center">Type Here to search a Game</input-placeholder>
		</input-box>
		<input-info text="blue size-2" margin="t-1" style={searchInputValue !== '' ? 'opacity:1' : 'opacity:0'}>{inputInfoText}</input-info>
	</search-input>
	<search-results>
		<!--  -->
	</search-results>
</game-search>

<style lang="scss">
	game-search {
		background-color: #fafafa;

		search-input {
			input-box {
				input {
					font-family: inherit;
					background-color: #fafafa;
					border: 3px solid var(--blue);
				}

				input[value] ~ input-placeholder,
				input:focus ~ input-placeholder {
					transform: translateY(-2rem);
					font-size: var(--font-size-3);
				}

				input-placeholder {
					padding: 0 0.5rem;

					pointer-events: none;
					background-color: #fafafa;
					width: max-content;

					border-radius: 50px;

					transition-property: transform font-size;
					transition-duration: 0.3s;
					transition-timing-function: ease;
				}
			}

			input-info {
				align-self: center;

				transition: opacity 0.3s;
			}
		}
	}
</style>
