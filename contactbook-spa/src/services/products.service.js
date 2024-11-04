import { DEFAULT_IMAGE } from '@/constants';

/**
 * @param {string} url
 * @param {RequestInit} options
 * @returns Promise<Response>
 */
async function efetch(url, options = {}) {
  let result = {};
  let json = {};
  try {
    result = await fetch(url, options);
    json = await result.json();
    console.log('Server response:', json); // Thêm log này
  } catch (error) {
    console.error('Fetch error:', error.message); // Thêm log lỗi
    throw new Error(error.message);
  }
  if (!result.ok || json.status !== 'success') {
    throw new Error(json.message);
  }
  return json.data;
}

function makeProductsService() {
  const baseUrl = '/api/v1/products';

  async function fetchProducts(page, limit = 10) {
    let url = `${baseUrl}?page=${page}&limit=${limit}`;
    const data = await efetch(url);
    data.products = data.products.map((product) => {
      return {
        ...product,
        product_image: product.product_image ?? DEFAULT_IMAGE
      };
    });
    return data;
  }

  async function fetchProduct(product_id) {
    const { product } = await efetch(`${baseUrl}/${product_id}`);
    return {
      ...product,
      product_image: product.product_image ?? DEFAULT_IMAGE
    };
  }

  async function createProduct(product) {
    console.log('Product:', product.body);
    return efetch(baseUrl, {
      method: 'POST',
      body: product
    });
  }

  async function deleteAllProducts() {
    return efetch(baseUrl, {
      method: 'DELETE'
    });
  }

  async function updateProduct(product_id, product) {
    console.log('ID:', product_id); 
    console.log('ID type:', typeof product_id); 

    return efetch(`${baseUrl}/${product_id}`, {
      method: 'PUT',
      body: product
    });
  }

  async function deleteProduct(product_id) {
    return efetch(`${baseUrl}/${product_id}`, {
      method: 'DELETE'
    });
  }

  async function getProducts(page, limit = 10) {
    let url = `${baseUrl}?page=${page}&limit=${limit}`;
    const data = await efetch(url);
    data.products = data.products.map((product) => {
      return {
        ...product,
        product_image: product.product_image ?? DEFAULT_IMAGE
      };
    });
    return data;
  }

  return {
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteAllProducts,
    getProducts
  };
}

export default makeProductsService();
