const knex = require('../database/knex');
const Paginator = require('./paginator');
const bcrypt = require('bcrypt');
const { unlink } = require('node:fs');

function customerRepository() {
    return knex('Customers');
}

function readCustomer(payload) {
    return {
        customer_id: payload.customer_id,
        customer_name: payload.customer_name,
        customer_email: payload.customer_email,
        customer_password: payload.customer_password,
        customer_phone: payload.customer_phone,
        customer_address: payload.customer_address,
    };
}
async function createCustomer(payload) {
  const hashedPassword = await bcrypt.hash(payload.customer_password, 10);
  const customer = readCustomer({
    ...payload,
    customer_password: hashedPassword,
  });
  const [customer_id] = await customerRepository().insert(customer);
  return { customer_id, ...customer };
}


async function getManyCustomers(query) {
  try {
    const { customer_name, customer_email, customer_phone ,customer_address, page = 1, limit = 5 } = query;
    const paginator = new Paginator(page, limit);

    let results = await customerRepository()
      .where((builder) => {
        if (customer_name) {
          builder.where('customer_name', 'like', `%${customer_name}%`);
        }
        if (customer_email) {
          builder.where('customer_email', '=', customer_email);
        }
        if (customer_phone) {
          builder.where('customer_phone', 'like', `%${customer_phone}%`);
        }
        if (customer_address) {
          builder.where('customer_address', 'like', `%${customer_address}%`);
        }
      })
      .select(
        knex.raw('count(customer_id) OVER() AS recordCount'),
        'customer_id',
        'customer_name',
        'customer_email',
        'customer_password', //tuỳ theo role có hiện password của người dùng hay không
        'customer_phone',
        'customer_address'
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
      customers: results,
    };
  } catch (error) {
    console.error('Error in getManyCustomers:', error); // Ghi log lỗi
    throw new ApiError(500, 'An error occurred while retrieving customers');
  }
}



async function getCustomerById(customer_id) {
  return customerRepository().where('customer_id', customer_id).select('*').first();
}

async function getCustomerByEmail(customer_email) {
  return customerRepository()
    .where("customer_email", customer_email)
    .select("*")
    .first();
}

async function updateCustomer(customer_id, payload) {
  const updatedCustomer = await customerRepository()
    .where("customer_id", customer_id)
    .select("*")
    .first();

  if (!updatedCustomer) {
    return null; 
  }

  const update = readCustomer(payload); 


  await customerRepository().where("customer_id", customer_id).update(update);

  return { ...updatedCustomer, ...update }; 
}
async function deleteCustomer(customer_id) {
  const deletedCustomer = await customerRepository()
    .where('customer_id', customer_id)
    .first();
    
  if (!deletedCustomer) {
    return null; 
  }

  await customerRepository().where('customer_id', customer_id).del();

  return deletedCustomer; 
}

async function deleteAllCustomer() {
  await customerRepository().del();
}

async function verifyCustomer(email, password) {
  // if (!email || !password) {
  //   throw new Error("Email and password are required");
  // }
  const customer = await knex('Customer')
    .where({ customer_email: email })
    .first();
  const isMatch = await bcrypt.compare(password, customer.customer_password);
  if(!isMatch) {
    throw new Error("Mật khẩu không chính xác.");
  }
  return customer; // Trả về null nếu không tìm thấy customer hoặc mật khẩu không khớp
}

const checkExistEmail = async (email) => {
  const user = await knex("users").where({ useremail: email }).first();
  return user;
};

// async function authenticate(email, password) {
//   // Tìm kiếm người dùng trong cơ sở dữ liệu
//   const query =
//     "SELECT * FROM Customer WHERE customer_email = ? AND customer_password = ?";
//   const result = await db.query(query, [email, password]);

//   if (result.length > 0) {
//     return result[0]; // Trả về thông tin người dùng
//   }
//   return null; // Không tìm thấy
// };


module.exports = {
  createCustomer,
  getManyCustomers,
  getCustomerById,
  getCustomerByEmail,
  updateCustomer,
  deleteCustomer,
  deleteAllCustomer,
  verifyCustomer,
  checkExistEmail,
  //authenticate,
};
