/**
 * Custom hook for loading jobs from SQLite database
 * Falls back to JSON data if database is unavailable
 */

import { useState, useEffect, useCallback } from 'react'
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
    description: 'Định hình trải nghiệm sản phẩm từ ý tưởng đến ra mắt.',
    requirements: ['Chuyên gia Figma', 'Nghiên cứu người dùng', 'Tạo mẫu'],
    backgroundImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80',
  },
]

export function useJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [source, setSource] = useState(null) // 'sqlite', 'json', or 'fallback'
  const [totalCount, setTotalCount] = useState(0)

  const loadJobs = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Try SQLite first
      const dbAvailable = await isDatabaseAvailable()
      
      if (dbAvailable) {
        const dbJobs = await getJobs(200)
        const count = await getJobCount()
        setJobs(dbJobs)
        setTotalCount(count)
        setSource('sqlite')
        console.log(`Loaded ${dbJobs.length} jobs from SQLite`)
      } else if (jobsData.jobs && jobsData.jobs.length > 0) {
        // Fall back to JSON
        setJobs(jobsData.jobs)
        setTotalCount(jobsData.count || jobsData.jobs.length)
        setSource('json')
        console.log(`Loaded ${jobsData.jobs.length} jobs from JSON`)
      } else {
        // Use fallback dummy data
        setJobs(fallbackJobs)
        setTotalCount(fallbackJobs.length)
        setSource('fallback')
        console.log('Using fallback jobs')
      }
    } catch (err) {
      console.error('Error loading jobs:', err)
      setError(err.message)
      
      // Try JSON fallback on error
      if (jobsData.jobs && jobsData.jobs.length > 0) {
        setJobs(jobsData.jobs)
        setSource('json')
      } else {
        setJobs(fallbackJobs)
        setSource('fallback')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadJobs()
  }, [loadJobs])

  return {
    jobs,
    loading,
    error,
    source,
    totalCount,
    refresh: loadJobs,
  }
}

export default useJobs
