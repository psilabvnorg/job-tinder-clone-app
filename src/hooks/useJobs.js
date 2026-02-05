/**
 * Custom hook for loading jobs from SQLite database
 * Falls back to JSON data if database is unavailable
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { getJobs, getJobCount, isDatabaseAvailable } from '../services/database'
import jobsData from '../data/jobs.json'

// Fallback jobs when no data available
const fallbackJobs = [
  {
    id: '1',
    title: 'Lập trình viên Frontend cao cấp',
    company: 'TechFlow Inc.',
    location: 'San Francisco, CA',
    salary: '$140k - $180k',
    type: 'Toàn thời gian',
    remote: true,
    category: 'IT - Phần mềm',
    description: 'Xây dựng ứng dụng web đẹp, hiệu năng cao với React và TypeScript.',
    requirements: ['5+ năm React', 'TypeScript', 'Design Systems'],
    backgroundImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  },
  {
    id: '2',
    title: 'Nhà thiết kế sản phẩm',
    company: 'DesignLab Studio',
    location: 'New York, NY',
    salary: '$120k - $150k',
    type: 'Toàn thời gian',
    remote: true,
    category: 'Thiết kế',
    description: 'Định hình trải nghiệm sản phẩm từ ý tưởng đến ra mắt.',
    requirements: ['Chuyên gia Figma', 'Nghiên cứu người dùng', 'Tạo mẫu'],
    backgroundImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80',
  },
]

// Extract unique values from jobs array
function extractUniqueValues(jobs, field) {
  const values = new Set()
  jobs.forEach(job => {
    if (job[field]) {
      // Clean up location - extract city/province name
      let value = job[field]
      if (field === 'location') {
        // Remove "(mới)" suffix and trim
        value = value.replace(/\s*\(mới\)\s*/gi, '').trim()
      }
      if (value) values.add(value)
    }
  })
  return Array.from(values).sort()
}

export function useJobs() {
  const [allJobs, setAllJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [source, setSource] = useState(null) // 'sqlite', 'json', or 'fallback'
  const [totalCount, setTotalCount] = useState(0)
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')

  const loadJobs = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Try SQLite first
      const dbAvailable = await isDatabaseAvailable()
      
      if (dbAvailable) {
        const dbJobs = await getJobs(200)
        const count = await getJobCount()
        setAllJobs(dbJobs)
        setTotalCount(count)
        setSource('sqlite')
        console.log(`Loaded ${dbJobs.length} jobs from SQLite`)
      } else if (jobsData.jobs && jobsData.jobs.length > 0) {
        // Fall back to JSON
        setAllJobs(jobsData.jobs)
        setTotalCount(jobsData.count || jobsData.jobs.length)
        setSource('json')
        console.log(`Loaded ${jobsData.jobs.length} jobs from JSON`)
      } else {
        // Use fallback dummy data
        setAllJobs(fallbackJobs)
        setTotalCount(fallbackJobs.length)
        setSource('fallback')
        console.log('Using fallback jobs')
      }
    } catch (err) {
      console.error('Error loading jobs:', err)
      setError(err.message)
      
      // Try JSON fallback on error
      if (jobsData.jobs && jobsData.jobs.length > 0) {
        setAllJobs(jobsData.jobs)
        setSource('json')
      } else {
        setAllJobs(fallbackJobs)
        setSource('fallback')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadJobs()
  }, [loadJobs])

  // Extract unique categories and locations
  const categories = useMemo(() => extractUniqueValues(allJobs, 'category'), [allJobs])
  const locations = useMemo(() => extractUniqueValues(allJobs, 'location'), [allJobs])

  // Filter jobs based on selected filters
  const jobs = useMemo(() => {
    return allJobs.filter(job => {
      const matchCategory = !categoryFilter || job.category === categoryFilter
      const matchLocation = !locationFilter || 
        (job.location && job.location.replace(/\s*\(mới\)\s*/gi, '').trim() === locationFilter)
      return matchCategory && matchLocation
    })
  }, [allJobs, categoryFilter, locationFilter])

  return {
    jobs,
    allJobs,
    loading,
    error,
    source,
    totalCount,
    refresh: loadJobs,
    // Filter related
    categories,
    locations,
    categoryFilter,
    locationFilter,
    setCategoryFilter,
    setLocationFilter,
  }
}

export default useJobs
