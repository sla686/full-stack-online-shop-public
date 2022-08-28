import mongoose from 'mongoose'

import Product, { ProductDocument } from '../models/Product'
import { NotFoundError, BadRequestError } from '../helpers/apiError'

const findById = async (productId: string): Promise<ProductDocument> => {
  const foundProduct = await Product.findById({ _id: productId }).populate(
    'shop',
    '_id name'
  )
  if (!foundProduct) {
    throw new NotFoundError(`Product ${productId} not found`)
  }

  return foundProduct
}

const create = async (product: ProductDocument): Promise<ProductDocument> => {
  return await product.save()
}

const findByShop = async (shopId: string): Promise<ProductDocument[]> => {
  return await Product.find({ shop: shopId })
    .populate('shop', '_id name')
    .select('-image')
}

export default { findById, create, findByShop }
