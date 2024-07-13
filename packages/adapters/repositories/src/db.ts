import * as Pg from '@effect/sql-pg'
import { Config, String } from 'effect'

const ConfigSQL = Config.all({
	database: Config.succeed('DB_NAME'),
	host: Config.succeed('DB_HOST'),
	password: Config.redacted('DB_PASSWORD'),
	transformQueryNames: Config.succeed(String.camelToSnake),
	transformResultNames: Config.succeed(String.snakeToCamel),
	username: Config.succeed('DB_USERNAME'),
})

export const ServiceSqlBase = Pg.PgClient.layer(ConfigSQL)
