import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateCartResponse, normalizeQuantity, validateStockForCart, mergeCartItem } from './cartHelpers.js'

test('validateStockForCart rejects out-of-stock products', () => {
  assert.throws(() => validateStockForCart({ stock: 0 }, 1), /out of stock/i)
})

test('validateStockForCart rejects quantities beyond available stock', () => {
  assert.throws(() => validateStockForCart({ stock: 2 }, 3), /Not enough stock/i)
})

test('mergeCartItem increments quantity for duplicates', () => {
  const items = [{ product: 'prod-1', quantity: 1 }]
  const result = mergeCartItem(items, 'prod-1', 2)
  assert.equal(result.items[0].quantity, 3)
})

test('calculateCartResponse adds subtotals', () => {
  const cart = {
    items: [
      { product: { price: 100 }, quantity: 2 },
      { product: { price: 50 }, quantity: 1 },
    ],
  }

  const response = calculateCartResponse(cart)
  assert.deepEqual(response.items.map((item) => item.subtotal), [200, 50])
  assert.equal(response.total, 250)
})

test('normalizeQuantity defaults to 1 for missing or invalid values', () => {
  assert.equal(normalizeQuantity(undefined), 1)
  assert.equal(normalizeQuantity(0), 1)
})
