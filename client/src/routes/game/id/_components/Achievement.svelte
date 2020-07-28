<script>
	import ImagePlaceHolder from '@/components/Base/Image/Placeholder.svelte'
	import ImageAchievement from '@/components/Base/Image/Achievement.svelte'

	import { getColorFromValue } from '@/services/helper.service.js'

	export let achievement
	export let name
	export let _id
	export let index
	export let startLoadingImages

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
</script>

<achievement text="cinder" text-dark="white" id="ach-{achievement['_id']}">

	{#if startLoadingImages === true}
		<ImageAchievement gameId={_id} gameName={name} {index} value={achievement['value']} achId={achievement['_id']} isAchieved={achievement['isAchieved']} />
	{:else}
		<ImagePlaceHolder />
	{/if}

	<header text="weight-9" flex="align-center">

		{#if achievement['isAchieved'] === true}
			<name padding="l-3">{achievement['name']}</name>
		{:else}
			<name padding="l-3">{achievement['isHidden'] ? hideText(achievement['name']) : achievement['name']}</name>
		{/if}

		{#if achievement['isAchieved'] === true}
			<is-achieved class="pill" margin="l-2" text="white size-3 weight-10">Achieved</is-achieved>
		{/if}

		{#if achievement['isDLC'] === true}
			<is-dlc class="pill" margin="l-2" text="white size-3 weight-10">DLC</is-dlc>
		{/if}
	</header>

	{#if achievement['isAchieved'] === true}
		<description padding="l-3">{achievement['description']}</description>
	{:else}
		<description padding="l-3">{achievement['isHidden'] ? hideText(achievement['description']) : achievement['description']}</description>
	{/if}

	<score grid="overlap" text="weight-6" padding="xy-2">
		<container flex="direction-column align-center justify-center">
			<img class="icon" icon="size-6" filter="white" src="icons/trophy.svg" alt="" />
			<span text="size-4 white weight-9">{achievement['score']}p</span>
		</container>

		<background filter={getColorFromValue(achievement['value'])} />
	</score>

</achievement>

<style lang="scss">
	achievement {
		box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.25);
		padding: 0.5rem;
		display: grid;
		border-radius: 5px;
		margin-bottom: 1rem;

		grid-template-columns: max-content auto max-content;
		grid-template-rows: max-content auto;

		transition: background-color 1s;

		header {
			grid-area: 1 / 2 / 1 / 2;

			.pill {
				border-radius: 3.5px;
				padding: 0.1rem 0.2rem;
				height: 16px;
				display: flex;
				align-items: center;
			}

			is-dlc {
				color: #fff;
				background-color: #1a55e9;
			}

			is-achieved {
				background-color: #00bb74;
			}
		}

		description {
			grid-area: 2 / 2 / 2 / 2;

			align-self: center;
		}

		score {
			grid-area: 1 / 3 / span 2 / 3;

			container {
				z-index: 1;
			}

			background {
				display: block;
				background-color: #000;
				width: 3.25rem;
				height: 3.25rem;
				border-radius: 50px;
				z-index: 0;
				box-shadow: 0 0 10px 0 #000;
			}
		}
	}
</style>
