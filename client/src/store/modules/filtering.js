import { writable } from "svelte/store";

export default function () {
  let filterDefaultValues = {
    developer: '',
    publisher: '',
    genre: '',
    difficulty: undefined
  }

  const { subscribe, update } = writable(filterDefaultValues)

  return {
    subscribe,
    setDeveloper: (developer) => update(filterDefaultValues => {
      filterDefaultValues['developer'] = developer
      return filterDefaultValues
    }),
    setPublisher: (publisher) => update(filterDefaultValues => {
      filterDefaultValues['publisher'] = publisher
      return filterDefaultValues
    }),
    setGenre: (genre) => update(filterDefaultValues => {
      filterDefaultValues['genre'] = genre
      return filterDefaultValues
    }),
    setDifficulty: (difficulty) => update(filterDefaultValues => {
      filterDefaultValues['difficulty'] = difficulty
      return filterDefaultValues
    })
  }
}