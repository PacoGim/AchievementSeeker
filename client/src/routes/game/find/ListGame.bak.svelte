<script>
	import { onMount } from 'svelte'

	import GameImage from '../../../components/Base/GameImage.svelte'

	import { parseDate } from '../../../services/helper.service.js'

	let games = []

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
		fetch(`http://localhost:3000/api?query=${query}`)
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

<table>
	<thead text="weight-6">
		<tr>
			<th />
			<th class="nameHeader">Name</th>
			<th>Release Date</th>
			<th>Score</th>
			<th>Points</th>
			<th>Achievements</th>
			<th>Difficulty</th>
		</tr>
	</thead>
	<tbody>
		{#each games as game, index (index)}
			<tr>
				<td class="imageField">
					<GameImage appid={game['appid']} imageType="smallCapsule" />
				</td>
				<td class="nameField">{game['name']}</td>
				<td class="releaseDateField">{parseDate(game['releaseDate'])}</td>
				<td class="scoreField">{game['score']}</td>
				<td class="pointsField">{reduceNumber(game['points'])}</td>
				<td class="achievementCountField">{game['achievementCount']}</td>
				<td class="difficultyField">{game['difficulty']['average']}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style lang="scss">
	table {
		width: 100%;
		white-space: nowrap;
		text-align: center;
		table-layout: fixed;

		thead tr th {
			width: 20%;

			&.nameHeader {
				width: 100%;
			}
		}

		td {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.nameField {
			max-width: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.difficultyField {
			width: 10px;
		}
	}

	@media (max-width: 480px) {
		table {
			// display: none;
		}
	}
</style>
