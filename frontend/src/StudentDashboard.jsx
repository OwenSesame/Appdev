import React, { useState, useEffect } from 'react';
import { 
  User, Settings, ShieldCheck, Map, Wallet, 
  BookOpen, Globe, Award, Save, 
  Clock, Phone, ChevronRight,
  MessageSquare, Bell, Calendar, LogOut,
  LayoutDashboard, Search, Send, Filter
} from 'lucide-react';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, doc, setDoc, getDoc, onSnapshot 
} from 'firebase/firestore';
import { 
  getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged 
} from 'firebase/auth';

// Firebase Initialization
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'success-predict-app';

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "Juan",
    lastName: "Dela Cruz",
    email: "juan.delacruz@university.edu.ph",
    phone: "+63 912 345 6789",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
    bio: "Sophomore Computer Science student focused on AI and accessibility.",
    interests: ["Artificial Intelligence", "Community Development", "Web Technologies"]
  });

  // 1. Authentication Lifecycle
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth error:", err);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 2. Data Synchronization Lifecycle
  useEffect(() => {
    if (!user) return;

    // Path following MANDATORY RULE 1
    const profileDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'profile');

    const unsubscribe = onSnapshot(profileDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      } else {
        // Initialize doc if it doesn't exist
        setDoc(profileDocRef, profile);
      }
    }, (error) => {
      console.error("Firestore sync error:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const aiInsights = {
    status: "Stable",
    riskScore: 12,
    recommendations: [
      {
        id: 1,
        title: "Government Subsidy Path",
        description: "Based on your income bracket, you qualify for the Tertiary Education Subsidy (TES).",
        icon: <Wallet className="text-emerald-500" />,
        action: "Apply Now"
      },
      {
        id: 2,
        title: "Digital Inclusion Program",
        description: "Your area shows limited connectivity. You are eligible for a free mobile data allowance.",
        icon: <Globe className="text-indigo-500" />,
        action: "Claim Data"
      },
      {
        id: 3,
        title: "Peer Mentorship",
        description: "Your high study time score makes you a great candidate to lead peer study groups.",
        icon: <Award className="text-amber-500" />,
        action: "Learn More"
      }
    ]
  };

  const notifications = [
    { id: 1, text: "AI Analysis: Your risk score decreased by 2%!", time: "2h ago", type: "success" },
    { id: 2, text: "New message from Faculty: Scholarship interview set.", time: "5h ago", type: "info" }
  ];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'roadmap', label: 'My Roadmap', icon: <Map size={20} /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} /> },
    { id: 'calendar', label: 'Schedule', icon: <Calendar size={20} /> },
    { id: 'profile', label: 'My Profile', icon: <User size={20} /> },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    const saveBtn = e.target.querySelector('button[type="submit"]');
    const originalText = saveBtn.innerText;
    saveBtn.innerText = "Saving...";

    try {
      const profileDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'profile');
      await setDoc(profileDocRef, profile);
      setIsEditing(false);
      saveBtn.innerText = "Saved!";
    } catch (err) {
      console.error("Save error:", err);
      saveBtn.innerText = "Error";
    } finally {
      setTimeout(() => { if (saveBtn) saveBtn.innerText = originalText; }, 2000);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'messages':
        return (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl h-[600px] flex overflow-hidden">
            <div className="w-80 border-r flex flex-col">
              <div className="p-6 border-b">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-sm outline-none" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 bg-indigo-50 border-l-4 border-indigo-500 flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-200"></div>
                  <div>
                    <p className="font-bold text-sm">Prof. Rodriguez</p>
                    <p className="text-xs text-slate-500 truncate">Regarding your subsidy...</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col bg-slate-50/50">
              <div className="p-6 bg-white border-b flex justify-between items-center">
                <h3 className="font-bold">Prof. Rodriguez</h3>
                <Settings size={18} className="text-slate-400 cursor-pointer" />
              </div>
              <div className="flex-1 p-8 text-center text-slate-400 flex flex-col justify-center">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                <p>Select a conversation to start messaging</p>
              </div>
              <div className="p-6 bg-white border-t flex gap-4">
                <input type="text" placeholder="Type a message..." className="flex-1 p-3 bg-slate-50 rounded-xl outline-none" />
                <button className="bg-indigo-600 text-white p-3 rounded-xl"><Send size={18}/></button>
              </div>
            </div>
          </div>
        );
      
      case 'roadmap':
        return (
          <div className="space-y-6">
             <div className="bg-indigo-900 text-white p-10 rounded-[3rem] relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-3xl font-black mb-4">Academic & Social Roadmap</h2>
                  <p className="text-indigo-200 max-w-lg">Your personalized path to graduation based on AI-identified barriers and socioeconomic strengths.</p>
                </div>
                <div className="absolute top-0 right-0 p-10 opacity-10"><Map size={150} /></div>
             </div>
             <div className="grid md:grid-cols-3 gap-6">
                {['Financial Goals', 'Academic Milestones', 'Career Prep'].map(title => (
                  <div key={title} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h4 className="font-bold mb-4">{title}</h4>
                    <div className="space-y-3">
                      {[1,2,3].map(i => (
                        <div key={i} className="flex items-center gap-3 text-sm text-slate-500">
                          <div className="w-2 h-2 rounded-full bg-indigo-400"></div> Task {i}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'profile':
      case 'dashboard':
      default:
        return (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* PROFILE CARD */}
            <div className="w-full lg:w-80 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden shrink-0">
              <div className="h-28 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"></div>
              <div className="px-6 pb-8">
                <div className="relative -mt-14 mb-4 flex justify-center">
                  <img 
                    src={profile.avatar} 
                    alt="Profile" 
                    className="w-28 h-28 rounded-[2rem] border-4 border-white bg-slate-50 shadow-xl object-cover"
                  />
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="absolute bottom-0 right-1/4 bg-white p-2 rounded-xl shadow-md border hover:bg-slate-50 transition-all text-indigo-600"
                  >
                    <Settings size={14} />
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSave} className="space-y-4">
                    <input 
                      type="text" 
                      value={profile.firstName}
                      onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 ring-indigo-500 outline-none"
                      placeholder="First Name"
                    />
                    <textarea 
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
                      rows="3"
                    />
                    <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all">
                      <Save size={16} /> Save Changes
                    </button>
                  </form>
                ) : (
                  <div className="text-center">
                    <h2 className="text-xl font-black text-slate-800">{profile.firstName} {profile.lastName}</h2>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-tighter mb-4">{profile.email}</p>
                    
                    <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                      {profile.interests.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[9px] font-black uppercase rounded-lg tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-3 text-left border-t border-slate-50 pt-6">
                      <div className="flex items-center gap-3 text-slate-500 text-xs font-medium">
                        <div className="bg-slate-50 p-2 rounded-lg text-indigo-400"><Phone size={14} /></div>
                        {profile.phone}
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 text-xs font-medium">
                        <div className="bg-slate-50 p-2 rounded-lg text-indigo-400"><Clock size={14} /></div>
                        Member since 2024
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI INTERACTIVE CONTENT */}
            <div className="flex-1 space-y-6">
              
              {/* AI STATUS BANNER */}
              <div className="relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-5">
                    <div className="p-5 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-200">
                      <ShieldCheck size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800">Success Roadmap</h3>
                      <p className="text-slate-500 text-sm font-medium">AI Status: <span className="text-emerald-500 font-black uppercase">{aiInsights.status}</span></p>
                    </div>
                  </div>
                  <div className="bg-slate-50 px-8 py-3 rounded-2xl border border-slate-100 text-center sm:text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Risk Score</p>
                    <p className="text-3xl font-black text-indigo-600">{aiInsights.riskScore}<span className="text-sm">%</span></p>
                  </div>
                </div>
              </div>

              {/* RECOMMENDATIONS GRID */}
              <div>
                <div className="flex items-center justify-between mb-4 px-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Priority Interventions</h4>
                  <button className="text-xs font-bold text-indigo-600 hover:underline" onClick={() => setActiveTab('roadmap')}>View All</button>
                </div>
                <div className="grid gap-4">
                  {aiInsights.recommendations.map((rec) => (
                    <div key={rec.id} className="group bg-white p-6 rounded-3xl border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex items-center gap-6">
                      <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        {rec.icon}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-slate-800 mb-0.5">{rec.title}</h5>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{rec.description}</p>
                      </div>
                      <button 
                        onClick={() => alert(`Redirecting to ${rec.title} application...`)}
                        className="bg-slate-50 px-4 py-2 rounded-xl text-slate-900 font-bold text-[10px] uppercase tracking-wider flex items-center gap-2 group-hover:bg-indigo-600 group-hover:text-white transition-all"
                      >
                        {rec.action} <ChevronRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* QUICK STATS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-200">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-white/10 p-3 rounded-2xl"><BookOpen size={20} className="text-indigo-400" /></div>
                    <span className="text-[10px] font-black text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full uppercase">On Track</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Academic Attendance</p>
                  <h4 className="text-3xl font-black">94.2%</h4>
                  <div className="w-full bg-slate-800 h-2 rounded-full mt-6 overflow-hidden">
                    <div className="bg-indigo-50 h-full rounded-full" style={{width: '94%'}}></div>
                  </div>
                </div>
                
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Map size={80} />
                  </div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600"><Map size={20} /></div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Travel Distance</p>
                  <h4 className="text-3xl font-black text-slate-800">12.5 <span className="text-sm font-medium text-slate-400">km</span></h4>
                  <p className="text-xs text-indigo-600 mt-4 font-bold flex items-center gap-1">
                    <Wallet size={12} /> Transport Subsidy Active
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] -m-8">
      {/* SIDE NAVIGATOR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-indigo-500 p-2 rounded-xl">
              <ShieldCheck size={24} />
            </div>
            <span className="font-black text-xl tracking-tighter">SUCCESS<span className="text-indigo-400">P</span></span>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === item.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-800">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-4 text-slate-400 hover:text-red-400 font-bold text-sm transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-64 p-8 space-y-8 animate-in fade-in duration-700">
        
        {/* TOP SEARCH/NOTIF BAR */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Welcome back, {profile.firstName}!</h1>
            <p className="text-slate-500 text-sm">
              {user ? `Session: ${user.uid.substring(0, 8)}...` : 'Connecting to AI cloud...'}
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-3 rounded-2xl border border-slate-200 shadow-sm relative transition-all ${showNotifications ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-400 hover:text-indigo-600'}`}
              >
                <Bell size={20} />
                <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in slide-in-from-top-2">
                  <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                    <h5 className="font-black text-xs uppercase tracking-widest">Notifications</h5>
                    <button className="text-[10px] text-indigo-600 font-bold">Mark all as read</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="p-4 border-b hover:bg-slate-50 transition-colors flex gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">{n.text}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div 
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-3 bg-white p-2 pr-4 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-200 transition-all"
            >
              <img src={profile.avatar} alt="avatar" className="w-8 h-8 rounded-lg bg-slate-100" />
              <span className="text-xs font-bold text-slate-700">{profile.firstName}</span>
            </div>
          </div>
        </div>

        {/* DYNAMIC CONTENT LOADED VIA TABS */}
        <div className="min-h-[600px]">
          {renderContent()}
        </div>

      </main>
    </div>
  );
}