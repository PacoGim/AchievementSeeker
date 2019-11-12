import Router from 'koa-router'

import GameCollection from "../db/collections/GameCollection";

import { setCacheUrl } from "../url-cache";

const router = new Router({ prefix: '/games' })

router.get('/allGames', async ctx => {
  ctx.body = await GameCollection.get().find({}).project({ name: 1, appid: 1, alias: 1, _id: 1 }).toArray()
  setCacheUrl(ctx)
})

router.get('/genres', async ctx => {
  ctx.body = await GameCollection.get().distinct('genres')
  setCacheUrl(ctx)
})

router.get('/publishers', async ctx => {
  ctx.body = await GameCollection.get().distinct('publishers')
  setCacheUrl(ctx)
})

router.get('/developers', async ctx => {
  ctx.body = await GameCollection.get().distinct('developers')
  setCacheUrl(ctx)
})

module.exports = {
  routes: router.routes(),
  allowedMethods: router.allowedMethods(),
}
