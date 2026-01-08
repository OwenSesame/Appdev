import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, LogOut, User, GraduationCap, ArrowRight,
  ShieldCheck, Wallet, Award, Save, Calendar, Search, 
  LayoutDashboard, AlertCircle, Users, FileText,
  TrendingDown, Filter, Download, Plus, Trash2, 
  ChevronRight, Settings, Info, Lock, Mail, X,
  Activity, Home, MapPin, BookOpen, CheckCircle2
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_STUDENTS = [
  { id: '1', name: 'Juan Dela Cruz', income: 8500, absences: 14, risk: 78, status: 'At Risk', email: 'juan@univ.edu', studyTime: 8, distance: 15, parentEdu: 1 },
  { id: '2', name: 'Maria Santos', income: 28000, absences: 2, risk: 12, status: 'Stable', email: 'maria@univ.edu', studyTime: 25, distance: 2, parentEdu: 4 },
  { id: '3', name: 'Kevin Lee', income: 14500, absences: 6, risk: 32, status: 'Stable', email: 'kevin@univ.edu', studyTime: 12, distance: 8, parentEdu: 2 },
];

const MOCK_USERS = [
  { id: 'u1', name: 'Dr. Smith', role: 'teacher', email: 'smith@univ.edu' },
  { id: 'u2', name: 'Admin Jane', role: 'admin', email: 'admin@univ.edu' },
  { id: 'u3', name: 'Juan Dela Cruz', role: 'student', email: 'juan@univ.edu' },
];

// --- HELPER COMPONENTS ---

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
      <div 
        className={`h-full transition-all duration-1000 ${colorClass}`} 
        style={{ width: `${Math.min(100, (parseFloat(String(value).replace(/[^0-9.]/g, '')) / max) * 100)}%` }}
      />
    </div>
  </div>
);

// --- DASHBOARD COMPONENTS ---

