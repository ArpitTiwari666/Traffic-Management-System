import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { LayoutDashboard, Video, Search, MapPinned, BarChart3, BellRing, Camera, FileText, Settings as SettingsIcon, Menu, ChevronDown, Activity, CarFront, Gauge, CircleAlert, Wifi, WifiOff, SlidersHorizontal, Maximize2, MoreHorizontal, Crosshair, Map, Layers3, Route, Radio, ShieldAlert, Download, FileDown, RefreshCw, UserRound, LockKeyhole, MapIcon, Server, MonitorCog, Palette, CircleHelp, CheckCircle2, TriangleAlert, XCircle, Clock3, Navigation, Database, Zap, Eye, Filter, ArrowUpRight, ArrowDownRight, SunMedium, MoonStar, Bell, LogOut, SearchCheck, Fingerprint, Network, LocateFixed } from 'lucide-react';
import './styles.css';

const nav = [
  ['Dashboard', LayoutDashboard], ['Live Camera Feed', Video], ['Vehicle Search & Tracking', Search], ['GIS Traffic Map', MapPinned], ['Traffic Analytics', BarChart3], ['Alerts', BellRing], ['Camera Management', Camera], ['Reports', FileText], ['Settings', SettingsIcon],
];

const cameras = [
  { id:'CAM-014', location:'Vijay Nagar Junction', type:'ANPR PTZ', status:'Online', count:84, speed:38, plate:'MP09AB1234' },
  { id:'CAM-027', location:'Palasia Square', type:'Fixed ANPR', status:'Online', count:71, speed:31, plate:'MP09CD7721' },
  { id:'CAM-041', location:'Airport Road Gate', type:'ANPR PTZ', status:'Warning', count:46, speed:52, plate:'MP09EF9044' },
  { id:'CAM-063', location:'MR-10 Corridor', type:'Traffic Cam', status:'Online', count:96, speed:27, plate:'MP09GH1189' },
  { id:'CAM-078', location:'Bhawarkua Circle', type:'ANPR PTZ', status:'Offline', count:0, speed:0, plate:'—' },
  { id:'CAM-093', location:'Rau Bypass', type:'Fixed ANPR', status:'Online', count:52, speed:44, plate:'MP09JK5207' },
];
const trafficTrend = [{t:'06:00',v:420},{t:'08:00',v:980},{t:'10:00',v:1320},{t:'12:00',v:1110},{t:'14:00',v:1480},{t:'16:00',v:1660},{t:'18:00',v:2180},{t:'20:00',v:1520}];
const density = [{name:'Mon',v:62},{name:'Tue',v:71},{name:'Wed',v:68},{name:'Thu',v:82},{name:'Fri',v:88},{name:'Sat',v:74},{name:'Sun',v:59}];
const hourly = [{h:'06',v:420},{h:'07',v:680},{h:'08',v:1120},{h:'09',v:1240},{h:'10',v:980},{h:'11',v:1050},{h:'12',v:1180},{h:'13',v:1210},{h:'14',v:1340},{h:'15',v:1460},{h:'16',v:1750},{h:'17',v:2140},{h:'18',v:2280},{h:'19',v:2010},{h:'20',v:1640},{h:'21',v:1180}];
const vehicleTypes = [{name:'Car',value:58},{name:'Two-wheeler',value:24},{name:'Bus',value:8},{name:'Truck',value:6},{name:'Other',value:4}];
const speedData = [{h:'06',v:49},{h:'08',v:44},{h:'10',v:42},{h:'12',v:46},{h:'14',v:41},{h:'16',v:36},{h:'18',v:28},{h:'20',v:34}];
const alerts = [
  {id:'AL-3091',severity:'Critical',title:'Blacklisted vehicle detected',plate:'MP09AB1234',camera:'CAM-014',location:'Vijay Nagar Junction',time:'21:14:42',status:'Open'},
  {id:'AL-3088',severity:'High',title:'ANPR mismatch confidence',plate:'MP09EF9044',camera:'CAM-041',location:'Airport Road Gate',time:'21:09:13',status:'Investigating'},
  {id:'AL-3085',severity:'Medium',title:'Unusual route deviation',plate:'MP09JK5207',camera:'CAM-093',location:'Rau Bypass',time:'20:55:26',status:'Open'},
  {id:'AL-3081',severity:'Low',title:'Camera packet loss',plate:'—',camera:'CAM-078',location:'Bhawarkua Circle',time:'20:42:08',status:'Resolved'},
];
const detections = [
  {time:'21:14:42',camera:'CAM-014',location:'Vijay Nagar Junction',plate:'MP09AB1234',type:'Sedan',color:'White',conf:'98.7%'},
  {time:'21:08:11',camera:'CAM-027',location:'Palasia Square',plate:'MP09CD7721',type:'SUV',color:'Black',conf:'96.3%'},
  {time:'20:55:26',camera:'CAM-093',location:'Rau Bypass',plate:'MP09JK5207',type:'Hatchback',color:'Blue',conf:'94.8%'},
  {time:'20:48:09',camera:'CAM-063',location:'MR-10 Corridor',plate:'MP09GH1189',type:'Truck',color:'White',conf:'97.1%'},
];
const mapNodes = [
  {lat:22.7533,lng:75.8937,label:'CAM-014',status:'high',name:'Vijay Nagar'},
  {lat:22.7256,lng:75.8860,label:'CAM-027',status:'medium',name:'Palasia'},
  {lat:22.7268,lng:75.8037,label:'CAM-041',status:'low',name:'Airport Rd'},
  {lat:22.7350,lng:75.8400,label:'CAM-063',status:'high',name:'MR-10'},
  {lat:22.6580,lng:75.8150,label:'CAM-093',status:'medium',name:'Rau Bypass'},
  {lat:22.6867,lng:75.8650,label:'CAM-078',status:'offline',name:'Bhawarkua'},
];


const demoSummary = {
  active_cameras: 312,
  vehicles_detected_today: 18420,
  avg_speed_kmh: 38,
  active_alerts: 4,
  congestion_index: 68,
  congestion_label: 'Moderate',
  network_coverage_pct: 96,
  camera_status_breakdown: { Online: 312, Warning: 9, Offline: 7 },
};

