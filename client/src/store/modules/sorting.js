import { writable } from "svelte/store";

export default function () {

  let cycleValues = {
    "-1": 1,
    1: 0,
    0: -1
  }

  let sortDefaultValues = {
    achievementCount: 0,
    difficulty: 0,
    points: 0,
    score: 0,
    trend: 0,
    releaseDate:-1
  }

  const { subscribe, update } = writable(sortDefaultValues)

  return {
    subscribe,
    cycleValue: (type) => update(sortDefaultValues => {
      sortDefaultValues[type] = cycleValues[sortDefaultValues[type]]
      return sortDefaultValues
    })
  }
}