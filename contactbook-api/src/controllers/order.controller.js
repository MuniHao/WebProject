const ordersService = require("../services/orders.service");
const ApiError = require("../api-error");
const JSend = require("../jsend");

// Tạo đơn hàng và các mặt hàng
async function createOrder(req, res, next) {
  if (!req.body?.customer_id || !Array.isArray(req.body.items)) {
    return next(
      new ApiError(400, "Customer ID and items are required to create an order")
    );
  }

  try {
    const order = await ordersService.createOrder({
      ...req.body,
    });
    return res
      .status(201)
      .set({
        Location: `${req.baseUrl}/${order.order_id}`,
      })
      .json(JSend.success({ order }));
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while creating the order")
    );
  }
}

// Lấy đơn hàng theo bộ lọc
async function getOrdersByFilter(req, res, next) {
  let result = {
    orders: [],
    metadata: {
      totalRecords: 0,
      firstPage: 1,
      lastPage: 1,
      page: 1,
      limit: 5,
    },
  };

  try {
    result = await ordersService.getOrdersByFilter(req.query);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while retrieving orders"));
  }

  return res.json(
    JSend.success({
      orders: result.orders,
      metadata: result.metadata,
    })
  );
}

// Lấy thông tin đơn hàng theo ID
async function getOrder(req, res, next) {
  const { order_id } = req.params;

  try {
    const order = await ordersService.getOrderById(order_id);
    if (!order) {
      return next(new ApiError(404, "Order not found"));
    }
    return res.json(JSend.success({ order }));
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error retrieving order with order_id=${order_id}`)
    );
  }
}

// Cập nhật thông tin đơn hàng
async function updateOrder(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update cannot be empty"));
  }

  const { order_id } = req.params;

  try {
    const updated = await ordersService.updateOrder(order_id, req.body);

    if (!updated) {
      return next(new ApiError(404, "Order not found"));
    }

    return res.json(JSend.success({ order: updated }));
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Error updating order with order_id=${order_id}`)
    );
  }
}

// Xóa đơn hàng
async function deleteOrder(req, res, next) {
  const { order_id } = req.params;

  try {
    const deleted = await ordersService.deleteOrder(order_id);

    if (!deleted) {
      return next(new ApiError(404, "Order not found"));
    }

    return res.json(JSend.success());
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, `Could not delete order with order_id=${order_id}`)
    );
  }
}

module.exports = {
  createOrder,
  getOrdersByFilter,
  getOrder,
  updateOrder,
  deleteOrder,
};
