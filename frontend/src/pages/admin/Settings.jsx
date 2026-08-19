import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Save } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const [form, setForm] = useState({
    admission_year: '',
    student_count: '',
    years_of_excellence: '',
    expert_teachers: '',
    classes_offered: '',
    school_hours: '',
    require_2fa: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings')
      if (data) {
        setForm({
          admission_year: data.admission_year || '',
          student_count: data.student_count || '',
          years_of_excellence: data.years_of_excellence || '',
          expert_teachers: data.expert_teachers || '',
          classes_offered: data.classes_offered || '',
          school_hours: data.school_hours || '',
          require_2fa: data.require_2fa || false
        })
      }
    } catch {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/settings', form)
      toast.success('Settings updated successfully!')
    } catch {
      toast.error('Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-smd-blue flex items-center justify-center">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-gray-500">Manage dynamic information shown across the public website.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSave} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Admission Year */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Admission Year</label>
              <input 
                type="text" 
                value={form.admission_year} 
                onChange={e => setForm({...form, admission_year: e.target.value})} 
                className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-smd-blue focus:ring-1 focus:ring-smd-blue"
                placeholder="e.g. 2025-26"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Shown in the hero banner (e.g., Admissions Open for 2025-26)</p>
            </div>

            {/* Student Count */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Student Count</label>
              <input 
                type="text" 
                value={form.student_count} 
                onChange={e => setForm({...form, student_count: e.target.value})} 
                className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-smd-blue focus:ring-1 focus:ring-smd-blue"
                placeholder="e.g. 500+"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Shown in statistics and about sections.</p>
            </div>

            {/* Years of Excellence */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Years of Trust / Excellence</label>
              <input 
                type="text" 
                value={form.years_of_excellence} 
                onChange={e => setForm({...form, years_of_excellence: e.target.value})} 
                className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-smd-blue focus:ring-1 focus:ring-smd-blue"
                placeholder="e.g. 15+"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Shown in the stats bar and about sections.</p>
            </div>

            {/* Expert Teachers */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Expert Teachers Count</label>
              <input 
                type="text" 
                value={form.expert_teachers} 
                onChange={e => setForm({...form, expert_teachers: e.target.value})} 
                className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-smd-blue focus:ring-1 focus:ring-smd-blue"
                placeholder="e.g. 30+"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Shown in the home page statistics bar.</p>
            </div>

            {/* Classes Offered */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Classes Offered</label>
              <input 
                type="text" 
                value={form.classes_offered} 
                onChange={e => setForm({...form, classes_offered: e.target.value})} 
                className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-smd-blue focus:ring-1 focus:ring-smd-blue"
                placeholder="e.g. I - XII"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Shown in the home page statistics bar.</p>
            </div>
            
          </div>

          <hr className="border-gray-100" />

          {/* School Hours */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">School Hours</label>
            <textarea 
              rows={3}
              value={form.school_hours} 
              onChange={e => setForm({...form, school_hours: e.target.value})} 
              className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-smd-blue focus:ring-1 focus:ring-smd-blue resize-none"
              placeholder="Mon – Sat: 7:30 AM – 2:00 PM&#10;Sunday: Closed"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Shown on the Contact Us page.</p>
          </div>

          <hr className="border-gray-100" />

          {/* Security Settings */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Security Settings</h2>
            <div className="flex items-center justify-between bg-gray-50 p-5 rounded-xl border border-gray-100">
              <div>
                <p className="font-bold text-gray-800">Two-Factor Authentication (OTP)</p>
                <p className="text-sm text-gray-500 mt-1">Require a 6-digit email verification code when logging into the Admin Portal.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={form.require_2fa}
                  onChange={(e) => setForm({...form, require_2fa: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-smd-blue"></div>
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={saving}
              className="bg-smd-blue text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
