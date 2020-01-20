<script>
	import { onMount } from 'svelte'

	import { isWebpSupported } from 'services/helper.service.js'
	import { fetchImage } from 'services/fetch.service.js'

	export let achievement
	// export let gameName;
	// export let gameId
	// export let appid
	export let index
	let imgUrl = ''

	onMount(async () => {
		// setTimeout(async () => {
		//   isWebpSupported().then(async isSupported => {
		//     if (isSupported) {
		//       imgUrl = await fetchImage(
		//         `http://localhost:4000/image/achievement/${gameId}/${achievement["_id"]}`
		//       );
		//     } else {
		//       imgUrl = `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/${appid}/${achievement["img"]}`;
		//     }
		//   });
		// }, index * 50);
	})
</script>

<achievement id={achievement._id} flex="direction-row align-center">
	<index>{index}</index>
	<name>{achievement.name}</name>
	<imeru grid="overlap">
		<placeholder />
		<img value={achievement['value']} onload="this.setAttribute('loaded','true')" src={imgUrl} alt="" />
	</imeru>
</achievement>

<style>
	achievement {
		/* color: black; */
		background-color: rgba(0, 0, 0, 0.5);
	}
	/*
  picture {
    transition: opacity 1s;
  }

  achievement image {
    display: block;
    position: relative;
    height: 64px;
    width: 64px;
  }

  achievement image placeholder {
    display: block;
    background-color: #fff;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  achievement image img {
    z-index: 1;
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
  } */

	/* achievement image {
    display: inline-block;
    position: relative;
    height: 64px;
    width: 64px;
  }

  achievement image loading {
    height: 100%;
    width: 100%;
    position: absolute;
    background-color: #fff;
    top: 0;
    left: 0;
  }

  achievement image picture {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  } */

	imeru {
		height: 64px;
		width: 64px;
	}

	placeholder {
		background-color: #fff;
		height: 100%;
		width: 100%;
		border: #333 2px solid;
	}

	imeru img {
		height: 100%;
		width: 100%;
		border: transparent 2px solid;
	}
	imeru img[value='0'] {
		border-color: #bd5c0e;
	}
	imeru img[value='1'] {
		border-color: #a2b6b8;
	}

	imeru img[value='2'] {
		border-color: #ffa601;
	}

	imeru img[value='3'] {
		border-color: #bd5c0e;
	}

	imeru img[value='4'] {
		border-color: #100e75;
	}

	img {
		transform: scale(0) rotateZ(360deg);
		transition: transform 0.75s cubic-bezier(0, 0, 0, 1.5);
	}
</style>
