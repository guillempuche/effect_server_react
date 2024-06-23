import { Effect, Layer } from 'effect'

import { RepoAuthor } from '@journals/adapters/repositories'
import {
	LiveRouteAuthorAddAuthor,
	LiveRouteAuthorDeleteAuthor,
	LiveRouteAuthorGetAuthor,
	LiveRouteAuthorUpdateAuthor,
} from './express_author.routes.js'
import { Express, LiveServer } from './express_server.js'

const LiveMain = LiveServer.pipe(
	Layer.merge(LiveRouteAuthorAddAuthor),
	Layer.merge(LiveRouteAuthorDeleteAuthor),
	Layer.merge(LiveRouteAuthorGetAuthor),
	Layer.merge(LiveRouteAuthorUpdateAuthor),
	Layer.provide(Express.live),
	Layer.provide(RepoAuthor.Live),
)

Layer.launch(LiveMain).pipe(
	Effect.tapErrorCause(Effect.logError),
	Effect.runFork,
)
