// https://medium.com/@hmufraggi/effect-typescript-database-migration-804d71fb8564

import * as Sql from '@effect/sql-pg'
import { Effect } from 'effect'

export default Effect.flatMap(
	Sql.client.PgClient,
	sql => sql`
  ADD YOUR SQL SCRIPT
`,
)
