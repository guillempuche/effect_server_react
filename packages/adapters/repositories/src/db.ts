import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as Pg from '@effect/sql-pg'
import dotenv from 'dotenv'
import { Config, String } from 'effect'

// // Load environment variables
// dotenv.config({
// 	path: join(dirname(fileURLToPath(import.meta.url)), '../.env'),
// })

export const SqlLive = Pg.client.layer({
	database: Config.succeed('DB_NAME'),
	host: Config.succeed('DB_HOST'),
	password: Config.secret('DB_PASSWORD'),
	// ssl: Config.succeed(true),
	transformQueryNames: Config.succeed(String.camelToSnake),
	transformResultNames: Config.succeed(String.snakeToCamel),
	username: Config.succeed('DB_USERNAME'),
})

// const program = Effect.gen(function* (_) {
// 	const sql = yield* _(Sql.client.Client)
// const people = yield* _(
// 	sql<{
// 		readonly id: number
// 		readonly name: string
// 	}>`SELECT id, name FROM people`,
// )
// yield* _(Effect.log(`Got ${people.length} results!`))
// })
// pipe(program, Effect.provide(SqlLive), Effect.runPromise)
