<script>
  import { toggleFilters } from '@/services/component.service.js'

  import { filters } from '@/store/main.store.js'

	export let achievements
	let isFilterFirstRun = true

	$: {
		if (process.browser === true) {
			if (isFilterFirstRun === false) {
				filters
				toggleFilters(achievements,$filters)
			} else {
				isFilterFirstRun = false
			}
		}
	}
</script>

<sortfilter text="weight-7 size-6" text-dark="white" flex="direction-row justify-around" margin="b-10">

	<hide-achieved flex="direction-row align-center">
		<label for="hideAchieved" checked={$filters.includes('hideAchieved')}>Hide Achieved</label>
		<input type="checkbox" id="hideAchieved" bind:group={$filters} value="hideAchieved" />
	</hide-achieved>

	<hide-dlc flex="direction-row align-center">
		<label for="hideDLC" checked={$filters.includes('hideDLC')}>Hide DLC</label>
		<input type="checkbox" id="hideDLC" bind:group={$filters} value="hideDLC" />
	</hide-dlc>

</sortfilter>

<style lang="scss">
	sortfilter {
		label {
			cursor: pointer;
			user-select: none;
			display: flex;
			align-items: center;
		}
		label::after {
			content: '';
			display: block;
			height: 1.5rem;
			width: 1.5rem;
			background-color: #fff;
			border-radius: 50px;
			margin-left: 0.5rem;

			border: 3px solid #fff;

			transition: box-shadow 0.3s;
		}
		label[checked='true']::after {
			box-shadow: inset 0 0 0 10px var(--bluetiful);
		}

		label[checked='false']::after {
			box-shadow: inset 0 0 0 0 transparent;
		}

		input[type='checkbox'] {
			display: none;
		}
	}
</style>
