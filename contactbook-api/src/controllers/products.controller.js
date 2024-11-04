const productsService = require('../services/products.service')
const ApiError = require('../api-error');
const JSend = require('../jsend');

async function createProduct(req, res, next) {
    if (!req.body?.product_name || typeof req.body.product_name !== "string") {
      return next(new ApiError(400, "Product name should be a non-empty string"));
    }

    try {
        const product = await productsService.createProduct({
          ...req.body,
          product_image: req.file ? `/public/uploads/${req.file.filename}` : null,
        });
        return res
          .status(201)
          .set({
            Location: `${req.baseUrl}/${product.product_id}`,
          })
          .json(JSend.success({ product }));
    } catch (error) {
        console.log(error);
        return next(
          new ApiError(500, "An error occurred while creating the product")
        );
    }
}
async function getProductsByFilter(req, res, next) {
    let result = {
        products: [],
        metadata: {
            totalRecords: 0,
            firstPage: 1,
            lastPage: 1,
            page: 1,
            limit: 5,
        },
    };

    try {
        result = await productsService.getManyProducts(req.query);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while retrieving products")
        );
    }

    return res.json(
        JSend.success({
            products: result.products,
            metadata: result.metadata,
        })
    );
}
async function getProduct(req, res, next) {
    const { product_id } = req.params;

    try {
        const product = await productsService.getProductById(product_id);
        if (!product) {
          return next(new ApiError(404, "Product not found"));
        }
        return res.json(JSend.success({ product }));
    } 
    catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error retrieving product with product_id= ${product_id}`)
        );
    }
}
async function updateProduct(req, res, next) {
    if (Object.keys(req.body).length === 0 && !req.file) {
        return next(new ApiError(400, 'Data to update can not be empty'));
    }

    const { product_id } = req.params;

    try {
    const updated = await productsService.updateProduct(product_id, {
      ...req.body,
      product_image: req.file ? `/public/uploads/${req.file.filename}` : null,
    });

    if (!updated) {
        return next(new ApiError(404, 'Product not found'));
    }

    return res.json(JSend.success({
        product: updated,
    }));
    } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error updating product with product_id=${product_id}`)
    );
  }
}

async function deleteProduct(req, res, next) {
  const { product_id } = req.params;

  try {
    const deleted = await productsService.deleteProduct(product_id);

    if (!deleted) {
      return next(new ApiError(404, 'Product not found'));
    }

    return res.json(JSend.success());
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, `Could not delete product with product_id=${product_id}`));
  }
}
async function deleteAllProducts(req, res, next) {
  try {
    await productsService.deleteAllProducts();

    return res.json(JSend.success());
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'An error occurred while removing all products'));
  }
}

module.exports = {
    getProductsByFilter,
    deleteAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};