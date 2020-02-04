<script>
	import SearchGame from './SearchGame.svelte'
	import ListGame from './ListGame.svelte'

	let title = 'Game Search'
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<game-list>
	<SearchGame />
	<ListGame/>
</game-list>
