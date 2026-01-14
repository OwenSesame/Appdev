import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, LogOut, User, GraduationCap, ArrowRight,
  ShieldCheck, Wallet, Award, Save, Calendar, Search, 
  LayoutDashboard, AlertCircle, Users, FileText,
  TrendingDown, Filter, Download, Plus, Trash2, 
  ChevronRight, Settings, Info, Lock, Mail, X,
  Activity, Home, MapPin, BookOpen, CheckCircle2,
  Edit3, Megaphone, BellRing, ClipboardCheck, Moon, Wifi, Monitor, UserCheck, Book, UserPlus
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_STUDENTS = [
  { 
    id: '1', name: 'Juan Dela Cruz', email: 'juan@univ.edu', 
    income: 8500, absences: 14, studyTime: 4, distance: 15, parentEdu: 1,
    householdSize: 7, techAccess: 0, scholarship: 0, screenTime: 12, sleepHours: 5,
    risk: 92, status: 'At Risk', interventions: [] 
  },
  { 
    id: '2', name: 'Maria Santos', email: 'maria@univ.edu', 
    income: 45000, absences: 1, studyTime: 25, distance: 2, parentEdu: 5,
    householdSize: 3, techAccess: 1, scholarship: 1, screenTime: 3, sleepHours: 8,
    risk: 8, status: 'Stable', interventions: [] 
  },
  { 
    id: '3', name: 'Kevin Lee', email: 'kevin@univ.edu', 
    income: 18000, absences: 6, studyTime: 10, distance: 8, parentEdu: 3,
    householdSize: 5, techAccess: 1, scholarship: 0, screenTime: 9, sleepHours: 6,
    risk: 45, status: 'Stable', interventions: [] 
  },
];

// --- HELPER FUNCTIONS ---

const parseCSVLine = (line) => {
  const result = [];
  let startValueIndex = 0;
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      inQuotes = !inQuotes; 
    } else if (line[i] === ',' && !inQuotes) {
      let val = line.substring(startValueIndex, i).trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      result.push(val);
      startValueIndex = i + 1;
    }
  }
  let lastVal = line.substring(startValueIndex).trim();
  if (lastVal.startsWith('"') && lastVal.endsWith('"')) lastVal = lastVal.slice(1, -1);
  result.push(lastVal);
  return result;
};

const cleanNumber = (val) => {
  if (!val) return 0;
  const match = val.toString().match(/(\d+(\.\d+)?)/); 
  if (!match) return 0;
  let num = parseFloat(match[0]);
  if (val.toString().toLowerCase().includes('k')) num *= 1000; 
  return Math.round(num);
};

const cleanIncome = (val) => {
  if (!val) return 0;
  const clean = val.toString().replace(/[, ]/g, '');
  if (clean.includes('-') || clean.includes('–')) {
    const parts = clean.split(/[-–]/).map(p => cleanNumber(p));
    if (parts.length === 2) return (parts[0] + parts[1]) / 2;
  }
  return cleanNumber(clean);
};

const mapYesNo = (val) => val && val.toString().toLowerCase().includes('yes') ? 1 : 0;

const mapEdu = (val) => {
  if (!val) return 2;
  const s = val.toString().toLowerCase();
  if (s.includes('elem')) return 1;
  if (s.includes('second') || s.includes('high')) return 2;
  if (s.includes('vocational')) return 3;
  if (s.includes('college')) return 4;
  if (s.includes('grad') || s.includes('post')) return 5;
  return 2;
};

const RiskIndicator = ({ label, value, max, icon: Icon, colorClass }) => (
  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-slate-400" />
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-xs font-black text-slate-800">{value}</span>
    </div>
    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
      <div className={`h-full transition-all duration-1000 ${colorClass}`} style={{ width: `${Math.min(100, (parseFloat(String(value).replace(/[^0-9.]/g, '')) / max) * 100)}%` }} />
    </div>
  </div>
);

