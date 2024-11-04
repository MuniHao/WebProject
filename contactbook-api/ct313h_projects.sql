create database ct313h_projects;
use ct313h_projects;

CREATE TABLE Products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(255),
    product_price DECIMAL(10, 2),
    product_color VARCHAR(100),
    product_description TEXT,
    product_image VARCHAR(1000)
);

CREATE TABLE Customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_password varchar(255),
    customer_phone VARCHAR(10),
    customer_address VARCHAR(255),
    customer_or_admin int default 0 -- 1 -admin
);

CREATE TABLE Orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_total DECIMAL(10, 2),
    order_payment_method VARCHAR(50),
    -- order_status VARCHAR(50),
    order_status enum('Trong giỏ hàng', 'Đã đặt', 'Hoàn thành', 'Đã huỷ' ) default 'Trong giỏ hàng',
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Order_Items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL(10, 2), -- Giá tại thời điểm mua, để giữ lịch sử giá
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE ON UPDATE CASCADE
);