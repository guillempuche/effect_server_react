import { Schema } from '@effect/schema'
import { pipe } from 'effect'
import { Api, ApiGroup } from 'effect-http'

import { Author } from '@journals/core'
import {
	UseCaseAuthorAdd,
	UseCaseAuthorDelete,
	UseCaseAuthorGet,
	UseCaseAuthorUpdate,
} from '@journals/usecases'

// Create an API group for authors
export const apiAuthor = pipe(
	ApiGroup.make('Authors', {
		description: 'Manage authors',
	}),
	ApiGroup.addEndpoint(
		ApiGroup.post('addAuthor', '/author').pipe(
			Api.setRequestBody(UseCaseAuthorAdd),
			Api.setResponseBody(Author),
		),
	),
	ApiGroup.addEndpoint(
		ApiGroup.get('getAuthor', '/author/:id').pipe(
			Api.setRequestQuery(UseCaseAuthorGet),
			Api.setResponseBody(Author),
		),
	),
	ApiGroup.addEndpoint(
		ApiGroup.put('updateAuthor', '/author/:id').pipe(
			Api.setRequestBody(UseCaseAuthorUpdate),
			Api.setResponseBody(Author),
		),
	),
	ApiGroup.addEndpoint(
		ApiGroup.delete('deleteAuthor', '/author/:id').pipe(
			Api.setRequestBody(UseCaseAuthorDelete),
			Api.setResponseBody(Schema.Boolean),
		),
	),
)

export const api = Api.make({ title: "Journals's API" }).pipe(
	Api.addGroup(apiAuthor),
)
