import { writable } from "svelte/store";

export default function () {

  let cycleValues = {
    "-1": 1,
    1: 0,
    0: -1
  }

  let sortValues = {
    achievementCount: 0,
    difficulty: 0,
    score: 0,
    trend: -1,
    releaseDate: -1
  }

  const { subscribe, update } = writable(sortValues)

  return {
    subscribe,
    cycleValue: (type) => update(sortValues => {
      console.log('Updating Sorting', type)
      sortValues[type] = cycleValues[sortValues[type]]
      return sortValues
    })
  }
}