// localStorage keys
const FAV_KEY = 'yummy:favorites';
const HIST_KEY = 'yummy:history';

// Types
export interface FavoriteItem {
  slug: string;
  title: string;
  coverUrl: string | null;
  type?: string;
  savedAt: number;
}

export interface HistoryItem {
  mangaSlug: string;
  mangaTitle: string;
  coverUrl: string | null;
  type?: string;
  chapterSlug: string;
  chapterNum: string;
  page?: number;
  readAt: number;
}

// Helpers
function parseDate(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (minutes < 1) return 'baru saja';
  if (minutes < 60) return `${minutes}m yang lalu`;
  if (hours < 24) return `${hours}j yang lalu`;
  if (days < 7) return `${days}h yang lalu`;
  
  const date = new Date(timestamp);
  return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
}

// Favorites
export function getFavorites(): FavoriteItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(FAV_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(item: Omit<FavoriteItem, 'savedAt'>): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const favorites = getFavorites();
    const exists = favorites.find(f => f.slug === item.slug);
    
    if (exists) {
      const updated = favorites.filter(f => f.slug !== item.slug);
      localStorage.setItem(FAV_KEY, JSON.stringify(updated));
      return false;
    } else {
      const updated = [{ ...item, savedAt: Date.now() }, ...favorites];
      localStorage.setItem(FAV_KEY, JSON.stringify(updated));
      return true;
    }
  } catch {
    return false;
  }
}

export function isFavorite(slug: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const favorites = getFavorites();
    return favorites.some(f => f.slug === slug);
  } catch {
    return false;
  }
}

export function removeFavorite(slug: string): void {
  if (typeof window === 'undefined') return;
  try {
    const favorites = getFavorites().filter(f => f.slug !== slug);
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  } catch {}
}

export function clearFavorites(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(FAV_KEY);
  } catch {}
}

// History
export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(HIST_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addHistory(item: Omit<HistoryItem, 'readAt'>): void {
  if (typeof window === 'undefined') return;
  try {
    let history = getHistory();
    
    // Remove existing entry for same manga+chapter
    history = history.filter(h => !(h.mangaSlug === item.mangaSlug && h.chapterSlug === item.chapterSlug));
    
    // Prepend new entry
    const newEntry: HistoryItem = { ...item, readAt: Date.now() };
    history = [newEntry, ...history];
    
    // Cap to 50 items
    if (history.length > 50) {
      history = history.slice(0, 50);
    }
    
    localStorage.setItem(HIST_KEY, JSON.stringify(history));
  } catch {}
}

export function updateHistoryPage(mangaSlug: string, chapterSlug: string, page: number): void {
  if (typeof window === 'undefined') return;
  try {
    let history = getHistory();
    const index = history.findIndex(
      h => h.mangaSlug === mangaSlug && h.chapterSlug === chapterSlug
    );
    
    if (index !== -1) {
      history[index].page = page;
      history[index].readAt = Date.now();
      localStorage.setItem(HIST_KEY, JSON.stringify(history));
    }
  } catch {}
}

export function getHistoryForManga(mangaSlug: string): HistoryItem | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const history = getHistory();
    return history.find(h => h.mangaSlug === mangaSlug);
  } catch {
    return undefined;
  }
}

export function removeHistory(mangaSlug: string): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getHistory().filter(h => h.mangaSlug !== mangaSlug);
    localStorage.setItem(HIST_KEY, JSON.stringify(history));
  } catch {}
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(HIST_KEY);
  } catch {}
}

// Time helper for lists
export function timeAgo(timestamp: number): string {
  return parseDate(timestamp);
}
