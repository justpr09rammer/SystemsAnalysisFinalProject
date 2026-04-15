// import React, { useState } from 'react';
// import { User, Bell, Shield, Moon, ChevronLeft, Save, Lock, EyeOff } from 'lucide-react';
//
// const SettingsPage = ({ darkMode, setDarkMode }) => {
//   const [subView, setSubView] = useState('main'); // 'main', 'profile', or 'privacy'
//   const [notifications, setNotifications] = useState(true);
//
//   // Dynamic Styles based on Dark Mode prop
//   const cardBg = darkMode ? '#1e1e1e' : 'white';
//   const textColor = darkMode ? '#f8fafc' : '#1a1c1e';
//   const borderColor = darkMode ? '#334155' : '#e2e8f0';
//   const secondaryText = darkMode ? '#94a3b8' : '#64748b';
//   const rowHover = darkMode ? '#2d2d2d' : '#f1f5f9';
//
//   const SettingRow = ({ icon: Icon, title, desc, action }) => (
//     <div style={{ display: 'flex', alignItems: 'center', padding: '20px 0', borderBottom: `1px solid ${borderColor}` }}>
//       <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: darkMode ? '#334155' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px' }}>
//         <Icon size={20} color={darkMode ? '#3498db' : '#64748b'} />
//       </div>
//       <div style={{ flex: 1 }}>
//         <h4 style={{ margin: 0, fontSize: '1rem', color: textColor }}>{title}</h4>
//         <p style={{ margin: 0, fontSize: '0.85rem', color: secondaryText }}>{desc}</p>
//       </div>
//       {action}
//     </div>
//   );
//
//   // VIEW: Profile Information
//   if (subView === 'profile') {
//     return (
//       <div style={{ maxWidth: '600px' }}>
//         <button onClick={() => setSubView('main')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: secondaryText, cursor: 'pointer', marginBottom: '24px' }}>
//           <ChevronLeft size={20} /> Back to Settings
//         </button>
//         <h2 style={{ marginBottom: '24px', color: textColor }}>Profile Information</h2>
//         <div style={{ background: cardBg, padding: '32px', borderRadius: '16px', border: `1px solid ${borderColor}` }}>
//           <div style={{ marginBottom: '20px' }}>
//             <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', color: textColor }}>Full Name</label>
//             <input type="text" defaultValue="John Doe" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${borderColor}`, background: darkMode ? '#0f172a' : 'white', color: textColor }} />
//           </div>
//           <div style={{ marginBottom: '20px' }}>
//             <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px', color: textColor }}>Email Address</label>
//             <input type="email" defaultValue="john@example.com" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${borderColor}`, background: darkMode ? '#0f172a' : 'white', color: textColor }} />
//           </div>
//           <button onClick={() => setSubView('main')} style={{ width: '100%', padding: '14px', background: '#3498db', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
//             Save Changes
//           </button>
//         </div>
//       </div>
//     );
//   }
//
//   // VIEW: Privacy & Security
//   if (subView === 'privacy') {
//     return (
//       <div style={{ maxWidth: '600px' }}>
//         <button onClick={() => setSubView('main')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: secondaryText, cursor: 'pointer', marginBottom: '24px' }}>
//           <ChevronLeft size={20} /> Back to Settings
//         </button>
//         <h2 style={{ marginBottom: '24px', color: textColor }}>Privacy & Security</h2>
//         <div style={{ background: cardBg, padding: '32px', borderRadius: '16px', border: `1px solid ${borderColor}` }}>
//             <SettingRow icon={Lock} title="Change Password" desc="Last changed 3 months ago" action={<button style={{ background: 'none', border: 'none', color: '#3498db', fontWeight: '600', cursor: 'pointer' }}>Update</button>} />
//             <SettingRow icon={EyeOff} title="Private Profile" desc="Hide your reading activity from others" action={
//                 <div onClick={() => alert("Privacy toggled")} style={{ width: '44px', height: '24px', background: '#cbd5e1', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
//                     <div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: '3px' }} />
//                 </div>
//             } />
//         </div>
//       </div>
//     );
//   }
//
//   // MAIN VIEW
//   return (
//     <div style={{ maxWidth: '800px' }}>
//       <header style={{ marginBottom: '32px' }}>
//         <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', color: textColor }}>Settings</h1>
//         <p style={{ color: secondaryText }}>Manage your account preferences and application theme.</p>
//       </header>
//
//       <div style={{ background: cardBg, padding: '32px', borderRadius: '16px', border: `1px solid ${borderColor}`, boxShadow: darkMode ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
//         <h3 style={{ marginBottom: '24px', fontSize: '1.2rem', color: textColor }}>Account Preferences</h3>
//
//         <SettingRow
//           icon={User}
//           title="Profile Information"
//           desc="Update your name, email, and avatar."
//           action={<button onClick={() => setSubView('profile')} style={{ padding: '8px 16px', borderRadius: '6px', border: `1px solid ${borderColor}`, background: darkMode ? '#334155' : 'white', color: textColor, cursor: 'pointer' }}>Edit</button>}
//         />
//
//         <SettingRow
//           icon={Bell}
//           title="Notifications"
//           desc="Manage reading reminders and quiz alerts."
//           action={
//             <div onClick={() => setNotifications(!notifications)} style={{ width: '44px', height: '24px', background: notifications ? '#2ecc71' : '#cbd5e1', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: '0.2s' }}>
//               <div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: notifications ? '23px' : '3px', transition: '0.2s' }} />
//             </div>
//           }
//         />
//
//         <SettingRow
//           icon={Moon}
//           title="Dark Mode"
//           desc="Toggle the application theme."
//           action={
//             <div onClick={() => setDarkMode(!darkMode)} style={{ width: '44px', height: '24px', background: darkMode ? '#3498db' : '#cbd5e1', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: '0.2s' }}>
//               <div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: darkMode ? '23px' : '3px', transition: '0.2s' }} />
//             </div>
//           }
//         />
//
//         <SettingRow
//           icon={Shield}
//           title="Privacy & Security"
//           desc="Manage your data and connected accounts."
//           action={<button onClick={() => setSubView('privacy')} style={{ padding: '8px 16px', borderRadius: '6px', border: `1px solid ${borderColor}`, background: darkMode ? '#334155' : 'white', color: textColor, cursor: 'pointer' }}>Manage</button>}
//         />
//
//         <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: `1px solid ${borderColor}` }}>
//             <button onClick={() => alert("Account deletion is disabled.")} style={{ color: '#ef4444', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
//               Delete Account
//             </button>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default SettingsPage;