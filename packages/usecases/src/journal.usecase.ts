import * as S from '@effect/schema/Schema'

import { Journal } from '@journals/core'

// Create
export const JournalCreateParams = Journal.pipe(
	S.omit('id', 'created_at', 'updated_at', 'version'),
)
export type JournalCreateParams = typeof JournalCreateParams.Type

// Update
export const JournalUpdateParams = S.partial(Journal, { exact: true }).pipe(
	S.omit('id', 'created_at'),
)
export type JournalUpdateParams = typeof JournalUpdateParams.Type
