<image-placeholder />

<style>
	image-placeholder {
		display: inline-block;
		background: linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.5));
		width: 4rem;
		height: 4rem;
		max-width: 4rem;
		max-height: 4rem;
		min-width: 3rem;
		min-height: 3rem;

		grid-area: 1 / 1 / span 2 / 1;

		animation: rotate infinite 1s cubic-bezier(0, 0, 0, 1.5);
	}

	@keyframes rotate {
		0% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(0.8);
			opacity: 0.7;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
