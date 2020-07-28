<script>
	import { onMount } from 'svelte'

	// Services
	import FetchService from '@/services/fetch.service.js'
	import { getColorFromValue } from '@/services/helper.service.js'
	import { toggleFilters } from '@/services/component.service.js'

	//Store
	import { filters } from '@/store/main.store.js'

	// Components
	import AchievementsTotals from './AchievementsTotals.svelte'
	import SortFilter from './SortFilter.svelte'
	import Achievement from './Achievement.svelte'

	export let achievementsValues
	export let _id
	export let achievements
	export let name

	let totalAchieved = 0
	let startLoadingImages = false

	onMount(() => {
		getUserAchievements().then(() => {
			countAchievements()
			toggleFilters(achievements, $filters)
		})
	})

	function getUserAchievements() {
		return new Promise(async (resolve, reject) => {
			let response = await FetchService.postWithCredentials(`user/${_id}`)

			if (response && response['message'] === undefined && response['game'] && response['game']['achievements'] && response['game']['achievements'].length > 0) {
				let userDBAchievements = response['game']['achievements']

				userDBAchievements.forEach((achId) => {
					let foundAchievement = achievements.find((i) => i['_id'] === achId)
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
		achievements.forEach((ach) => {
			if (ach['isAchieved'] === true) {
				achievementsValues[ach['value']]['achievedAmount']++
				totalAchieved++
			}
		})
	}
</script>

<game-achievements shadow>
	<summary margin="b-10">
		<span margin="b-10" flex="align-center" text="white size-10 weight-8" text-dark="white">
			Achievements - You have {totalAchieved} of {achievements.length}
			<img class="icon" icon="size-13" filter="white" filter-dark="white" src="icons/trophy.svg" alt="" />
			({Math.round((100 / achievements.length) * totalAchieved)}%)
		</span>
		<AchievementsTotals {achievementsValues} />
	</summary>

	<SortFilter {achievements} />

	<achievements text="cinder size-5" text-dark="white" flex="direction-column">
		{#if totalAchieved === achievements.length}
			<h1 flex="direction-column align-center">
				<span>Congratulations!</span>
				<span>You got all the Achievements!</span>
			</h1>
		{/if}
		{#each achievements as achievement, index (achievement['_id'])}
			<Achievement {achievement} {_id} {name} {index} {startLoadingImages}/>
		{/each}
	</achievements>
</game-achievements>

<style lang="scss">
	game-achievements {
		// max-width: ;
		width: 100%;
		margin: 2rem 2rem 0 2rem;
		padding: 2rem 2rem 0 2rem;

		transition: background-color 1s;


	}
</style>
