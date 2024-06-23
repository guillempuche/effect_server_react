import * as S from '@effect/schema/Schema'

import {
	type EntityId,
	VERSION_INITIAL,
	Version,
	ZonedDateTime,
} from './index.js'

// ============================================================================
// Entity
// ============================================================================

// export const SchemaEntity = S.Struct({
// 	id: S.UUID,
// 	version: Version,
// })
// export interface IEntity {
// 	readonly id: EntityId
// 	readonly version: string
// }
export class Entity extends S.Class<Entity>('Entity')({
	// id: S.propertySignature(S.String).pipe(S.fromKey("userId")),
	id: S.UUID,
	version: Version,
}) {}

// ============================================================================
// Metadata
// ============================================================================

// export const SchemaMetadata = S.extend(
// 	S.Struct({
// 		created_by_id: S.UUID,
// 		created_at: ZonedDateTime,
// 		updated_at: S.optional(ZonedDateTime),
// 	}),
// 	SchemaEntity,
// )
// export type Metadata = typeof SchemaMetadata.Type

// export interface IMetadata {
// 	readonly created_by_id: EntityId
// 	readonly created_at: Temporal.ZonedDateTime
// 	readonly updated_at?: Temporal.ZonedDateTime
// }
export class Metadata extends S.Class<Metadata>('Metadata')({
	created_by_id: S.UUID,
	created_at: ZonedDateTime,
	updated_at: S.optional(ZonedDateTime),
}) {}

// ============================================================================
// Author
// ============================================================================

// export const SchemaAuthor = S.extend(
// 	S.Struct({
// 		fullname: S.String,
// 	}),
// 	SchemaMetadata,
// )
// export type Author = typeof SchemaAuthor.Type

// interface IAuthor extends IEntity, IMetadata {
// 	readonly fullname: string
// }
// export class Author extends S.Class<IAuthor>('Author')({
export class Author extends S.Class<Author>('Author')({
	...Entity.fields,
	...Metadata.fields,
	fullname: S.String,
}) {
	// // static encode = S.encode(this)
	// // static encodeArray = S.encode(S.Array(this))
	// static encode = S.encode(this)
	// static encodeArray = S.encode(S.Array(this))
}
// export namespace Author {
// 	export interface AuthorEncoded extends S.Schema.Encoded<typeof Author> {}
// }
// Example of benefits for Class Schema: const returnType = S.decodeUnknown(AuthorDraft)({})

export const AuthorVersions = {
	[VERSION_INITIAL]: VERSION_INITIAL,
} as const
type AuthorVersionsType = keyof typeof AuthorVersions
// const authorVersion: AuthorVersionsType = '1.0.1';

// ============================================================================
// Journal
// ============================================================================

// export const SchemaJournal = S.extend(
// 	S.Struct({
// 		title: S.String,
// 		body: S.String,
// 		status: S.Literal('draft', 'published'),
// 	}),
// 	SchemaMetadata,
// )
// export type Journal = typeof SchemaJournal.Type

// interface IJournal extends IEntity, IMetadata {
// 	readonly title: string
// 	readonly body: string
// 	readonly status: 'draft' | 'published'
// }
export class Journal extends S.Class<Journal>('Journal')({
	...Entity.fields,
	...Metadata.fields,
	created_at: ZonedDateTime,
	title: S.String,
	body: S.String,
	status: S.Literal('draft', 'published'),
}) {}

// ============================================================================
// Editor
// ============================================================================

// export const SchemaEditor = S.Struct({
// 	// Journal related
// 	journal: S.optional(S.String),
// 	journal_id: S.optional(S.UUID), // Used when an existing journal is being edited

// 	// Author related
// 	author_id: S.optional(S.UUID), // Used when an existing author is being edited
// 	fullname: S.optional(S.String),
// })
// export type Editor = typeof SchemaEditor.Type

interface IEditor {
	readonly journal?: string
	readonly journal_id?: EntityId
	readonly author_id?: EntityId
	readonly fullname?: string
}
export class Editor extends S.Class<IEditor>('Editor')({
	// journal: S.OptionFromNullOr(S.String),
	journal: S.optional(S.String),
	journal_id: S.optional(S.UUID),
	author_id: S.optional(S.UUID),
	fullname: S.optional(S.String),
}) {}
