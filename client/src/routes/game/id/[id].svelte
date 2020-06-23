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
				'achievements.value': 1,
				'achievements.isDLC': 1
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
	import { onMount } from 'svelte'

	import FetchService from '@/services/fetch.service.js'

	import GameCard from '@/components/game/id/GameCard.svelte'
	import GameAchievements from '@/components/game/id/GameAchievements.svelte'

	export let game
	export let achievementsValues

	let title

	onMount(async () => {
		$dynamicPageName = game['name']
		title = game['name']
	})
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<game-page flex="direction-row">

	<GameCard name={game['name']} developers={game['developers']} publishers={game['publishers']} appid={game['appid']} score={game['score']} releaseDate={game['releaseDate']} platforms={game['platforms']} genres={game['genres']} points={game['points']} visitCount={game['visitCount']} />
	<GameAchievements _id={game['_id']} achievements={game['achievements']} name={game['name']} {achievementsValues} />

</game-page>

<style lang="scss">
game-page{
	max-width: 1080px;
}
</style>
