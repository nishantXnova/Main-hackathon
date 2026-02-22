
import React, { useEffect, useState } from 'react';
import { getMetrics, subscribeToMetrics, getCacheHitRate, getAverageApiResponseTime } from '@/lib/metricsService';
import { Activity, Zap, WifiOff, Globe, Clock, BarChart3, PlayCircle } from 'lucide-react';
import { triggerDemoMode } from '@/lib/demoService';

const PerformanceMonitor: React.FC = () => {
    const [metrics, setMetrics] = useState(getMetrics());
    const [isVisible, setIsVisible] = useState(false);

    const handleDemoMode = () => {
        triggerDemoMode();
        window.location.reload(); // Reload to see the changes
    };

    useEffect(() => {
        const unsubscribe = subscribeToMetrics(setMetrics);

        // Toggle visibility with Alt+M (Metrics)
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key === 'm') {
                setIsVisible(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            unsubscribe();
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    if (!isVisible) return (
        <div
            className="fixed bottom-4 right-4 z-[9999] opacity-20 hover:opacity-100 transition-opacity cursor-pointer group"
            onClick={() => setIsVisible(true)}
        >
            <div className="bg-black/80 backdrop-blur-md text-white p-2 rounded-full border border-white/20">
                <Activity className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" />
            </div>
        </div>
    );

    const hitRate = getCacheHitRate();
    const avgResponse = getAverageApiResponseTime();

    return (
        <div className="fixed bottom-4 right-4 z-[9999] w-72 bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-4 text-white overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                    <h3 className="text-xs font-bold tracking-wider uppercase text-blue-100">Live Performance</h3>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleDemoMode}
                        className="text-[10px] bg-emerald-500/20 hover:bg-emerald-500/40 px-2 py-1 rounded transition-colors text-emerald-400 flex items-center gap-1 font-bold"
                    >
                        <PlayCircle className="w-3 h-3" />
                        DEMO
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors text-white/60"
                    >
                        Hide
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <MetricCard
                    icon={<Globe className="w-3 h-3 text-cyan-400" />}
                    label="Translations"
                    value={metrics.translationRequests}
                />
                <MetricCard
                    icon={<Zap className="w-3 h-3 text-yellow-400" />}
                    label="Cache Hit"
                    value={`${hitRate}%`}
                />
                <MetricCard
                    icon={<WifiOff className="w-3 h-3 text-orange-400" />}
                    label="Offline Uses"
                    value={metrics.offlineUsageCount}
                />
                <MetricCard
                    icon={<Clock className="w-3 h-3 text-purple-400" />}
                    label="Load Time"
                    value={`${metrics.loadTime}ms`}
                />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-white/40 mb-1">
                    <span>API LATENCY</span>
                    <span>{avgResponse}ms avg</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                        style={{ width: `${Math.min(100, (avgResponse / 1000) * 100)}%` }}
                    />
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-medium text-white/50 uppercase tracking-tighter">System Nominal</span>
                </div>
                <span className="text-[9px] text-white/30 italic">v2.4.1-stable</span>
            </div>
        </div>
    );
};

const MetricCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number }> = ({ icon, label, value }) => (
    <div className="bg-white/5 border border-white/5 rounded-xl p-2 h-16 flex flex-col justify-between hover:bg-white/10 transition-colors">
        <div className="flex items-center gap-1.5 text-[10px] text-white/50">
            {icon}
            <span className="truncate">{label}</span>
        </div>
        <div className="text-lg font-mono font-bold text-white/90">{value}</div>
    </div>
);

export default PerformanceMonitor;
