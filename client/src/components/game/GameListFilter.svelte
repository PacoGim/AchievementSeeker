<script>
	import { fetchServer } from 'services/fetch.service.js'
	import BaseClose from 'components/base/BaseClose.svelte'

	import { filtering } from 'store/store.js'
	import { onMount } from 'svelte'

	import { getCachedData, setCachedData, ONEDAY } from 'services/cache.service.js'

	let genres = []
	let selectedGenres = []

	let isGenreContainerVisible = false
	let isDifficultyContainerVisible = false
	let isPlatformsContainerVisible = false

	$: {
		if (selectedGenres.length > 0) {
			filtering.setGenres(selectedGenres)
		}
	}

	onMount(() => {
		getCachedData('genres')
			.then(res => {
				genres = res['genres']
			})
			.catch(() => {
				fetchServer('/games/genres').then(async res => {
					if (res['status'] === 200) {
						genres = await res.json()
						genres = genres.sort((a, b) => a.localeCompare(b))

						setCachedData('genres', {
							expiresOn: new Date().getTime() + ONEDAY,
							genres,
						})
					}
				})
			})
	})

	function setDifficulty(difficulty) {
		setAllContainersVisibilityToFalse()
		filtering.setDifficulty(difficulty)
	}

	function genreSelected() {
		setAllContainersVisibilityToFalse()
		filtering.setGenre(selectedGenre)
	}

	function toggleContainerVisibility(containerName) {
		setAllContainersVisibilityToFalse()

		switch (containerName) {
			case 'genres':
				isGenreContainerVisible = true
				break
			case 'difficulty':
				isDifficultyContainerVisible = true
				break
			case 'platforms':
				isPlatformsContainerVisible = true
				break
		}
	}

	function setAllContainersVisibilityToFalse() {
		isGenreContainerVisible = false
		isDifficultyContainerVisible = false
		isPlatformsContainerVisible = false
	}
</script>

