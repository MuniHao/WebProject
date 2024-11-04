/* eslint-disable no-undef */
const express = require("express");
const customerController = require("../controllers/customer.controller.js");
const router = express.Router();
const { methodNotAllowed } = require("../controllers/errors.controller.js");
const avatarUpload = require("../middlewares/image-upload.middleware.js");
module.exports.setup = (app) => {
  app.use("/api/v1/customers", router);
  /**
   * @swagger
   * /api/v1/customers/filter:
   *   get:
   *     summary: Get customers by filter
   *     description: Retrieve a list of customers based on filtering criteria
   *     parameters:
   *       - in: query
   *         name: customer_name
   *         schema:
   *           type: string
   *         description: Filter by customer name
   *       - in: query
   *         name: customer_email
   *         schema:
   *           type: string
   *         description: Filter by customer email
   *       - in: query
   *         name: customer_address
   *         schema:
   *           type: string
   *         description: Filter by customer address
   *       - $ref: '#/components/parameters/limitParam'
   *       - $ref: '#/components/parameters/pageParam'
   *     tags:
   *       - customers
   *     responses:
   *       200:
   *         description: A list of customers
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
   *                     customers:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Customer'
   *                     metadata:
   *                       $ref: '#/components/schemas/PaginationMetadata'
   */
  router.get("/filter", customerController.getCustomersByFilter); // Lọc sản phẩm

  /**
   * @swagger
   * /api/v1/customers/create/:
   *   post:
   *     summary: Create a new customer
   *     description: Create a new customer
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/Customer'
   *     tags:
   *       - customers
   *     responses:
   *       201:
   *         description: A new customer created
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
   *                     customer:
   *                       $ref: '#/components/schemas/Customer'
   */
  router.post("/create/", avatarUpload, customerController.createCustomer); // Tạo sản phẩm mới

  /**
   * @swagger
   * /api/v1/customers:
   *   delete:
   *     summary: Delete all customers
   *     description: Delete all customers
   *     tags:
   *       - customers
   *     responses:
   *       200:
   *         description: All customers deleted
   *         $ref: '#/components/responses/200NoData'
   */
  router.delete("/", customerController.deleteAllCustomer); // Xóa tất cả sản phẩm
  // router.all('/', methodNotAllowed); // Xử lý phương thức không được phép

  /**
   * @swagger
   * /api/v1/customers/{customer_id}:
   *   get:
   *     summary: Get customer by ID
   *     description: Get customer by ID
   *     parameters:
   *       - $ref: '#/components/parameters/customerIdParam'
   *     tags:
   *       - customers
   *     responses:
   *       200:
   *         description: A customer
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
   *                     customer:
   *                       $ref: '#/components/schemas/Customer'
   */
  router.get("/:customer_id", customerController.getCustomer); // Lấy sản phẩm theo ID

  /**
   * @swagger
   * /api/v1/customers/{customer_id}:
   *   put:
   *     summary: Update customer by ID
   *     description: Update customer by ID
   *     parameters:
   *       - in: path
   *         name: customer_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the customer to update
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/Customer'
   *     tags:
   *       - customers
   *     responses:
   *       200:
   *         description: An updated customer
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
   *                     customer:
   *                       $ref: '#/components/schemas/Customer'
   */
  router.put("/:customer_id", avatarUpload, customerController.updateCustomer); // Cập nhật sản phẩm theo ID

  /**
   * @swagger
   * /api/v1/customers/{customer_id}:
   *   delete:
   *     summary: Delete customer by ID
   *     description: Delete a customer by its ID.
   *     parameters:
   *       - in: path
   *         name: customer_id
   *         required: true
   *         schema:
   *           type: string
   *         description: The ID of the customer to delete
   *     tags:
   *       - customers
   *     responses:
   *       200:
   *         description: Customer deleted
   *         $ref: '#/components/responses/200NoData'
   */
  router.delete("/:customer_id", customerController.deleteCustomer); // Xóa sản phẩm theo ID
  router.all("/:customer_id", methodNotAllowed); // Xử lý phương thức không được phép

  /**
   * @swagger
   * /api/v1/customers:
   *   post:
   *     summary: Login as a customer
   *     description: Authenticate a customer using email and password
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               customer_email:
   *                 type: string
   *                 format: email
   *                 description: Customer's email
   *               customer_password:
   *                 type: string
   *                 description: Customer's password
   *                 format: password
   *     tags:
   *       - customers
   *     responses:
   *       200:
   *         description: Successfully authenticated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: The response status
   *                   enum: [success]
   *       401:
   *         description: Authentication failed
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: The response status
   *                   enum: [error]
   *                 message:
   *                   type: string
   *                   description: Error message
   */
  router.post("/", avatarUpload, customerController.login); // Xác thực đăng nhập
  
  router.all("/", methodNotAllowed); // Xử lý phương thức không được phép
  //module.exports = app;

  router.all("/login/", (req, res) => {
    res.status(405).send("Method Not Allowed");
  });
};
