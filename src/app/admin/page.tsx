"use client";

import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, ReferenceArea
} from 'recharts';

// SVG Icons to match screenshot
const ArrowUp = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 inline-block mr-1"><path d="m18 15-6-6-6 6" /></svg>;
const ArrowDown = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 inline-block mr-1"><path d="m6 9 6 6 6-6" /></svg>;

// Mock Data for Charts
const mockBarData = [
    { name: '28 June', Generated: 180, Target: 140 },
    { name: '05 July', Generated: 160, Target: 155 },
    { name: '12 July', Generated: 160, Target: 150 },
    { name: '19 July', Generated: 180, Target: 130 },
    { name: '26 July', Generated: 195, Target: 190 },
    { name: '02 Aug', Generated: 210, Target: 200 },
];

const mockLineData = [
    { name: '1', current: 3, previous: 2 },
    { name: '2', current: 3.5, previous: 2.2 },
    { name: '3', current: 5, previous: 3 },
    { name: '4', current: 4.5, previous: 2.8 },
    { name: '5', current: 3.5, previous: 2 },
    { name: '6', current: 3, previous: 2.2 },
    { name: '7', current: 2.8, previous: 2.5 },
    { name: '8', current: 3.5, previous: 3.1 },
    { name: '9', current: 3.6, previous: 3.2 },
    { name: '10', current: 4.8, previous: 3.8 },
    { name: '11', current: 5.5, previous: 4.2 },
    { name: '12', current: 6.2, previous: 4.3 },
];

