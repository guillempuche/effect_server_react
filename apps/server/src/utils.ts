import { Effect, Layer, LogLevel, Logger, pipe } from 'effect'
import { HttpError } from 'effect-http'
import { PrettyLogger } from 'effect-log'

export const appError = (message: string) =>
	Effect.mapError((e: Error) =>
		HttpError.make(500, {
			message,
			details: e.message,
		}),
	)

export const loggerDebug = pipe(
	PrettyLogger.layer(),
	Layer.merge(Logger.minimumLogLevel(LogLevel.All)),
)
