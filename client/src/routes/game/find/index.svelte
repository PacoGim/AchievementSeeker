<script>
	import SearchGameInput from './_components/SearchGameInput.svelte'
	import ListGame from './_components/ListGame.svelte'

	let title = 'Game Search'
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<game-search>
	<SearchGameInput />
	<ListGame/>
</game-search>
