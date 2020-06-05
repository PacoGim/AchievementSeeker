<script context="module">
	export async function preload({ host, path, query, params }, session) {
		let game = await FetchService.post('games', {
			games: [params['id']],
			project: {
				_id: 1,
				name: 1,
				visitCount: 1,
				appid: 1,
				releaseDate: 1,
				score: 1,
				platforms: 1,
				points: 1,
				genres: 1,
				developers: 1,
				publishers: 1,
				'achievements._id': 1,
				'achievements.name': 1,
				'achievements.score': 1,
				'achievements.description': 1,
				'achievements.isHidden': 1,
				'achievements.value': 1
			}
		})

		game = game[0]

		let achievementsValues = {
			0: {
				achievedAmount: 0,
				amount: 0
			},
			1: {
				achievedAmount: 0,
				amount: 0
			},
			2: {
				achievedAmount: 0,
				amount: 0
			},
			3: {
				achievedAmount: 0,
				amount: 0
			},
			4: {
				achievedAmount: 0,
				amount: 0
			}
		}

		game['achievements'].forEach(ach => {
			achievementsValues[ach['value']]['amount']++

			if (ach['isAchieved'] === true) {
				achievementsValues[ach['value']]['achievedAmount']++
				totalAchieved++
			}
		})

		return { game, achievementsValues }
	}
</script>

<script>
	import { dynamicPageName } from '@/store/main.store.js'
	import { tweened } from 'svelte/motion'
	import { onMount } from 'svelte'

	import FetchService from '@/services/fetch.service.js'
	import { parseDate } from '@/services/helper.service.js'

	import GameImage from '@/components/Base/GameImage.svelte'
	import ImageAchievement from '@/components/Base/Image/Achievement.svelte'
	import ImagePlaceHolder from '@/components/Base/Image/Placeholder.svelte'

	export let game
	export let achievementsValues

	let title
	let startLoadingImages = false

	let arePublishersAndDevelopersSame = false

	let totalAchieved = 0

	onMount(async () => {
		$dynamicPageName = game['name']
		title = game['name']
		mergeDevAndPublishers()

		getUserAchievements().then(() => countAchievements())
	})

	function getUserAchievements() {
		return new Promise(async (resolve, reject) => {
			let response = await FetchService.postWithCredentials(`user/${game['_id']}`)

			if (response && response['message'] === undefined && response['game'] && response['game']['achievements'] && response['game']['achievements'].length > 0) {
				let achievements = response['game']['achievements']

				achievements.forEach(achId => {
					let foundAchievement = game['achievements'].find(i => i['_id'] === achId)
					if (foundAchievement) {
						foundAchievement['isAchieved'] = true
					}
				})

				game = game
			}

			startLoadingImages = true
			resolve()
		})
	}

	function countAchievements() {
		game['achievements'].forEach(ach => {
			if (ach['isAchieved'] === true) {
				achievementsValues[ach['value']]['achievedAmount']++
				totalAchieved++
			}
		})
	}

	function mergeDevAndPublishers() {
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
	}

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

	<game-card shadow flex="direction-column">

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
				<genre text="white size-5 weight-8" padding="x-2 y-1">{genre}</genre>
			{/each}
		</genres>

		<points>{game['points']}</points>

		<play-button>Start Game</play-button>

		<developers-publishers flex="direction-column">
			{#if arePublishersAndDevelopersSame === true}
				<developer-publisher>
					<span>Developer/Publisher:</span>
					{#each game['developers'] as developer, index (index)}
						<developer>{developer}</developer>
					{/each}
				</developer-publisher>
			{:else}
				<developers>
					<span>Developers:</span>
					{#each game['developers'] as developer, index (index)}
						<developer>{developer}</developer>
					{/each}
				</developers>
				<publishers>
					<span>Publishers:</span>
					{#each game['publishers'] as publisher, index (index)}
						<publisher>{publisher}</publisher>
					{/each}
				</publishers>
			{/if}
		</developers-publishers>
	</game-card>

	<game-achievements shadow>
		<summary margin="b-10">
			<span margin="b-10" flex="align-center" text="white size-12 weight-8">
				Achievements - You have {totalAchieved} of {game['achievements'].length}
				<img class="icon" icon="size-13 white" src="icons/trophy.svg" alt="" />
			</span>
			<achievements-totals flex="justify-around direction-row">

				{#each [0, 1, 2, 3, 4] as value, index (index)}
					{#if achievementsValues[value]['amount'] !== 0}
						<container shadow flex="direction-column align-center" text={getColorFromValue(value)}>
							<totals flex="align-center">
								{achievementsValues[value]['achievedAmount']}/{achievementsValues[value]['amount']}
								<img class="icon" icon="size-10 {getColorFromValue(value)}" src="icons/trophy.svg" alt="" />
							</totals>
							<value>
								{getColorFromValue(value)
									.charAt(0)
									.toUpperCase() + getColorFromValue(value).slice(1)}
							</value>
						</container>
					{/if}
				{/each}

			</achievements-totals>
		</summary>
		<achievements text="white size-5" flex="direction-column">
			{#each game['achievements'] as achievement, index (index)}
				<achievement>

					{#if startLoadingImages === true}
						<ImageAchievement gameId={game['_id']} achId={achievement['_id']} isAchieved={achievement['isAchieved']} />
					{:else}
						<ImagePlaceHolder />
					{/if}

					<header text="weight-9" padding="x-3 t-2">
						<name>{achievement['isHidden'] && achievement['isAchieved'] === undefined ? hideText(achievement['name']) : achievement['name']}</name>
					</header>

					<description  padding="xy-3" flex="align-center">{achievement['isHidden'] ? hideText(achievement['description']) : achievement['description']}</description>

					<score flex="align-center" padding="xy-2">
						<img class="icon" icon="size-base {getColorFromValue(achievement['value'])}" src="icons/trophy.svg" alt="" />
						<span text={getColorFromValue(achievement['value'])}>{achievement['score']}</span>
					</score>

				</achievement>
			{/each}
		</achievements>
	</game-achievements>
</game-page>

<style lang="scss">
	game-card {
		margin: 2rem;
		padding-bottom: 1rem;
		border-radius: 30px;
		width: 30vw;
		height: fit-content;
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

	game-achievements {
		width: 100%;
		margin: 2rem 2rem 0 2rem;
		padding: 2rem 2rem 0 2rem;

		background-image: linear-gradient(to bottom right, #4476fd, #3ca7e9);

		achievements-totals {
			container {
				background-color: #fff;
				padding: 0.5rem 2.5rem;
				border-radius: 3px;
			}
		}

		achievement {
			display: grid;
			background-color: rgba(255, 255, 255, 0.2);
			border: 1px solid #fff;
			margin-bottom: 1rem;

			grid-template-columns: max-content auto max-content;
			grid-template-rows: max-content auto;

			border-radius: 0 3px 3px 0;

			header {
				grid-area: 1 / 2 / 1 / 2;
			}

			description {
				grid-area: 2 / 2 / 2 / 2;
			}

			score {
				grid-area: 2 / 3 / 2 / 3;
				background-color: #fff;
				border-radius: 3px 0 0 3px;
				height: max-content;
			}
		}
	}
</style>
