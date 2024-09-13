import {Pool} from 'pg';

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '123456',
    database: 'todos'
});

export default pool;