const demoAnalytics = {
  hourly_volume: trafficTrend.map(x => ({ label: x.t.replace(':00',''), value: x.v })),
  bottlenecks: [
    { corridor:'Vijay Nagar Junction', index:82, delay:'+14 min delay' },
    { corridor:'MR-10 Corridor', index:74, delay:'+11 min delay' },
    { corridor:'Palasia Square', index:61, delay:'+8 min delay' },
  ],
};

const demoAlertKpis = { open:2, investigating:1, resolved_today:1, blacklist_matches:1 };

const demoReportPreview = {
  title:'Daily Traffic Intelligence',
  vehicles_detected:18420,
  peak_volume_per_hr:2280,
  avg_speed_kmh:38,
  alerts_triggered:4,
  trend:trafficTrend,
};

const demoSettings = {
  operations_mode:'Demo / Simulation',
  data_refresh_seconds:12,
  security_level:'Standard',
  default_map_layers:['Traffic','Cameras','Incidents'],
};

const demoData = {
  cameras: cameras.map((c,i)=>({
    ...c,
    health_pct: c.status==='Online' ? 98 : c.status==='Warning' ? 82 : 0,
    ip_address:`192.168.10.${14+i}`,
    last_active:new Date(Date.now()-i*60000).toISOString(),
  })),
  detections,
  alerts,
  alertKpis:demoAlertKpis,
  summary:demoSummary,
  analytics:demoAnalytics,
  gis:{nodes:mapNodes},
  reportPreview:demoReportPreview,
  settings:demoSettings,
};

function getDemoVehicleProfile(plate){
  const normalized=String(plate||'').trim().toUpperCase();
  const source=detections.find(d=>d.plate===normalized) || detections[0];
  const matching=detections.filter(d=>d.plate===normalized);
  const chosen=matching.length?matching: [source];
  const trajectory=chosen.map((d,i)=>({
    n:i+1,
    camera_id:d.camera,
    location:d.location,
    timestamp:new Date(`2026-09-25T${d.time}`).toISOString(),
    coords:mapNodes[i % mapNodes.length] ? [mapNodes[i % mapNodes.length].lat,mapNodes[i % mapNodes.length].lng] : [22.735,75.85],
  }));
  return {
    plate:normalized || source.plate,
    vehicle_type:source.type,
    color:source.color,
    first_seen:trajectory[0]?.timestamp,
    last_seen:trajectory[trajectory.length-1]?.timestamp,
    detection_count:chosen.length,
    avg_confidence:Number(String(source.conf).replace('%','')),
    is_blacklisted:source.plate==='MP09AB1234',
    trajectory,
  };
}

