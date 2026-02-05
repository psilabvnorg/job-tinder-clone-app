/**
 * SQLite Database Service for offline job storage
 * Uses sql.js (SQLite compiled to WebAssembly) for browser-based SQLite
 */

import initSqlJs from 'sql.js'

// Singleton database instance
let db = null
let sqlPromise = null

/**
 * Initialize sql.js and load the database
 */
async function initDatabase() {
  if (db) return db

  if (!sqlPromise) {
    sqlPromise = initSqlJs({
      // Load sql.js wasm from CDN
      locateFile: file => `https://sql.js.org/dist/${file}`
    })
  }

  const SQL = await sqlPromise

  try {
    // Try to load existing database from public folder
    const response = await fetch('/data/jobs.db')
    if (response.ok) {
      const buffer = await response.arrayBuffer()
      db = new SQL.Database(new Uint8Array(buffer))
      console.log('Loaded jobs database from server')
    } else {
      // Create empty database if none exists
      db = new SQL.Database()
      createSchema(db)
      console.log('Created new empty database')
    }
  } catch (error) {
    console.warn('Could not load database, creating empty one:', error)
    db = new SQL.Database()
    createSchema(db)
  }

  return db
}

/**
 * Create database schema if needed
 */
function createSchema(database) {
  database.run(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT,
      salary TEXT,
      job_type TEXT,
      remote INTEGER DEFAULT 0,
      description TEXT,
      requirements TEXT,
      url TEXT UNIQUE,
      source TEXT,
      background_image TEXT,
      created_at TEXT,
      raw_data TEXT,
      crawled_at TEXT
    )
  `)
}

/**
 * Get all jobs from database
 * @param {number} limit - Max jobs to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} Array of job objects
 */
export async function getJobs(limit = 100, offset = 0) {
  const database = await initDatabase()
  
  const results = database.exec(`
    SELECT * FROM jobs 
    ORDER BY crawled_at DESC 
    LIMIT ${limit} OFFSET ${offset}
  `)

  if (!results.length || !results[0].values.length) {
    return []
  }

  const columns = results[0].columns
  return results[0].values.map(row => {
    const job = {}
    columns.forEach((col, i) => {
      job[col] = row[i]
    })
    // Transform to match app's expected format
    return {
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location || 'Chưa rõ',
      salary: job.salary || 'Thỏa thuận',
      type: job.job_type || 'Toàn thời gian',
      remote: Boolean(job.remote),
      description: job.description || '',
      requirements: job.requirements ? job.requirements.split(',') : [],
      backgroundImage: job.background_image,
      url: job.url,
      source: job.source,
      category: job.category || job.job_type || 'Khác',
    }
  })
}

/**
 * Get total job count
 * @returns {Promise<number>}
 */
export async function getJobCount() {
  const database = await initDatabase()
  const results = database.exec('SELECT COUNT(*) as count FROM jobs')
  return results[0]?.values[0]?.[0] || 0
}

/**
 * Search jobs by keyword
 * @param {string} keyword - Search term
 * @returns {Promise<Array>}
 */
export async function searchJobs(keyword) {
  const database = await initDatabase()
  const searchTerm = `%${keyword}%`
  
  const stmt = database.prepare(`
    SELECT * FROM jobs 
    WHERE title LIKE ? OR company LIKE ? OR description LIKE ?
    ORDER BY crawled_at DESC
    LIMIT 50
  `)
  
  stmt.bind([searchTerm, searchTerm, searchTerm])
  
  const jobs = []
  while (stmt.step()) {
    const row = stmt.getAsObject()
    jobs.push({
      id: row.id,
      title: row.title,
      company: row.company,
      location: row.location || 'Chưa rõ',
      salary: row.salary || 'Thỏa thuận',
      type: row.job_type || 'Toàn thời gian',
      remote: Boolean(row.remote),
      description: row.description || '',
      requirements: row.requirements ? row.requirements.split(',') : [],
      backgroundImage: row.background_image,
      url: row.url,
      source: row.source,
      category: row.category || row.job_type || 'Khác',
    })
  }
  stmt.free()
  
  return jobs
}

/**
 * Check if database is available
 * @returns {Promise<boolean>}
 */
export async function isDatabaseAvailable() {
  try {
    await initDatabase()
    const count = await getJobCount()
    return count > 0
  } catch {
    return false
  }
}

export default {
  getJobs,
  getJobCount,
  searchJobs,
  isDatabaseAvailable,
}
