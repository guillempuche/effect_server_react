import { Cause, Console, Effect, Option } from 'effect'

let program = Effect.catchAllDefect(
	Effect.dieMessage('Boom!'), // Simulating a runtime error
	defect => {
		if (Cause.isRuntimeException(defect)) {
			return Console.log(`RuntimeException defect caught: ${defect.message}`)
		}
		return Console.log('Unknown defect caught.')
	},
)

// We get an Exit.Success because we caught all defects
Effect.runPromiseExit(program).then(console.log)
/*
Output:
RuntimeException defect caught: Boom!
{
  _id: "Exit",
  _tag: "Success",
  value: undefined
}
*/

program = Effect.catchSomeDefect(
	Effect.dieMessage('Boom!'), // Simulating a runtime error
	defect => {
		if (Cause.isIllegalArgumentException(defect)) {
			return Option.some(
				Console.log(
					`Caught an IllegalArgumentException defect: ${defect.message}`,
				),
			)
		}
		return Option.none()
	},
)

// Since we are only catching IllegalArgumentException
// we will get an Exit.Failure because we simulated a runtime error.
Effect.runPromiseExit(program).then(console.log)
/*
Output:
{
  _id: "Exit",
  _tag: "Failure",
  cause: {
    _id: "Cause",
    _tag: "Die",
    defect: {
      _tag: "RuntimeException",
      message: "Boom!",
      [Symbol(@effect/io/Cause/errors/RuntimeException)]: Symbol(@effect/io/Cause/errors/RuntimeException),
      toString: [Function: toString]
    }
  }
}
*/
