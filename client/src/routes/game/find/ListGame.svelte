<script>
	import { onMount } from 'svelte'

	import GameImage from '../../../components/Base/GameImage.svelte'

	import { parseDate, parseDateReduced } from '../../../services/helper.service.js'

	let games = []

	let isSmallViewPort = true

	let query = `{
      games(sortBy:{
				releaseDate:-1
			}){
        _id
        appid
        name
        releaseDate
        score
        points
        achievementCount
        difficulty{
          average
        }
      }
    }`

	onMount(() => {
		if (window.innerWidth <= 620) {
			isSmallViewPort = true
		} else {
			isSmallViewPort = false
		}

		fetch(`http://192.168.1.104:3000/api?query=${query}`)
			.then(response => {
				return response.json()
			})
			.then(data => {
				games = data['data']['games']
			})
	})

	function reduceNumber(value) {
		if (value / 1000 >= 1) {
			return `${(value / 1000).toFixed(1)} K`
		} else {
			return value.toFixed(1)
		}
	}
</script>

<game-grid-table>
	<image-field class="header" />
	<name-field class="header" text="weight-7">Game</name-field>

	<release-date-field class="header" text="weight-7">
		{#if isSmallViewPort}
			<img class="icon" icon="size-6" src="icons/calendar.svg" alt="" />
		{:else}Release Date{/if}
	</release-date-field>

	<score-field class="header" text="weight-7">Score</score-field>
	<points-field class="header" text="weight-7">Points</points-field>

	<achievement-count-field class="header" text="weight-7">
		{#if isSmallViewPort}
			<img class="icon" icon="size-6" src="icons/trophy.svg" alt="" />
		{:else}Achievements{/if}
	</achievement-count-field>

	<difficulty-field class="header" text="weight-7">Difficulty</difficulty-field>

	{#each games as game, index (index)}
		<image-field class="body">
			<GameImage appid={game['appid']} imageType="smallCapsule" />
		</image-field>
		<name-field class="body">{game['name']}</name-field>
		<release-date-field class="body">
			{#if isSmallViewPort}{parseDateReduced(game['releaseDate'])}{:else}{parseDate(game['releaseDate'])}{/if}

		</release-date-field>
		<score-field class="body">{game['score']}</score-field>
		<points-field class="body">{reduceNumber(game['points'])}</points-field>
		<achievement-count-field class="body">{game['achievementCount']}</achievement-count-field>
		<difficulty-field class="body">{game['difficulty']['average']}</difficulty-field>
	{/each}
</game-grid-table>

<style lang="scss">
	game-grid-table {
		display: grid;
		text-align: center;
		grid-template-columns: max-content repeat(6, auto);
		align-items: center;
	}

	.header{
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #9dd9ff;
		padding: .5rem 0;
		height: 2.5rem;
	}

	.body{
		vertical-align: middle;
	}

	name-field.body {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	@media (max-width: 460px) {
		game-grid-table {
			grid-template-columns: repeat(6, auto);

			image-field.header {
				display: none;
			}

			name-field.body {
				display: none;
			}
		}
	}
</style>
