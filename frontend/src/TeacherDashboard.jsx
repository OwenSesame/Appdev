import React from 'react';
import { Users, Activity, HeartPulse, TrendingUp } from 'lucide-react';

export default function TeacherDashboard({ data }) {
  const atRiskStudents = data.filter(s => s.at_risk);
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600"><Users /></div>
          <div><p className="text-[10px] font-black text-slate-400 uppercase">Assigned</p><h3 className="text-3xl font-black">{data.length}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="bg-red-50 p-4 rounded-2xl text-red-600"><Activity /></div>
          <div><p className="text-[10px] font-black text-slate-400 uppercase">At-Risk</p><h3 className="text-3xl font-black">{atRiskStudents.length}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="bg-green-50 p-4 rounded-2xl text-green-600"><HeartPulse /></div>
          <div><p className="text-[10px] font-black text-slate-400 uppercase">Success Rate</p><h3 className="text-3xl font-black">92%</h3></div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h3 className="text-2xl font-black mb-6">Faculty Intervention Queue</h3>
        <div className="space-y-4">
          {atRiskStudents.map((student, i) => (
            <div key={i} className="flex items-center justify-between p-6 border rounded-2xl border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">{student.name[0]}</div>
                <div>
                  <p className="font-bold text-slate-800">{student.name}</p>
                  <p className="text-xs text-red-500 font-bold uppercase tracking-widest">Intervention Required</p>
                </div>
              </div>
              <button className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all">
                View Risk Factors
              </button>
            </div>
          ))}
          {atRiskStudents.length === 0 && (
            <div className="text-center py-10 text-slate-400 italic">No students currently require attention.</div>
          )}
        </div>
      </div>
    </div>
  );
}