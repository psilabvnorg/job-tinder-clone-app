/**
 * SQLite Database Service for offline data storage
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
      locateFile: file => `https://sql.js.org/dist/${file}`
    })
  }

  const SQL = await sqlPromise

  try {
    const response = await fetch('/data/jobs.db')
    if (response.ok) {
      const buffer = await response.arrayBuffer()
      db = new SQL.Database(new Uint8Array(buffer))
      console.log('Loaded database from server')
    } else {
      db = new SQL.Database()
      console.log('Created new empty database')
    }
  } catch (error) {
    console.warn('Could not load database:', error)
    db = new SQL.Database()
  }

  return db
}

// Helper to convert query results to array of objects
function queryToArray(results) {
  if (!results.length || !results[0].values.length) return []
  const columns = results[0].columns
  return results[0].values.map(row => {
    const obj = {}
    columns.forEach((col, i) => {
      obj[col] = row[i]
    })
    return obj
  })
}

// ============ JOBS ============

export async function getJobs(limit = 100, offset = 0) {
  const database = await initDatabase()
  const results = database.exec(`
    SELECT * FROM jobs ORDER BY crawled_at DESC LIMIT ${limit} OFFSET ${offset}
  `)
  return queryToArray(results).map(job => ({
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
  }))
}

export async function getJobCount() {
  const database = await initDatabase()
  const results = database.exec('SELECT COUNT(*) as count FROM jobs')
  return results[0]?.values[0]?.[0] || 0
}

export async function searchJobs(keyword) {
  const database = await initDatabase()
  const searchTerm = `%${keyword}%`
  const stmt = database.prepare(`
    SELECT * FROM jobs 
    WHERE title LIKE ? OR company LIKE ? OR description LIKE ?
    ORDER BY crawled_at DESC LIMIT 50
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

export async function isDatabaseAvailable() {
  try {
    await initDatabase()
    const count = await getJobCount()
    return count > 0
  } catch {
    return false
  }
}

// ============ INSTRUCTORS ============

export async function getInstructors() {
  const database = await initDatabase()
  const results = database.exec('SELECT * FROM instructors ORDER BY id')
  return queryToArray(results).map(row => ({
    id: row.id,
    name: row.name,
    username: row.username,
    avatar: row.avatar,
    category: row.category,
    verified: Boolean(row.verified),
  }))
}

// ============ STORIES ============

export async function getStories() {
  const database = await initDatabase()
  const results = database.exec('SELECT * FROM stories ORDER BY id')
  return queryToArray(results).map(row => ({
    id: row.id,
    user: { name: row.user_name, username: row.user_username },
    image: row.image,
    hasUnseen: Boolean(row.has_unseen),
  }))
}

// ============ COMPANIES ============

export async function getCompanies() {
  const database = await initDatabase()
  const results = database.exec('SELECT * FROM companies ORDER BY id')
  return queryToArray(results).map(row => ({
    id: row.id,
    name: row.name,
    logo: row.logo,
    industry: row.industry,
    size: row.size,
    location: row.location,
  }))
}

// ============ POSTS ============

export async function getPosts() {
  const database = await initDatabase()
  const results = database.exec(`
    SELECT p.*, i.name as author_name, i.username as author_username, 
           i.avatar as author_avatar, i.category as author_category, i.verified as author_verified
    FROM posts p
    LEFT JOIN instructors i ON p.author_id = i.id
    ORDER BY p.id
  `)
  return queryToArray(results).map(row => ({
    id: row.id,
    author: {
      id: row.author_id,
      name: row.author_name,
      username: row.author_username,
      avatar: row.author_avatar,
      category: row.author_category,
      verified: Boolean(row.author_verified),
    },
    time: row.time,
    content: row.content,
    image: row.image,
    tags: row.tags ? JSON.parse(row.tags) : [],
    likes: row.likes,
    comments: row.comments,
    category: row.category,
    quiz: row.quiz_question ? {
      question: row.quiz_question,
      options: row.quiz_options ? JSON.parse(row.quiz_options) : [],
      correctId: row.quiz_correct_id,
      explanation: row.quiz_explanation,
    } : null,
  }))
}

// ============ PRACTICE QUESTIONS ============

export async function getPracticeQuestions() {
  const database = await initDatabase()
  const results = database.exec('SELECT * FROM practice_questions ORDER BY id')
  return queryToArray(results).map(row => ({
    id: row.id,
    topic: row.topic,
    title: row.title,
    question: row.question,
    options: row.options ? JSON.parse(row.options) : [],
    correctOptionId: row.correct_option_id,
    explanation: row.explanation,
    image: row.image,
  }))
}

// ============ CATEGORIES ============

export const categories = ['All', 'IELTS', 'Marketing', 'Finance', 'MBA', 'Design', 'Leadership']

export const categoryEmojis = {
  'IELTS': '📖',
  'Marketing': '📈',
  'Finance': '💰',
  'MBA': '🎓',
  'Design': '🎨',
  'Leadership': '💡',
}

// ============ HELPERS ============

export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

export default {
  getJobs,
  getJobCount,
  searchJobs,
  isDatabaseAvailable,
  getInstructors,
  getStories,
  getCompanies,
  getPosts,
  getPracticeQuestions,
  categories,
  categoryEmojis,
  formatNumber,
}
