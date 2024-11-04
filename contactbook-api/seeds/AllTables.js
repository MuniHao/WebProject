const { faker } = require("@faker-js/faker");

function createProduct() {
  const models = [
    "iPhone 11",
    "iPhone 12",
    "iPhone 13",
    "iPhone 14",
    "iPhone 15",
  ];
  const colors = ["Đen", "Trắng", "Đỏ", "Xanh", "Xanh dương", "Vàng", "Hồng"];
  const storageOptions = ["64GB", "128GB", "256GB", "512GB"];

  return {
    product_name: `${faker.helpers.arrayElement(models)} ${faker.helpers.arrayElement(storageOptions)}`,
    product_price: faker.number.int({ min: 15000000, max: 35000000 }),
    product_color: faker.helpers.arrayElement(colors),
    product_description: faker.commerce.productDescription(),
    product_image: "/public/images/blank.png",
  };
}

function createCustomer() {
  return {
    customer_name: faker.person.fullName(),
    customer_email: faker.internet.email(),
    customer_password: faker.internet.password(),
    customer_phone: `09${faker.number.int({ min: 10000000, max: 99999999 })}`, // Số điện thoại bắt đầu bằng 09
    customer_address: faker.location.streetAddress(),
  };
}

function createOrder(customerIds) {
  return {
    customer_id: faker.helpers.arrayElement(customerIds),
    order_date: faker.date.recent(),
    order_total: faker.number.int({ min: 5000000, max: 50000000 }), // Tổng tiền từ 5 triệu đến 50 triệu
    order_payment_method: faker.helpers.arrayElement([
      "Credit Card",
      "PayPal",
      "Bank Transfer",
    ]),
    order_status: faker.helpers.arrayElement([
      "Trong giỏ hàng",
      "Đã đặt",
      "Hoàn thành",
      "Đã huỷ",
    ]),
  };
}

function createOrderItem(orderIds, productIds) {
  return {
    order_id: faker.helpers.arrayElement(orderIds),
    product_id: faker.helpers.arrayElement(productIds),
    quantity: faker.number.int({ min: 1, max: 5 }),
    price: faker.number.int({ min: 15000000, max: 35000000 }), // Giá sản phẩm tại thời điểm mua
  };
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("Order_Items").del();
  await knex("Orders").del();
  await knex("Products").del();
  await knex("Customers").del();

  await knex.raw("ALTER TABLE Products AUTO_INCREMENT = 1");
  await knex.raw("ALTER TABLE Customers AUTO_INCREMENT = 1");
  await knex.raw("ALTER TABLE Orders AUTO_INCREMENT = 1");
  await knex.raw("ALTER TABLE Order_Items AUTO_INCREMENT = 1");

  // Insert dữ liệu vào bảng Product và Customer
  const products = Array.from({ length: 20 }, createProduct);
  const customers = Array.from({ length: 10 }, createCustomer);

  await knex("Products").insert(products);
  await knex("Customers").insert(customers);

  // Lấy danh sách ID sau khi chèn
  const productIds = await knex("Products").pluck("product_id");
  const customerIds = await knex("Customers").pluck("customer_id");

  // Insert dữ liệu vào bảng Orders
  const orders = Array.from({ length: 15 }, () =>
    createOrder(customerIds)
  );
  await knex("Orders").insert(orders);

  // Lấy danh sách ID của Orders
  const orderIds = await knex("Orders").pluck("order_id");

  // Insert dữ liệu vào bảng Order_Items
  const orderItems = Array.from({ length: 30 }, () =>
    createOrderItem(orderIds, productIds)
  );
  await knex("Order_Items").insert(orderItems);
};
