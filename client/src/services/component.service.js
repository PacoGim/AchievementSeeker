export 	function toggleFilters(achievements,filters) {
  achievements.forEach((ach) => {
    let hideAch = false
    let achStyles = document.querySelector(`achievement#ach-${ach['_id']}`).style

    if (filters.includes('hideAchieved') && ach['isAchieved'] === true) hideAch = true
    if (filters.includes('hideDLC') && ach['isDLC'] === true) hideAch = true

    if (hideAch === true) {
      achStyles.position = 'fixed'
      achStyles.visibility = 'hidden'
    } else {
      achStyles.position = ''
      achStyles.visibility = ''
    }
  })
}