import { useState, useEffect } from 'react'
import { FileText, Plus, Trash2, Loader2, UploadCloud, FileImage } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/services/api'
import { motion, AnimatePresence } from 'framer-motion'

export default function Documents() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)

  // Form state
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ title: '', doc_type: 'General Documents' })
  const [selectedFile, setSelectedFile] = useState(null)

  const fetchDocuments = async () => {
    try {
      const { data } = await api.get('/documents')
      setDocuments(data)
    } catch (err) {
      toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDocuments() }, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!selectedFile) return toast.error('Please select an image file.')

    setIsUploading(true)
    const form = new FormData()
    form.append('title', formData.title)
    form.append('doc_type', formData.doc_type)
    form.append('file', selectedFile)

    try {
      await api.post('/documents', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Document uploaded and analyzed successfully!')
      setShowModal(false)
      setFormData({ title: '', doc_type: 'General Documents' })
      setSelectedFile(null)
      fetchDocuments()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to upload document')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return
    try {
      await api.delete(`/documents/${id}`)
      toast.success('Document deleted')
      fetchDocuments()
    } catch (err) {
      toast.error('Failed to delete document')
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">School Documents</h1>
          <p className="text-sm text-slate-500 mt-1">Upload MPD files and Fee charts for the Chatbot</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-smd-blue text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-900 transition-colors"
        >
          <Plus size={18} /> Upload Document
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="py-4 px-6 font-semibold">Document Title</th>
              <th className="py-4 px-6 font-semibold">Category</th>
              <th className="py-4 px-6 font-semibold">Extracted Text (AI)</th>
              <th className="py-4 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-12 text-slate-400">Loading documents...</td>
              </tr>
            ) : documents.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-12 text-slate-400">No documents uploaded yet.</td>
              </tr>
            ) : (
              documents.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-smd-orange" />
                      <a href={doc.file_url} target="_blank" rel="noreferrer" className="font-semibold text-slate-800 hover:text-blue-600">
                        {doc.title}
                      </a>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {doc.doc_type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-xs">
                    <div className="truncate max-w-[300px]">
                      {doc.extracted_text && doc.extracted_text.length > 5 ? doc.extracted_text : <span className="text-red-400 italic">No text extracted</span>}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete document"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isUploading && setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Upload Document</h2>
              <form onSubmit={handleUpload}>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Document Title</label>
                    <input
                      type="text" required placeholder="e.g. Fee Structure 2025-26"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-smd-blue transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Category (MPD Section)</label>
                    <select
                      value={formData.doc_type}
                      onChange={e => setFormData({ ...formData, doc_type: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-smd-blue transition-colors bg-white"
                    >
                      <option value="General Documents">General Documents</option>
                      <option value="Certifications & Reports">Certifications & Reports</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">File (JPG / PNG)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors relative">
                      <input
                        type="file" required accept="image/jpeg, image/png, image/webp"
                        onChange={e => setSelectedFile(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {selectedFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <FileImage size={32} className="text-green-500" />
                          <span className="text-sm font-semibold text-slate-700">{selectedFile.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <UploadCloud size={32} className="text-slate-400" />
                          <span className="text-sm text-slate-500">Click or drag image here<br/><small>(Images only for AI OCR)</small></span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button type="button" onClick={() => setShowModal(false)} disabled={isUploading} className="flex-1 py-3 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isUploading} className="flex-1 py-3 font-semibold text-white bg-smd-blue hover:bg-blue-900 rounded-xl transition-colors flex items-center justify-center gap-2">
                    {isUploading ? <Loader2 size={18} className="animate-spin" /> : 'Upload & Analyze'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
