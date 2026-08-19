import { useState, useEffect } from 'react'
import { FileText, Plus, Trash2, Loader2, UploadCloud, FileImage, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/services/api'
import { motion, AnimatePresence } from 'framer-motion'

export default function Documents() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)

  // Form state
  const [showModal, setShowModal] = useState(false)
  const [editingDoc, setEditingDoc] = useState(null)
  const [formData, setFormData] = useState({ title: '', doc_type: 'General Documents', share_with_ai: true })
  const [selectedFile, setSelectedFile] = useState(null)
  
  // Delete state
  const [docToDelete, setDocToDelete] = useState(null)

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
    if (!editingDoc && !selectedFile) return toast.error('Please select a file.')

    setIsUploading(true)
    const form = new FormData()
    form.append('title', formData.title)
    form.append('doc_type', formData.doc_type)
    form.append('share_with_ai', formData.share_with_ai)
    if (selectedFile) form.append('file', selectedFile)

    try {
      if (editingDoc) {
        await api.put(`/documents/${editingDoc.id}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Document updated successfully!')
      } else {
        await api.post('/documents', form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Document uploaded and analyzed successfully!')
      }
      setShowModal(false)
      setEditingDoc(null)
      setFormData({ title: '', doc_type: 'General Documents', share_with_ai: true })
      setSelectedFile(null)
      fetchDocuments()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save document')
    } finally {
      setIsUploading(false)
    }
  }

  const confirmDelete = (doc) => {
    setDocToDelete(doc)
  }

  const executeDelete = async () => {
    if (!docToDelete) return
    const id = docToDelete.id
    
    // Optimistic UI update for instant feedback
    setDocuments(prev => prev.filter(doc => doc.id !== id))
    setDocToDelete(null)
    
    try {
      await api.delete(`/documents/${id}`)
      toast.success('Document deleted')
    } catch (err) {
      toast.error('Failed to delete document')
      // Restore state if deletion failed
      fetchDocuments()
    }
  }

  const handleEdit = (doc) => {
    setEditingDoc(doc)
    setFormData({ title: doc.title, doc_type: doc.doc_type, share_with_ai: doc.share_with_ai !== false })
    setSelectedFile(null)
    setShowModal(true)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">MPD Documents</h1>
          <p className="text-sm text-slate-500 mt-1">Manage Mandatory Public Disclosure files</p>
        </div>
        <button
          onClick={() => {
            setEditingDoc(null)
            setFormData({ title: '', doc_type: 'General Documents', share_with_ai: true })
            setSelectedFile(null)
            setShowModal(true)
          }}
          className="flex items-center gap-2 bg-smd-blue text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-900 transition-colors"
        >
          <Plus size={18} /> Upload Document
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
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
                      <a href={doc.file_url.startsWith('http') ? `${import.meta.env.VITE_API_URL}/documents/view/${doc.id}` : doc.file_url} target="_blank" rel="noreferrer" className="font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                        {doc.title}
                      </a>
                      {doc.share_with_ai !== false && (
                        <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider" title="Shared with AI Chatbot">AI</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {doc.doc_type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-xs">
                    <div className="truncate max-w-[300px]">
                      {doc.share_with_ai === false ? (
                        <span className="text-slate-400 italic">AI Disabled — Text Ignored</span>
                      ) : doc.extracted_text && doc.extracted_text.length > 5 ? (
                        doc.extracted_text
                      ) : (
                        <span className="text-red-400 italic">No text extracted</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right flex items-center justify-end gap-1">
                    <a
                      href={doc.file_url.startsWith('http') ? `${import.meta.env.VITE_API_URL}/documents/view/${doc.id}` : doc.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Document"
                    >
                      <ExternalLink size={16} />
                    </a>
                    <button
                      onClick={() => handleEdit(doc)}
                      className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Rename document"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                    <button
                      onClick={() => confirmDelete(doc)}
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
              <h2 className="text-xl font-bold text-slate-800 mb-6">{editingDoc ? 'Edit Document' : 'Upload Document'}</h2>
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
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-2">File (JPG / PNG / PDF)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors relative">
                      <input
                        type="file" accept="image/jpeg, image/png, image/webp, application/pdf"
                        onChange={e => setSelectedFile(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        {...(!editingDoc ? { required: true } : {})}
                      />
                      {selectedFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <FileImage size={32} className="text-green-500" />
                          <span className="text-sm font-semibold text-slate-700">{selectedFile.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <UploadCloud size={32} className="text-slate-400" />
                          <span className="text-sm text-slate-500">
                            {editingDoc ? 'Click to upload a new file (optional)' : 'Click or drag document here'}
                            <br/><small>(Images or PDFs allowed)</small>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      id="share_with_ai"
                      checked={formData.share_with_ai}
                      onChange={e => setFormData({ ...formData, share_with_ai: e.target.checked })}
                      className="w-5 h-5 text-smd-blue border-slate-300 rounded focus:ring-smd-blue"
                    />
                    <label htmlFor="share_with_ai" className="text-sm font-semibold text-slate-700 cursor-pointer select-none">
                      Share with AI Chatbot
                      <span className="block text-xs font-normal text-slate-500 mt-0.5">Allow the AI to read and answer questions about this document.</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button type="button" onClick={() => setShowModal(false)} disabled={isUploading} className="flex-1 py-3 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isUploading} className="flex-1 py-3 font-semibold text-white bg-smd-blue hover:bg-blue-900 rounded-xl transition-colors flex items-center justify-center gap-2">
                    {isUploading ? <Loader2 size={18} className="animate-spin" /> : (editingDoc ? 'Update Document' : 'Upload & Analyze')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {docToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDocToDelete(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Delete Document?</h2>
              <p className="text-slate-500 mb-6 text-sm">
                Are you sure you want to delete <span className="font-semibold text-slate-700">"{docToDelete.title}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDocToDelete(null)} className="flex-1 py-2.5 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                  Cancel
                </button>
                <button onClick={executeDelete} className="flex-1 py-2.5 font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors">
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
