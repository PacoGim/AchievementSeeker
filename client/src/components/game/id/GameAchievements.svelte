<script>
	import { onMount } from 'svelte'

	// Services
	import FetchService from '@/services/fetch.service.js'

	// Components
	import ImagePlaceHolder from '@/components/Base/Image/Placeholder.svelte'
	import ImageAchievement from '@/components/Base/Image/Achievement.svelte'

	export let achievementsValues
	export let _id
	export let achievements
	export let name

	let totalAchieved = 0
	let startLoadingImages = false

	onMount(() => {
		// setTimeout(() => {
		getUserAchievements().then(() => countAchievements())
		// }, 1000)
	})

	function getUserAchievements() {
		return new Promise(async (resolve, reject) => {
			let response = await FetchService.postWithCredentials(`user/${_id}`)

			if (response && response['message'] === undefined && response['game'] && response['game']['achievements'] && response['game']['achievements'].length > 0) {
				let userDBAchievements = response['game']['achievements']

				userDBAchievements.forEach(achId => {
					let foundAchievement = achievements.find(i => i['_id'] === achId)
					if (foundAchievement) {
						foundAchievement['isAchieved'] = true
					}
				})
			}

			startLoadingImages = true
			resolve()
		})
	}

	function countAchievements() {
		achievements.forEach(ach => {
			if (ach['isAchieved'] === true) {
				achievementsValues[ach['value']]['achievedAmount']++
				totalAchieved++
			}
		})
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
		return ['copper', 'silver', 'gold', 'blood', 'rainbow'][value]
	}
</script>

<game-achievements shadow>
	<summary margin="b-10">
		<span margin="b-10" flex="align-center" text="white size-12 weight-8">
			Achievements - You have {totalAchieved} of {achievements.length}
			<img class="icon" icon="size-13 white" src="icons/trophy.svg" alt="" />
		</span>
		<achievements-totals flex="justify-around direction-row">

			{#each [0, 1, 2, 3, 4] as value, index (index)}
				{#if achievementsValues[value]['amount'] !== 0}
					<container shadow flex="direction-column align-center">
						<totals flex="align-center">
							<achievements text={getColorFromValue(value)}>{achievementsValues[value]['achievedAmount']}/{achievementsValues[value]['amount']}</achievements>
							<img class="icon" icon="size-10 {getColorFromValue(value)}" src="icons/trophy.svg" alt="" />
						</totals>
						<value text={getColorFromValue(value)}>
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
		{#each achievements as achievement, index (index)}
			<achievement>

				{#if startLoadingImages === true}
					<ImageAchievement gameId={_id} gameName={name} value={achievement['value']} achId={achievement['_id']} isAchieved={achievement['isAchieved']} />
				{:else}
					<ImagePlaceHolder />
				{/if}

				<header text="weight-9" padding="x-3 t-2" flex="align-center">

					{#if achievement['isAchieved'] === true}
						<name>{achievement['name']}</name>
					{:else}
						<name>{achievement['isHidden'] ? hideText(achievement['name']) : achievement['name']}</name>
					{/if}

					{#if achievement['isAchieved'] === true}
						<img class="icon" margin="l-1" icon="size-7 white" src="icons/checkmark-circle.svg" alt="" />
					{/if}

					{#if achievement['isDLC'] === true}
						<isDLC margin="l-1">DLC</isDLC>
					{/if}
				</header>

				{#if achievement['isAchieved'] === true}
					<description padding="l-3">{achievement['description']}</description>
				{:else}
					<description padding="l-3">{achievement['isHidden'] ? hideText(achievement['description']) : achievement['description']}</description>
				{/if}

				<score flex="align-center" text="weight-6" padding="xy-2">
					<img class="icon" icon="size-base {getColorFromValue(achievement['value'])}" src="icons/trophy.svg" alt="" />
					<span text={getColorFromValue(achievement['value'])}>
						{achievement['score']}
						<span text="weight-9">ρ</span>
					</span>
				</score>

			</achievement>
		{/each}
	</achievements>
</game-achievements>

<style lang="scss">
	game-achievements {
		// max-width: ;
		// width: 100%;
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
			padding: 0.5rem 0 0.5rem 0.5rem;
			display: grid;
			background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3));
			border: 2px solid #fff;
			margin-bottom: 1rem;

			grid-template-columns: max-content auto max-content;
			grid-template-rows: max-content auto;

			header {
				grid-area: 1 / 2 / 1 / 2;

				isDLC {
					font-family: BebasNeue;
				}
			}

			description {
				grid-area: 2 / 2 / 2 / 2;
			}

			score {
				box-shadow: inset -4px 0px 10px -6px rgba(0, 0, 0, 0.33);
				align-self: center;
				grid-area: 1 / 3 / span 2 / 3;
				background-color: #fff;
				border-radius: 3px 0 0 3px;
				height: max-content;
				white-space: nowrap;
			}
		}
	}
</style>
