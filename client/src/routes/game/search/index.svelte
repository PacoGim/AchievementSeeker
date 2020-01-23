<script>
	import SearchGame from './SearchGame.svelte'

	let title = 'Game Search'
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<game-list>
	<SearchGame />
</game-list>
