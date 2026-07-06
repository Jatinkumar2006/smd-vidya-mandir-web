import { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, ChevronDown, ChevronUp, Star, Award } from 'lucide-react'
import api from '@/services/api'
import PageHeader from '@/components/common/PageHeader'

export default function Results() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedYears, setExpandedYears] = useState({})

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await api.get('/results')
        setResults(data)
        
        // Group and find latest year to expand it by default
        const years = [...new Set(data.map(r => r.year))].sort((a, b) => b - a)
        if (years.length > 0) {
          setExpandedYears({ [years[0]]: true })
        }
      } catch (err) {
        console.error('Failed to fetch results', err)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [])

  const groupedResults = useMemo(() => {
    const grouped = results.reduce((acc, result) => {
      if (!acc[result.year]) acc[result.year] = []
      acc[result.year].push(result)
      return acc
    }, {})
    
    // Sort each year's results by score (descending)
    Object.keys(grouped).forEach(year => {
      grouped[year].sort((a, b) => parseFloat(b.score) - parseFloat(a.score))
    })
    
    return grouped
  }, [results])

  const sortedYears = Object.keys(groupedResults).sort((a, b) => b - a)
  const currentYear = sortedYears[0]

  const toggleYear = (year) => {
    setExpandedYears(prev => ({ ...prev, [year]: !prev[year] }))
  }

  const StudentCard = ({ result, featured = false }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`relative bg-white rounded-2xl overflow-hidden border border-slate-100 flex flex-col items-center text-center p-4 ${
          featured ? 'shadow-2xl shadow-smd-blue/10' : 'shadow-lg hover:shadow-xl'
        } transition-all duration-300 group`}
      >
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-smd-gold to-yellow-300" />
        
        {result.description && (
          <div 
            className="absolute top-6 left-1.5 text-smd-navy/60 text-[8px] font-black tracking-[0.15em] uppercase z-0 pointer-events-none"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {result.description}
          </div>
        )}
        
        <div className="relative mb-3 w-full flex justify-center">
          <div className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-smd-gold to-smd-blue shadow-lg">
            <img src={result.photo_url} alt={result.student_name} className="w-full h-full rounded-full object-cover border-4 border-white" />
            
            {featured && !result.description && (
              <div className="absolute -bottom-1 -right-1 bg-smd-gold text-white p-1 rounded-full shadow-md z-10">
                <Award size={16} />
              </div>
            )}
          </div>
        </div>

        <h3 className="text-sm md:text-base mb-1 font-bold text-smd-navy group-hover:text-smd-blue transition-colors whitespace-nowrap overflow-hidden text-ellipsis w-full px-2">
          {result.student_name}
        </h3>
        <p className="text-xs mb-3 font-semibold text-slate-500">{result.class}</p>

        <div className="mt-auto bg-slate-50 w-full py-2 rounded-xl border border-slate-100">
          <div className="flex items-center justify-center gap-1.5">
            <Star size={14} className="text-smd-gold fill-smd-gold" />
            <span className="text-base font-black text-smd-navy">{result.score}</span>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      <Helmet><title>Hall of Fame & Results | SMD Vidya Mandir</title></Helmet>

      <PageHeader 
        title="Hall of Fame"
        subtitle="Celebrating the extraordinary academic achievements of our bright students who make SMD Vidya Mandir proud every year."
        badge="Top Results"
      />

      {/* Results Content */}
      <section className="py-20 bg-slate-50 min-h-[50vh]">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex justify-center items-center py-20 text-slate-500">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-smd-blue border-t-transparent" />
            </div>
          ) : sortedYears.length === 0 ? (
            <div className="text-center py-20 text-slate-500 bg-white rounded-3xl shadow-sm border border-slate-100">
              <Trophy size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-700">No results published yet.</h3>
              <p className="mt-2">Check back later for updates on our top performers.</p>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-16">
              
              {/* Current Year Highlight */}
              {currentYear && (
                <div className="space-y-10">
                  <div className="text-center">
                    <h2 className="inline-block text-3xl font-black text-smd-navy mb-2">
                      Class of {currentYear} Toppers
                    </h2>
                    <div className="h-1.5 w-24 bg-smd-gold mx-auto rounded-full" />
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                    {groupedResults[currentYear].map(result => (
                      <StudentCard key={result.id} result={result} featured={true} />
                    ))}
                  </div>
                </div>
              )}

              {/* Previous Years Archive (Folders) */}
              {sortedYears.length > 1 && (
                <div className="mt-20 pt-16 border-t border-slate-200">
                  <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-slate-700">Previous Years' Hall of Fame</h2>
                  </div>

                  <div className="space-y-4 max-w-4xl mx-auto">
                    {sortedYears.slice(1).map(year => (
                      <div key={year} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300">
                        <button
                          onClick={() => toggleYear(year)}
                          className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-smd-blue/10 text-smd-blue flex items-center justify-center font-black text-lg">
                              {year}
                            </div>
                            <span className="text-lg font-bold text-slate-700">Batch of {year}</span>
                          </div>
                          <div className={`p-2 rounded-full bg-slate-100 text-slate-500 transition-transform duration-300 ${expandedYears[year] ? 'rotate-180' : ''}`}>
                            <ChevronDown size={20} />
                          </div>
                        </button>
                        
                        <AnimatePresence>
                          {expandedYears[year] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-slate-100"
                            >
                              <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 bg-slate-50/50">
                                {groupedResults[year].map(result => (
                                  <StudentCard key={result.id} result={result} />
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </section>
    </>
  )
}
