<script context="module">
	export async function preload({ host, path, query, params }, session) {
		let fieldsToFetch = ['_id', 'name', 'visitCount', 'appid', 'releaseDate', 'score', 'platforms', 'points', 'genres{type}', 'developers{name}', 'publishers{name}', 'achievements{_id,name,score,description,isHidden,value}']

		let game = await FetchService.get(`api?query=${GraphQLService.buildQuery(`gameById(id:"${params['id']}")`, fieldsToFetch)}`)

		game = game['data']['gameById']

		return { game }
	}
</script>

<script>
	import { dynamicPageName } from '../../store/main.store.js'
	import { onMount } from 'svelte'

	import FetchService from '../../services/fetch.service.js'
	import GraphQLService from '../../services/graphql.service.js'
	import { parseDate } from '../../services/helper.service.js'

	import GameImage from '../../components/Base/GameImage.svelte'

	export let game

	let title

	let arePublishersAndDevelopersSame = false

	onMount(() => {
		$dynamicPageName = game['name']
		title = game['name']

		let developers = game['developers']
		let publishers = game['publishers']

		if (developers.length === publishers.length) {
			if (developers.length !== 1 && publichers.length !== 1) {
				developers.sort((a, b) => a.localeCompare(b))
				publishers.sort((a, b) => a.localeCompare(b))
			}

			if (developers.join('') === publishers.join('')) {
				arePublishersAndDevelopersSame = true
			}
		}
	})

	function hideText(text) {
		if (text) {
			let outputText = ''

			for (let letter of text) {
				if (letter === ' ') {
					outputText += '.'
				} else {
					outputText += '_'
				}
			}

			return outputText
		} else {
			return ''
		}
	}

	function getColorFromValue(value) {
		switch (value) {
			case 0:
				return 'copper'
				break
			case 1:
				return 'silver'
				break
			case 2:
				return 'gold'
				break
			case 3:
				return 'blood'
				break
			case 4:
				return 'celestial'
				break
		}
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<game-page flex="direction-row">

	<game-card flex="direction-column">

		<header grid="overlap">
			<GameImage imageType="hero" appid={game['appid']} klass="gamePageHero" />
			<GameImage imageType="logo" appid={game['appid']} klass="gamePageLogo" alt={game['name']} />
			<score grid="overlap">
				<circumference />
				<value text="weight-9 size-7">{game['score']}</value>
			</score>
		</header>

		<release-date-platforms margin="xy-2" flex="direction-row justify-between align-center">

			<release-date text="white weight-10 size-5" padding="xy-1" flex="direction-row align-center">
				<img class="icon" icon="size-8 white" margin="r-1" src="icons/calendar.svg" alt="Release Date: " />
				<span padding="r-1">{parseDate(game['releaseDate'])}</span>
			</release-date>

			<platforms>
				{#each game['platforms'] as platform, index (index)}
					<img class="icon" icon="size-8 bluetiful" margin="l-2" src="icons/{platform}.svg" alt="" />
				{/each}
			</platforms>

		</release-date-platforms>

		<visit-count flex="direction-column justify-center align-center">
			<img class="icon" icon="size-20 bluetiful" src="icons/people.svg" alt="Visit this Week" />
			<span text="size-4 weight-5 bluetiful">Visits this week: {game['visitCount']}</span>
		</visit-count>

		<!-- <span>Genres</span> -->
		<genres>
			{#each game['genres'] as genre, index (index)}
				<genre text="white size-5 weight-8" padding="x-2 y-1">{genre['type']}</genre>
			{/each}
		</genres>

		<points>{game['points']}</points>

		<play-button>Start Game</play-button>

		<developers-publishers flex="direction-column">
			{#if arePublishersAndDevelopersSame === true}
				<developer-publisher>
					<span>Developer/Publisher:</span>
					{#each game['developers'] as developer, index (index)}
						<developer>{developer['name']}</developer>
					{/each}
				</developer-publisher>
			{:else}
				<developers>
					<span>Developers:</span>
					{#each game['developers'] as developer, index (index)}
						<developer>{developer['name']}</developer>
					{/each}
				</developers>
				<publishers>
					<span>Publishers:</span>
					{#each game['publishers'] as publisher, index (index)}
						<publisher>{publisher['name']}</publisher>
					{/each}
				</publishers>
			{/if}
		</developers-publishers>
	</game-card>

	<game-achievements>
		<summary />
		<achievements flex="direction-column">
			{#each game['achievements'] as achievement, index (index)}
				<achievement>

					<GameImage imageType="achievement" appid={game['appid']} achId={achievement['_id']} alt={achievement['_id']} />

					<name>Name: {achievement['isHidden'] ? hideText(achievement['name']) : achievement['name']}</name>

					<description>Description: {achievement['isHidden'] ? hideText(achievement['description']) : achievement['description']}</description>

					<score>
						<img class="icon" icon="size-base {getColorFromValue(achievement['value'])}" src="icons/trophy.svg" alt="" />
						<span>{achievement['score']}</span>
					</score>

				</achievement>
			{/each}
		</achievements>
	</game-achievements>
</game-page>

<style lang="scss">
	game-card {
		width: 30vw;
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
