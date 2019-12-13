<script>
	import { onMount } from 'svelte'
	import BaseGameImage from 'components/base/BaseGameImage.svelte'

	import { parseDate } from 'services/helper.service.js'

	export let game
</script>

<a class="game" href="/game/{game['_id']}" title={game['name']} shadow>

	<BaseGameImage margin="r-0" gameId={game['_id']} appid={game['appid']} imageType="header" styleClass="game-list-image" />

	<name text="weight-6 biscay">{game['name']}</name>

	{#if game['isFree'] === true}
		<is-free flex="align-center" text="white size-0 weight-7" margin="xy-0" padding="x-0">Free</is-free>
	{/if}

	<platforms margin="r-0" flex="direction-row align-center">
		{#each game['platforms'] as platfom, index (index)}
			<img class="icon" margin="r-0" icon="size-base {platfom === 'windows' ? 'blue' : 'biscay'}" src="icons/{platfom}.svg" alt="" />
		{/each}
	</platforms>

	<release-date text="weight-3 size-0 waikawa-grey">Released the {parseDate(game['releaseDate'])}</release-date>

	<achievement-count bg={game['achievementCount'] >= 15 ? 'blue' : 'waikawa-grey'} padding="xy-0 r-1" flex="direction-row align-center">
		<icon margin="r-0" grid="overlap align-center justify-center ">
			<img class="icon" text="blue weight-5 size-1" icon="{game['achievementCount'] >= 15 ? 'blue' : 'waikawa-grey'} size-base" src="icons/trophy.svg" alt="Trophies: " />
			<circle-bg shadow padding="xy-1" />
		</icon>
		<count text="waikawa-grey size-1 weight-6">{game['achievementCount']}</count>
	</achievement-count>

	<!-- <difficulty>{game['difficulty']['average']}%</difficulty> -->

	<score text="waikawa-grey size-1" margin="r-0">
		Score:
		<span text="white weight-8 size-0" padding="x-0">{Math.round(game['score'])}</span>
	</score>

	<genres padding="xy-0" text="waikawa-grey weight-3 size-1">
		{#each game['genres'] as genre, index (index)}
			<genre>{genre['type']}</genre>
		{/each}
	</genres>

</a>

<style lang="scss">
	.game {
		margin-bottom: 1rem;
		background-color: #f8f8f8;
		display: grid;

		grid-template-columns: min-content minmax(20px, 1fr) max-content max-content;
		grid-template-rows: min-content min-content;
		text-decoration: none;

		border-radius: 5.5px 5px 5px 5px;

		name {
			grid-column: 2;
			grid-row: 1;

			align-self: center;

			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
		}

		is-free {
			// background-color: var(--biscay);
			background-color: rgb(22, 180, 62);
			border-radius: 50px;
			grid-column: 3;
			grid-row: 1;
		}

		platforms {
			grid-column: 4;
			grid-row: 1;
		}

		release-date {
			grid-column: 2 / span 3;
			grid-row: 2;

			align-self: center;
		}

		achievement-count {
			width: max-content;
			grid-column: 2;
			grid-row: 3;
			// background-color: var(--blue);
			border-radius: 50px;

			icon {
				img {
					justify-self: center;
				}

				circle-bg {
					border-radius: 50px;
					background-color: #fff;
				}
			}

			count {
				color: #fff;
			}
		}

		difficulty {
			grid-column: 4;
			grid-row: 3;
		}

		score {
			grid-column: 3 / span 2;
			grid-row: 3;

			span {
				background-color: var(--waikawa-grey);
				border-radius: 50px;
			}
		}

		genres {
			grid-column: 1 / span 4;
			grid-row: 4;

			genre {
				&::after {
					content: ', ';
				}

				&:last-child::after {
					content: '';
				}
			}
		}
	}
</style>
