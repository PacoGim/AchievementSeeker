import { IAchievement, Achievement } from './AchievementEntity'
import { IDifficulty } from './DifficultyEntity'
import { IReleaseDateSplit } from './ReleaseDateSplitEntity'

export enum Platform {
	WINDOWS = 'windows',
	LINUX = 'linux',
	MAC = 'mac',
	ANY = 'any',
	ALL = 'all',
}

export interface IGame {
	[index: string]: any
	_id: string
	achievementCount: number
	achievements: IAchievement[]
	age: number
	alias?: string[]
	appid: number
	backgrounds: string[]
	createdAt: Date
	developers: string[]
	difficulty: IDifficulty
	genres: string[]
	isFree: boolean
	name: string
	platforms: string[]
	points?: number
	publishers: string[]
	releaseDate: Date
	releaseDateSplit: IReleaseDateSplit
	reviewCount?: number
	score?: number
	trend?: number
	updatedAt: Date
	version: number
	visitCount?: number
}

export class Game {
	[index: string]: any
	private _id: string = ''
	private achievementCount: number = 0
	private achievements: Achievement[] = []
	private age: number = 0
	private alias: string[] = []
	private appid: number = 0
	private backgrounds: string[] = []
	private createdAt: Date = new Date()
	private developers: string[] = []
	private difficulty: IDifficulty = { easy: 0, medium: 0, hard: 0, average: 0 }
	private genres: string[] = []
	private isFree: boolean = false
	private name: string = ''
	private platforms: string[] = []
	private points: number = 0
	private publishers: string[] = []
	private releaseDate: Date = new Date()
	private releaseDateSplit: IReleaseDateSplit = { year: 0, month: 0, day: 0 }
	private reviewCount: number = 0
	private score: number = 0
	private trend: number = 0
	private updatedAt: Date = new Date()
	private version: number = 0
	private visitCount: number = 0

	constructor(init?: Partial<Game>) {
		Object.assign(this, init)
	}

	get_id() {
		return this._id
	}
	set_id(_id: string) {
		this._id = _id
	}

	getAchievementCount() {
		return this.achievementCount
	}
	setAchievementCount(achievementCount: number) {
		this.achievementCount = achievementCount
	}

	getAchievements() {
		return this.achievements
	}
	setAchievements(achievements: Achievement[]) {
		this.achievements = achievements
	}

	getAge() {
		return this.age
	}
	setAge(age: number) {
		this.age = age
	}

	getAlias() {
		return this.alias
	}
	setAlias(alias: string[]) {
		this.alias = alias
	}

	getAppid() {
		return this.appid
	}
	setAppid(appid: number) {
		this.appid = appid
	}

	getBackgrounds() {
		return this.backgrounds
	}
	setBackgrounds(backgrounds: string[]) {
		this.backgrounds = backgrounds
	}

	getCreatedAt() {
		return this.createdAt
	}
	setCreatedAt(createdAt: Date) {
		this.createdAt = createdAt
	}

	getDevelopers() {
		return this.developers
	}
	setDevelopers(developers: string[]) {
		this.developers = developers
	}

	getDifficulty() {
		return this.difficulty
	}
	setDifficulty(difficulty: IDifficulty) {
		this.difficulty = difficulty
	}

	getGenres() {
		return this.genres
	}
	setGenres(genres: string[]) {
		this.genres = genres
	}

	getIsFree() {
		return this.isFree
	}
	setIsFree(isFree: boolean) {
		this.isFree = isFree
	}

	getName() {
		return this.name
	}
	setName(name: string) {
		this.name = name
	}

	getPlatforms() {
		return this.platforms
	}
	setPlatforms(platforms: string[]) {
		this.platforms = platforms
	}

	getPoints() {
		return this.points
	}
	setPoints(points: number) {
		this.points = points
	}

	getPublishers() {
		return this.publishers
	}
	setPublishers(publishers: string[]) {
		this.publishers = publishers
	}

	getReleaseDate() {
		return this.releaseDate
	}
	setReleaseDate(releaseDate: Date) {
		this.releaseDate = releaseDate
	}

	getReleaseDateSplit() {
		return this.releaseDateSplit
	}
	setReleaseDateSplit(releaseDateSplit: IReleaseDateSplit) {
		this.releaseDateSplit = releaseDateSplit
	}

	getReviewCount() {
		return this.reviewCount
	}
	setReviewCount(reviewCount: number) {
		this.reviewCount = reviewCount
	}

	getScore() {
		return this.score
	}
	setScore(score: number) {
		this.score = score
	}

	getTrend() {
		return this.trend
	}
	setTrend(trend: number) {
		this.trend = trend
	}

	getUpdatedAt() {
		return this.updatedAt
	}
	setUpdatedAt(updatedAt: Date) {
		this.updatedAt = updatedAt
	}

	getVersion() {
		return this.version
	}
	setVersion(version: number) {
		this.version = version
	}

	getVisitCount() {
		return this.visitCount
	}
	setVisitCount(visitCount: number) {
		this.visitCount = visitCount
	}
}
