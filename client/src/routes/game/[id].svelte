<script context="module">
	export async function preload({ host, path, query, params }, session) {
		return { id: params['id'] }
	}
</script>

<script>
	import { dynamicPageName } from '../../store/main.store.js'
	import { onMount } from 'svelte'

	import FetchService from '../../services/fetch.service.js'
	import GraphQLService from '../../services/graphql.service.js'

	export let id
	let title

	onMount(() => {
		FetchService.get(`api?query=${GraphQLService.buildQuery(`gameById(id:"${id}")`, ['_id', 'name'])}`).then(response => {
      const data = response['data']['gameById']
      console.log(data)
			title = data['name']
			$dynamicPageName = data['name']
		})
	})
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>