function normalizeCamera(c){return { ...c, count:c.vehicles_per_min ?? 0, speed:c.avg_speed_kmh ?? 0, plate:c.last_plate || '—' }}
function normalizeAlert(a){return { ...a, camera:a.camera_id, time:a.created_at ? new Date(a.created_at).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'}) : '—' }}
function normalizeDetection(d){return { ...d, time:d.timestamp ? new Date(d.timestamp).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'}) : '—', camera:d.camera_id, location:d.camera_id, type:d.vehicle_type, conf:`${Number(d.confidence || 0).toFixed(1)}%` }}

function App(){
  const [page,setPage] = useState('Dashboard');
  const [collapsed,setCollapsed] = useState(()=>typeof window !== 'undefined' ? window.innerWidth <= 780 : false);
  const [globalSearch,setGlobalSearch] = useState('');
  const [searchOpen,setSearchOpen] = useState(false);
  const [live,setLive] = useState(true);
  const [selectedCamera,setSelectedCamera] = useState(null);
  const [loading,setLoading] = useState(false);
  const [data,setData] = useState(demoData);

  const loadData=()=>{
    setLoading(true);
    window.setTimeout(()=>{
      setData({...demoData, cameras:demoData.cameras.map(c=>({...c}))});
      setSelectedCamera(current=>current || demoData.cameras[0]);
      setLoading(false);
    },180);
  };

  useEffect(()=>{
    const handler=()=>loadData();
    window.addEventListener('cityvision:refresh',handler);
    setSelectedCamera(demoData.cameras[0]);
    return ()=>window.removeEventListener('cityvision:refresh',handler);
  },[]);

  useEffect(()=>{
    if(!live) return;
    const timer=setInterval(()=>{
      setData(current=>({
        ...current,
        summary:{...current.summary, vehicles_detected_today:current.summary.vehicles_detected_today + Math.floor(Math.random()*9)+1},
      }));
    },12000);
    return ()=>clearInterval(timer);
  },[live]);

  const pageKey = page;
  const currentUser=JSON.parse(localStorage.getItem('cityvision_user') || '{"username":"admin","role":"ADMIN"}');
  return <div className="app">
    <aside className={`sidebar ${collapsed?'collapsed':''}`}>
      <div className="brand"><div className="brand-mark"><Activity size={22}/></div><div className="brand-copy"><strong>CityVision <span>AI</span></strong><small>TRAFFIC OPERATIONS</small></div></div>
      <div className="side-status"><span className="live-dot"/> SYSTEM OPERATIONAL <span className="sys-time">LIVE</span></div>
      <nav>{nav.map(([label,Icon])=><button key={label} onClick={()=>{setPage(label); if(typeof window !== 'undefined' && window.innerWidth <= 780) setCollapsed(true)}} className={page===label?'active':''} title={collapsed?label:''}><Icon size={18}/><span>{label}</span>{label==='Alerts'&&<b>{data.alertKpis?.open ?? data.alerts.length}</b>}</button>)}</nav>
      <div className="sidebar-footer"><div className="operator"><div className="avatar">{(currentUser.username||'AD').slice(0,2).toUpperCase()}</div><div><strong>Control Room</strong><small>{currentUser.role || 'Admin'} • Secure</small></div><ChevronDown size={15}/></div></div>
    </aside>
    <button className={`mobile-sidebar-backdrop ${collapsed?'hidden':''}`} aria-label="Close navigation" onClick={()=>setCollapsed(true)}/>
    <main className="main">
      <header className="topbar"><button className="icon-btn" onClick={()=>setCollapsed(v=>!v)}><Menu size={19}/></button><div className="crumb"><span>SMART CITY</span><ChevronDown size={13}/><strong>{page}</strong></div><div className="top-actions"><div className="global-search nav-search" style={searchOpen && typeof window !== 'undefined' && window.matchMedia('(max-width: 780px)').matches ? {display:'flex'} : undefined}><Search size={16}/><input value={globalSearch} onChange={e=>setGlobalSearch(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&globalSearch.trim()){setPage('GIS Traffic Map');const query=globalSearch.trim();setTimeout(()=>window.dispatchEvent(new CustomEvent('cityvision:location-search',{detail:{query}})),0);}}} placeholder="Search city, area or road..."/><button className="search-close" onClick={()=>{setGlobalSearch('');if(typeof window !== 'undefined' && window.matchMedia('(max-width: 780px)').matches) setSearchOpen(false);}} aria-label="Clear search">×</button></div><button className="icon-btn nav-search-btn active" onClick={()=>{if(typeof window !== 'undefined' && window.matchMedia('(max-width: 780px)').matches){setSearchOpen(v=>!v);setTimeout(()=>{if(!searchOpen) document.querySelector('.nav-search input')?.focus();},50);}}} aria-label="Search city, area or road" title="Search city, area or road"><Search size={18}/></button><button className="icon-btn"><Bell size={18}/><i/></button><button className="profile-btn" onClick={()=>{localStorage.removeItem('cityvision_token');setPage('Dashboard')}}><div className="avatar small">{(currentUser.username||'AD').slice(0,2).toUpperCase()}</div><span>{currentUser.username || 'Admin'}</span><LogOut size={14}/></button></div></header>
      <div className="page-wrap">
        {loading && <div className="backend-loading"><RefreshCw size={14}/> Refreshing demo data…</div>}
        <AnimatePresence mode="wait"><motion.div key={pageKey} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.22}}>{renderPage(page,{live,setLive,selectedCamera,setSelectedCamera,setPage,data,loadData})}</motion.div></AnimatePresence>
      </div>
    </main>
  </div>
}
const Metric = ({icon:Icon,label,value,delta,accent='cyan',note})=><motion.div className="metric card" whileHover={{y:-2}}><div className={`metric-icon ${accent}`}><Icon size={18}/></div><div className="metric-body"><div className="eyebrow">{label}</div><div className="metric-value">{value}</div>{delta&&<div className={`delta ${delta[0]==='+'?'up':'down'}`}>{delta[0]==='+'?<ArrowUpRight size={12}/>:<ArrowDownRight size={12}/>} {delta.slice(1)} <span>{note||'vs yesterday'}</span></div>}</div></motion.div>;
const SectionHead=({title,kicker,action})=><div className="section-head"><div><div className="eyebrow">{kicker}</div><h2>{title}</h2></div>{action}</div>;
const Pill=({children,tone='neutral'})=><span className={`pill ${tone}`}>{children}</span>;

function Dashboard({setPage,data}){
  const summary=data.summary;
  const analytics=data.analytics;
  const feed=data.detections?.length?data.detections:detections;
  const trend=(analytics?.hourly_volume||[]).map(x=>({t:`${x.label}:00`,v:x.value}));
  const traffic=trend.length?trend:trafficTrend;
  const breakdown=summary?.camera_status_breakdown||{Online:312,Warning:9,Offline:7};
  return <section>
    <div className="hero"><div><div className="eyebrow accent-text">CITY TRAFFIC OVERVIEW • LIVE OPERATIONS</div><h1>Command Center</h1><p>Unified visibility across ANPR, CCTV, vehicle movement and city traffic flow.</p></div><div className="hero-actions"><button className="btn ghost" onClick={()=>window.dispatchEvent(new Event('cityvision:refresh'))}><RefreshCw size={15}/>Refresh</button><button className="btn primary" onClick={()=>setPage('GIS Traffic Map')}><MapPinned size={15}/>Open Live Map</button></div></div>
    <div className="metrics-grid"><Metric icon={Camera} label="ACTIVE CAMERAS" value={summary?.active_cameras||'—'} accent="blue"/><Metric icon={CarFront} label="VEHICLES DETECTED" value={summary?.vehicles_detected_today?.toLocaleString()||'—'} accent="violet"/><Metric icon={Gauge} label="AVG. VEHICLE SPEED" value={summary?`${summary.avg_speed_kmh} km/h`:'—'} accent="green"/><Metric icon={CircleAlert} label="ACTIVE ALERTS" value={summary?.active_alerts??'—'} accent="red" note="demo data"/></div>
    <div className="dashboard-grid">
      <div className="card chart-card large"><SectionHead kicker="LIVE ANALYTICS" title="City Traffic Volume" action={<Pill tone="green"><span className="live-dot"/> LIVE</Pill>}/><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={traffic}><defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#57d7ff" stopOpacity=".28"/><stop offset="100%" stopColor="#57d7ff" stopOpacity="0"/></linearGradient></defs><CartesianGrid stroke="#1d2b34" vertical={false}/><XAxis dataKey="t" stroke="#6e7d88" tickLine={false} axisLine={false}/><YAxis stroke="#6e7d88" tickLine={false} axisLine={false}/><Tooltip contentStyle={{background:'#0c151b',border:'1px solid #24343f',borderRadius:12}}/><Area type="monotone" dataKey="v" stroke="#57d7ff" strokeWidth={2.5} fill="url(#g1)"/></AreaChart></ResponsiveContainer></div></div>
      <div className="card congestion"><SectionHead kicker="NETWORK STATUS" title="Congestion Index"/><div className="gauge"><div className="gauge-ring"><div><strong>{summary?.congestion_index??'—'}</strong><span>/100</span></div></div></div><div className="gauge-caption"><Pill tone="amber">{summary?.congestion_label||'—'}</Pill><span>Calculated from demo traffic data</span></div><div className="mini-rows">{(analytics?.bottlenecks||[]).slice(0,3).map(b=><div key={b.corridor}><span>{b.corridor}</span><b>{b.index}</b></div>)}</div></div>
      <div className="card activity-card"><SectionHead kicker="REAL-TIME FEED" title="Activity Feed" action={<button className="text-btn" onClick={()=>setPage('Vehicle Search & Tracking')}>Investigate</button>}/><div className="feed">{feed.map((d,i)=><div className="feed-item" key={d.id||i}><div className="feed-icon"><Fingerprint size={15}/></div><div><strong><span className="mono">{d.plate}</span> detected</strong><span>{d.camera} • {d.location||'Camera network'}</span></div><time>{d.time}</time></div>)}</div></div>
      <div className="card camera-overview"><SectionHead kicker="INFRASTRUCTURE" title="Camera Status" action={<button className="text-btn" onClick={()=>setPage('Camera Management')}>Manage</button>}/><div className="camera-bars">{Object.entries(breakdown).map(([l,n],i)=>{const c=l==='Online'?'green':l==='Warning'?'amber':'red';return <div key={l}><div className="row-label"><span><i className={`dot ${c}`}/>{l}</span><b>{n}</b></div><div className="bar"><i className={c} style={{width:`${summary?((n/(Object.values(breakdown).reduce((a,b)=>a+b,0)||1))*100):0}%`}}/></div></div>})}</div><div className="coverage"><Network size={14}/> <span>Network coverage</span><strong>{summary?.network_coverage_pct??'—'}%</strong></div></div>
    </div>
  </section>
}

function LiveCameraFeed({live,setLive,selectedCamera,setSelectedCamera,data}){
  const [events,setEvents]=useState([]);
  const filtered=data.cameras?.length?data.cameras:cameras;
  useEffect(()=>{
    if(!live) return;
    let index=0;
    const pushEvent=()=>{
      const d=detections[index % detections.length];
      setEvents(prev=>[{plate:d.plate,type:d.type,camera_id:d.camera,location:d.location,time:d.time},...prev].slice(0,20));
      index+=1;
    };
    pushEvent();
    const timer=setInterval(pushEvent,4000);
    return ()=>clearInterval(timer);
  },[live]);
  return <section><div className="hero compact"><div><div className="eyebrow accent-text">SURVEILLANCE NETWORK</div><h1>Live Camera Feed</h1><p>Camera inventory and live telemetry are running in local demo mode.</p></div><div className="hero-actions"><button className={`btn ${live?'danger-soft':'ghost'}`} onClick={()=>setLive(v=>!v)}>{live?<><Radio size={15}/>Live Mode</>:<><Clock3 size={15}/>Paused</>}</button></div></div><div className="camera-layout"><div className="camera-grid">{filtered.map((c,i)=><CameraCard key={c.id} c={c} i={i} onSelect={()=>setSelectedCamera(c)}/>)}</div><aside className="side-panel">{selectedCamera?<CameraDetails c={selectedCamera}/>:<div className="panel-empty"><Crosshair size={28}/><strong>Select a camera</strong><span>Choose any feed to inspect health, ANPR and recent detections.</span></div>}{events.length>0&&<div className="live-events"><span className="eyebrow">LATEST LIVE EVENT</span><code>{events[0].plate||events[0].type||'telemetry'} • {events[0].camera_id||'network'}</code></div>}</aside></div></section>
}

function CameraCard({c,i,onSelect}){return <motion.button className="camera-card" whileHover={{y:-3}} onClick={onSelect}><div className="video"><div className="scan-lines"/><div className="video-top"><span className="live-badge"><i/> LIVE</span><span className="camid">{c.id}</span><MoreHorizontal size={16}/></div><div className="fake-road"><div className="lane l1"/><div className="lane l2"/><div className="fake-car" style={{left:`${18+i*9}%`}}><span className="plate-overlay">{c.plate}</span></div></div><div className="video-bottom"><span><Navigation size={13}/>{c.location}</span><span>{new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}</span></div></div><div className="camera-meta"><div><strong>{c.type}</strong><span>{c.status==='Online'?'● Secure stream':'● '+c.status}</span></div><div className="cam-stats"><span><CarFront size={13}/>{c.count}/min</span><span><Gauge size={13}/>{c.speed} km/h</span></div></div></motion.button>}
function CameraDetails({c}){return <div className="detail-panel"><div className="panel-head"><div><span className="eyebrow">CAMERA DETAILS</span><h3>{c.id}</h3></div><Pill tone={c.status==='Online'?'green':c.status==='Warning'?'amber':'red'}>{c.status}</Pill></div><div className="detail-map"><MapPinned size={22}/><span>{c.location}</span></div><div className="detail-grid"><div><span>Type</span><b>{c.type}</b></div><div><span>Vehicles / min</span><b>{c.count}</b></div><div><span>Avg. speed</span><b>{c.speed} km/h</b></div><div><span>ANPR</span><b>Enabled</b></div></div><div className="detail-section"><span className="eyebrow">LATEST PLATE</span><div className="plate-big">{c.plate}</div><div className="confidence"><span>Recognition confidence</span><b>98.7%</b></div><div className="confidence-bar"><i style={{width:'98.7%'}}/></div></div></div>}

function VehicleTracking(){
  const [q,setQ]=useState('MP09AB1234'); const [profile,setProfile]=useState(null); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  const searchVehicle=()=>{
    setLoading(true);
    setError('');
    window.setTimeout(()=>{
      const result=getDemoVehicleProfile(q);
      if(result){setProfile(result);}else{setProfile(null);setError('Vehicle not found in demo data.');}
      setLoading(false);
    },180);
  };
  return <section><div className="hero compact"><div><div className="eyebrow accent-text">INVESTIGATION CONSOLE</div><h1>Vehicle Search & Tracking</h1><p>Search the local demo detection history and reconstruct plate trajectories.</p></div></div><div className="search-card card"><Search size={19}/><input value={q} onChange={e=>setQ(e.target.value.toUpperCase())} placeholder="Enter registration number"/><button className="btn primary" onClick={searchVehicle} disabled={loading}><SearchCheck size={15}/>{loading?'Searching…':'Search Vehicle'}</button><button className="icon-btn" onClick={()=>setQ('MP09AB1234')}><RefreshCw size={18}/></button></div>{error&&<div className="backend-banner"><TriangleAlert size={15}/><span>{error}</span></div>}{profile&&<div className="tracking-grid"><div className="card vehicle-card"><div className="panel-head"><div><span className="eyebrow">VEHICLE PROFILE</span><h3>{profile.plate}</h3></div><Pill tone={profile.is_blacklisted?'red':'green'}>{profile.is_blacklisted?'BLACKLISTED':'CLEAR'}</Pill></div><div className="vehicle-visual"><div className="vehicle-silhouette">🚘</div><div className="plate-big">{profile.plate}</div></div><div className="vehicle-specs"><div><span>Type</span><b>{profile.vehicle_type}</b></div><div><span>Color</span><b>{profile.color}</b></div><div><span>First seen</span><b>{profile.first_seen?new Date(profile.first_seen).toLocaleTimeString('en-IN'): '—'}</b></div><div><span>Last seen</span><b>{profile.last_seen?new Date(profile.last_seen).toLocaleTimeString('en-IN'): '—'}</b></div><div><span>Detections</span><b>{profile.detection_count}</b></div><div><span>Confidence</span><b>{profile.avg_confidence}%</b></div></div><div className="action-row"><button className="btn ghost"><Download size={14}/>Export Trail</button><button className="btn danger"><ShieldAlert size={14}/>Create Alert</button></div></div><div className="card trajectory-card"><SectionHead kicker="SPATIAL-TEMPORAL TRACE" title="Trajectory" action={<Pill tone="green"><span className="live-dot"/> {profile.trajectory.length} sightings</Pill>}/><TrajectoryMap points={profile.trajectory}/><div className="timeline">{profile.trajectory.map((x,i)=><div key={`${x.camera_id}-${i}`} className="timeline-item"><div className="tl-dot">{x.n}</div><div><strong>{x.location}</strong><span>{new Date(x.timestamp).toLocaleTimeString('en-IN')} • {x.camera_id}</span></div></div>)}</div></div></div>}</section>
}

function TrajectoryMap({points=[]}){
  const mapRef=React.useRef(null);
  const leafletRef=React.useRef(null);
  React.useEffect(()=>{
    let cancelled=false;
    const cssId='cityvision-leaflet-css';
    const cssUrl='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    const jsUrl='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    const init=()=>{
      if(cancelled || !mapRef.current || !window.L || leafletRef.current) return;
      const L=window.L;
      const routePoints=(points.length?points:[]).map((p,i)=>({n:p.n||i+1,name:p.location||p.camera_id,camera:p.camera_id,time:p.timestamp?new Date(p.timestamp).toLocaleTimeString('en-IN'): '',coords:p.coords||[22.735,75.85]}));
      const map=L.map(mapRef.current,{zoomControl:true,attributionControl:true});
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
      const route=routePoints.map(p=>p.coords);
      L.polyline(route,{color:'#57d7ff',weight:5,opacity:.9}).addTo(map);
      routePoints.forEach(p=>{
        L.circleMarker(p.coords,{radius:9,color:'#061017',weight:2,fillColor:'#57d7ff',fillOpacity:.95})
          .bindPopup(`<strong>${p.n}. ${p.name}</strong><br>${p.camera}<br>${p.time}`)
          .addTo(map);
      });
      map.fitBounds(L.latLngBounds(route),{padding:[24,24]});
      leafletRef.current=map;
      setTimeout(()=>map.invalidateSize(),0);
    };
    if(!document.getElementById(cssId)){
      const link=document.createElement('link');
      link.id=cssId; link.rel='stylesheet'; link.href=cssUrl;
      document.head.appendChild(link);
    }
    if(window.L) init();
    else {
      const existing=document.querySelector(`script[src="${jsUrl}"]`);
      if(existing) existing.addEventListener('load',init);
      else {
        const script=document.createElement('script');
        script.src=jsUrl; script.async=true; script.onload=init;
        document.body.appendChild(script);
      }
    }
    return ()=>{
      cancelled=true;
      if(leafletRef.current){leafletRef.current.remove(); leafletRef.current=null;}
    };
  },[]);
  return <div ref={mapRef} className="trajectory-map trajectory-osm-map"/>;
}

function OSMMap({layer,onReady,nodes=[],searchQuery=''}) {
  const [ready,setReady]=useState(false);
  const mapRef = React.useRef(null);
  const leafletRef = React.useRef(null);
  React.useEffect(() => {
    let cancelled = false;
    const cssId = 'cityvision-leaflet-css';
    const cssUrl = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    const jsUrl = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId; link.rel = 'stylesheet'; link.href = cssUrl;
      document.head.appendChild(link);
    }
    const init = () => {
      if (cancelled || !mapRef.current || !window.L || leafletRef.current) return;
      const L = window.L;
      const map = L.map(mapRef.current, { zoomControl:true, attributionControl:true }).setView([22.7350,75.8500], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19, attribution:'&copy; OpenStreetMap contributors' }).addTo(map);
      const markerLayer = L.layerGroup().addTo(map);
      const routeLayer = L.layerGroup().addTo(map);
      const incidentLayer = L.layerGroup().addTo(map);
      leafletRef.current = {map, markerLayer, routeLayer, incidentLayer, L};
      setReady(true);
      if (onReady) onReady(() => { map.invalidateSize(); map.locate({setView:true,maxZoom:14}); });
    };
    if (window.L) init();
    else {
      const script = document.createElement('script');
      script.src = jsUrl; script.async = true; script.onload = init;
      document.body.appendChild(script);
    }
    return () => { cancelled = true; };
  }, []);

  React.useEffect(() => {
    const state = leafletRef.current;
    if (!state) return;
    const {L,map,markerLayer,routeLayer,incidentLayer} = state;
    markerLayer.clearLayers(); routeLayer.clearLayers(); incidentLayer.clearLayers();
    const color = n => n.status==='high'?'#ff657a':n.status==='medium'?'#ffbf66':n.status==='offline'?'#83939d':'#45e3a7';
    if (layer==='Traffic' || layer==='Cameras') {
      nodes.forEach(n => L.circleMarker([n.lat,n.lng], {radius:9,color:color(n),fillColor:color(n),fillOpacity:.78,weight:2}).bindPopup(`<strong>${n.label}</strong><br>${n.name}<br>Status: ${n.status}`).addTo(markerLayer));
    }
    if (layer==='Traffic' || layer==='Routes') {
      L.polyline(gisRoute, {color:'#57d7ff',weight:5,opacity:.85}).addTo(routeLayer);
    }
    if (layer==='Traffic') {
      L.circleMarker([22.7350,75.8400], {radius:7,color:'#ff657a',fillColor:'#ff657a',fillOpacity:.9}).bindPopup('<strong>Traffic incident</strong><br>MR-10 Corridor').addTo(incidentLayer);
      L.circleMarker([22.7050,75.8600], {radius:7,color:'#ffbf66',fillColor:'#ffbf66',fillOpacity:.9}).bindPopup('<strong>Traffic incident</strong><br>Active congestion').addTo(incidentLayer);
    }
  }, [layer,ready,nodes]);

  useEffect(()=>{
    const mapState=leafletRef.current;
    const q=(searchQuery||'').trim().toLowerCase();
    if(!mapState || !q) return;
    const match=nodes.find(n=>[n.name,n.label,n.camera_id,n.location].filter(Boolean).some(v=>String(v).toLowerCase().includes(q)));
    if(match) mapState.map.setView([match.lat,match.lng],15,{animate:true});
  },[searchQuery,nodes]);

  return <div ref={mapRef} className="leaflet-map" />;
}

