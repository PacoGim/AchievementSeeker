export interface IAchievement {
	_id: number
	name: string
	steamName: string
	description: string
	img: string
	imgGray: string
	value: number
	score: number
	isHidden: boolean
}

export class Achievement {
	private _id: number = 0
	private description: string = ''
	private img: string = ''
	private imgGray: string = ''
	private isHidden: boolean = false
	private name: string = ''
	private score: number = 0
	private steamName: string = ''
	private value: number = 0

	constructor(init?: Partial<Achievement>) {
		Object.assign(this, init)
	}

	get_id() {
		return this._id
	}
	set_id(_id: number) {
		this._id = _id
	}

	getName() {
		return this.name
	}
	setName(name: string) {
		this.name = name
	}

	getSteamName() {
		return this.steamName
	}
	setSteamName(steamName: string) {
		this.steamName = steamName
	}

	getDescription() {
		return this.description
	}
	setDescription(description: string) {
		this.description = description
	}

	getImg() {
		return this.img
	}
	setImg(img: string) {
		this.img = img
	}

	getImgGray() {
		return this.imgGray
	}
	setImgGray(imgGray: string) {
		this.imgGray = imgGray
	}

	getValue() {
		return this.value
	}
	setValue(value: number) {
		this.value = value
	}

	getScore() {
		return this.score
	}
	setScore(score: number) {
		this.score = score
	}

	getIsHidden() {
		return this.isHidden
	}
	setIsHidden(isHidden: boolean) {
		this.isHidden = isHidden
	}
}
