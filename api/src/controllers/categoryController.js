import Category from "../models/Category.js";
import Product from "../models/Product.js";
import slugify from "slugify";

export const createCategory = async (req, res) => {
  const slug = slugify(req.body.name, { lower: true });

  const exists = await Category.findOne({ slug });

  if (exists) {
    return res.status(400).json({
      message: "Duplicate slug"
    });
  }

  const category = await Category.create({
    ...req.body,
    slug
  });

  res.status(201).json(category);
};

export const getCategories = async (req, res) => {
  const categories = await Category.find();

  const data = await Promise.all(
    categories.map(async cat => {
      const count = await Product.countDocuments({
        category_id: cat._id
      });

      return {
        ...cat._doc,
        productCount: count
      };
    })
  );

  res.json(data);
};

export const getCategoryBySlug = async (req, res) => {
  const category = await Category.findOne({
    slug: req.params.slug
  });

  if (!category) {
    return res.status(404).json({
      message: "Category not found"
    });
  }

  const products = await Product.find({
    category_id: category._id,
    is_deleted: false
  });

  res.json({
    category,
    products
  });
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;

  if (req.body.name) {
    const baseSlug = slugify(req.body.name, { lower: true });
    let slug = baseSlug;
    let count = 2;

    while (await Category.findOne({ slug, _id: { $ne: id } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    req.body.slug = slug;
  }

  const category = await Category.findByIdAndUpdate(id, req.body, { new: true });

  res.json(category);
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  // prevent deletion if products exist for this category
  const productCount = await Product.countDocuments({ category_id: id, is_deleted: false });

  if (productCount > 0) {
    return res.status(400).json({ message: "Cannot delete category with assigned products" });
  }

  await Category.findByIdAndDelete(id);

  res.json({ message: "Category deleted" });
};