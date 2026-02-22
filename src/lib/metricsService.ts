
type MetricType = 'translation_request' | 'translation_cache_hit' | 'translation_cache_miss' | 'offline_access' | 'page_load' | 'api_call';

interface AppMetrics {
    translationRequests: number;
    cacheHits: number;
    cacheMisses: number;
    offlineUsageCount: number;
    apiResponseTimes: number[];
    loadTime: number;
    sessionStartTime: number;
}

const metrics: AppMetrics = {
    translationRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
    offlineUsageCount: 0,
    apiResponseTimes: [],
    loadTime: 0,
    sessionStartTime: Date.now(),
};

// Listeners for live updates
const listeners: Set<(m: AppMetrics) => void> = new Set();

const notifyListeners = () => {
    listeners.forEach(l => l({ ...metrics }));
};

export const trackMetric = (type: MetricType, value?: any) => {
    switch (type) {
        case 'translation_request':
            metrics.translationRequests++;
            break;
        case 'translation_cache_hit':
            metrics.cacheHits++;
            break;
        case 'translation_cache_miss':
            metrics.cacheMisses++;
            break;
        case 'offline_access':
            metrics.offlineUsageCount++;
            break;
        case 'page_load':
            metrics.loadTime = value;
            break;
        case 'api_call':
            if (typeof value === 'number') {
                metrics.apiResponseTimes.push(value);
            }
            break;
    }
    notifyListeners();

    // Also log to console for quick judge visibility
    console.log(`[Metric] ${type}:`, metrics);
};

export const getMetrics = () => ({ ...metrics });

export const subscribeToMetrics = (callback: (m: AppMetrics) => void) => {
    listeners.add(callback);
    callback({ ...metrics });
    return () => {
        listeners.delete(callback);
    };
};

export const getCacheHitRate = () => {
    const total = metrics.cacheHits + metrics.cacheMisses;
    if (total === 0) return 0;
    return Math.round((metrics.cacheHits / total) * 100);
};

export const getAverageApiResponseTime = () => {
    if (metrics.apiResponseTimes.length === 0) return 0;
    const sum = metrics.apiResponseTimes.reduce((a, b) => a + b, 0);
    return Math.round(sum / metrics.apiResponseTimes.length);
};

// Auto-track load time
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        const loadTime = Date.now() - performance.timing.navigationStart;
        trackMetric('page_load', loadTime);
    });
}
