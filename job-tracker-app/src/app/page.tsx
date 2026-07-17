"use client";

import { useEffect, useState, JSX } from 'react';
import { Send, Calendar, CheckCircle, XCircle, Pencil, X, Save, Search, Trash2 } from 'lucide-react';

interface Job {
  id: string;
  company: string;
  role: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  date: string;
  notes: string;
}

const statusStyles: Record<Job['status'], string> = {
  Applied: 'bg-blue-100 text-blue-800',
  Interview: 'bg-yellow-100 text-yellow-800',
  Offer: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

const statusIcons: Record<Job['status'], JSX.Element> = {
  Applied: <Send size={16} className="inline mr-1" />,
  Interview: <Calendar size={16} className="inline mr-1" />,
  Offer: <CheckCircle size={16} className="inline mr-1" />,
  Rejected: <XCircle size={16} className="inline mr-1" />,
};

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    company: '',
    role: '',
    status: 'Applied',
    date: '',
    notes: '',
  });

  const [editJobId, setEditingJobId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Job>>({});

  // Fetch jobs whenever the search term changes (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchJobs(search);
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const fetchJobs = async (q: string = '') => {
    setLoading(true);
    try {
      const url = q ? `/api/jobs?q=${encodeURIComponent(q)}` : '/api/jobs';
      const res = await fetch(url);
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const newJob = await res.json();
      setJobs([newJob, ...jobs]);
      setForm({ company: '', role: '', status: 'Applied', date: '', notes: '' });
    } catch (err) {
      console.error('Failed to add job', err);
    }
  };

  const startEditing = (job: Job) => {
    setEditingJobId(job.id);
    setEditForm({ ...job });
  };

  const cancelEditing = () => {
    setEditingJobId(null);
    setEditForm({});
  };

  const saveEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const updated = await res.json();
      setJobs(jobs.map((job) => (job.id === id ? updated : job)));
      setEditingJobId(null);
      setEditForm({});
    } catch (err) {
      console.error('Failed to update job', err);
    }
  };

  const deleteJob = async (id: string) => {
    if (!confirm('Delete this job entry?')) return;
    try {
      await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      setJobs(jobs.filter((job) => job.id !== id));
    } catch (err) {
      console.error('Failed to delete job', err);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Job Tracker 📝</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-xl shadow">
        <input name="company" value={form.company} onChange={handleChange} placeholder="Company 🏢" className="w-full p-2 border rounded" required />
        <input name="role" value={form.role} onChange={handleChange} placeholder="Role 👨‍💻" className="w-full p-2 border rounded" required />
        <select name="status" value={form.status} onChange={handleChange} className="w-full p-2 border rounded">
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
        <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full p-2 border rounded" required />
        <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes 🗒️" className="w-full p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Job</button>
      </form>

      {/* Search bar */}
      <div className="relative mt-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by company, role, or notes..."
          className="w-full p-2 pl-10 border rounded bg-white shadow-sm"
        />
      </div>

      <div className="mt-4 space-y-4">
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {!loading && jobs.length === 0 && (
          <p className="text-sm text-gray-500">No jobs found{search ? ` for "${search}"` : ''}.</p>
        )}
        {jobs.map((job) => (
          <div key={job.id} className="p-4 bg-gray-50 border rounded-xl shadow">
            {editJobId === job.id ? (
              <>
                <input name="company" value={editForm.company || ''} onChange={handleEditChange} className="w-full p-1 border mb-1 rounded" />
                <input name="role" value={editForm.role || ''} onChange={handleEditChange} className="w-full p-1 border mb-1 rounded" />
                <select name="status" value={editForm.status || 'Applied'} onChange={handleEditChange} className="w-full p-1 border mb-1 rounded">
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
                <input name="date" type="date" value={editForm.date ? editForm.date.slice(0, 10) : ''} onChange={handleEditChange} className="w-full p-1 border mb-1 rounded" />
                <textarea name="notes" value={editForm.notes || ''} onChange={handleEditChange} className="w-full p-1 border mb-2 rounded" />
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(job.id)} className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded"><Save size={16} /> Save</button>
                  <button onClick={cancelEditing} className="flex items-center gap-1 bg-gray-400 text-white px-2 py-1 rounded"><X size={16} /> Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold">{job.company}</h2>
                    <p className="text-sm">{job.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${statusStyles[job.status]}`}>
                      {statusIcons[job.status]}
                      {job.status}
                    </div>
                    <button onClick={() => startEditing(job)} className="text-gray-500 hover:text-black">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => deleteJob(job.id)} className="text-gray-500 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{job.date.slice(0, 10)}</p>
                {job.notes && <p className="mt-2 text-sm text-gray-700">{job.notes}</p>}
              </>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}