export default function AdminPage() {
    const [settings, setSettings] = useState<any>(null);
    const [tiers, setTiers] = useState<any[]>([]);
    const [stats, setStats] = useState<any[]>([]);
    const [trends, setTrends] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                console.log('Fetching dashboard data...');
                const [resSettings, resTiers, resStats, resTrends] = await Promise.all([
                    fetch('/api/settings'),
                    fetch('/api/tiers'),
                    fetch('/api/stats'),
                    fetch('/api/trend')
                ]);

                if (resSettings.ok) setSettings(await resSettings.json());
                else console.error('Settings fetch failed');

                if (resTiers.ok) setTiers(await resTiers.json());
                else console.error('Tiers fetch failed');

                if (resStats.ok) setStats(await resStats.json());
                else console.error('Stats fetch failed');

                if (resTrends.ok) {
                    const trendData = await resTrends.json();
                    setTrends(trendData);
                } else {
                    console.error('Trends fetch failed');
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const saveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('/api/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        alert('Settings saved!');
    };

    const saveTier = async (tier: any) => {
        await fetch('/api/tiers', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tier)
        });
        alert(`Tier ${tier.name} saved!`);
    };

    const saveStat = async (stat: any) => {
        await fetch('/api/stats', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(stat)
        });
        alert(`Stat ${stat.label} saved!`);
    };

    const saveAllStats = async () => {
        try {
            await Promise.all(stats.map(stat => fetch('/api/stats', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(stat)
            })));
            alert('All impact statistics saved successfully!');
        } catch (error) {
            console.error('Failed to save all stats:', error);
            alert('Error saving all impact statistics.');
        }
    };

    const saveTrends = async (type: string) => {
        const typeTrends = trends.filter(t => t.type === type);
        await fetch('/api/trend', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trends) // Bulk update everything
        });
        alert(`${type === 'HISTORY' ? 'Revenue history' : 'Forecast data'} saved!`);
    };

    const addTrendPoint = (type: string) => {
        const newPoint = {
            id: Math.random(),
            type,
            label: type === 'HISTORY' ? 'New Date' : 'Week X',
            value1: 0,
            value2: 0,
            order: trends.length
        };
        setTrends([...trends, newPoint]);
    };

    const removeTrendPoint = (id: any) => {
        setTrends(trends.filter(p => p.id !== id));
    };

    if (loading) return <div className="p-10 text-center text-slate-800 font-bold">Loading Dashboard...</div>;

    const raised = Number(settings?.raised || 0);
    const goal = Number(settings?.goal || 100000000);
    const percentageStr = goal > 0 ? ((raised / goal) * 100).toFixed(0) : '0';

    const pieData = [
        { name: 'Raised', value: raised, fill: '#eab308' },
        { name: 'Remaining Gap', value: Math.max(0, goal - raised), fill: '#1e293b' }
    ];

    return (
        <div className="min-h-screen bg-[#f4f6f8] text-slate-900 font-sans pb-20">

            {/* Dashboard View Matching Screenshot */}
            <div className="p-6 md:p-10 max-w-[1400px] mx-auto">


                <div className="w-full flex flex-col gap-4">
                    {/* ROW 1 */}
                    <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[300px]">
                        {/* Bar Chart */}
                        <div className="bg-white border border-slate-200 w-full lg:w-2/3 h-[300px] lg:h-full p-6 pt-8 pb-4 flex flex-col">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={trends.filter(t => t.type === 'HISTORY').length > 0 ? trends.filter(t => t.type === 'HISTORY') : [
                                        { label: 'No Data', value1: 0, value2: 0 }
                                    ].map(d => ({ name: d.label, Generated: d.value1, Target: d.value2 }))}
                                    barGap={-26}
                                    margin={{ top: 10, right: 0, bottom: 0, left: -20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 'auto']} />
                                    <Legend verticalAlign="top" align="right" iconType="square" wrapperStyle={{ fontSize: 10, color: '#64748b', top: -10, paddingBottom: 10 }} />
                                    <Bar dataKey="Generated" fill="#94a3b8" barSize={32} radius={[2, 2, 0, 0]} />
                                    <Bar dataKey="Target" fill="#1e293b" barSize={20} radius={[2, 2, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Donut Chart */}
                        <div className="bg-white border border-slate-200 w-full lg:w-1/3 h-[300px] lg:h-full flex items-center justify-center relative p-6">
                            <div className="absolute top-1/2 left-[20%] -translate-y-1/2 flex flex-col items-center">
                                <span className="text-[11px] text-slate-600 font-semibold mb-2">Quarterly revenue goal</span>
                                <span className="bg-[#1e293b] text-white text-[10px] px-4 py-1 rounded-full uppercase font-bold tracking-wider">Revenue</span>
                            </div>
                            <div className="w-[180px] h-[180px] absolute right-[10%]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={85}
                                            startAngle={90}
                                            endAngle={-270}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-2xl font-bold text-[#1e293b]">{percentageStr}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ROW 2 */}
                    <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[260px]">
                        {/* Basic Metrics */}
                        <div className="bg-white border border-slate-200 w-full lg:w-1/3 h-[260px] lg:h-full p-6 flex flex-col justify-between">
                            <div>
                                <span className="text-[13px] font-semibold text-slate-700 block mb-2">Basic metrics:</span>
                                <span className="bg-[#1e293b] text-white text-[10px] px-4 py-1 rounded-full uppercase font-bold tracking-wider inline-block mb-6">Revenue</span>

                                <div className="flex justify-between items-end mb-1">
                                    <h2 className="text-3xl font-bold text-[#1e293b] tracking-tight">${raised.toLocaleString()}</h2>
                                    <span className="text-[13px] font-bold text-slate-700"><ArrowUp /> 5.4%</span>
                                </div>
                                <span className="text-[11px] text-slate-500">Last month</span>
                            </div>

                            <div className="w-full h-6 bg-slate-200 mt-6 relative overflow-hidden">
                                <div
                                    className="h-full bg-[#eab308] text-[#1e293b] text-[10px] font-bold px-3 py-1 flex justify-between items-center transition-all duration-1000"
                                    style={{ width: `${percentageStr}%` }}
                                >
                                    <span className="whitespace-nowrap">Weekly target</span>
                                    <span>${goal.toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 1 })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Line Chart */}
                        <div className="bg-white border border-slate-200 w-full lg:w-2/3 h-[260px] lg:h-full p-4 relative pt-10">
                            <div className="absolute top-4 right-10 bg-[#e2e8f0] px-4 py-1 text-[11px] font-semibold text-slate-600 z-10">Final forecast</div>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={trends.filter(t => t.type === 'FORECAST').length > 0 ? trends.filter(t => t.type === 'FORECAST').map(d => ({ name: d.label, current: d.value1, previous: d.value2 })) : [
                                        { name: '1', current: 0, previous: 0 }
                                    ]}
                                    margin={{ top: 0, right: 0, bottom: 0, left: -20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={false} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickCount={6} domain={[0, 'auto']} />
                                    <Line type="monotone" dataKey="current" stroke="#eab308" strokeWidth={2} dot={{ r: 3, fill: "#fff", stroke: "#eab308", strokeWidth: 2 }} activeDot={{ r: 5 }} />
                                    <Line type="monotone" dataKey="previous" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={{ r: 3, fill: "#fff", stroke: "#94a3b8", strokeWidth: 2 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* ROW 3 */}
                    <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[130px]">
                        {/* Additional metrics */}
                        <div className="bg-white border border-slate-200 w-full lg:w-1/3 p-6 flex flex-col justify-center">
                            <span className="text-[13px] font-semibold text-slate-700 block mb-2">Additional metrics:</span>
                            <span className="bg-[#1e293b] text-white text-[10px] px-4 py-1 rounded-full uppercase font-bold tracking-wider inline-block mb-3 w-max">Donors</span>
                            <div className="flex justify-between items-end">
                                <span className="text-xl font-bold text-[#1e293b]">2341</span>
                                <span className="text-[13px] font-bold text-slate-700"><ArrowDown /> 3.2%</span>
                            </div>
                            <div className="w-full flex mt-2 h-4">
                                <div className="bg-white w-2/3"></div>
                                <div className="bg-[#1e293b] rounded-full w-1/3"></div>
                            </div>
                        </div>

                        {/* Bottom row stats split */}
                        <div className="w-full lg:w-2/3 flex flex-col sm:flex-row gap-4">
                            <div className="bg-white border border-slate-200 border-t-4 border-t-[#1e293b] p-6 w-full flex flex-col justify-center">
                                <span className="text-[11px] font-semibold text-slate-600 mb-2">Average Donation:</span>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="font-bold text-[#1e293b] text-lg lg:text-md mr-1">154</span>
                                        <span className="text-xs text-slate-500">(-5%)</span>
                                    </div>
                                    <span className="text-[12px] font-bold text-slate-700"><ArrowUp /> 27.4%</span>
                                </div>
                                <span className="text-[10px] text-slate-400 mt-2">Last week</span>
                            </div>

                            <div className="bg-white border border-slate-200 p-6 w-full flex items-center justify-between">
                                <div className="w-10 h-10 rounded-full border-4 border-[#1e293b] border-t-[#e2e8f0] flex-shrink-0"></div>
                                <div className="ml-4 flex-grow">
                                    <span className="text-[10px] font-semibold text-slate-600 block mb-1">Portfolio under management</span>
                                    <div className="flex justify-between items-center text-[10px] font-bold text-[#1e293b]">
                                        <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#1e293b] mr-1"></span> Net revenue</div>
                                        <span className="text-slate-400">^</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mt-1">
                                        <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-slate-300 mr-1"></span> 4B (15%)</div>
                                        <span>v</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-slate-200 p-6 w-full flex flex-col justify-center">
                                <span className="text-[11px] font-semibold text-slate-600 mb-2">Average tier price:</span>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-[#1e293b] text-lg lg:text-md">3 054.50</span>
                                    <span className="text-[12px] font-bold text-slate-700"><ArrowUp /> 1.25%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-[9px] text-slate-400 text-center w-full mt-2">
                        *The graphs/charts remain in mock, and changes automatically based on data, placeholder text is assumed from DB data.*
                    </div>
                </div>
            </div>

            <hr className="my-10 border-slate-300 max-w-[1400px] mx-auto" />

            {/* Actual Data Management section (The real admin forms) */}
            <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
                <h2 className="text-2xl font-bold text-slate-800 mb-8">Database Management</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Settings Update */}
                    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Global Settings</h3>
                        <form onSubmit={saveSettings} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Raised Amount ($)</label>
                                <input type="number" value={settings?.raised || 0} onChange={e => setSettings({ ...settings, raised: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-800 focus:outline-none focus:border-[#1e293b]" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Goal Amount ($)</label>
                                <input type="number" value={settings?.goal || 0} onChange={e => setSettings({ ...settings, goal: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-800 focus:outline-none focus:border-[#1e293b]" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Hero Title</label>
                                <input type="text" value={settings?.heroTitle || ''} onChange={e => setSettings({ ...settings, heroTitle: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-800 focus:outline-none focus:border-[#1e293b]" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Hero Subtitle</label>
                                <input type="text" value={settings?.heroSubtitle || ''} onChange={e => setSettings({ ...settings, heroSubtitle: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-800 focus:outline-none focus:border-[#1e293b]" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Hero Text</label>
                                <textarea value={settings?.heroText || ''} onChange={e => setSettings({ ...settings, heroText: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-800 h-24 focus:outline-none focus:border-[#1e293b]"></textarea>
                            </div>
                            <button type="submit" className="bg-[#1e293b] hover:bg-slate-800 text-white font-bold py-3 px-4 rounded w-full mt-4 transition-colors">Save Settings</button>
                        </form>
                    </div>

                    {/* Stats Update */}
                    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Impact Statistics</h3>
                            <button onClick={saveAllStats} className="bg-[#1e293b] hover:bg-slate-800 text-white font-bold py-1.5 px-4 rounded text-sm transition-colors">Save All</button>
                        </div>
                        <div className="space-y-6">
                            {stats.map((stat, i) => (
                                <div key={stat.id} className="flex gap-4 items-end bg-slate-50 p-4 rounded border border-slate-200">
                                    <div className="flex-grow">
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Value</label>
                                        <input type="text" value={stat.value} onChange={e => {
                                            const newStats = [...stats];
                                            newStats[i].value = e.target.value;
                                            setStats(newStats);
                                        }} className="w-full bg-white border border-slate-300 rounded p-2 text-slate-800 focus:outline-none focus:border-[#1e293b]" />
                                    </div>
                                    <div className="flex-grow">
                                        <label className="block text-xs font-semibold text-slate-600 mb-1">Label</label>
                                        <input type="text" value={stat.label} onChange={e => {
                                            const newStats = [...stats];
                                            newStats[i].label = e.target.value;
                                            setStats(newStats);
                                        }} className="w-full bg-white border border-slate-300 rounded p-2 text-slate-800 focus:outline-none focus:border-[#1e293b]" />
                                    </div>
                                    <button onClick={() => saveStat(stat)} className="bg-slate-200 hover:bg-slate-300 border border-slate-300 text-slate-800 font-bold py-2 px-4 rounded text-sm transition-colors">Save</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Donation Tiers Update */}
                    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm lg:col-span-2">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Donation Tiers</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {tiers.map((tier, i) => (
                                <div key={tier.id} className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
                                    <div className="flex gap-4">
                                        <div className="w-1/3">
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">Name</label>
                                            <input type="text" value={tier.name} onChange={e => {
                                                const newTiers = [...tiers]; newTiers[i].name = e.target.value; setTiers(newTiers);
                                            }} className="w-full bg-white border border-slate-300 rounded p-2 text-slate-800 focus:outline-none focus:border-[#1e293b]" />
                                        </div>
                                        <div className="w-1/3">
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">Price ($)</label>
                                            <input type="number" value={tier.price} onChange={e => {
                                                const newTiers = [...tiers]; newTiers[i].price = e.target.value; setTiers(newTiers);
                                            }} className="w-full bg-white border border-slate-300 rounded p-2 text-slate-800 focus:outline-none focus:border-[#1e293b]" />
                                        </div>
                                        <div className="w-1/3">
                                            <label className="block text-xs font-semibold text-slate-600 mb-1">Available</label>
                                            <input type="number" value={tier.available} onChange={e => {
                                                const newTiers = [...tiers]; newTiers[i].available = e.target.value; setTiers(newTiers);
                                            }} className="w-full bg-white border border-slate-300 rounded p-2 text-slate-800 focus:outline-none focus:border-[#1e293b]" />
                                        </div>
                                    </div>
                                    <button onClick={() => saveTier(tier)} className="bg-slate-200 hover:bg-slate-300 border border-slate-300 text-slate-800 font-bold py-2 px-4 rounded w-full text-sm transition-colors">Save Tier</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Revenue History & Forecast Management */}
                    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Charts Data Management</h3>
                            <button onClick={() => { saveTrends('HISTORY'); saveTrends('FORECAST'); }} className="bg-[#1e293b] hover:bg-slate-800 text-white font-bold py-2 px-6 rounded transition-colors">Save All Charts Data</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* History */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-slate-700">Revenue History (Bar Chart)</h4>
                                    <button onClick={() => addTrendPoint('HISTORY')} className="text-gold text-xs font-bold hover:underline">+ Add Week</button>
                                </div>
                                {trends.filter(t => t.type === 'HISTORY').map((point, i) => (
                                    <div key={point.id} className="flex gap-2 items-end bg-slate-50 p-2 rounded border border-slate-200 relative group">
                                        <div className="flex-grow">
                                            <input type="text" placeholder="Date" value={point.label} onChange={e => {
                                                const newTrends = [...trends];
                                                const idx = trends.findIndex(t => t.id === point.id);
                                                newTrends[idx].label = e.target.value;
                                                setTrends(newTrends);
                                            }} className="w-full text-[10px] bg-white border p-1 rounded" />
                                        </div>
                                        <div className="w-20">
                                            <input type="number" placeholder="Gen" value={point.value1} onChange={e => {
                                                const newTrends = [...trends];
                                                const idx = trends.findIndex(t => t.id === point.id);
                                                newTrends[idx].value1 = e.target.value;
                                                setTrends(newTrends);
                                            }} className="w-full text-[10px] bg-white border p-1 rounded" />
                                        </div>
                                        <div className="w-20">
                                            <input type="number" placeholder="Target" value={point.value2} onChange={e => {
                                                const newTrends = [...trends];
                                                const idx = trends.findIndex(t => t.id === point.id);
                                                newTrends[idx].value2 = e.target.value;
                                                setTrends(newTrends);
                                            }} className="w-full text-[10px] bg-white border p-1 rounded" />
                                        </div>
                                        <button onClick={() => removeTrendPoint(point.id)} className="text-red-500 opacity-0 group-hover:opacity-100 p-1">×</button>
                                    </div>
                                ))}
                            </div>

                            {/* Forecast */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-slate-700">Forecast Data (Line Chart)</h4>
                                    <button onClick={() => addTrendPoint('FORECAST')} className="text-gold text-xs font-bold hover:underline">+ Add Point</button>
                                </div>
                                {trends.filter(t => t.type === 'FORECAST').map((point, i) => (
                                    <div key={point.id} className="flex gap-2 items-end bg-slate-50 p-2 rounded border border-slate-200 relative group">
                                        <div className="flex-grow">
                                            <input type="text" placeholder="X-Label" value={point.label} onChange={e => {
                                                const newTrends = [...trends];
                                                const idx = trends.findIndex(t => t.id === point.id);
                                                newTrends[idx].label = e.target.value;
                                                setTrends(newTrends);
                                            }} className="w-full text-[10px] bg-white border p-1 rounded" />
                                        </div>
                                        <div className="w-20">
                                            <input type="number" placeholder="Cur" step="0.1" value={point.value1} onChange={e => {
                                                const newTrends = [...trends];
                                                const idx = trends.findIndex(t => t.id === point.id);
                                                newTrends[idx].value1 = e.target.value;
                                                setTrends(newTrends);
                                            }} className="w-full text-[10px] bg-white border p-1 rounded" />
                                        </div>
                                        <div className="w-20">
                                            <input type="number" placeholder="Prev" step="0.1" value={point.value2} onChange={e => {
                                                const newTrends = [...trends];
                                                const idx = trends.findIndex(t => t.id === point.id);
                                                newTrends[idx].value2 = e.target.value;
                                                setTrends(newTrends);
                                            }} className="w-full text-[10px] bg-white border p-1 rounded" />
                                        </div>
                                        <button onClick={() => removeTrendPoint(point.id)} className="text-red-500 opacity-0 group-hover:opacity-100 p-1">×</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
