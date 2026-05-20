import mongoose from 'mongoose'
import Product from '../models/Product.js'
import Wishlist from '../models/Wishlist.js'

function formatWishlistItem(item) {
  const product = item.product

  return {
    id: item._id,
    wishlist_id: item._id,
    added_at: item.createdAt,
    product: {
      id: product._id,
      name: product.name,
      price: product.price,
      images: product.images,
      stock_status: product.stock > 0 ? 'in_stock' : 'out_of_stock',
      slug: product.slug
    }
  }
}

export async function listWishlist(req, res) {
  const wishlistItems = await Wishlist.find({ user: req.user.id }).populate('product')
  const items = wishlistItems.filter((item) => item.product).map(formatWishlistItem)

  return res.json({ items })
}

export async function addWishlistItem(req, res) {
  const { product_id } = req.body

  if (!product_id || !mongoose.isValidObjectId(product_id)) {
    return res.status(400).json({ message: 'product_id is required' })
  }

  const product = await Product.findOne({ _id: product_id, is_deleted: false })

  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }

  const existingWishlistItem = await Wishlist.findOne({ user: req.user.id, product: product._id })

  if (existingWishlistItem) {
    return res.status(409).json({ message: 'Already in wishlist' })
  }

  const wishlistItem = await Wishlist.create({
    user: req.user.id,
    product: product._id
  })

  await wishlistItem.populate('product')

  return res.status(201).json(formatWishlistItem(wishlistItem))
}

export async function removeWishlistItem(req, res) {
  const { productId } = req.params

  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: 'Invalid product id' })
  }

  const wishlistItem = await Wishlist.findOne({ user: req.user.id, product: productId })

  if (!wishlistItem) {
    return res.status(404).json({ message: 'Wishlist item not found' })
  }

  await wishlistItem.deleteOne()

  return res.json({ message: 'Wishlist item removed successfully' })
}