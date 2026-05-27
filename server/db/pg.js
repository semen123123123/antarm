import pg from 'pg';

const { Pool } = pg;

let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://antarm.rrjtfenhfkmkvgolwefi:AntArm2024!@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
      max: 5,
      idleTimeoutMillis: 30000,
    });
    pool.on('error', (err) => console.error('PG pool error:', err.message));
  }
  return pool;
}

// Convert SQLite ? placeholders to PostgreSQL $1, $2, ...
function convertPlaceholders(sql) {
  let idx = 0;
  return sql.replace(/\?/g, () => `$${++idx}`);
}

// Check if SQL is an INSERT
function isInsert(sql) {
  return /^\s*INSERT\s/i.test(sql);
}

// Check if SQL is a SELECT or WITH
function isSelect(sql) {
  return /^\s*(?:SELECT|WITH)\s/i.test(sql);
}

class Statement {
  constructor(sql, pool) {
    this.originalSql = sql;
    this.sql = convertPlaceholders(sql);
    this.pool = pool;
    this.isInsert = isInsert(sql);
    this.isSelect = isSelect(sql);
  }

  async _query(params = []) {
    const client = await this.pool.connect();
    try {
      // For INSERT without RETURNING, append RETURNING id
      let sql = this.sql;
      if (this.isInsert && !/RETURNING\s/i.test(sql)) {
        sql += ' RETURNING id';
      }
      const result = await client.query(sql, params);
      return result;
    } finally {
      client.release();
    }
  }

  async all(...params) {
    const result = await this._query(params);
    return result.rows;
  }

  async get(...params) {
    const result = await this._query(params);
    return result.rows[0] || null;
  }

  async run(...params) {
    const result = await this._query(params);
    return {
      lastInsertRowid: result.rows?.[0]?.id || null,
      changes: result.rowCount || 0,
    };
  }
}

export function getDb() {
  const p = getPool();
  return {
    prepare(sql) {
      return new Statement(sql, p);
    },
    async exec(multiSql) {
      const statements = multiSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      const client = await p.connect();
      try {
        for (const stmt of statements) {
          await client.query(stmt);
        }
      } finally {
        client.release();
      }
    },
    transaction(fn) {
      const run = async (...args) => {
        const client = await p.connect();
        try {
          await client.query('BEGIN');
          const result = await fn(...args);
          await client.query('COMMIT');
          return result;
        } catch (err) {
          await client.query('ROLLBACK');
          throw err;
        } finally {
          client.release();
        }
      };
      return run;
    },
  };
}

export async function initSchema() {
  // Schema already applied via Supabase migration
  // This is a no-op for Vercel/Supabase deployments
  console.log('✓ Supabase schema ready (already applied via migration)');
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export default { getDb, initSchema, closePool };
