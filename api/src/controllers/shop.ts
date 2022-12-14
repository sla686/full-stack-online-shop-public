import { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import { Request as RequestAuth } from 'express-jwt'
import { Fields, Files, formidable } from 'formidable'
import extend from 'lodash/extend'

import Shop from '../models/Shop'
import ShopService from '../services/shop'
import UserService from '../services/user'
import { BadRequestError } from '../helpers/apiError'

// interface RequestOwner extends Request, Document {
//   shop?: {
//     updated: number
//     image: Buffer
//     owner: {
//       _id: string
//     }
//   }
//   auth?: {
//     _id: string
//   }
// }

const create = async (req: Request, res: Response, next: NextFunction) => {
  const form = formidable({ keepExtensions: true })
  form.parse(req, async (err, fields: Fields, files: Files) => {
    if (err) {
      res.status(400).json({
        message: 'Image could not be uploaded',
      })
    }
    const shop = new Shop(fields)
    try {
      const foundUser = await UserService.findById(req.params.userId)
      shop.owner = foundUser._id
      if (files.image) {
        // console.log(files)
        if (files.image instanceof Array) {
          shop.image = fs.readFileSync(files.image[0].filepath)
          // shop.image.name =
          //   files.image[0].originalFilename || files.image[0].newFilename
          // shop.image.ContentType = files.image[0].type
        } else {
          shop.image = fs.readFileSync(files.image.filepath)
          // shop.image.name =
          //   files.image.originalFilename || files.image.newFilename
          // shop.image.ContentType = files.image.type
        }
      }
      const result = await ShopService.create(shop)
      res.status(200).json(result)
    } catch (error) {
      console.log(error)
      if (error instanceof Error && error.name == 'ValidationError') {
        next(new BadRequestError('Invalid Request', error))
      } else {
        next(error)
      }
    }
  })
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(await ShopService.findAll())
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

const listByOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shops = await ShopService.findByOwner(req.params.userId)
    res.json(shops)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

const readById = async (req: Request, res: Response) => {
  try {
    const shop = await ShopService.findById(req.params.shopId)
    if (!shop)
      return res.status(404).json({
        error: 'Shop not found',
      })
    shop.image = undefined
    return res.json(shop)
  } catch (err) {
    return res.status(400).json({
      error: 'Could not retrieve shop',
    })
  }
}

const isOwner = async (req: RequestAuth, res: Response, next: NextFunction) => {
  const shop = await ShopService.findById(req.params.shopId)
  const isOwner = shop && req.auth && shop.owner._id == req.auth._id
  if (!isOwner) {
    return res.status(403).json({
      error: 'User is not authorized',
    })
  }
  next()
}

const update = async (req: Request, res: Response, next: NextFunction) => {
  const form = formidable({ keepExtensions: true })
  form.parse(req, async (err, fields: Fields, files: Files) => {
    if (err) {
      res.status(400).json({
        message: 'Photo could not be uploaded',
      })
    }
    let shop = await ShopService.findById(req.params.shopId)
    shop = extend(shop, fields)
    shop.updated = Date.now()
    if (files.image) {
      if (files.image instanceof Array) {
        shop.image = fs.readFileSync(files.image[0].filepath)
      } else {
        shop.image = fs.readFileSync(files.image.filepath)
      }
    }
    try {
      res.json(await shop.save())
    } catch (error) {
      if (error instanceof Error && error.name == 'ValidationError') {
        next(new BadRequestError('Invalid Request', error))
      } else {
        console.log(error)
        next(error)
      }
    }
  })
}

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await ShopService.remove(req.params.shopId))
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      console.log(error)
      next(error)
    }
  }
}

const photo = async (req: Request, res: Response, next: NextFunction) => {
  const shop = await ShopService.findById(req.params.shopId)
  // console.log('Shop:', shop)
  if (shop && shop?.image) {
    res.set('Content-Type', 'image/png')
    return res.send(shop.image)
  }
  next()
}

const defaultPhoto = (req: Request, res: Response) => {
  return res.sendFile(process.cwd() + '/src/images/default.png')
}

export default {
  create,
  findAll,
  listByOwner,
  readById,
  isOwner,
  update,
  remove,
  photo,
  defaultPhoto,
}
