import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSettingsStore, MenuItem } from '@/store/settingsStore';
import { useMovieStore } from '@/store/movieStore';
import { useGenreStore } from '@/store/genreStore';
import { useCategoryStore } from '@/store/categoryStore';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { menuItems, settings } = useSettingsStore();
  const { genres } = useGenreStore();
  const { categories } = useCategoryStore();
  const movies = useMovieStore((state) => state.movies);

  if (!settings) return null;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter visible items
  const navLinks = (menuItems || []).filter(item => item.visible);

  const renderDesktopMenuItem = (item: MenuItem) => {
    if (item.type === 'link') {
      return (
        <Link
          key={item.id}
          to={item.path}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary uppercase tracking-wider',
            location.pathname === item.path ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {item.label}
        </Link>
      );
    }

    if (item.type === 'dynamic-genres') {
      return (
        <DropdownMenu key={item.id}>
          <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary uppercase tracking-wider text-muted-foreground outline-none">
            {item.label} <ChevronDownIcon className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-black/95 backdrop-blur-xl border-white/10">
            {genres.map((genre) => (
              <DropdownMenuItem key={genre.id} asChild className="focus:bg-white/10 cursor-pointer">
                <Link to={`/genre/${genre.slug}`} className="w-full text-white/90">
                  {genre.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    if (item.type === 'dynamic-categories') {
      return (
        <DropdownMenu key={item.id}>
          <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary uppercase tracking-wider text-muted-foreground outline-none">
            {item.label} <ChevronDownIcon className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-black/95 backdrop-blur-xl border-white/10">
            {categories.map((cat) => (
              <DropdownMenuItem key={cat.id} asChild className="focus:bg-white/10 cursor-pointer">
                <Link to={`/category/${cat.slug}`} className="w-full text-white/90">
                  {cat.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return null;
  };

  const renderMobileMenuItem = (item: MenuItem) => {
    if (item.type === 'link') {
      return (
        <Link
          key={item.id}
          to={item.path}
          onClick={() => setIsMobileMenuOpen(false)}
          className={cn(
            'block py-3 px-4 rounded-lg text-sm font-medium uppercase tracking-wider transition-colors',
            location.pathname === item.path ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          )}
        >
          {item.label}
        </Link>
      );
    }

    if (item.type === 'dynamic-genres') {
      return (
        <div key={item.id} className="py-2">
          <div className="px-4 text-xs font-semibold text-muted-foreground uppercase mb-2">{item.label}</div>
          <div className="pl-4 border-l-2 border-border ml-4 space-y-1">
            {genres.slice(0, 5).map(g => (
              <Link
                key={g.id}
                to={`/genre/${g.slug}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 px-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {g.name}
              </Link>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-[#181818] shadow-lg' : 'bg-gradient-to-b from-black/90 to-transparent md:from-black/80'
      )}
    >
      <div className="container mx-auto px-4 py-3 md:py-0 md:h-20 flex items-center justify-between gap-4">
        {/* Mobile Layout (MovieBox Style) */}
        <div className="md:hidden w-full flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
              <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-wider text-primary">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.siteName} style={{ height: `${settings.logoSize}px` }} className="object-contain" />
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-stream-accent-glow flex items-center justify-center">
                      <FilmIcon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="text-white">MovieBox</span>
                  </div>
                )}
              </Link>
            </div>
          </div>

          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search movies/ TV Shows"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white/10 border border-white/5 rounded-lg text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />

            {/* Mobile Search Results Dropdown */}
            {searchQuery.length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#181818] border border-white/10 rounded-xl shadow-2xl max-h-[60vh] overflow-y-auto z-50 animate-in fade-in zoom-in-95 duration-200">
                {movies
                  .filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .length > 0 ? (
                  <div className="p-2 space-y-1">
                    {movies
                      .filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(movie => (
                        <Link
                          key={movie.id}
                          to={`/watch/${movie.id}`}
                          onClick={() => {
                            setSearchQuery('');
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-10 h-14 object-cover rounded bg-secondary"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-sm truncate">{movie.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <span>{movie.year}</span>
                              <span>•</span>
                              <span className="uppercase">{movie.type}</span>
                              {movie.quality && (
                                <>
                                  <span>•</span>
                                  <span className="text-primary">{movie.quality}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout - Hidden on Mobile */}
        <div className="hidden md:flex items-center justify-between w-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 font-display text-2xl font-bold tracking-wider text-primary hover:opacity-80 transition-opacity">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.siteName} style={{ height: `${settings.logoSize}px` }} className="object-contain" />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-stream-accent-glow flex items-center justify-center">
                    <FilmIcon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-gradient">STREAMSPHERE</span>
                </>
              )}
            </Link>

            <div className="flex items-center gap-6">
              {navLinks.map((link) => renderDesktopMenuItem(link))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={cn(
              'flex items-center transition-all duration-300',
              isSearchOpen ? 'w-64' : 'w-10'
            )}>
              {isSearchOpen && (
                <input
                  type="text"
                  placeholder="Search movies, series..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 px-4 pr-10 bg-secondary rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary animate-fade-in"
                  autoFocus
                />
              )}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                  isSearchOpen ? 'absolute right-0 text-muted-foreground hover:text-foreground' : 'bg-secondary hover:bg-secondary/80'
                )}
              >
                {isSearchOpen ? <XIcon className="w-5 h-5" /> : <SearchIcon className="w-5 h-5" />}
              </button>
            </div>

            <Link
              to="/admin"
              className="hidden md:flex w-10 h-10 rounded-full bg-secondary items-center justify-center hover:bg-primary transition-colors"
            >
              <UserIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-4 shadow-lg animate-in slide-in-from-top-5 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => renderMobileMenuItem(link))}
          </div>
        </div>
      )}
    </nav>
  );
};

// Icons

const SearchIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /></svg>
)

const BellIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
)

const MenuIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
)

const UserIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
)

const FilmIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 3v18" /><path d="M3 7.5h4" /><path d="M3 12h18" /><path d="M3 16.5h4" /><path d="M17 3v18" /><path d="M17 7.5h4" /><path d="M17 16.5h4" /></svg>
)

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6" /></svg>
)

export default Navbar;
