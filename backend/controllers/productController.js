const slugify = require('slugify');
const Product = require('../models/Product');

const formatProduct = (product) => ({
  id: product._id,
  name: product.name,
  slug: product.slug,
  description: product.description,
  price: product.price,
  stock: product.stock,
  categoryId: product.categoryId,
  images: product.images,
  isDeleted: product.isDeleted,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

exports.listProducts = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });
    return res.json({ products: products.map(formatProduct) });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load products', error: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
      isDeleted: { $ne: true },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json({ product: formatProduct(product) });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load product', error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock = 0, categoryId, images = [] } = req.body;

    if (!name || typeof price === 'undefined') {
      return res.status(400).json({ message: 'Name and price are required.' });
    }

    const slug = slugify(name, { lower: true, strict: true });
    const product = await Product.create({
      name,
      slug,
      description,
      price,
      stock,
      categoryId: categoryId || undefined,
      images,
    });

    return res.status(201).json({ message: 'Product created', product: formatProduct(product) });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create product', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const nextName = req.body.name ?? product.name;
    product.name = nextName;
    product.slug = slugify(nextName, { lower: true, strict: true });
    product.description = req.body.description ?? product.description;
    product.price = typeof req.body.price !== 'undefined' ? req.body.price : product.price;
    product.stock = typeof req.body.stock !== 'undefined' ? req.body.stock : product.stock;
    product.categoryId = req.body.categoryId ?? product.categoryId;
    product.images = req.body.images ?? product.images;
    product.isDeleted = typeof req.body.isDeleted !== 'undefined' ? req.body.isDeleted : product.isDeleted;

    await product.save();

    return res.json({ message: 'Product updated', product: formatProduct(product) });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update product', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isDeleted = true;
    await product.save();

    return res.json({ message: 'Product removed' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete product', error: error.message });
  }
};
