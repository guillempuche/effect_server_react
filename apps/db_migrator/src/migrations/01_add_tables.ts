// https://medium.com/@hmufraggi/effect-typescript-database-migration-804d71fb8564

import * as Sql from '@effect/sql-pg'
import { Effect } from 'effect'

export default Effect.flatMap(
	Sql.client.PgClient,
	sql => sql`
    CREATE TABLE tasks (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      task_name VARCHAR(255) NOT NULL,
      task_description TEXT,
      status VARCHAR(50) DEFAULT 'Todo',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `,
)
