import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @DESC Fetch all products
// @ROUTE /api/products
// @METHOD GET
export const getAll = asyncHandler(async (req, res) => {
  const pageSize = 6;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.status(201).json({
    success: true,
    products,
    page,
    pages: Math.ceil(count / pageSize),
  });
});

// @DESC Fetch single product
// @ROUTE /api/products/:id
// @METHOD GET
export const getSingle = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(401);
    throw new Error("Product not found");
  }

  res.status(201).json({ success: true, product });
});

// @Desc Create product
// @Route /api/products
// @Method POST
export const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    brand: req.body.brand,
    category: req.body.category,
    countInStock: req.body.countInStock,
    image: req.body.image || "/images/simple.jpg",
    user: req.user._id,
  });

  const createdProduct = await product.save();

  res.status(201).json({ success: true, product: createdProduct });
});

// @Desc Update product
// @Route /api/products/:id
// @Method PUT
export const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (product) {
    product.name = req.body.name;
    product.description = req.body.description;
    product.price = req.body.price;
    product.brand = req.body.brand;
    product.category = req.body.category;
    product.countInStock = req.body.countInStock;
    product.image = req.body.image || "/images/simple.jpg";

    const updatedProduct = await product.save();

    res.status(201).json({ success: true, product: updatedProduct });
  } else {
    res.status(401);
    throw new Error("Product not found");
  }
});

// @Desc Delete product
// @Route /api/products/:id
// @Method DELETE
export const deleteProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    res.status(401);
    throw new Error("Product not found");
  }

  await Product.findOneAndDelete(req.params.id);

  res.status(201).json({ message: "Product deleted" });
});

// @Desc Get top products
// @Route /api/products/top
// @Method GET
export const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).limit(3);

  res.status(201).json({ success: true, products });
});
