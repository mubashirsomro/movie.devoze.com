import { useState } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import MovieCard from '@/components/MovieCard';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { getSeries } from '@/store/movieStore';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/store/settingsStore';
import AdContainer from '@/components/AdContainer';

const SeriesPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const series = getSeries();
  const { adSettings } = useSettingsStore();

  return (
    <div className="min-h-screen bg-[--stream-bg] text-white">
      <div className="container mx-auto px-4 py-8 pt-36 md:pt-24">
        <div className="container mx-auto px-4">
          {/* Ad Space */}
          <div className="mb-8">
            <AdContainer code={adSettings?.seriesAdCode} label="Advertisement" />
          </div>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-4xl md:text-5xl tracking-wider">TV Series</h1>
              <p className="text-muted-foreground mt-1">Binge-worthy shows waiting for you</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode('grid')}
                className={cn(viewMode === 'grid' && 'bg-primary text-primary-foreground')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode('list')}
                className={cn(viewMode === 'list' && 'bg-primary text-primary-foreground')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Series Grid */}
          <div className={cn(
            'grid gap-3 md:gap-6',
            viewMode === 'grid'
              ? 'grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
              : 'grid-cols-1'
          )}>
            {series.map((show) => (
              <MovieCard key={show.id} movie={show} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SeriesPage;
