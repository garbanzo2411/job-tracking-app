"use client";

import { useState } from 'react';

interface Job {
  id: number;
  company: string;
  role: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  date: string;
  notes: string;
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState({
    company: '',
    role: '',
    status: 'Applied',
    date: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: Job = { ...form, id: Date.now() } as Job;
    setJobs([newJob, ...jobs]);
    setForm({ company: '', role: '', status: 'Applied', date: '', notes: '' });
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
            <div className="flex justify-between">
              <div>
                <h2 className="font-semibold">{job.company}</h2>
                <p className="text-sm">{job.role} – <span className="italic">{job.status}</span></p>
              </div>
              <p className="text-sm text-gray-500">{job.date}</p>
            </div>
            {job.notes && <p className="mt-2 text-sm text-gray-700">{job.notes}</p>}
          </div>
        ))}
      </div>
    </main>
  );
}
