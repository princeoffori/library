// Update with your config settings.

module.exports = {
  test: {
    client: 'postgresql',
    connection: {
      database: 'library',
      user:     'postgres',
      password: 'admin'
    }
  },
  development: {
      client: 'postgresql',
      connection: process.env.DATABASE_URL || {
        host: process.env.HOST || 'localhost',
        database: process.env.DB_NAME || 'library',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'admin',
      },
  }

    //     pool: {
    //       min: 2,
    //       max: 10
    //     },
    //     migrations: {
    //       tableName: 'knex_migrations'
    //     }
    //   }
};
