import * as S from '@effect/schema/Schema'
import { type Brand, pipe } from 'effect'
import { Temporal } from 'temporal-polyfill'

import { v4 as uuid } from 'uuid'
export { uuid }

// export const EntityId = pipe(S.UUID, Brand.Brand<'EntityId'>)
export type EntityId = S.UUID & Brand.Brand<'EntityId'>

/**
 * The semantic version string.
 *
 * Format `"major.minor.path"`, e.g. `"1.2.3"`.
 */
export const Version = S.String.pipe(
	S.pattern(/^\d+\.\d+\.\d+$/), // Ensure "<major>.<minor>.<patch>" and no leading or trailing
)
export type Version = typeof Version.Type
export const VERSION_INITIAL = '1.0.0'

/**
 * An experimental date time.
 *
 * Documentation at https://github.com/fullcalendar/temporal-polyfill.
 *
 * Get inspiration with EffectJS at https://github.com/PREreview/coar-notify/blob/main/src/Temporal.ts (it is `@js-temporal/polyfill` package)
 *
 * @example
 * const date = Temporal.Now.zonedDateTimeISO()
 */
// type Version = string & Brand.Brand<'Version'>
// const Version = Brand.refined<Version>(
// 	str => /^\d+\.\d+\.\d+$/.test(str), // Ensure "<major>.<minor>.<patch>" and no leading or trailing whitespace
// 	str => Brand.error(`Expected "<major>.<minor>.<patch>" but got ${str}`),
// )
export const ZonedDateTime = S.instanceOf(Temporal.ZonedDateTime)

/**
 * To avoid a clash with the JavaScript Date SqliteDate type.
 */
const TemporalString = S.String.pipe(S.brand('TemporalString'))

/**
 * UTC DateTime is stored in ISO 8601 format to ensure datetimes can be sorted
 * and compared lexicographically.
 *
 * Documentation about datetimes in SQLite here https://www.sqlite.org/lang_datefunc.html
 */
export const SqliteDateTime = TemporalString.pipe(S.brand('SqliteDateTime'))
export type SqliteDateTime = S.Schema.Type<typeof SqliteDateTime>

export function castTemporal(value: Temporal.ZonedDateTime): SqliteDateTime {
	// Convert the ZonedDateTime to an ISO 8601 string in UTC
	const isoString = value.toInstant().toString()

	return isoString as SqliteDateTime
}