<game-filter flex="direction-row align-center">
	<h2>Filter:</h2>
	<filter-options flex="direction-row align-center" user-select="none">
		<filter-option cursor="pointer" flex="direction-column align-center" on:click={() => toggleContainerVisibility('genres')}>
			<span>Genre</span>
			<selected>{$filtering.genre}</selected>
		</filter-option>

		<filter-option cursor="pointer" flex="direction-column align-center" on:click={() => toggleContainerVisibility('difficulty')}>
			<span>Difficulty</span>
			<selected>
				{#if $filtering.difficulty !== undefined}{$filtering.difficulty}{/if}
			</selected>
		</filter-option>

		<filter-option cursor="pointer" flex="direction-column align-center" on:click={() => toggleContainerVisibility('platforms')}>
			<span>Platforms</span>
			<selected>{$filtering.platform}</selected>
		</filter-option>

		<filter-option cursor="pointer" flex="direction-column align-center" on:click={() => filtering.cycleIsFree()}>
			<span>Free to play?</span>
			<selected>
				{#if $filtering.isFree !== undefined}{$filtering.isFree === 'true' ? 'Yes' : 'No'}{/if}
			</selected>
		</filter-option>

	</filter-options>
</game-filter>

<game-filter-selector>

	<genre-selector class={isGenreContainerVisible === true ? 'show-container' : 'hide-container'} flex="direction-row align-center">
		<BaseClose message="genreClose" on:genreClose={() => (isGenreContainerVisible = false)} />
		<h2>Genre:</h2>
		<genres flex="wrap">
			{#each genres as genre, index (index)}
				<genre grid="overlap align-center">
					<input id="genre-{index}" type="checkbox" cursor="pointer" bind:group={selectedGenres} value={genre} />
					<label for="genre-{index}">{genre}</label>
				</genre>
			{/each}
		</genres>
	</genre-selector>

	<difficulty-selector class={isDifficultyContainerVisible === true ? 'show-container' : 'hide-container'} flex="direction-row align-center">
		<BaseClose message="difficultyClose" on:difficultyClose={() => (isDifficultyContainerVisible = false)} />
		<h2>Difficulty:</h2>
		<difficulties>
			<difficulty class="any" on:click={() => setDifficulty(undefined)}>Any</difficulty>
			<difficulty class="_0-10" on:click={() => setDifficulty(0)}>0-10</difficulty>
			<difficulty class="_10-20" on:click={() => setDifficulty(10)}>10-20</difficulty>
			<difficulty class="_20-30" on:click={() => setDifficulty(20)}>20-30</difficulty>
			<difficulty class="_30-40" on:click={() => setDifficulty(30)}>30-40</difficulty>
			<difficulty class="_40-50" on:click={() => setDifficulty(40)}>40-50</difficulty>
			<difficulty class="_50-60" on:click={() => setDifficulty(50)}>50-60</difficulty>
			<difficulty class="_60-70" on:click={() => setDifficulty(60)}>60-70</difficulty>
			<difficulty class="_70-80" on:click={() => setDifficulty(70)}>70-80</difficulty>
			<difficulty class="_80-90" on:click={() => setDifficulty(80)}>80-90</difficulty>
			<difficulty class="_90-100" on:click={() => setDifficulty(90)}>90-100</difficulty>
		</difficulties>
	</difficulty-selector>

	<platform-selector class={isPlatformsContainerVisible === true ? 'show-container' : 'hide-container'} flex="direction-row align-center">
		<BaseClose message="platformClose" on:platformClose={() => (isPlatformsContainerVisible = false)} />
		<h2>Platforms:</h2>
		<platforms>
			<platform cursor="pointer" on:click={() => filtering.setPlatform('ALL')}>All</platform>
			<platform cursor="pointer" on:click={() => filtering.setPlatform('WINDOWS')}>Windows</platform>
			<platform cursor="pointer" on:click={() => filtering.setPlatform('MAC')}>Mac</platform>
			<platform cursor="pointer" on:click={() => filtering.setPlatform('LINUX')}>Linux</platform>
		</platforms>
	</platform-selector>
</game-filter-selector>

<style lang="scss">
	game-filter {
		width: 100%;
		background-color: var(--bg-color);
		padding: 1rem;

		filter-options {
			width: 100%;

			filter-option {
				background-color: var(--bg-color);
				padding: 0.5rem 1rem;

				margin-left: 1rem;
				white-space: nowrap;
			}
		}
	}

	game-filter-selector {
		width: 100%;
		position: relative;
		margin-bottom: 2rem;

		& > * {
			position: absolute;
			width: 100%;
			background-color: var(--bg-color);
			padding: 0.5rem 1rem;
			transition: transform 0.3s, opacity 0.3s;

			h2 {
				margin-right: 1rem;
			}

			&.hide-container {
				pointer-events: none;
				transform: translateY(-50px);
				opacity: 0;
			}

			&.show-container {
				transform: translateY(0px);
				opacity: 1;
			}
		}

		genre-selector {
			genres genre {
				margin: 0.5rem;
				label {
					font-size: 0.9rem;
					background-color: #111;
					border: solid 1px #fff;
					color: #fff;
					border-radius: 1000px;
					padding: 0.25rem 0.5rem;
					z-index: -1;
				}

				input {
					height: 100%;
					opacity: 0;
				}

				input:checked ~ label {
					background-color: #3023c2;
				}
			}
		}
	}

	difficulty-selector {
		difficulty {
			cursor: pointer;
			padding: 0.5rem 1rem;
			border-radius: 50px;
			display: inline-block;

			&.any {
				background: linear-gradient(to right, #999, #333);
			}

			&._0-10 {
				background: linear-gradient(to right, #39c21d, #2cc230);
			}

			&._10-20 {
				background: linear-gradient(to right, #1cc255, #19c285);
			}

			&._20-30 {
				background: linear-gradient(to right, #19c2b7, #19a1c2);
			}

			&._30-40 {
				background: linear-gradient(to right, #196dc2, #1e42c2);
			}

			&._40-50 {
				background: linear-gradient(to right, #3023c2, #5519c2);
			}

			&._50-60 {
				background: linear-gradient(to right, #8819c2, #ac19b7);
			}

			&._60-70 {
				background: linear-gradient(to right, #bf1993, #be356a);
			}

			&._70-80 {
				background: linear-gradient(to right, #a89533, #a1c219);
			}

			&._80-90 {
				background: linear-gradient(to right, #b6a019, #c27419);
			}

			&._90-100 {
				background: linear-gradient(to right, #c24a19, #c21a19);
			}
		}
	}
</style>
