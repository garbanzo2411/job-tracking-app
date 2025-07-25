"use client";

import { useEffect, JSX, useState } from 'react';
import { Send, Calendar, CheckCircle, XCircle, Pencil, X, Save } from 'lucide-react';

interface Job {
  id: number;
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
  const [form, setForm] = useState({
    company: '',
    role: '',
    status: 'Applied',
    date: '',
    notes: '',
  });

  const [editJobId, setEditingJobId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Job>>({});

  useEffect(() => {
    // Load initial jobs from localStorage if available
    const savedJobs = localStorage.getItem("job-tracker-data");
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    }
  }, []);

  useEffect(() => {
    // Save jobs to localStorage whenever they change
    localStorage.setItem("job-tracker-data", JSON.stringify(jobs));
  }, [jobs]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: Job = { ...form, id: Date.now() } as Job;
    setJobs([newJob, ...jobs]);
    setForm({ company: '', role: '', status: 'Applied', date: '', notes: '' });
  };

  const startEditing = (job: Job) => {
    setEditingJobId(job.id);
    setEditForm({...job});
  };

  const cancelEditing = () => {
    setEditingJobId(null);
    setEditForm({});
  };

  const saveEdit = (id: number) => {
    setJobs(jobs.map(job => job.id === id ? { ...job, ...editForm } : job));
    setEditingJobId(null);
    setEditForm({}); 
  };

  return (
    <main className="max-w-3xl mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Job Tracker 📝 </h1>

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

      <div className="mt-8 space-y-4">
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
                <input name="date" type="date" value={editForm.date || ''} onChange={handleEditChange} className="w-full p-1 border mb-1 rounded" />
                <textarea name="notes" value={editForm.notes || ''} onChange={handleEditChange} className="w-full p-1 border mb-2 rounded" />
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(job.id)} className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded"><Save size={16}/> Save</button>
                  <button onClick={cancelEditing} className="flex items-center gap-1 bg-gray-400 text-white px-2 py-1 rounded"><X size={16}/> Cancel</button>
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
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{job.date}</p>
                {job.notes && <p className="mt-2 text-sm text-gray-700">{job.notes}</p>}
              </>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}