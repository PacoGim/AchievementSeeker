import Router from 'koa-router'

import GameCollection from "../db/collections/GameCollection";

const router = new Router({ prefix: '/games' })

router.get('/allGames', async ctx => {
  ctx.body = await GameCollection.get().find({}).project({ name: 1, appid: 1, alias: 1, _id: 1 }).toArray()
})

module.exports = {
  routes: router.routes(),
  allowedMethods: router.allowedMethods(),
}