const StudentPortal = ({ studentData }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [profile, setProfile] = useState(studentData || INITIAL_STUDENTS[0]);

  // 1. DYNAMIC CALCULATION: Recalculate risk based on current profile state
  // This ensures that when income or absences change, the Success Rate updates immediately
  const calculateDynamicRisk = () => {
    const baseRisk = (profile.absences * 5);
    const incomePenalty = profile.income < 10000 ? 20 : 0;
    const studyBonus = (profile.studyTime || 10) > 20 ? -10 : 0;
    
    // Clamp value between 0 and 100
    return Math.max(0, Math.min(100, baseRisk + incomePenalty + studyBonus));
  };

  const currentRisk = calculateDynamicRisk();
  const successRate = 100 - currentRisk;

  const getRiskStatus = (score) => {
    if (score > 50) return { color: 'text-rose-500', bg: 'bg-rose-50', label: 'High Risk' };
    if (score > 20) return { color: 'text-amber-500', bg: 'bg-amber-50', label: 'Moderate' };
    return { color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Low Risk' };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Sidebar - Same as before */}
      <div className="lg:col-span-3 space-y-2">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
            <User className="text-indigo-600" size={32} />
          </div>
          <h3 className="font-black text-slate-800 leading-tight">{profile.name}</h3>
          <p className="text-xs font-bold text-slate-400">Student ID: 2024-0001</p>
        </div>
        <button onClick={() => setActiveTab('home')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'home' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white'}`}>
          <LayoutDashboard size={20} /> My Progress
        </button>
        <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white'}`}>
          <Settings size={20} /> Edit Profile
        </button>
      </div>

      <div className="lg:col-span-9 space-y-6">
        {activeTab === 'home' ? (
          <>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
              <div className="relative w-40 h-40 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                   <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                   {/* 2. UPDATE: Uses successRate for the circle progress */}
                   <circle 
                    cx="80" 
                    cy="80" 
                    r="70" 
                    stroke="currentColor" 
                    strokeWidth="12" 
                    fill="transparent" 
                    strokeDasharray={440} 
                    strokeDashoffset={440 - (440 * successRate) / 100} 
                    className="text-indigo-600 transition-all duration-1000" 
                   />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-800">{successRate}%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Success Rate</span>
                 </div>
              </div>
              <div className="flex-1 space-y-4">
                <h2 className="text-2xl font-black text-slate-800 text-center md:text-left">Welcome Back, {profile.name.split(' ')[0]}</h2>
                <p className="text-slate-500 text-sm leading-relaxed text-center md:text-left">
                  Your risk status is <span className={`font-bold ${getRiskStatus(currentRisk).color}`}>{getRiskStatus(currentRisk).label}</span> based on your updated socioeconomic data.
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold flex items-center gap-2"><Wallet size={14}/> PHP {(profile.income || 0).toLocaleString()}/mo</div>
                  <div className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-2"><AlertCircle size={14}/> {profile.absences} Absences</div>
                </div>
              </div>
            </div>

            {/* AI Insights Section - Also dynamic now */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                <h4 className="font-black text-slate-800 flex items-center gap-2 text-lg"><TrendingDown className="text-rose-500"/> AI Predicted Challenges</h4>
                <div className="space-y-3">
                  {profile.absences > 10 && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600">
                      High absenteeism ({profile.absences} sessions) is impacting your performance.
                    </div>
                  )}
                  {profile.income < 10000 && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600">
                      Financial pressure may be affecting your focus.
                    </div>
                  )}
                  {profile.absences <= 10 && profile.income >= 10000 && (
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-sm text-emerald-600">
                      No major socio-academic risks detected at this time.
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                <h4 className="font-black text-slate-800 flex items-center gap-2 text-lg"><ShieldCheck className="text-emerald-500"/> Recommended Solutions</h4>
                <div className="space-y-3">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                    <Award className="text-emerald-600 shrink-0" size={18}/>
                    <p className="text-sm text-emerald-800 font-bold">
                      {profile.income < 15000 ? "Eligible for University Grant (B-12)." : "Maintain current academic standing."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* 3. SETTINGS TAB: Now includes Absences so you can test the Success Rate change */
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-black text-slate-800 mb-6">Profile Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Full Name</label>
                  <input className="w-full p-4 bg-slate-50 border-transparent focus:border-indigo-500 border rounded-2xl outline-none transition-all font-bold" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Monthly Income (PHP)</label>
                  <input type="number" className="w-full p-4 bg-slate-50 border-transparent focus:border-indigo-500 border rounded-2xl outline-none transition-all font-bold" value={profile.income} onChange={e => setProfile({...profile, income: parseInt(e.target.value) || 0})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Total Absences</label>
                  <input type="number" className="w-full p-4 bg-slate-50 border-transparent focus:border-indigo-500 border rounded-2xl outline-none transition-all font-bold" value={profile.absences} onChange={e => setProfile({...profile, absences: parseInt(e.target.value) || 0})} />
                </div>
              </div>
              <button 
                onClick={() => {
                  setActiveTab('home');
                  alert("Profile updated and Risk recalculated!");
                }}
                className="mt-8 bg-slate-900 text-white w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
              >
                <Save size={18}/> Update & View Progress
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

const TeacherPortal = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [studentsList, setStudentsList] = useState(INITIAL_STUDENTS);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // 1. Add search state
  const [searchQuery, setSearchQuery] = useState('');

  // 2. Create the filtered list based on the search query
  const filteredStudents = studentsList.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

 const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  setIsAnalyzing(true);
  const reader = new FileReader();

  reader.onload = (e) => {
    const text = e.target.result;
    const rows = text.split('\n').filter(r => r.trim()).slice(1); 
    
    const newStudents = rows.map((row, index) => {
      const cols = row.split(',').map(col => col.replace(/"/g, '').trim());
      if (cols.length < 4) return null;

      const email = cols[1] || "No Email";
      
      // Check if student email already exists in the current list
      const isDuplicate = studentsList.some(s => s.email.toLowerCase() === email.toLowerCase());
      if (isDuplicate) return null; 

      const income = parseInt(cols[2]) || 0;
      const absences = parseInt(cols[3]) || 0;
      const risk = parseInt(cols[4]) || Math.min(100, (absences * 5) + (income < 10000 ? 20 : 0));

      return {
        id: `csv-${index}-${Date.now()}`,
        name: cols[0] || "Unknown Student",
        email: email,
        income: income,
        absences: absences,
        risk: risk,
        status: risk > 50 ? 'At Risk' : 'Stable',
        studyTime: parseInt(cols[5]) || 10,
        distance: parseInt(cols[6]) || 5,
        parentEdu: parseInt(cols[7]) || 2
      };
    }).filter(s => s !== null);

    if (newStudents.length > 0) {
      setStudentsList(prev => [...newStudents, ...prev]);
      setNotification(`${newStudents.length} new records synced`);
    } else {
      setNotification('No new unique records found');
    }
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsUploading(false);
      setNotification(null);
    }, 3000);
  };

  reader.readAsText(file);
};

  const downloadSampleCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,name,email,income,absences,risk,study_time,distance,parent_edu\n" +
      "Juan Dela Cruz,juan@univ.edu,8500,14,78,8,15,1\n" +
      "Maria Santos,maria@univ.edu,28000,2,12,25,2,4\n" +
      "Pedro Gomez,pedro@univ.edu,12000,8,45,15,5,2";
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "student_analytics_sample.csv";
    link.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Faculty Dashboard</h2>
          <p className="text-slate-400 text-sm font-bold">Identifying academic risks through AI socio-analysis.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={downloadSampleCSV} className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-600 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-colors">
            <Download size={16}/> Sample CSV
          </button>
          <button onClick={() => setIsUploading(true)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
            <Plus size={16}/> Upload CSV
          </button>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-500 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={18}/>
            <span className="font-bold text-sm">{notification}</span>
          </div>
          <button onClick={() => setNotification(null)}><X size={16}/></button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Monitoring', value: studentsList.length, icon: <Users className="text-indigo-500"/>, bg: 'bg-indigo-50/50' },
          { label: 'High Risk Students', value: studentsList.filter(s => s.risk > 50).length, icon: <AlertCircle className="text-rose-500"/>, bg: 'bg-rose-50/50' },
          { label: 'Search Results', value: filteredStudents.length, icon: <Filter className="text-emerald-500"/>, bg: 'bg-emerald-50/50' }
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 bg-white transition-transform hover:scale-[1.02]`}>
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center`}>{stat.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <h4 className="font-black text-slate-800">Intervention Registry</h4>
          <div className="relative">
             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             {/* 3. Bind the input to the searchQuery state */}
             <input 
                placeholder="Filter students..." 
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 transition-all" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                <th className="px-8 py-4">Student</th>
                <th className="px-8 py-4 text-center">Income Level</th>
                <th className="px-8 py-4 text-center">Risk Factor</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* 4. Map through filteredStudents instead of studentsList */}
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black shrink-0">{student.name[0]}</div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-800 truncate">{student.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold truncate">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center font-bold text-slate-600 text-sm">
                      PHP {(student.income || 0).toLocaleString()}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`text-sm font-black ${student.risk > 50 ? 'text-rose-500' : 'text-emerald-500'}`}>{student.risk}%</span>
                        <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                           <div className={`h-full ${student.risk > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${student.risk}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${student.risk > 50 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {student.risk > 50 ? 'At Risk' : 'Stable'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => setSelectedStudent(student)}
                        className="w-10 h-10 inline-flex items-center justify-center bg-slate-50 text-slate-400 hover:text-white hover:bg-indigo-600 rounded-2xl transition-all shadow-sm"
                        title="Analyze"
                      >
                        <ChevronRight size={18}/>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-10 text-center text-slate-400 font-bold text-sm">
                    No students found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- DETAILED ANALYSIS MODAL --- */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-6 border-b border-slate-100 flex justify-between items-center z-10">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl">
                      {selectedStudent.name[0]}
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-800">{selectedStudent.name}</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Socioeconomic Profile</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedStudent(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all"><X/></button>
              </div>

              <div className="p-8 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Metrics Section */}
                    <div className="space-y-6">
                       <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-l-4 border-indigo-600 pl-4">Risk Distribution</h4>
                       <div className="grid grid-cols-1 gap-4">
                          <RiskIndicator 
                            label="Monthly Income" 
                            value={`PHP ${selectedStudent.income.toLocaleString()}`} 
                            max={50000} 
                            icon={Wallet} 
                            colorClass={selectedStudent.income < 10000 ? "bg-rose-500" : "bg-emerald-500"} 
                          />
                          <RiskIndicator 
                            label="Absences" 
                            value={`${selectedStudent.absences} Days`} 
                            max={30} 
                            icon={Calendar} 
                            colorClass={selectedStudent.absences > 10 ? "bg-rose-500" : "bg-amber-500"} 
                          />
                          <RiskIndicator 
                            label="Study Hours" 
                            value={`${selectedStudent.studyTime || 10} hrs/wk`} 
                            max={40} 
                            icon={BookOpen} 
                            colorClass={(selectedStudent.studyTime || 10) < 15 ? "bg-rose-500" : "bg-emerald-500"} 
                          />
                          <RiskIndicator 
                            label="Commute Dist." 
                            value={`${selectedStudent.distance || 5} KM`} 
                            max={30} 
                            icon={MapPin} 
                            colorClass={(selectedStudent.distance || 5) > 10 ? "bg-amber-500" : "bg-emerald-500"} 
                          />
                       </div>
                    </div>

                    {/* AI Insights Section */}
                    <div className="space-y-6">
                       <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-l-4 border-emerald-500 pl-4">Intervention Strategy</h4>
                       <div className="bg-emerald-50/50 rounded-[2rem] border border-emerald-100 p-6 space-y-6">
                          <div className="flex gap-4">
                             <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                                <Award className="text-emerald-600" size={20}/>
                             </div>
                             <div>
                                <p className="text-sm font-black text-emerald-900 mb-1">Financial Assistance</p>
                                <p className="text-xs text-emerald-700 leading-relaxed">
                                  Income level PHP {selectedStudent.income.toLocaleString()} is below the poverty threshold. 
                                  <strong> Recommendation:</strong> Fast-track for Tertiary Education Subsidy (TES) Application.
                                </p>
                             </div>
                          </div>
                          
                          <div className="flex gap-4">
                             <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                                <Activity className="text-amber-600" size={20}/>
                             </div>
                             <div>
                                <p className="text-sm font-black text-amber-900 mb-1">Retention Support</p>
                                <p className="text-xs text-amber-700 leading-relaxed">
                                  Absences reached {selectedStudent.absences} sessions. 
                                  <strong> Recommendation:</strong> Assign Peer Mentor and schedule a guidance counselor interview.
                                </p>
                             </div>
                          </div>

                       <div className="pt-4 border-t border-emerald-100">
                          <button 
                            onClick={() => {
                              setSelectedStudent(null);
                              setNotification(`Intervention deployed for ${selectedStudent.name}`);
                              setTimeout(() => setNotification(null), 3000);
                            }}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl"
                          >
                            Deploy Interventions
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
        </div>
      )}

      {/* --- UPLOAD MODAL --- */}
      {isUploading && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <FileText className="text-indigo-600" size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">CSV Scrutiny</h3>
              <p className="text-xs text-slate-400 font-bold mt-1">Batch process student records via AI</p>
            </div>
            <label className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center group hover:border-indigo-400 transition-all cursor-pointer block">
              <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
              {isAnalyzing ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[10px] font-black text-indigo-600 uppercase">Analyzing Records...</p>
                </div>
              ) : (
                <>
                  <Plus className="mx-auto text-slate-300 mb-4 transition-transform group-hover:scale-110" size={32} />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Select CSV File</p>
                </>
              )}
            </label>
            <button onClick={() => setIsUploading(false)} className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-xs uppercase hover:bg-slate-100 transition-colors">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminPortal = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [isDeleting, setIsDeleting] = useState(null);
  
  // --- NEW STATES FOR FUNCTIONALITY ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newAccount, setNewAccount] = useState({
    name: '',
    email: '',
    role: 'student'
  });

  // --- HANDLERS ---
  const handleAddAccount = (e) => {
    e.preventDefault();
    const newUser = {
      ...newAccount,
      id: `u${Date.now()}`,
    };
    setUsers([newUser, ...users]);
    setIsAddModalOpen(false);
    setNewAccount({ name: '', email: '', role: 'student' });
  };

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
    setIsDeleting(null);
  };

  // --- CSV UPLOAD FOR ACCOUNTS ---
  const handleCSVUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const rows = text.split('\n').filter(r => r.trim()).slice(1);
    
    const uploadedUsers = rows.map((row, index) => {
      const cols = row.split(',').map(col => col.replace(/"/g, '').trim());
      if (cols.length < 3) return null;

      const email = cols[1];

      // DUPLICATE CHECK: Skip if email already exists in the system
      const isDuplicate = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (isDuplicate) return null;

      return {
        id: `csv-user-${index}-${Date.now()}`,
        name: cols[0],
        email: email,
        role: (cols[2] || 'student').toLowerCase()
      };
    }).filter(u => u !== null);

    if (uploadedUsers.length > 0) {
      setUsers(prev => [...uploadedUsers, ...prev]);
      alert(`${uploadedUsers.length} accounts added.`);
    } else {
      alert("No new accounts were added (duplicates detected).");
    }
    setIsUploading(false);
  };
  reader.readAsText(file);
};

  // --- SEARCH FILTER ---
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">System Admin</h2>
          <p className="text-slate-400 text-sm font-bold">Managing database accounts and security protocols.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsUploading(true)}
            className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-slate-50 transition-all"
          >
            <Download size={18}/> Import CSV
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-indigo-600 transition-all"
          >
            <Plus size={18}/> New Account
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center bg-slate-50/30 gap-4">
            <h4 className="font-black text-slate-800">User Directory</h4>
            
            {/* SEARCH BAR */}
            <div className="relative flex-1 max-w-xs w-full">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Filter accounts..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="divide-y divide-slate-100">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.id} className="px-8 py-6 flex items-center justify-between group hover:bg-slate-50/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${user.role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                      {user.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-400 font-bold">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                      {user.role}
                     </span>
                     {isDeleting === user.id ? (
                       <div className="flex gap-2">
                          <button onClick={() => deleteUser(user.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><CheckCircle2 size={18}/></button>
                          <button onClick={() => setIsDeleting(null)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><X size={18}/></button>
                       </div>
                     ) : (
                      <button onClick={() => setIsDeleting(user.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-all"><Trash2 size={18}/></button>
                     )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                No users found
              </div>
            )}
          </div>
        </div>

        {/* ORIGINAL SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6 shadow-xl">
             <h4 className="font-black flex items-center gap-2"><Lock className="text-indigo-400" size={18}/> DB Integrity</h4>
             <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Uptime</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded text-white bg-emerald-500">99.9%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Security Patch</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded text-white bg-indigo-500">v2.4.1</span>
                </div>
             </div>
             <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
               All student data is encrypted using AES-256 and subject to university privacy compliance standards.
             </p>
           </div>
        </div>
      </div>

      {/* --- ADD ACCOUNT MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">New Account</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
            </div>
            <form onSubmit={handleAddAccount} className="p-8 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Full Name</label>
                <input required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-bold text-sm" value={newAccount.name} onChange={(e) => setNewAccount({...newAccount, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Email Address</label>
                <input required type="email" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-bold text-sm" value={newAccount.email} onChange={(e) => setNewAccount({...newAccount, email: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Role</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 font-bold text-sm appearance-none" value={newAccount.role} onChange={(e) => setNewAccount({...newAccount, role: e.target.value})}>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all shadow-xl">Create Account</button>
            </form>
          </div>
        </div>
      )}

      {/* --- CSV IMPORT MODAL --- */}
      {isUploading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-2">
              <FileText className="text-indigo-600" size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Import Directory</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Expected Format: name, email, role</p>
            <label className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center group hover:border-indigo-400 transition-all cursor-pointer block">
              <input type="file" className="hidden" accept=".csv" onChange={handleCSVUpload} />
              <Plus className="mx-auto text-slate-300 mb-2 transition-transform group-hover:scale-110" size={32} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Account CSV</p>
            </label>
            <button onClick={() => setIsUploading(false)} className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest">Cancel</button>
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
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // In a real app, find user in MOCK_USERS. Here we simulate:
    setTimeout(() => {
      setIsLoading(false);
      setView('dashboard');
    }, 1200);
  };

  const logout = () => {
    setView('landing');
    setRole(null);
    setCurrentUser(null);
  };

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white overflow-hidden relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>

        <div className="relative z-10 w-full max-w-lg text-center animate-in fade-in zoom-in-95 duration-1000">
          <div className="inline-flex p-4 rounded-[2.5rem] bg-indigo-500/10 border border-indigo-500/20 mb-10 shadow-2xl shadow-indigo-500/10">
            <BrainCircuit className="text-indigo-400 w-12 h-12" />
          </div>
          <h1 className="text-6xl font-black mb-4 tracking-tighter uppercase italic leading-none">Success<span className="text-indigo-500">Predict</span></h1>
          <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em] mb-12">Empowering Student Futures with Socio-AI</p>
          <div className="space-y-4">
            {['student', 'teacher', 'admin'].map((id) => (
              <button 
                key={id} 
                onClick={() => { setRole(id); setView('login'); }} 
                className={`w-full group bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-[2rem] flex items-center justify-between transition-all hover:bg-indigo-600 hover:border-indigo-400 hover:scale-[1.02] active:scale-95`}
              >
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
          <p className="mt-12 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">© 2024 University Academic Intelligence Systems</p>
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent"></div>
        <div className="w-full max-w-md space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
           <button onClick={() => setView('landing')} className="group text-slate-500 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all">
             <ArrowRight size={16} className="rotate-180 transition-transform group-hover:-translate-x-1" /> Back to Portals
           </button>
           <div className="bg-[#0f172a] p-10 rounded-[3.5rem] border border-slate-800 shadow-2xl space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-black uppercase tracking-tight">{role} Access</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Authenticated Entry Required</p>
              </div>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                 <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-600 uppercase ml-2 tracking-widest">Email Address</label>
                   <input required className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl outline-none focus:border-indigo-500 font-bold text-white placeholder:text-slate-700 transition-all" placeholder="name@univ.edu" />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-600 uppercase ml-2 tracking-widest">Password</label>
                   <input required type="password" defaultValue="demo123" className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl outline-none focus:border-indigo-500 font-bold text-white placeholder:text-slate-700 transition-all" placeholder="••••••••" />
                 </div>
                 <button type="submit" disabled={isLoading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 active:scale-95 transition-all disabled:opacity-50">
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>Authenticating...</span>
                      </div>
                    ) : 'Enter Dashboard'}
                 </button>
              </form>
              <p className="text-center text-[10px] text-slate-600 font-bold">Use "demo123" for any account</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <nav className="bg-white/80 backdrop-blur-xl border-b sticky top-0 z-[80] px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3 font-black text-2xl tracking-tighter italic select-none">
          <BrainCircuit className="text-indigo-600" size={22}/> SUCCESS<span className="text-indigo-600">PREDICT</span>
          <span className="hidden md:block h-6 w-[1px] bg-slate-200 mx-2"></span>
          <span className="hidden md:block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 not-italic">v2.4 LTS</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-xs font-black text-slate-800 uppercase tracking-tighter">Authorized {role}</span>
            <span className="text-[10px] font-bold text-emerald-500">System Online</span>
          </div>
          <button onClick={logout} className="bg-rose-50 text-rose-500 p-3 rounded-2xl hover:bg-rose-100 hover:text-rose-600 active:scale-90 transition-all shadow-sm">
            <LogOut size={20} />
          </button>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto p-6 lg:p-12">
        {role === 'student' && <StudentPortal />}
        {role === 'teacher' && <TeacherPortal />}
        {role === 'admin' && <AdminPortal />}
      </main>
      
      <footer className="max-w-7xl mx-auto p-12 text-center border-t border-slate-100">
         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">SuccessPredict AI Core — Secure Academic Environment</p>
      </footer>
    </div>
  );
}