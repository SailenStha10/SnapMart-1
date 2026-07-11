import Product from "../models/Product.js";
import Category from "../models/Category.js";
import slugify from "slugify";
import { isDatabaseConnected } from "../../config/db.js";
import { getFallbackProducts, getFallbackCategories } from "../utils/fallbackData.js";

export const createProduct = async (req, res) => {

  if (req.body.price <= 0) {
    return res.status(400).json({
      message: "Price must be greater than 0"
    });
  }

  const baseSlug = slugify(req.body.name, {
    lower: true
  });

  let slug = baseSlug;
  let count = 2;

  while (await Product.findOne({ slug })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  const product = await Product.create({
    ...req.body,
    slug
  });

  res.status(201).json(product);
};

export const getProducts = async (req, res) => {
  if (!isDatabaseConnected()) {
    const products = getFallbackProducts();
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

    let filteredProducts = [...products];

    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm)
      );
    }

    if (category) {
      filteredProducts = filteredProducts.filter((product) => {
        const categoryId = typeof product.category_id === 'string' ? product.category_id : product.category_id?._id;
        return categoryId === category || product.categorySlug === category;
      });
    }

    if (minPrice) {
      filteredProducts = filteredProducts.filter((product) => product.price >= Number(minPrice));
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter((product) => product.price <= Number(maxPrice));
    }

    if (sort === 'price_asc') {
      filteredProducts.sort((a, b) => a.price - b.price);
    }

    if (sort === 'price_desc') {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    if (sort === 'newest') {
      filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const start = (pageNumber - 1) * limitNumber;
    const end = start + limitNumber;

    return res.json({
      products: filteredProducts.slice(start, end),
      total: filteredProducts.length,
      page: pageNumber,
      totalPages: Math.ceil(filteredProducts.length / limitNumber) || 1,
    });
  }

  let {
    search,
    category,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 12
  } = req.query;

  let query = {
    is_deleted: false
  };

  // SEARCH
  if (search) {
    query.$or = [
      {
        name: {
          $regex: search,
          $options: "i"
        }
      },
      {
        description: {
          $regex: search,
          $options: "i"
        }
      }
    ];
  }

  // CATEGORY FILTER
  if (category) {
    const cat = await Category.findOne({
      slug: category
    });

    if (cat) {
      query.category_id = cat._id;
    }
  }

  // PRICE FILTER
  if (minPrice || maxPrice) {
    query.price = {};

    if (minPrice) {
      query.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      query.price.$lte = Number(maxPrice);
    }
  }

  // SORT
  let sortOption = {};

  if (sort === "price_asc") {
    sortOption.price = 1;
  }

  if (sort === "price_desc") {
    sortOption.price = -1;
  }

  if (sort === "newest") {
    sortOption.createdAt = -1;
  }

  const products = await Product.find(query)
    .populate("category_id")
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Product.countDocuments(query);

  res.json({
    products,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit)
  });
};

export const getProductBySlug = async (req, res) => {
  if (!isDatabaseConnected()) {
    const product = getFallbackProducts().find((item) => item.slug === req.params.slug);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  }

  const product = await Product.findOne({
    slug: req.params.slug,
    is_deleted: false
  }).populate("category_id");

  if (!product) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  res.json(product);
};

export const updateProduct = async (req, res) => {

  if (req.body.name) {
    const baseSlug = slugify(req.body.name, { lower: true });

    let slug = baseSlug;
    let count = 2;

    // ensure unique slug excluding current product
    while (await Product.findOne({ slug, _id: { $ne: req.params.id } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    req.body.slug = slug;
  }

  if (req.body.price !== undefined && req.body.price <= 0) {
    return res.status(400).json({ message: "Price must be greater than 0" });
  }

  if (req.body.stock !== undefined && req.body.stock < 0) {
    return res.status(400).json({ message: "Stock cannot be negative" });
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(product);
};

export const deleteProduct = async (req, res) => {

  await Product.findByIdAndUpdate(
    req.params.id,
    {
      is_deleted: true
    }
  );

  res.json({
    message: "Product soft deleted"
  });
};