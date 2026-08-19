import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { ImagePlus, Trash2, X } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'

const C = { navy: '#0a143c', gold: '#f59e0b', white: '#ffffff', bg: '#f7f9ff', border: '#e5e7eb', text: '#0a143c', muted: '#6b7280' }
const CATEGORIES = ['general', 'events', 'sports', 'cultural', 'campus', 'academic']
const PLACEHOLDER_COLORS = ['#0a143c', '#1a3aad', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#3b82f6', '#f97316']

export default function AdminGallery() {
  const [items, setItems]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [filterCat, setFilter]    = useState('all')
  const [showForm, setShowForm]   = useState(false)
  const [form, setForm]           = useState({ title: '', category: 'general', sort_order: 0 })
  const [files, setFiles]         = useState([])
  const [saving, setSaving]       = useState(false)
  const [preview, setPreview]     = useState(null)
  const [lightbox, setLightbox]   = useState(null)

  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [newAlbum, setNewAlbum] = useState('')

  const load = async () => {
    try {
      const { data } = await api.get('/gallery')
      setItems(data)
    } catch { toast.error('Failed to load gallery') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const albums = [...new Set(items.map(i => i.title))]
  
  const filtered = selectedAlbum ? items.filter(i => i.title === selectedAlbum) : []

  const handleAddFolder = (e) => {
    e.preventDefault()
    if (newAlbum.trim()) {
      setSelectedAlbum(newAlbum.trim())
      setShowFolderModal(false)
      setNewAlbum('')
      setShowForm(true)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault(); setSaving(true)
    if (!files.length) {
      toast.error('Please select at least one image'); setSaving(false); return;
    }
    try {
      const formData = new FormData()
      formData.append('title', selectedAlbum)
      formData.append('sort_order', form.sort_order)
      files.forEach(f => formData.append('images', f))

      await api.post('/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Gallery items added!')
      setForm({ title: '', category: 'general', sort_order: 0 }); setFiles([]); setShowForm(false); load()
    } catch { toast.error('Failed to add item') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/gallery/${id}`)
      toast.success('Item removed'); load()
    } catch { toast.error('Delete failed') }
  }

  const handleAlbumSortChange = async (title, newSortOrder) => {
    try {
      await api.put('/gallery/album-sort', { title, sort_order: newSortOrder })
      toast.success('Album sort order updated'); load()
    } catch { toast.error('Failed to update sort order') }
  }

  const handlePhotoSortChange = async (id, newSortOrder) => {
    try {
      await api.put(`/gallery/${id}`, { sort_order: newSortOrder })
      toast.success('Photo sort order updated'); load()
    } catch { toast.error('Failed to update sort order') }
  }

  return (
    <>
      <Helmet><title>Gallery – Admin – SMD Vidya Mandir</title></Helmet>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {selectedAlbum && (
            <button onClick={() => { setSelectedAlbum(null); setShowForm(false) }} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontWeight: 600 }}>
              &larr; Back
            </button>
          )}
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: C.navy }}>{selectedAlbum ? `Album: ${selectedAlbum}` : 'Gallery Albums'}</h1>
        </div>
        
        <button onClick={selectedAlbum ? () => {
          const albumItems = items.filter(i => i.title === selectedAlbum);
          const nextSort = albumItems.length > 0 ? Math.max(...albumItems.map(i => i.sort_order)) + 1 : 0;
          setForm(prev => ({ ...prev, sort_order: nextSort }));
          setShowForm(true);
        } : () => setShowFolderModal(true)} style={{
          background: C.gold, color: C.navy, fontWeight: 700, fontSize: 14,
          padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <ImagePlus size={16} /> {selectedAlbum ? 'Upload Photos' : 'Add Album Folder'}
        </button>
      </div>

      {!selectedAlbum ? (
        // Folder View
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {loading ? (
            <p className="text-gray-500 p-4">Loading albums...</p>
          ) : albums.length === 0 ? (
            <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-xl border">No albums yet. Click Add Album Folder to start.</div>
          ) : (
            albums.map(album => {
              const albumItems = items.filter(i => i.title === album);
              const cover = albumItems.find(i => i.image_url)?.image_url;
              const albumSortOrder = albumItems[0]?.album_sort_order || 0;
              return (
                <div 
                  key={album} 
                  className="bg-white border rounded-xl p-4 flex flex-col hover:shadow-md transition-shadow group"
                >
                  <div onClick={() => setSelectedAlbum(album)} className="w-full aspect-[4/3] bg-gray-100 rounded-lg relative mb-3 overflow-hidden group-hover:scale-105 transition-transform cursor-pointer">
                    {cover ? (
                      <img src={cover} alt={album} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">📁</div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {albumItems.length} photos
                    </div>
                  </div>
                  <h3 onClick={() => setSelectedAlbum(album)} className="font-bold text-gray-800 text-[13px] leading-tight line-clamp-2 cursor-pointer mb-2">{album}</h3>
                  <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Sort Order:</label>
                    <input 
                      type="number" 
                      defaultValue={albumSortOrder} 
                      onBlur={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val !== albumSortOrder) handleAlbumSortChange(album, val);
                      }}
                      className="w-16 border rounded px-1.5 py-0.5 text-xs outline-none focus:border-blue-500" 
                    />
                  </div>
                </div>
              )
            })
          )}
        </div>
      ) : (
        // List View inside Folder
        <>
          {/* Add Form */}
          {showForm && (
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontWeight: 700, color: C.navy }}>Upload Photos to "{selectedAlbum}"</h3>
                <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={18} color={C.muted} /></button>
              </div>
              <form onSubmit={handleAdd}>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>Select Images (You can select multiple) *</label>
                  <input required multiple type="file" accept="image/*" onChange={e => setFiles(Array.from(e.target.files))}
                    style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <button type="submit" disabled={saving} style={{
                  background: C.navy, color: C.white, fontWeight: 700, fontSize: 14,
                  padding: '12px 28px', borderRadius: 10, border: 'none', cursor: 'pointer',
                }}>
                  {saving ? 'Uploading...' : 'Upload Photos'}
                </button>
              </form>
            </div>
          )}

          {/* Grid */}
          {loading
            ? <p style={{ textAlign: 'center', color: C.muted, padding: 48 }}>Loading...</p>
            : filtered.length === 0
              ? <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: 48, textAlign: 'center', color: C.muted }}>No photos in this album yet. Upload some above!</div>
              : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                  {filtered.map((item, i) => (
                    <div key={item.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
                      {item.image_url
                        ? <img src={item.image_url} alt={item.title} onClick={() => setLightbox(item.image_url)} style={{ width: '100%', height: 160, objectFit: 'contain', background: '#f8fafc', cursor: 'zoom-in' }}
                            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                        : null
                      }
                      <div style={{ width: '100%', height: 160, background: PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length], display: item.image_url ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 40 }}>🖼️</span>
                      </div>
                      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div className="flex justify-end items-center">
                          <button onClick={() => handleDelete(item.id)} style={{ background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Sort:</label>
                          <input 
                            type="number" 
                            defaultValue={item.sort_order || 0} 
                            onBlur={(e) => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val) && val !== item.sort_order) handlePhotoSortChange(item.id, val);
                            }}
                            className="w-16 border rounded px-1.5 py-0.5 text-xs outline-none focus:border-blue-500 bg-gray-50" 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
          }
        </>
      )}

      {showFolderModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setShowFolderModal(false)} />
          <div style={{ position: 'relative', background: C.white, borderRadius: 16, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: 400, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontWeight: 700, color: C.navy, fontSize: '1.2rem', margin: 0 }}>Create Album Folder</h2>
              <button onClick={() => setShowFolderModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}><X size={20} color={C.muted} /></button>
            </div>
            <form onSubmit={handleAddFolder}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', marginBottom: 8 }}>Album Name *</label>
              <input type="text" required placeholder="e.g. Annual Function 2026" value={newAlbum} onChange={e => setNewAlbum(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: `2px solid ${C.border}`, outline: 'none', fontSize: 14, marginBottom: 24, boxSizing: 'border-box' }} />
              
              <button type="submit" style={{ width: '100%', padding: 12, fontWeight: 600, color: C.white, background: C.navy, borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 14 }}>
                Create Folder
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <button
            onClick={() => setLightbox(null)}
            style={{ position: 'absolute', top: '20px', right: '24px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}
          >
            <X size={20} />
          </button>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '820px', width: '100%', animation: 'fadeIn 0.25s ease' }}>
            <img
              src={lightbox}
              alt="Lightbox view"
              style={{ width: '100%', borderRadius: '18px', display: 'block', maxHeight: '85vh', objectFit: 'contain', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
            />
          </div>
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
        </div>
      )}
    </>
  )
}
