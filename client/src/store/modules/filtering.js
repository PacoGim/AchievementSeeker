import { writable } from "svelte/store";

export default function () {
  let filterValues = {
    developer: '',
    publisher: '',
    genre: '',
    difficulty: undefined,
    isFree: undefined,
    platform: 'ANY',
  }

  const { subscribe, update } = writable(filterValues)

  return {
    subscribe,
    setDeveloper: (developer) => update(filterValues => {
      filterValues['developer'] = developer
      return filterValues
    }),
    setPublisher: (publisher) => update(filterValues => {
      filterValues['publisher'] = publisher
      return filterValues
    }),
    setGenre: (genre) => update(filterValues => {
      filterValues['genre'] = genre
      return filterValues
    }),
    setDifficulty: (difficulty) => update(filterValues => {
      filterValues['difficulty'] = difficulty
      return filterValues
    }),
    setPlatform: (platform) => update(filterValues => {
      filterValues['platform'] = platform
      return filterValues
    }),
    cycleIsFree: () => update(filterValues => {
      switch (filterValues['isFree']) {
        case undefined:
          filterValues['isFree'] = 'true'
          break
        case 'true':
          filterValues['isFree'] = 'false'
          break
        case 'false':
          filterValues['isFree'] = undefined
          break
      }

      console.log(filterValues['isFree'])

      return filterValues
    })
  }
}