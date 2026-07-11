export const normalizeQuantity = (quantity = 1) => {
  const parsedQuantity = Number(quantity)

  if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
    return 1
  }

  return Math.floor(parsedQuantity)
}

export const validateStockForCart = (product, requestedQuantity = 1) => {
  if (!product) {
    throw new Error('Product not found')
  }

  const normalizedQuantity = normalizeQuantity(requestedQuantity)

  if (!product.stock || product.stock <= 0) {
    throw new Error('Product is out of stock')
  }

  if (normalizedQuantity > product.stock) {
    throw new Error('Not enough stock')
  }

  return normalizedQuantity
}

export const mergeCartItem = (items, productId, quantity = 1) => {
  const normalizedQuantity = normalizeQuantity(quantity)
  const existingItemIndex = items.findIndex((item) => String(item.product) === String(productId))

  if (existingItemIndex > -1) {
    items[existingItemIndex].quantity += normalizedQuantity
    return { items, existingItemIndex }
  }

  items.push({ product: productId, quantity: normalizedQuantity })
  return { items, existingItemIndex: items.length - 1 }
}

export const calculateCartResponse = (cart) => {
  const cartObject = cart.toObject ? cart.toObject() : { ...cart }

  cartObject.items = (cartObject.items || []).map((item) => {
    const product = item.product && typeof item.product === 'object' ? item.product : null
    const price = product && typeof product.price === 'number' ? product.price : 0

    return {
      ...item,
      subtotal: price * (item.quantity || 0),
    }
  })

  cartObject.total = cartObject.items.reduce((sum, item) => sum + item.subtotal, 0)

  return cartObject
}
