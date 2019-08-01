<style>
  bg {
    display: block;
    height: 50vh;
    width: 100vw;
    position: absolute;
    top: 0;
    box-shadow: 0 0 5px 2.5px rgba(0, 0, 0, 0.25);
    transition: background-color 1s, transform 1s;
  }

  bg[num="1"] {
    position: relative;
    transform: var(--transform-1);
    z-index: -1;
  }

  bg[num="1"] color {
    position: absolute;
    z-index: 1;
    background-color: var(--fancy-bg-color-1);
    display: block;
    height: 100%;
    width: 100%;
  }

  bg[num="1"] img {
    mix-blend-mode: multiply;
    position: absolute;
    transform: skewY(5deg) translateY(0px);
    z-index: 2;
  }

  bg[num="2"] {
    transform: var(--transform-2);
    z-index: -2;
  }
  bg[num="2"] color {
    background-color: var(--fancy-bg-color-2);
    position: absolute;
  }

  bg[num="2"] img {
    display: block;
    position: absolute;
    transform: skewY(-15deg) translateY(0px);
    object-fit: fill;
  }
</style>

<fancy-bg>
  <bg num="1">
    <img
      src="https://steamcdn-a.akamaihd.net/steam/apps/268910/ss_615455299355eaf552c638c7ea5b24a8b46e02dd.jpg?t=1555602930"
      alt="" />
    <color />
  </bg>
  <bg num="2">
    <img
      src="https://steamcdn-a.akamaihd.net/steam/apps/268910/ss_ae3db08c403209d868e52ae513540e1ba0489302.jpg?t=1555602930"
      alt="" />
    <color />
  </bg>
</fancy-bg>
