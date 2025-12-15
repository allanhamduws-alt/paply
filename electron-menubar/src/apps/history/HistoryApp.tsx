import { useEffect, useState } from 'react';
import { History, Clock, Copy, Check, Trash2, Star, Zap, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { HistoryItem } from '@/types/electron';

export function HistoryApp() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<number | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      const data = await window.electronAPI.getHistory();
      setHistory(data);
    };
    loadHistory();

    window.electronAPI.onHistoryUpdated((newHistory) => setHistory(newHistory));
  }, []);

  const handleCopy = async (item: HistoryItem) => {
    await window.electronAPI.copyHistoryItem(item.id);
    setCopied(item.id);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleDelete = async (id: number) => {
    await window.electronAPI.deleteHistoryItem(id);
  };

  const handleToggleFavorite = async (id: number) => {
    await window.electronAPI.toggleFavorite(id);
    setHistory(prev =>
      prev.map(item => (item.id === id ? { ...item, favorite: !item.favorite } : item))
    );
  };

  const handleClearAll = async () => {
    if (confirm('Wirklich alle Einträge löschen?')) {
      await window.electronAPI.clearHistory();
    }
  };

  const filteredHistory = history
    .filter(item => filter === 'all' || item.favorite)
    .filter(item => {
      if (!search) return true;
      const text = (item.polished || item.transcript).toLowerCase();
      return text.includes(search.toLowerCase());
    });

  return (
    <div className="min-h-screen bg-background p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <History className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">History</h1>
            <p className="text-xs text-muted-foreground">{history.length} Einträge</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleClearAll}>
          <Trash2 className="w-4 h-4 mr-1" />
          Alle löschen
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Suchen..."
            className="pl-9"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button
          size="sm"
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          Alle
        </Button>
        <Button
          size="sm"
          variant={filter === 'favorites' ? 'default' : 'outline'}
          onClick={() => setFilter('favorites')}
        >
          <Star className="w-4 h-4 mr-1" />
          Favoriten
        </Button>
      </div>

      {/* List */}
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="space-y-2 pr-2">
          {filteredHistory.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <History className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Keine Einträge</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <Card key={item.id} className="group">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm line-clamp-2">
                        {item.polished || item.transcript}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        <Badge variant="outline" className="text-xs py-0">
                          {item.wordCount} W
                        </Badge>
                        {item.polishUsed && (
                          <Badge variant="secondary" className="text-xs py-0">
                            <Zap className="w-3 h-3 mr-1" />
                            Polish
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => handleToggleFavorite(item.id)}
                      >
                        <Star
                          className={cn(
                            'w-4 h-4',
                            item.favorite && 'fill-primary text-primary'
                          )}
                        />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => handleCopy(item)}
                      >
                        {copied === item.id ? (
                          <Check className="w-4 h-4 text-primary" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

