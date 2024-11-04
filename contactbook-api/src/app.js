const express = require("express");
const JSend = require("./jsend");
const crypto = require("crypto");
const session = require("express-session");

//const bodyParser = require("body-parser");
const cors = require("cors");

const productsRouter = require("./routes/products.router");
const customerRouter = require("./routes/customer.router");

const {
  resourceNotFound,
  handleError,
} = require("./controllers/errors.controller");
const { specs, swaggerUi } = require("./docs/swagger");
const app = express();

// Tạo khóa bí mật ngẫu nhiên
const secretKey = crypto.randomBytes(32).toString("hex");
// console.log(secretKey);
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 } // Đặt true nếu bạn sử dụng HTTPS
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use(cors({ origin: 'http://localhost:5173' }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  return res.json(JSend.success());
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/public", express.static("public"));

productsRouter.setup(app);
customerRouter.setup(app);

//Handle 404 response
app.use(resourceNotFound);
app.use(handleError);
module.exports = app;
