<image-placeholder />

<style>
	image-placeholder {
		display: inline-block;

		width: 4rem;
		height: 4rem;
		max-width: 4rem;
		max-height: 4rem;
		min-width: 3rem;
		min-height: 3rem;

		grid-area: 1 / 1 / span 2 / 1;

		animation: opacityInOut infinite 2s ease-in-out;
	}

	@keyframes opacityInOut {
		0% {
			opacity: 1;
			background-image: linear-gradient(to left, #fff, #c6c6c6);
		}
		25% {
			opacity: 0;
		}
		50%{
			opacity: 1;
			background-image: linear-gradient(to left, #c6c6c6, #fff);
		}
		75%{
			opacity: 0;
		}
		100% {
			opacity: 1;
			background-image: linear-gradient(to left, #fff, #c6c6c6);
		}
	}
</style>
