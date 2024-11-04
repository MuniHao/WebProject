const knex=require('../database/knex');
const Paginator = require('./paginator');
const { unlink } = require('node:fs');
function productRepository() {
    return knex('Products');
}

function readProduct(payload) {
    return {
        //product_id: payload.product_id,
        product_name: payload.product_name,
        product_price: payload.product_price,
        product_color: payload.product_color,
        product_description: payload.product_description,
        product_image: payload.product_image,
    };
}

async function createProduct(payload) {
    const product=readProduct(payload);
    const [product_id] =await productRepository().insert(product);
    return { product_id, ...product };
}

function getManyProducts(query) {
    const { product_name, product_color } = query;

    return productRepository()
        .where((builder) => {
            if (product_name) {
                builder.where('product_name', 'like', `%${product_name}%`);
            }
            // if (favorite !== undefined &&
            //     favorite !== '0' &&
            //     favorite !== 'false') {
            //     builder.where('favorite', 1);
            // }
            // if (product_color) {
            //   builder.where("product_color", "like", `%${product_color}%`);
            // }
        })
        .select('*');
} 

async function getManyProducts(query) {
    const { product_name, product_color,  page = 1, limit = 5 } = query;
    const paginator = new Paginator(page, limit);
    let results = await productRepository()
        .where((builder) => {
            if (product_name) {
                builder.where("product_name", "like", `%${product_name}%`);
            }
            // if (favorite !== undefined &&
            //     favorite !== '0' &&
            //     favorite !== 'false') {
            //     builder.where('favorite', 1);
            // }
            // if (product_color) {
            //   builder.where("product_color", "like", `%${product_color}%`);
            // }
        })
        .select(
            knex.raw('count(product_id) OVER() AS recordCount'),
            'product_id',
            'product_name',
            'product_color',
            'product_price',
            'product_description',
            'product_image'
        )
        .limit(paginator.limit)
        .offset(paginator.offset);
    
    let totalRecords = 0;
    results = results.map((result) => {
        totalRecords = result.recordCount;
        delete result.recordCount;
        return result;
    });
    return {
        metadata: paginator.getMetadata(totalRecords),
        products: results,
    };
}

async function getProductById(product_id) {
    return productRepository().where('product_id', product_id).select('*').first();
}

async function updateProduct(product_id, payload) {
    const updatedProduct = await productRepository()
        .where('product_id', product_id)
        .select('*')
        .first();
    if (!updatedProduct) {
        return null;
    }

    const update = readProduct(payload);
    if (!update.product_image) {
        delete update.product_image;
    }
    await productRepository().where('product_id', product_id).update(update);
    if (
      update.product_image &&
      updatedProduct.product_image &&
      update.product_image !== updatedProduct.product_image &&
      updatedProduct.product_image.startsWith("/public/uploads")
    ) {
      unlink(`.${updatedProduct.product_image}`, (err) => {});
    }
    return { ...updatedProduct, ...update };
}

async function deleteProduct(product_id) {
  const deletedProduct = await productRepository()
    .where('product_id', product_id)
    .select('product_image')
    .first();

  if (!deletedProduct) {
    return null;
  }

  await productRepository().where("product_id", product_id).del();

  if (deletedProduct.product_image && deletedProduct.product_image.startsWith('/public/uploads')) {
    unlink(`.${deletedProduct.product_image}`, (err) => {});
  }

  return deletedProduct;
}

async function deleteAllProducts() {
  const products = await productRepository().select('product_image');
  await productRepository().del();

  products.forEach((product) => {
    if (
      product.product_image && product.product_image.startsWith("/public/uploads")
    ) {
      unlink(`.${product.avproduct_imageatar}`, (err) => {});
    }
  });
}

module.exports = {
  // Export defined functions
  createProduct,
  getManyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
};

