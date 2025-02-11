export default {
  development: {
    username: 'root',
    password: 'Thuy2009@',
    database: 'discount',
    host: 'localhost',
    dialect: process.env.DB_DIALECT || 'mysql',
    port: process.env.DB_PORT,
  },
};
