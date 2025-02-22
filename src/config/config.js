export default {
  development: {
    username: 'root',
    password: 'Thuy2009@',
    database: 'km_b2b',
    host: '172.17.0.1',
    dialect: process.env.DB_DIALECT || 'mysql',
    port: process.env.DB_PORT,
  },
};
