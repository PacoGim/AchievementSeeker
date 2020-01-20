<style>
  bg {
    display: block;
    position: absolute;
    top: 0;
    box-shadow: 0 0 5px 2.5px rgba(0, 0, 0, 0.25);
    /* transition-property: background-color, transform, opacity,min-height; */
    /* transition-duration: 1s; */
    /* transition-timing-function: cubic-bezier(0, 0, 0, 1.75); */
  }

  bg[num="1"] {
    min-height: var(--fancy-bg-height-1);
    min-width: var(--fancy-bg-width-1);
    background-color: var(--fancy-bg-color-1);
    transform: var(--fancy-bg-transform-1);
    opacity: var(--fancy-bg-opacity);
    z-index: -1;
  }

  bg[num="2"] {
    min-height: var(--fancy-bg-height-2);
    min-width: var(--fancy-bg-width-2);
    background-color: var(--fancy-bg-color-2);
    transform: var(--fancy-bg-transform-2);
    opacity: var(--fancy-bg-opacity);
    z-index: -2;
  }
</style>

<fancy-bg>
  <bg num="1" />
  <bg num="2" />
</fancy-bg>
