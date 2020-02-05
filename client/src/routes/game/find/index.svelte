<script>
	import SearchGameInput from './SearchGameInput.svelte'
	import ListGame from './ListGame.svelte'

	let title = 'Game Search'
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<game-search>
	<SearchGameInput />
	<ListGame/>
</game-search>
