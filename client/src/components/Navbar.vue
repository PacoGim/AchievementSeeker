<template>
  <Navbar>
    <Desktop>
      <router-link to="/" flex="column-dir align-center">
        <img icon="fit-width" src="@/assets/icons/home-outline.svg" />
        <route-name>Home</route-name>
      </router-link>
    </Desktop>
  </Navbar>
</template>

<style lang="scss" scoped>
Navbar {
  Desktop {
    display: block;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.25);
  }
}
</style>