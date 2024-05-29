import { Effect, Layer, LogLevel, Logger, pipe } from 'effect'
import { ServerError } from 'effect-http'
import { PrettyLogger } from 'effect-log'

export const appError = (message: string) =>
	Effect.mapError((e: Error) =>
		ServerError.makeJson(500, {
			message,
			details: e.message,
		}),
	)

export const loggerDebug = pipe(
	PrettyLogger.layer(),
	Layer.merge(Logger.minimumLogLevel(LogLevel.All)),
)
