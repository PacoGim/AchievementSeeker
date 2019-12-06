<script>
	import { onMount } from 'svelte'
	import BaseGameImage from 'components/base/BaseGameImage.svelte'

	import { parseDate } from 'services/helper.service.js'

	export let game
	// export let index
</script>

<a class="game" href="/game/{game['_id']}" title={game['name']} shadow>
	<BaseGameImage gameId={game['_id']} appid={game['appid']} imageType="capsule" styleClass="game-list-image" />
	<name text="weight-6 biscay">{game['name']}</name>
	<release-date text="weight-3 size-0 waikawa-grey">Released the {parseDate(game['releaseDate'])}</release-date>
</a>

<style lang="scss">
	.game {
		margin-bottom: 1rem;
		background-color: #f8f8f8;
		padding: 0.5rem;
		display: grid;
		grid-template-columns: 120px auto;
		grid-template-rows: max-content auto;
		text-decoration: none;

		border-radius: 5px;

		name {
			grid-column: 2;
			grid-row: 1;
		}

		release-date {
			grid-column: 2;
			grid-row: 2;
		}
	}
</style>
