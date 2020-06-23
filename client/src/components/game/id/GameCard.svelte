<script>
	import { onMount } from 'svelte'
	import GameImage from '@/components/Base/GameImage.svelte'
	import { parseDate } from '@/services/helper.service.js'

	export let developers
	export let publishers
	export let name
	export let appid
	export let score
	export let releaseDate
	export let platforms
	export let genres
	export let points
	export let visitCount

	let arePublishersAndDevelopersSame = false

	onMount(() => {
		mergeDevAndPublishers()
	})

	function mergeDevAndPublishers() {
		if (developers.length === publishers.length) {
			if (developers.length !== 1 && publichers.length !== 1) {
				developers.sort((a, b) => a.localeCompare(b))
				publishers.sort((a, b) => a.localeCompare(b))
			}

			if (developers.join('') === publishers.join('')) {
				arePublishersAndDevelopersSame = true
			}
		}
	}
</script>

<game-card shadow flex="direction-column">

	<header grid="overlap">
		<GameImage imageType="hero" {appid} klass="gamePageHero" />
		<GameImage imageType="logo" {appid} klass="gamePageLogo" alt={name} />
		<score grid="overlap">
			<circumference />
			<value text="weight-9 size-5">{score}ρ</value>
		</score>
	</header>

	<release-date-platforms margin="xy-2" flex="direction-row justify-between align-center">

		<release-date text="white weight-10 size-5" padding="xy-1" flex="direction-row align-center">
			<img class="icon" icon="size-8 white" margin="r-1" src="icons/calendar.svg" alt="Release Date: " />
			<span padding="r-1">{parseDate(releaseDate)}</span>
		</release-date>

		<platforms>
			{#each platforms as platform, index (index)}
				<img class="icon" icon="size-8 bluetiful" margin="l-2" src="icons/{platform}.svg" alt="" />
			{/each}
		</platforms>

	</release-date-platforms>

	<visit-count flex="direction-column justify-center align-center">
		<img class="icon" icon="size-20 bluetiful" src="icons/people.svg" alt="Visit this Week" />
		<span text="size-4 weight-5 bluetiful">Visits this week: {visitCount}</span>
	</visit-count>

	<!-- <span>Genres</span> -->
	<genres>
		{#each genres as genre, index (index)}
			<genre text="white size-5 weight-8" padding="x-2 y-1">{genre}</genre>
		{/each}
	</genres>

	<points>
		{points}
		<span text="weight-9">ρ</span>
	</points>

	<play-button>Start Game</play-button>

	<developers-publishers flex="direction-column">
		{#if arePublishersAndDevelopersSame === true}
			<developer-publisher>
				<span>Developer/Publisher:</span>
				{#each developers as developer, index (index)}
					<developer>{developer}</developer>
				{/each}
			</developer-publisher>
		{:else}
			<developers>
				<span>Developers:</span>
				{#each developers as developer, index (index)}
					<developer>{developer}</developer>
				{/each}
			</developers>
			<publishers>
				<span>Publishers:</span>
				{#each publishers as publisher, index (index)}
					<publisher>{publisher}</publisher>
				{/each}
			</publishers>
		{/if}
	</developers-publishers>
</game-card>

<style lang="scss">
	game-card {
		margin: 2rem;
		padding-bottom: 1rem;
		border-radius: 30px;
		// width: 30vw;
		// height: fit-content;
		header {
			score {
				z-index: 1;
				justify-self: end;
				align-items: center;
				align-self: start;
				color: #fff;
				margin: 0.5rem;

				circumference {
					height: 50px;
					width: 50px;
					border-radius: 100px;
					border: 4px solid #fff;
				}

				value {
					text-align: center;
				}
			}
		}

		release-date-platforms {
			release-date {
				border-radius: 4px;
				background-color: var(--bluetiful);
			}
		}

		genres {
			border: solid 2px var(--bluetiful);
			border-radius: 6px;
			padding: 2rem;
			margin: 1rem;
			display: flex;
			flex-direction: row;
			justify-content: space-evenly;

			genre {
				border-radius: 6px;
				background-color: var(--bluetiful);
			}
		}

		developers-publishers {
			developers developer,
			publishers publisher {
				&::after {
					content: ', ';
				}

				&:last-of-type::after {
					content: '';
				}
			}
		}
	}
</style>
