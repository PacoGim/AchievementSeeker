<script>
	import { getColorFromValue } from '@/services/helper.service.js'

	export let achievementsValues
</script>

<achievements-totals flex="justify-around direction-row">

	{#each [0, 1, 2, 3, 4] as value, index (index)}
		{#if achievementsValues[value]['amount'] !== 0}
			<container shadow padding="x-8 y-3" flex="direction-column align-center">
				<totals flex="align-center">
					<achievements text={getColorFromValue(value)} text-dark={getColorFromValue(value)}>{achievementsValues[value]['achievedAmount']}/{achievementsValues[value]['amount']}</achievements>
					<img class="icon" icon="size-8" filter={getColorFromValue(value)}  filter-dark={getColorFromValue(value)} src="icons/trophy.svg" alt="" />
				</totals>
				<value text="size-4 weight-8 {getColorFromValue(value)}" text-dark={getColorFromValue(value)}>{getColorFromValue(value).charAt(0).toUpperCase() + getColorFromValue(value).slice(1)}</value>
			</container>
		{/if}
	{/each}

</achievements-totals>

<style>
	achievements-totals container {
		transition: background-color 1s;
		border-radius: 3px;
	}
</style>