const gisRoute = [
  [22.7533,75.8937],[22.7440,75.8910],[22.7350,75.8840],
  [22.7200,75.8680],[22.7000,75.8480],[22.6800,75.8300],[22.6580,75.8150],
];

function GISMap({data}){
  const [layer,setLayer]=useState('Traffic'); const [locationSearch,setLocationSearch]=useState(''); const locateRef=React.useRef(null);
  useEffect(()=>{ const handler=e=>setLocationSearch(e.detail?.query||''); window.addEventListener('cityvision:location-search',handler); return ()=>window.removeEventListener('cityvision:location-search',handler); },[]);
  const snapshot=data.gis; const nodes=(snapshot?.nodes||[]).map(n=>({lat:n.lat,lng:n.lng,label:n.camera_id,status:n.status,name:n.name}));
  return <section><div className="hero compact"><div><div className="eyebrow accent-text">GEOSPATIAL OPERATIONS</div><h1>GIS Traffic Map</h1><p>Live network snapshot and camera nodes from the local demo dataset.</p></div><div className="hero-actions"><div className="segmented">{['Traffic','Cameras','Routes'].map(x=><button key={x} className={layer===x?'active':''} onClick={()=>setLayer(x)}>{x}</button>)}</div><button className="btn ghost" onClick={()=>locateRef.current&&locateRef.current()}><LocateFixed size={15}/>Locate me</button></div></div><div className="gis-layout"><div className="gis-map osm-map"><OSMMap layer={layer} nodes={nodes.length?nodes:mapNodes} searchQuery={locationSearch} onReady={fn=>{locateRef.current=fn}}/><div className="map-controls"><button title="OpenStreetMap"><Map size={16}/></button><button title="Map layers"><Layers3 size={16}/></button><button title="Fullscreen" onClick={()=>document.querySelector('.osm-map')?.requestFullscreen?.()}><Maximize2 size={16}/></button></div><div className="map-search"><Search size={15}/><input placeholder="Search area or junction"/></div><div className="legend"><strong>LIVE TRAFFIC</strong><span><i className="green"/> Low</span><span><i className="amber"/> Moderate</span><span><i className="red"/> Heavy</span></div></div><aside className="gis-side card"><SectionHead kicker="NETWORK SNAPSHOT" title="Live State"/><div className="map-stat"><span>Congested corridors</span><b>{snapshot?.congested_corridors??'—'}</b></div><div className="map-stat"><span>Active incidents</span><b>{snapshot?.active_incidents??'—'}</b></div><div className="map-stat"><span>Vehicles on network</span><b>{snapshot?.vehicles_on_network?.toLocaleString()??'—'}</b></div><div className="map-stat"><span>Camera coverage</span><b>{snapshot?.camera_coverage_pct??'—'}%</b></div><div className="side-divider"/><span className="eyebrow">SELECTED ROUTES</span>{(snapshot?.routes||[]).map(r=><div className="route-card" key={r.name}><Route size={17}/><div><strong>{r.name}</strong><span>{r.distance_km} km • {r.eta_minutes} min • {r.congestion}</span></div></div>)}</aside></div></section>
}

