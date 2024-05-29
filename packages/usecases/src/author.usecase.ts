import * as S from '@effect/schema/Schema'

import { Author } from '@journals/core'

// Add
export const UseCaseAuthorAdd = Author.pipe(
	S.omit('id', 'created_at', 'updated_at', 'version'),
)
export type UseCaseAuthorAdd = typeof UseCaseAuthorAdd.Type
// export type UseCaseAuthorAdd = S.Schema.Type<typeof UseCaseAuthorAdd>

// Delete
export const UseCaseAuthorDelete = S.UUID
export type UseCaseAuthorDelete = typeof UseCaseAuthorDelete.Type

// Get
export const UseCaseAuthorGet = S.UUID
export type UseCaseAuthorGet = typeof UseCaseAuthorDelete.Type

// Update
// export const UseCaseAuthorUpdate = S.partial(Author, { exact: true }).pipe(
// 	S.omit('created_at', 'created_by_id'),
// )
export const UseCaseAuthorUpdate = Author.pipe(
	S.omit('created_at', 'created_by_id'),
)
export type UseCaseAuthorUpdate = typeof UseCaseAuthorUpdate.Type
