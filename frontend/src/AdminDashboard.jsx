import React from 'react';
import { AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

export default function AdminDashboard({ data, loading, error, onUpload }) {
  return (
    <div className="space-y-8">
      <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-xl flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="max-w-xl text-white">
          <h2 className="text-4xl font-black mb-4">ML Analysis Hub</h2>
          <p className="text-indigo-100 text-lg">Process socioeconomic data records to identify students at risk.</p>
        </div>
        <label className="shrink-0 bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black text-lg cursor-pointer hover:scale-105 transition-transform">
          <input type="file" className="hidden" onChange={onUpload} accept=".csv" />
          {loading ? "AI Processing..." : "Process Dataset"}
        </label>
      </div>

      {error && <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-600 font-bold">{error}</div>}

      <div className="grid gap-4">
        {data.map((student, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl ${student.at_risk ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                {student.at_risk ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
              </div>
              <div>
                <h4 className="font-bold text-lg">{student.name}</h4>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Risk Score: {student.risk_score}%</p>
              </div>
            </div>
            <div className="flex-1 px-10 hidden md:block">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm italic text-slate-600">
                "{student.solution}"
              </div>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${student.at_risk ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
              {student.at_risk ? 'At Risk' : 'Stable'}
            </div>
          </div>
        ))}
        {data.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <TrendingUp size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold">No records found. Upload a CSV to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
}