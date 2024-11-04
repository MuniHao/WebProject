const express = require("express");
const productsController = require("../controllers/products.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");
const imageUpload = require("../middlewares/image-upload.middleware");
const authMiddleware = require("../middlewares/session-auth.middleware");
const router = express.Router();
module.exports.setup = (app) => {
  app.use("/api/v1/products", router);
  /**
   * @swagger
   * /api/v1/products:
   *   get:
   *     summary: Get products by filter
   *     description: Get products by filter
   *     parameters:
   *       - in: query
   *         name: product_name
   *         schema:
   *           type: string
   *         description: Filter by product name
   *       - $ref: '#/components/parameters/limitParam'
   *       - $ref: '#/components/parameters/pageParam'
   *     tags:
   *       - products
   *     responses:
   *       200:
   *         description: A list of products
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: The response status
   *                   enum: [success]
   *                 data:
   *                   type: object
   *                   properties:
   *                     products:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Product'
   *                     metadata:
   *                        $ref: '#/components/schemas/PaginationMetadata'
   *       500:
   *         description: Internal Server Error
   *         $ref: '#/components/responses/500ServerError'
   */
  router.get("/", productsController.getProductsByFilter);

  /**
   * @swagger
   * /api/v1/products:
   *   post:
   *     summary: Create a new product
   *     description: Create a new product
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/Product'
   *     tags:
   *       - products
   *     responses:
   *       201:
   *         description: A new product
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: The response status
   *                   enum: [success]
   *                 data:
   *                   type: object
   *                   properties:
   *                     product:
   *                       $ref: '#/components/schemas/Product'
   *       400:
   *         description: Bad Request (invalid query parameters)
   *         $ref: '#/components/responses/400BadRequest'
   *       500:
   *         description: Internal Server Error
   *         $ref: '#/components/responses/500ServerError'
   */
  router.post("/", imageUpload, productsController.createProduct);

  /**
   * @swagger
   *  /api/v1/products:
   *      delete:
   *          summary: Delete all products
   *          description: Delete all products
   *          tags:
   *              - products
   *          responses:
   *              200:
   *                  description: All products deleted
   *                  $ref: '#/components/responses/200NoData'
   *              500:
   *                  description: Internal Server Error
   *                  $ref: '#/components/responses/500ServerError'
   */
  router.delete("/", productsController.deleteAllProducts);

  router.all("/", methodNotAllowed);

  /**
   * @swagger
   *  /api/v1/products/{product_id}:
   *      get:
   *          summary: Get product by ID
   *          description: Get product by ID
   *          parameters:
   *              - $ref: '#/components/parameters/productIdParam'
   *          tags:
   *              - products
   *          responses:
   *              200:
   *                  description: A product
   *                  content:
   *                      application/json:
   *                          schema:
   *                              type: object
   *                              properties:
   *                                  status:
   *                                      type: string
   *                                      description: The responses status
   *                                      enum: [success]
   *                                  data:
   *                                      type: object
   *                                      properties:
   *                                          product:
   *                                              $ref: '#/components/schemas/Product'
   *              400:
   *                  description: Bad Request (invalid query parameters)
   *                  $ref: '#/components/responses/400BadRequest'
   *              404:
   *                  description: No products found
   *                  $ref: '#/components/responses/404NotFound'
   *              500:
   *                  description: Internal Server Error
   *                  $ref: '#/components/responses/500ServerError'
   */
  router.get("/:product_id", productsController.getProduct);

  /**
   * @swagger
   *  /api/v1/products/{product_id}:
   *   put:
   *     summary: Update product by ID
   *     description: Update product by ID
   *     parameters:
   *       - $ref: '#/components/parameters/productIdParam'
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/Product'
   *     tags:
   *       - products
   *     responses:
   *       200:
   *         description: An updated product
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: The response status
   *                   enum: [success]
   *                 data:
   *                   type: object
   *                   properties:
   *                     product:
   *                       $ref: '#/components/schemas/Product'
   *       400:
   *         description: Bad Request (invalid query parameters)
   *         $ref: '#/components/responses/400BadRequest'
   *       404:
   *         description: No products found
   *         $ref: '#/components/responses/404NotFound'
   *       500:
   *         description: Internal Server Error
   *         $ref: '#/components/responses/500ServerError'
   */
  router.put("/:product_id", imageUpload, productsController.updateProduct);

  /**
   * @swagger
   *  /api/v1/products/{product_id}:
   *   delete:
   *     summary: Delete product by ID
   *     description: Delete product by ID
   *     parameters:
   *       - $ref: '#/components/parameters/productIdParam'
   *     tags:
   *       - products
   *     responses:
   *       200:
   *         description: Product deleted
   *         $ref: '#/components/responses/200NoData'
   *       404:
   *         description: No products found
   *         $ref: '#/components/responses/404NotFound'
   *       500:
   *         description: Internal Server Error
   *         $ref: '#/components/responses/500ServerError'
   */
  router.delete("/:product_id", productsController.deleteProduct);

  router.all("/:product_id", methodNotAllowed);
};
