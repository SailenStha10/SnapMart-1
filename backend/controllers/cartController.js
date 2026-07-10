const Cart = require('../models/Cart');
const Product = require('../models/Product');

const populateCart = async (cart) => {
  const items = await Promise.all(
    (cart?.items || []).map(async (item) => {
      const product = await Product.findById(item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        product: product
          ? {
              id: product._id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              stock: product.stock,
              images: product.images,
            }
          : null,
      };
    })
  );

  return {
    items,
    updatedAt: cart?.updatedAt || null,
  };
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    return res.json({ cart: await populateCart(cart) });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load cart', error: error.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Product and quantity are required.' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        items: [{ productId, quantity }],
      });
    } else {
      const existingItem = cart.items.find((item) => item.productId.toString() === productId);
      if (existingItem) {
        existingItem.quantity = quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      await cart.save();
    }

    return res.json({
      message: 'Cart updated',
      cart: await populateCart(cart),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update cart', error: error.message });
  }
};