// --- COMPONENT: STUDENT PORTAL ---
const StudentPortal = ({ studentData, updateStudent, notifications }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [profile, setProfile] = useState(studentData || INITIAL_STUDENTS[0]);

  useEffect(() => { if (studentData) setProfile(studentData); }, [studentData]);

  const calculateRisk = (p) => {
    let score = 0;
    score += (p.absences * 3); 
    if (p.income < 15000) score += 10;
    if (p.studyTime < 5) score += 10;
    if (p.distance > 15) score += 5;
    if (p.parentEdu < 2) score += 5; 
    if (p.householdSize > 6) score += 5; 
    if (p.techAccess === 0) score += 15; 
    if (p.scholarship === 1) score -= 10; 
    if (p.screenTime > 8) score += 10;
    if (p.sleepHours < 6) score += 10;
    return Math.max(0, Math.min(100, score));
  };

  const currentRisk = calculateRisk(profile);
  const successRate = 100 - currentRisk;
  const getRiskStatus = (score) => {
    if (score > 50) return { color: 'text-rose-500', bg: 'bg-rose-50', label: 'High Risk' };
    if (score > 25) return { color: 'text-amber-500', bg: 'bg-amber-50', label: 'Moderate' };
    return { color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Low Risk' };
  };

  const markInterventionDone = (idx) => {
    const updatedInterventions = [...profile.interventions];
    updatedInterventions.splice(idx, 1);
    const updatedProfile = { ...profile, interventions: updatedInterventions };
    setProfile(updatedProfile);
    updateStudent(updatedProfile); 
    alert("Task Verified! Risk Score Recalculated.");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="lg:col-span-3 space-y-2">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4"><User className="text-indigo-600" size={32} /></div>
          <h3 className="font-black text-slate-800 leading-tight">{profile.name}</h3>
          <p className="text-xs font-bold text-slate-400">ID: 2024-00{profile.id}</p>
        </div>
        {notifications.length > 0 && (
          <div className="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-xl shadow-indigo-200 mb-6 animate-pulse">
             <div className="flex items-center gap-2 mb-2"><Megaphone size={16}/><h4 className="text-xs font-black uppercase tracking-widest">Broadcast</h4></div>
             <p className="text-xs font-bold leading-relaxed opacity-90">{notifications[notifications.length-1].message}</p>
          </div>
        )}
        <button onClick={() => setActiveTab('home')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'home' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white'}`}><LayoutDashboard size={20} /> My Progress</button>
        <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white'}`}><Settings size={20} /> Edit Profile</button>
      </div>

      <div className="lg:col-span-9 space-y-6">
        {activeTab === 'home' ? (
          <>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
              <div className="relative w-40 h-40 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                   <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                   <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * successRate) / 100} className="text-indigo-600 transition-all duration-1000" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-3xl font-black text-slate-800">{successRate}%</span><span className="text-[10px] font-bold text-slate-400 uppercase">Success Rate</span></div>
              </div>
              <div className="flex-1 space-y-4">
                <h2 className="text-2xl font-black text-slate-800 text-center md:text-left">Welcome Back, {profile.name.split(' ')[0]}</h2>
                <p className="text-slate-500 text-sm leading-relaxed text-center md:text-left">Your risk status is <span className={`font-bold ${getRiskStatus(currentRisk).color}`}>{getRiskStatus(currentRisk).label}</span>.</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold flex items-center gap-2"><Wallet size={14}/> PHP {profile.income}</div>
                  <div className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-2"><AlertCircle size={14}/> {profile.absences} Absences</div>
                  <div className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-2"><Moon size={14}/> {profile.sleepHours}h Sleep</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                <h4 className="font-black text-slate-800 flex items-center gap-2 text-lg"><ClipboardCheck className="text-indigo-500"/> Action Items {profile.interventions.length > 0 && <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full">{profile.interventions.length}</span>}</h4>
                <div className="space-y-3">
                  {profile.interventions.length > 0 ? profile.interventions.map((task, idx) => (
                      <div key={idx} className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between group">
                        <div className="flex items-center gap-3"><div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm"><BellRing size={14}/></div><div><p className="text-xs font-black text-indigo-900 uppercase tracking-wide">Pending</p><p className="text-sm text-indigo-800 font-bold">{task}</p></div></div>
                        <button onClick={() => markInterventionDone(idx)} className="bg-white text-emerald-500 p-2 rounded-xl shadow-sm hover:bg-emerald-500 hover:text-white transition-all"><CheckCircle2 size={18}/></button>
                      </div>
                    )) : <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl"><p className="text-slate-400 text-xs font-bold">No pending actions.</p></div>}
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                <h4 className="font-black text-slate-800 flex items-center gap-2 text-lg"><ShieldCheck className="text-emerald-500"/> AI Analysis</h4>
                <div className="space-y-3">
                  {profile.techAccess === 0 && <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600"><span className="font-bold text-amber-500">Resource:</span> Digital Divide (No Internet).</div>}
                  {profile.screenTime > 8 && <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600"><span className="font-bold text-rose-500">Focus:</span> Excessive screen time ({profile.screenTime}h).</div>}
                  {profile.risk <= 25 && <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-sm text-emerald-600 font-bold">Profile is optimal.</div>}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-black text-slate-800 mb-6">Manage Profile & Risks</h2>
              {/* STUDENT EDITING - Absences Removed */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Full Name</label><input className="w-full p-4 bg-slate-50 border-slate-100 border rounded-2xl font-bold" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Income</label><input type="number" className="w-full p-4 bg-slate-50 border-slate-100 border rounded-2xl font-bold" value={profile.income} onChange={e => setProfile({...profile, income: parseInt(e.target.value) || 0})} /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Study Hours</label><input type="number" className="w-full p-4 bg-slate-50 border-slate-100 border rounded-2xl font-bold" value={profile.studyTime} onChange={e => setProfile({...profile, studyTime: parseInt(e.target.value) || 0})} /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Sleep Hours</label><input type="number" className="w-full p-4 bg-slate-50 border-slate-100 border rounded-2xl font-bold" value={profile.sleepHours} onChange={e => setProfile({...profile, sleepHours: parseInt(e.target.value) || 0})} /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Screen Time</label><input type="number" className="w-full p-4 bg-slate-50 border-slate-100 border rounded-2xl font-bold" value={profile.screenTime} onChange={e => setProfile({...profile, screenTime: parseInt(e.target.value) || 0})} /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Household Size</label><input type="number" className="w-full p-4 bg-slate-50 border-slate-100 border rounded-2xl font-bold" value={profile.householdSize} onChange={e => setProfile({...profile, householdSize: parseInt(e.target.value) || 0})} /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Tech Access (0/1)</label><select className="w-full p-4 bg-slate-50 border-slate-100 border rounded-2xl font-bold" value={profile.techAccess} onChange={e => setProfile({...profile, techAccess: parseInt(e.target.value)})}>
                    <option value={1}>Available</option><option value={0}>No Access</option></select></div>
              </div>
              <button onClick={() => { updateStudent(profile); setActiveTab('home'); alert("Profile updated and Risk recalculated!"); }} className="mt-8 bg-slate-900 text-white w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl"><Save size={18}/> Update Data & Recalculate</button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- COMPONENT: TEACHER PORTAL ---
const TeacherPortal = ({ students, setStudents }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateRiskTeacher = (p) => {
    let score = 0;
    score += (p.absences * 3); 
    if (p.income < 15000) score += 10;
    if (p.sleepHours < 6) score += 10;
    if (p.screenTime > 8) score += 10;
    if (p.techAccess === 0) score += 15;
    if (p.householdSize > 6) score += 5;
    if (p.scholarship === 1) score -= 5;
    if (p.studyTime < 5) score += 5;
    if (p.distance > 15) score += 5;
    return Math.max(0, Math.min(100, score));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsAnalyzing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter(l => l.trim());
      
      const headerLine = lines[0].toLowerCase();
      const headers = parseCSVLine(headerLine);
      const getIdx = (keywords) => headers.findIndex(h => keywords.some(k => h.includes(k)));
      
      const idx = {
        name: getIdx(['name', 'fullname', 'student']),
        email: getIdx(['email']),
        income: getIdx(['income', 'monthly']),
        absences: getIdx(['absences']),
        study: getIdx(['study', 'hours']),
        dist: getIdx(['distance']),
        edu: getIdx(['education', 'parent']),
        size: getIdx(['size', 'household', 'family']),
        tech: getIdx(['tech', 'internet']),
        schol: getIdx(['scholarship']),
        screen: getIdx(['screen']),
        sleep: getIdx(['sleep'])
      };

      const newStudents = lines.slice(1).map((line, index) => {
        const cols = parseCSVLine(line);
        if (cols.length < 5) return null;

        const s = {
          id: `csv-${Date.now()}-${index}`,
          name: cols[idx.name] || "Unknown",
          email: cols[idx.email] || "noemail@univ.edu",
          income: cleanIncome(cols[idx.income]),
          absences: cleanNumber(cols[idx.absences]),
          studyTime: cleanNumber(cols[idx.study]),
          distance: cleanNumber(cols[idx.dist]),
          parentEdu: mapEdu(cols[idx.edu]),
          householdSize: cleanNumber(cols[idx.size]) || 4,
          techAccess: mapYesNo(cols[idx.tech]),
          scholarship: mapYesNo(cols[idx.schol]),
          screenTime: cleanNumber(cols[idx.screen]),
          sleepHours: cleanNumber(cols[idx.sleep]),
          interventions: []
        };
        
        s.risk = calculateRiskTeacher(s);
        s.status = s.risk > 50 ? 'At Risk' : 'Stable';
        return s;
      }).filter(Boolean);

      if (newStudents.length > 0) {
        setStudents(prev => [...prev, ...newStudents]);
        setNotification(`Successfully imported ${newStudents.length} profiles.`);
      } else {
        setNotification("Failed to parse CSV. Check headers.");
      }
      setTimeout(() => { setIsAnalyzing(false); setIsUploading(false); setNotification(null); }, 2000);
    };
    reader.readAsText(file);
  };

  const saveEdit = () => {
     const newRisk = calculateRiskTeacher(editData);
     const updated = { ...editData, risk: newRisk, status: newRisk > 50 ? 'At Risk' : 'Stable' };
     setStudents(students.map(s => s.id === updated.id ? updated : s));
     setSelectedStudent(updated);
     setEditMode(false);
     setNotification(`Updated ${updated.name}.`);
  };

  const deployIntervention = (type) => {
    if (!selectedStudent) return;
    const task = type === 'financial' ? "Apply for TES Subsidy" : "Guidance Counseling";
    const updated = { ...selectedStudent, interventions: [...selectedStudent.interventions, task] };
    setStudents(students.map(s => s.id === updated.id ? updated : s));
    setSelectedStudent(updated);
    setNotification("Intervention Deployed.");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div><h2 className="text-3xl font-black text-slate-800 tracking-tight">Faculty Dashboard</h2><p className="text-slate-400 text-sm font-bold">12-Factor Socioeconomic Risk Analysis</p></div>
        <button onClick={() => setIsUploading(true)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"><Plus size={16}/> Upload CSV</button>
      </div>

      {notification && <div className="bg-emerald-500 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg"><div className="flex items-center gap-3"><CheckCircle2 size={18}/><span className="font-bold text-sm">{notification}</span></div><button onClick={() => setNotification(null)}><X size={16}/></button></div>}

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <h4 className="font-black text-slate-800">Student Registry</h4>
          <input placeholder="Filter..." className="pl-4 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                <th className="px-8 py-4">Student</th>
                <th className="px-8 py-4 text-center">Factors Summary</th>
                <th className="px-8 py-4 text-center">Risk Score</th>
                <th className="px-8 py-4">Active Tasks</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black shrink-0">{student.name[0]}</div>
                        <div><p className="text-sm font-black text-slate-800">{student.name}</p><p className="text-[10px] text-slate-400 font-bold">{student.email}</p></div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center text-xs font-bold text-slate-500">
                        Inc: {student.income/1000}k • Slp: {student.sleepHours}h • Scr: {student.screenTime}h
                    </td>
                    <td className="px-8 py-5 text-center"><span className={`px-3 py-1 rounded-full text-[10px] font-black ${student.risk > 50 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>{student.risk}%</span></td>
                    <td className="px-8 py-5"><span className="text-[10px] font-bold text-slate-400 uppercase">{student.interventions.length} Pending</span></td>
                    <td className="px-8 py-5 text-right">
                      <button onClick={() => { setSelectedStudent(student); setEditData(student); setEditMode(false); }} className="p-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><Edit3 size={16}/></button>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- TEACHER ANALYSIS MODAL --- */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-6 border-b border-slate-100 flex justify-between items-center z-10">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl">{selectedStudent.name[0]}</div>
                    <div><h3 className="text-xl font-black text-slate-800">{selectedStudent.name}</h3><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Analysis</p></div>
                 </div>
                 <button onClick={() => setSelectedStudent(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all"><X/></button>
              </div>

              <div className="p-8 space-y-8">
                 {editMode ? (
                     <div className="space-y-6">
                        <div className="flex justify-between items-center"><h4 className="text-lg font-black text-slate-800">Edit Complete Profile</h4><button onClick={() => setEditMode(false)} className="text-xs font-bold text-rose-500 uppercase">Cancel</button></div>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-2"><label className="text-[10px] uppercase font-black text-slate-400">Income</label><input type="number" className="w-full p-3 bg-slate-50 rounded-xl font-bold" value={editData.income} onChange={(e) => setEditData({...editData, income: parseInt(e.target.value) || 0})} /></div>
                            <div className="space-y-2"><label className="text-[10px] uppercase font-black text-slate-400">Absences</label><input type="number" className="w-full p-3 bg-slate-50 rounded-xl font-bold" value={editData.absences} onChange={(e) => setEditData({...editData, absences: parseInt(e.target.value) || 0})} /></div>
                            <div className="space-y-2"><label className="text-[10px] uppercase font-black text-slate-400">Study Time</label><input type="number" className="w-full p-3 bg-slate-50 rounded-xl font-bold" value={editData.studyTime} onChange={(e) => setEditData({...editData, studyTime: parseInt(e.target.value) || 0})} /></div>
                            <div className="space-y-2"><label className="text-[10px] uppercase font-black text-slate-400">Sleep (Hrs)</label><input type="number" className="w-full p-3 bg-slate-50 rounded-xl font-bold" value={editData.sleepHours} onChange={(e) => setEditData({...editData, sleepHours: parseInt(e.target.value) || 0})} /></div>
                            <div className="space-y-2"><label className="text-[10px] uppercase font-black text-slate-400">Screen Time</label><input type="number" className="w-full p-3 bg-slate-50 rounded-xl font-bold" value={editData.screenTime} onChange={(e) => setEditData({...editData, screenTime: parseInt(e.target.value) || 0})} /></div>
                            <div className="space-y-2"><label className="text-[10px] uppercase font-black text-slate-400">Distance</label><input type="number" className="w-full p-3 bg-slate-50 rounded-xl font-bold" value={editData.distance} onChange={(e) => setEditData({...editData, distance: parseInt(e.target.value) || 0})} /></div>
                            <div className="space-y-2"><label className="text-[10px] uppercase font-black text-slate-400">Tech Access (0/1)</label><input type="number" className="w-full p-3 bg-slate-50 rounded-xl font-bold" value={editData.techAccess} onChange={(e) => setEditData({...editData, techAccess: parseInt(e.target.value) || 0})} /></div>
                            <div className="space-y-2"><label className="text-[10px] uppercase font-black text-slate-400">Scholarship (0/1)</label><input type="number" className="w-full p-3 bg-slate-50 rounded-xl font-bold" value={editData.scholarship} onChange={(e) => setEditData({...editData, scholarship: parseInt(e.target.value) || 0})} /></div>
                            <div className="space-y-2"><label className="text-[10px] uppercase font-black text-slate-400">Household</label><input type="number" className="w-full p-3 bg-slate-50 rounded-xl font-bold" value={editData.householdSize} onChange={(e) => setEditData({...editData, householdSize: parseInt(e.target.value) || 0})} /></div>
                        </div>
                        <button onClick={saveEdit} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs hover:bg-indigo-700 transition-all">Save & Recalculate Risk</button>
                     </div>
                 ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-l-4 border-indigo-600 pl-4">Metrics</h4>
                                <button onClick={() => setEditMode(true)} className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">Edit All</button>
                            </div>
                            
                            {/* SCROLLABLE METRICS CONTAINER */}
                            <div className="grid grid-cols-1 gap-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                                <RiskIndicator label="Monthly Income" value={`PHP ${selectedStudent.income.toLocaleString()}`} max={50000} icon={Wallet} colorClass={selectedStudent.income < 10000 ? "bg-rose-500" : "bg-emerald-500"} />
                                <RiskIndicator label="Absences" value={`${selectedStudent.absences} days`} max={30} icon={Calendar} colorClass={selectedStudent.absences > 10 ? "bg-rose-500" : "bg-emerald-500"} />
                                <RiskIndicator label="Sleep Duration" value={`${selectedStudent.sleepHours} hrs`} max={10} icon={Moon} colorClass={selectedStudent.sleepHours < 6 ? "bg-rose-500" : "bg-emerald-500"} />
                                <RiskIndicator label="Screen Time" value={`${selectedStudent.screenTime} hrs`} max={12} icon={Monitor} colorClass={selectedStudent.screenTime > 8 ? "bg-amber-500" : "bg-emerald-500"} />
                                <RiskIndicator label="Study Time" value={`${selectedStudent.studyTime} hrs/wk`} max={30} icon={Book} colorClass={selectedStudent.studyTime < 5 ? "bg-rose-500" : "bg-emerald-500"} />
                                <RiskIndicator label="Distance" value={`${selectedStudent.distance} km`} max={30} icon={MapPin} colorClass={selectedStudent.distance > 15 ? "bg-amber-500" : "bg-emerald-500"} />
                                <RiskIndicator label="Household Size" value={`${selectedStudent.householdSize} members`} max={10} icon={Users} colorClass={selectedStudent.householdSize > 6 ? "bg-amber-500" : "bg-emerald-500"} />
                                <RiskIndicator label="Tech Access" value={selectedStudent.techAccess ? "Available" : "Limited"} max={1} icon={Wifi} colorClass={!selectedStudent.techAccess ? "bg-rose-500" : "bg-emerald-500"} />
                                <RiskIndicator label="Parent Edu" value={`Level ${selectedStudent.parentEdu}`} max={5} icon={UserCheck} colorClass={selectedStudent.parentEdu < 2 ? "bg-amber-500" : "bg-emerald-500"} />
                                <RiskIndicator label="Scholarship" value={selectedStudent.scholarship ? "Yes" : "No"} max={1} icon={Award} colorClass={!selectedStudent.scholarship ? "bg-slate-300" : "bg-emerald-500"} />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-l-4 border-emerald-500 pl-4">Intervention</h4>
                            <div className="bg-slate-50 rounded-[2rem] border border-slate-100 p-6 space-y-4">
                                <div onClick={() => deployIntervention('financial')} className="p-4 bg-white rounded-xl border border-slate-100 flex justify-between items-center cursor-pointer hover:border-indigo-300"><div className="flex gap-3"><Award className="text-emerald-600"/><span className="text-xs font-black uppercase">Subsidy</span></div><Plus size={16}/></div>
                                <div onClick={() => deployIntervention('counseling')} className="p-4 bg-white rounded-xl border border-slate-100 flex justify-between items-center cursor-pointer hover:border-indigo-300"><div className="flex gap-3"><Activity className="text-rose-600"/><span className="text-xs font-black uppercase">Counseling</span></div><Plus size={16}/></div>
                            </div>
                        </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* --- UPLOAD MODAL --- */}
      {isUploading && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="text-center"><div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6"><FileText className="text-indigo-600" size={32} /></div><h3 className="text-2xl font-black text-slate-800 tracking-tight">CSV Upload</h3></div>
            <label className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center group hover:border-indigo-400 transition-all cursor-pointer block">
              <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
              {isAnalyzing ? <p className="text-[10px] font-black text-indigo-600 uppercase">Analyzing...</p> : <><Plus className="mx-auto text-slate-300 mb-4" size={32} /><p className="text-xs font-black text-slate-400 uppercase">Select File</p></>}
            </label>
            <button onClick={() => setIsUploading(false)} className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-xs uppercase hover:bg-slate-100">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPONENT: ADMIN PORTAL ---
const AdminPortal = ({ broadcastAlert, students, setStudents }) => {
    const [activeTab, setActiveTab] = useState('broadcast');
    const [msg, setMsg] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '' });

    const handleAddUser = () => {
        if(!newUser.name || !newUser.email) return;
        const newStudent = {
            id: Date.now().toString(),
            name: newUser.name,
            email: newUser.email,
            income: 0, absences: 0, studyTime: 5, distance: 0, parentEdu: 2,
            householdSize: 4, techAccess: 1, scholarship: 0, screenTime: 4, sleepHours: 8,
            risk: 0, status: 'Stable', interventions: []
        };
        setStudents(prev => [...prev, newStudent]);
        setIsAddModalOpen(false);
        setNewUser({ name: '', email: '' });
        alert("User added to database.");
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="flex justify-between items-center">
                <div><h2 className="text-3xl font-black text-slate-800 tracking-tight">System Admin</h2><p className="text-slate-400 text-sm font-bold">Secure Command Center</p></div>
                <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                    <button onClick={() => setActiveTab('broadcast')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'broadcast' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>Broadcast</button>
                    <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>Database</button>
                </div>
            </div>

            {activeTab === 'broadcast' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm"><h4 className="font-black text-slate-800 mb-6 flex items-center gap-2"><Megaphone className="text-rose-500"/> Broadcast Alert</h4><textarea className="w-full p-4 bg-slate-50 border-slate-100 border rounded-2xl outline-none focus:border-indigo-500 text-sm font-bold min-h-[120px]" placeholder="Type message..." value={msg} onChange={e => setMsg(e.target.value)} /><button onClick={() => { broadcastAlert(msg); setMsg(""); alert("Alert Sent"); }} className="w-full mt-4 py-4 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-600 shadow-lg shadow-rose-200">Send</button></div>
                  <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-center items-center text-center space-y-4"><Lock size={48} className="text-indigo-400 mb-4"/><h3 className="text-xl font-black">Secure</h3><p className="text-xs text-slate-400">System operating at 100% capacity.</p></div>
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                        <h4 className="font-black text-slate-800">Student Database</h4>
                        <button onClick={() => setIsAddModalOpen(true)} className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-emerald-600 transition-all"><UserPlus size={16}/> Add User</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead><tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50"><th className="px-8 py-4">User</th><th className="px-8 py-4 text-center">Role</th><th className="px-8 py-4 text-right">Action</th></tr></thead>
                            <tbody className="divide-y divide-slate-100">
                                {students.map(s => (
                                    <tr key={s.id} className="hover:bg-slate-50/50">
                                        <td className="px-8 py-4"><p className="font-black text-sm text-slate-800">{s.name}</p><p className="text-[10px] text-slate-400">{s.email}</p></td>
                                        <td className="px-8 py-4 text-center"><span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Student</span></td>
                                        <td className="px-8 py-4 text-right"><button onClick={() => {
                                            if(window.confirm("Delete this user?")) {
                                                setStudents(prev => prev.filter(st => st.id !== s.id));
                                            }
                                        }} className="text-rose-400 hover:text-rose-600 p-2"><Trash2 size={16}/></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
                        <h3 className="text-xl font-black text-slate-800">Add New Student</h3>
                        <div className="space-y-3">
                            <div><label className="text-[10px] font-black text-slate-400 uppercase">Name</label><input className="w-full p-3 bg-slate-50 rounded-xl font-bold" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} /></div>
                            <div><label className="text-[10px] font-black text-slate-400 uppercase">Email</label><input className="w-full p-3 bg-slate-50 rounded-xl font-bold" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} /></div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 text-slate-400 font-bold text-xs uppercase hover:bg-slate-50 rounded-xl">Cancel</button>
                            <button onClick={handleAddUser} className="flex-1 py-3 bg-emerald-500 text-white font-bold text-xs uppercase rounded-xl hover:bg-emerald-600">Create</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MAIN CONTROLLER ---
export default function App() {
  const [view, setView] = useState('landing'); 
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [notifications, setNotifications] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      if (role === 'student') {
          const studentFound = students.find(s => s.email.toLowerCase() === loginEmail.toLowerCase());
          if (studentFound) { setCurrentUserData(studentFound); setView('dashboard'); } 
          else if(loginEmail === '') { setCurrentUserData(students[0]); setView('dashboard'); }
          else alert("Email not found.");
      } else { setView('dashboard'); }
      setIsLoading(false);
    }, 1000);
  };

  const updateStudent = (updatedData) => {
     setStudents(students.map(s => s.id === updatedData.id ? updatedData : s));
     if(currentUserData && currentUserData.id === updatedData.id) setCurrentUserData(updatedData);
  };

  const broadcastAlert = (msg) => { setNotifications(prev => [...prev, { id: Date.now(), message: msg }]); };

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white overflow-hidden relative">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
        <div className="relative z-10 w-full max-w-lg text-center animate-in fade-in zoom-in-95 duration-1000">
          <div className="inline-flex p-4 rounded-[2.5rem] bg-indigo-500/10 border border-indigo-500/20 mb-10 shadow-2xl shadow-indigo-500/10"><BrainCircuit className="text-indigo-400 w-12 h-12" /></div>
          <h1 className="text-6xl font-black mb-4 tracking-tighter uppercase italic leading-none">Success<span className="text-indigo-500">Predict</span></h1>
          <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em] mb-12">Socio-AI Student Intervention</p>
          <div className="space-y-4">
            {['student', 'teacher', 'admin'].map((id) => (
              <button key={id} onClick={() => { setRole(id); setView('login'); setLoginEmail(''); }} className="w-full group bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-[2rem] flex items-center justify-between hover:bg-indigo-600 hover:border-indigo-400 transition-all">
                <div className="flex items-center gap-4 text-left">
                   <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                      {id === 'student' && <GraduationCap size={18}/>}
                      {id === 'teacher' && <Users size={18}/>}
                      {id === 'admin' && <ShieldCheck size={18}/>}
                   </div>
                   <span className="font-black text-sm uppercase tracking-widest">{id} Portal</span>
                </div>
                <ArrowRight size={20} className="text-slate-700 group-hover:text-white transition-all transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white">
        <div className="w-full max-w-md space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
           <button onClick={() => setView('landing')} className="group text-slate-500 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all"><ArrowRight size={16} className="rotate-180" /> Back</button>
           <div className="bg-[#0f172a] p-10 rounded-[3.5rem] border border-slate-800 shadow-2xl space-y-8">
              <div className="text-center"><h2 className="text-2xl font-black uppercase tracking-tight">{role} Access</h2></div>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                 <div className="space-y-1"><label className="text-[10px] font-black text-slate-600 uppercase ml-2 tracking-widest">Email</label><input required className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl outline-none focus:border-indigo-500 font-bold text-white placeholder:text-slate-700" placeholder="name@univ.edu" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} /></div>
                 <div className="space-y-1"><label className="text-[10px] font-black text-slate-600 uppercase ml-2 tracking-widest">Password</label><input required type="password" defaultValue="demo123" className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl outline-none focus:border-indigo-500 font-bold text-white" /></div>
                 <button type="submit" disabled={isLoading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-indigo-500">{isLoading ? 'Authenticating...' : 'Enter Dashboard'}</button>
              </form>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <nav className="bg-white/80 backdrop-blur-xl border-b sticky top-0 z-[80] px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3 font-black text-2xl tracking-tighter italic select-none"><BrainCircuit className="text-indigo-600" size={22}/> SUCCESS<span className="text-indigo-600">PREDICT</span></div>
        <button onClick={() => { setView('landing'); setRole(null); setCurrentUserData(null); }} className="bg-rose-50 text-rose-500 p-3 rounded-2xl hover:bg-rose-100 hover:text-rose-600 active:scale-90 transition-all shadow-sm"><LogOut size={20} /></button>
      </nav>
      <main className="max-w-7xl mx-auto p-6 lg:p-12">
        {role === 'student' && <StudentPortal studentData={currentUserData} updateStudent={updateStudent} notifications={notifications}/>}
        {role === 'teacher' && <TeacherPortal students={students} setStudents={setStudents} />}
        {role === 'admin' && <AdminPortal broadcastAlert={broadcastAlert} students={students} setStudents={setStudents} />}
      </main>
    </div>
  );
}