function Analytics({data}){
  const a=data.analytics; const h=(a?.hourly_volume||[]).map(x=>({h:x.label,v:x.value})); const d=(a?.weekly_congestion||[]).map(x=>({name:x.label,v:x.value})); const mix=a?.vehicle_mix||vehicleTypes; const sp=(a?.speed_profile||[]).map(x=>({h:x.label,v:x.value}));
  return <section><div className="hero compact"><div><div className="eyebrow accent-text">NETWORK INTELLIGENCE</div><h1>Traffic Analytics</h1><p>Backend-generated traffic density, speed, vehicle mix and bottlenecks.</p></div><div className="hero-actions"><button className="btn ghost" onClick={()=>window.dispatchEvent(new Event('cityvision:refresh'))}><RefreshCw size={15}/>Refresh</button></div></div><div className="analytics-grid"><div className="card chart-card xl"><SectionHead kicker="HOURLY VOLUME" title="Vehicles Detected / Hour" action={<Pill tone="blue">24h</Pill>}/><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={h.length?h:hourly}><CartesianGrid stroke="#1d2b34" vertical={false}/><XAxis dataKey="h" stroke="#6e7d88" tickLine={false} axisLine={false}/><YAxis stroke="#6e7d88" tickLine={false} axisLine={false}/><Tooltip contentStyle={{background:'#0c151b',border:'1px solid #24343f',borderRadius:12}}/><Bar dataKey="v" fill="#57d7ff" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div></div><div className="card chart-card"><SectionHead kicker="CONGESTION" title="Weekly Index"/><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><LineChart data={d.length?d:density}><CartesianGrid stroke="#1d2b34" vertical={false}/><XAxis dataKey="name" stroke="#6e7d88" tickLine={false} axisLine={false}/><YAxis domain={[0,100]} stroke="#6e7d88" tickLine={false} axisLine={false}/><Tooltip contentStyle={{background:'#0c151b',border:'1px solid #24343f',borderRadius:12}}/><Line type="monotone" dataKey="v" stroke="#b18cff" strokeWidth={3} dot={false}/></LineChart></ResponsiveContainer></div></div><div className="card chart-card"><SectionHead kicker="VEHICLE MIX" title="Vehicle Types"/><div className="pie-wrap"><ResponsiveContainer width="52%" height="100%"><PieChart><Pie data={mix} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={52} outerRadius={76} paddingAngle={3}>{mix.map((_,i)=><Cell key={i} fill={['#57d7ff','#b18cff','#45e3a7','#ffbf66','#71808d'][i%5]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><div className="pie-legend">{mix.map((v,i)=><div key={v.name}><i style={{background:['#57d7ff','#b18cff','#45e3a7','#ffbf66','#71808d'][i%5]}}/>{v.name}<b>{v.value}%</b></div>)}</div></div></div><div className="card chart-card"><SectionHead kicker="SPEED PROFILE" title="Average Speed"/><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={sp.length?sp:speedData}><defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#45e3a7" stopOpacity=".22"/><stop offset="100%" stopColor="#45e3a7" stopOpacity="0"/></linearGradient></defs><CartesianGrid stroke="#1d2b34" vertical={false}/><XAxis dataKey="h" stroke="#6e7d88" tickLine={false} axisLine={false}/><YAxis stroke="#6e7d88" tickLine={false} axisLine={false}/><Tooltip contentStyle={{background:'#0c151b',border:'1px solid #24343f',borderRadius:12}}/><Area type="monotone" dataKey="v" stroke="#45e3a7" strokeWidth={2.5} fill="url(#g2)"/></AreaChart></ResponsiveContainer></div></div><div className="card bottleneck"><SectionHead kicker="TOP BOTTLENECKS" title="Critical Corridors"/><div className="bottle-list">{(a?.bottlenecks||[]).map(b=><div key={b.corridor}><div><span>{b.corridor}</span><b>{b.index}</b></div><div className="bar"><i style={{width:b.index+'%'}}/></div><small>{b.delay}</small></div>)}</div></div></div></section>
}

function Alerts({data}){const [filter,setFilter]=useState('All'); const rows=filter==='All'?data.alerts:(data.alerts||[]).filter(a=>a.severity===filter); const k=data.alertKpis; return <section><div className="hero compact"><div><div className="eyebrow accent-text">SECURITY & INCIDENTS</div><h1>Alerts</h1><p>High-priority events from the citywide alert service.</p></div></div><div className="alert-kpis"><Metric icon={CircleAlert} label="OPEN" value={k?.open??'—'} accent="red"/><Metric icon={TriangleAlert} label="INVESTIGATING" value={k?.investigating??'—'} accent="amber"/><Metric icon={CheckCircle2} label="RESOLVED TODAY" value={k?.resolved_today??'—'} accent="green"/><Metric icon={ShieldAlert} label="BLACKLIST MATCHES" value={k?.blacklist_matches??'—'} accent="violet"/></div><div className="card table-card"><div className="table-toolbar"><div className="segmented">{['All','Critical','High','Medium','Low'].map(x=><button key={x} className={filter===x?'active':''} onClick={()=>setFilter(x)}>{x}</button>)}</div><button className="btn ghost" onClick={()=>window.dispatchEvent(new Event('cityvision:refresh'))}><RefreshCw size={15}/>Refresh</button></div><table><thead><tr><th>ALERT</th><th>VEHICLE</th><th>SOURCE</th><th>LOCATION</th><th>TIME</th><th>STATUS</th></tr></thead><tbody>{rows.map(a=><tr key={a.id}><td><div className="alert-name"><span className={`sev ${a.severity.toLowerCase()}`}/><div><strong>{a.title}</strong><span>{a.id} • {a.severity}</span></div></div></td><td><span className="mono">{a.plate}</span></td><td><span className="mono">{a.camera}</span></td><td>{a.location}</td><td className="mono">{a.time}</td><td><Pill tone={a.status==='Resolved'?'green':a.status==='Investigating'?'amber':'red'}>{a.status}</Pill></td></tr>)}</tbody></table></div></section>}


function CameraManagement({data}){const [q,setQ]=useState(''); const rows=(data.cameras||cameras).filter(c=>!q||c.id.toLowerCase().includes(q.toLowerCase())||c.location.toLowerCase().includes(q.toLowerCase())); return <section><div className="hero compact"><div><div className="eyebrow accent-text">INFRASTRUCTURE CONTROL</div><h1>Camera Management</h1><p>Monitor device health, connectivity, placement and ANPR capability from the local demo dataset.</p></div><div className="hero-actions"><button className="btn primary"><Camera size={15}/>Register Camera</button></div></div><div className="camera-management-grid"><div className="card table-card"><div className="table-toolbar"><div className="global-search compact-search"><Search size={15}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search camera or location"/></div><div className="segmented"><button className="active">All {rows.length}</button></div></div><table><thead><tr><th>CAMERA</th><th>LOCATION</th><th>TYPE</th><th>STATUS</th><th>LAST ACTIVE</th><th>HEALTH</th></tr></thead><tbody>{rows.map(c=><tr key={c.id}><td><div className="camera-id"><Camera size={15}/><span><strong>{c.id}</strong><small>{c.ip_address||'No IP'}</small></span></div></td><td>{c.location}</td><td>{c.type}</td><td><Pill tone={c.status==='Online'?'green':c.status==='Warning'?'amber':'red'}>{c.status}</Pill></td><td className="mono">{c.last_active?new Date(c.last_active).toLocaleTimeString('en-IN'):'—'}</td><td><div className="health"><div className="bar"><i className={c.status==='Offline'?'red':c.status==='Warning'?'amber':'green'} style={{width:`${c.health_pct||0}%`}}/></div><span>{c.health_pct ?? 0}%</span></div></td></tr>)}</tbody></table></div><aside className="card infra-side"><SectionHead kicker="CITY NETWORK" title="Infrastructure Health"/><div className="server-state"><Server size={19}/><div><strong>Control Core</strong><span>Demo control core active</span></div><CheckCircle2 size={17} className="ok"/></div><div className="server-state"><Database size={19}/><div><strong>Camera Data</strong><span>{rows.length} cameras loaded</span></div><CheckCircle2 size={17} className="ok"/></div><div className="server-state"><Zap size={19}/><div><strong>Simulator</strong><span>Local demo telemetry</span></div><CheckCircle2 size={17} className="ok"/></div></aside></div></section>}


function Reports({data}){const p=data.reportPreview; return <section><div className="hero compact"><div><div className="eyebrow accent-text">REPORTING CENTER</div><h1>Reports</h1><p>Generate auditable traffic, vehicle, camera and incident reports.</p></div><div className="hero-actions"><button className="btn primary"><FileDown size={15}/>Generate Report</button></div></div><div className="reports-grid">{[['Traffic Flow Report','Traffic volumes, speeds and corridor congestion','BarChart3'],['Vehicle Detection Report','ANPR detections and camera-wise sightings','Fingerprint'],['Camera Health Report','Availability, uptime and device health','Camera'],['Alert Incident Report','Open, investigated and resolved incidents','ShieldAlert']].map(([title,desc,ico],i)=>{const I={BarChart3,Fingerprint,Camera,ShieldAlert}[ico];return <motion.div className="report-card card" key={title} whileHover={{y:-4}}><div className="report-icon"><I size={20}/></div><div><span className="eyebrow">REPORT 0{i+1}</span><h3>{title}</h3><p>{desc}</p></div><div className="report-foot"><span>Local report service</span><button className="icon-btn"><ArrowUpRight size={16}/></button></div></motion.div>})}</div><div className="card report-preview"><SectionHead kicker="REPORT PREVIEW" title={p?.title||'Daily Traffic Intelligence'} action={<button className="btn ghost"><Download size={15}/>Export CSV</button>}/><div className="preview-grid"><div><span>Vehicles detected</span><strong>{p?.vehicles_detected??'—'}</strong></div><div><span>Peak volume</span><strong>{p?.peak_volume_per_hr??'—'} / hr</strong></div><div><span>Avg speed</span><strong>{p?.avg_speed_kmh??'—'} km/h</strong></div><div><span>Alerts triggered</span><strong>{p?.alerts_triggered??'—'}</strong></div></div><div className="preview-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={p?.trend?.map(x=>({t:x.t,v:x.v}))||trafficTrend}><defs><linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#b18cff" stopOpacity=".24"/><stop offset="100%" stopColor="#b18cff" stopOpacity="0"/></linearGradient></defs><XAxis dataKey="t" stroke="#6e7d88" tickLine={false} axisLine={false}/><YAxis stroke="#6e7d88" tickLine={false} axisLine={false}/><Area type="monotone" dataKey="v" stroke="#b18cff" strokeWidth={2.5} fill="url(#g3)"/></AreaChart></ResponsiveContainer></div></div></section>}


function Settings({data}){const s=data.settings; const items=[['User Profile','Manage operator identity and access details',UserRound],['System Preferences','Language, time zone and data refresh behavior',MonitorCog],['Notification Settings','Configure push, email and control-room notifications',Bell],['Alert Preferences','Severity thresholds and routing rules',ShieldAlert],['Map Preferences','Default layers, labels and map behavior',MapIcon],['Camera Settings','Stream quality, ANPR and device defaults',Camera],['Security Settings','Session security, MFA and audit policies',LockKeyhole],['Theme Settings','Interface density and command-center appearance',Palette]]; return <section><div className="hero compact"><div><div className="eyebrow accent-text">SYSTEM CONFIGURATION</div><h1>Settings</h1><p>Settings are loaded from the local demo configuration.</p></div></div><div className="settings-grid">{items.map(([title,desc,I])=><motion.button className="setting-item card" key={title} whileHover={{x:3}}><div className="setting-icon"><I size={18}/></div><div><strong>{title}</strong><span>{desc}</span></div><ChevronDown size={16}/></motion.button>)}</div><div className="card preferences"><SectionHead kicker="ACTIVE CONFIGURATION" title="Operations Profile"/><div className="pref-row"><div><strong>Operations Mode</strong><span>{s?.operations_mode||'—'}</span></div><Pill tone="green">ACTIVE</Pill></div><div className="pref-row"><div><strong>Data Refresh</strong><span>Live telemetry refresh interval</span></div><b>{s?.data_refresh_seconds??'—'} seconds</b></div><div className="pref-row"><div><strong>Security Level</strong><span>Access policies for control-room users</span></div><b>{s?.security_level||'—'}</b></div><div className="pref-row"><div><strong>Default Map</strong><span>Traffic + Cameras + Incidents</span></div><b>{s?.default_map_layers?.join(' + ')||'—'}</b></div></div></section>}


function renderPage(page,props){switch(page){case 'Dashboard':return <Dashboard {...props}/>;case 'Live Camera Feed':return <LiveCameraFeed {...props}/>;case 'Vehicle Search & Tracking':return <VehicleTracking {...props}/>;case 'GIS Traffic Map':return <GISMap {...props}/>;case 'Traffic Analytics':return <Analytics {...props}/>;case 'Alerts':return <Alerts {...props}/>;case 'Camera Management':return <CameraManagement {...props}/>;case 'Reports':return <Reports {...props}/>;case 'Settings':return <Settings {...props}/>;default:return <Dashboard {...props}/>}}

createRoot(document.getElementById('root')).render(<App/>);
