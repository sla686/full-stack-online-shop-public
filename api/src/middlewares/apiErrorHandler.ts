import { Request, Response, NextFunction } from 'express'

import ApiError from '../helpers/apiError'
import logger from '../util/logger'

export default function (
  error: ApiError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  if (error.source) {
    logger.error(error.source)
  }

  res.status(error.statusCode).json({
    status: error.name,
    statusCode: error.statusCode,
    message: error.message,
    error: error.source?.message.startsWith('User validation failed')
      ? error.source?.message.slice(24).replace(/^\w/, (c) => c.toUpperCase())
      : error.source?.message,
  })
}
