import { fileURLToPath } from 'node:url'
import { NodeContext, NodeRuntime } from '@effect/platform-node'
import * as Sql from '@effect/sql-pg'
import { Effect, Layer, pipe } from 'effect'

import { SqlLive } from '@journals/adapters/repositories'

const program = Effect.gen(function* (_) {})

const MigratorLive = Sql.migrator
	.layer({
		loader: Sql.migrator.fromFileSystem(
			fileURLToPath(new URL('migrations', import.meta.url)),
		),
		schemaDirectory: 'migrations',
	})
	.pipe(Layer.provide(SqlLive))
const EnvLive = Layer.mergeAll(SqlLive, MigratorLive).pipe(
	Layer.provide(NodeContext.layer),
)
pipe(program, Effect.provide(EnvLive), NodeRuntime.runMain)
