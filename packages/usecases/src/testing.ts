import { Context, Effect } from 'effect'

interface MathService {
	a: number
	add: (b: number) => Effect.Effect<number>
}

export class Math extends Context.Tag('Math')<Math, MathService>() {}

export function add(b: number) {
	return Effect.gen(function* () {
		const { a } = yield* Math //  I know that this will never work

		return a + b
	})
}

const program = Effect.gen(function* () {
	const { add } = yield* Math

	return add(3)
})

Effect.provideService(program, Math, { a: 2, add })
