#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const isPostgres = process.env.DATABASE_URL?.startsWith('postgresql') || 
                   process.env.DATABASE_URL?.startsWith('postgres');

const rootDir = path.join(__dirname, '..');
const schemaPath = path.join(rootDir, 'prisma', 'schema.prisma');
const sqliteSchemaPath = path.join(rootDir, 'prisma', 'schema.sqlite.prisma');
const postgresSchemaPath = path.join(rootDir, 'prisma', 'schema.postgresql.prisma');

if (isPostgres) {
  if (fs.existsSync(postgresSchemaPath)) {
    fs.copyFileSync(postgresSchemaPath, schemaPath);
    console.log('✓ Switched to PostgreSQL schema');
  }
} else {
  if (fs.existsSync(sqliteSchemaPath)) {
    fs.copyFileSync(sqliteSchemaPath, schemaPath);
    console.log('✓ Switched to SQLite schema');
  }
}
