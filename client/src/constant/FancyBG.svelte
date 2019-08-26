<style>
  bg {
    display: block;
    height: 50vh;
    width: 100vw;
    position: absolute;
    top: 0;
    box-shadow: 0 0 5px 2.5px rgba(0, 0, 0, 0.25);
    transition: background-color 1s, transform 1s, opacity 1s;
  }

  bg[num="1"] {
    background-color: var(--fancy-bg-color-1);
    transform: var(--transform-1);
    opacity: var(--fancy-bg-opacity);
    z-index: -1;
  }

  bg[num="2"] {
    background-color: var(--fancy-bg-color-2);
    transform: var(--transform-2);
    opacity: var(--fancy-bg-opacity);
    z-index: -2;
  }
</style>

<fancy-bg>
  <bg num="1" />
  <bg num="2" />
</fancy-bg>
