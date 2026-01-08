
import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSettingsStore } from '@/store/settingsStore';
import { useMovieStore } from '@/store/movieStore';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
    onMenuClick: () => void;
}

const TopBar = ({ onMenuClick }: TopBarProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const { settings } = useSettingsStore();
    const { movies } = useMovieStore();
    const navigate = useNavigate();
    const searchRef = useRef<HTMLDivElement>(null);

    // Close search on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredMovies = searchQuery.trim()
        ? movies.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
        : [];

    const handleResultClick = (movieId: string) => {
        setShowResults(false);
        setSearchQuery('');
        navigate(`/watch/${movieId}`); // Assuming /watch/:id route
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate('/movies'); // Simple redirect for now, ideally search page
            // In a real app we'd pass the query param
        }
    };

    if (!settings) return null;

    return (
        <header className="h-16 bg-[#1a1a1a] border-b border-[#333] flex items-center px-4 gap-4 sticky top-0 z-40">
            {/* Mobile Menu Trigger */}
            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-gray-400 hover:text-white"
                onClick={onMenuClick}
            >
                <MenuIcon className="w-6 h-6" />
            </Button>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-auto hidden md:block relative" ref={searchRef}>
                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowResults(true);
                        }}
                        onFocus={() => setShowResults(true)}
                        placeholder="Search movies/ TV Shows"
                        className="w-full bg-[#111] border-[#333] text-sm pl-10 focus:ring-primary h-10 rounded-lg text-gray-300 placeholder:text-gray-600"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => { setSearchQuery(''); setShowResults(false); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </form>

                {/* Visual Search Results Dropdown */}
                {showResults && searchQuery.trim() && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-2xl overflow-hidden z-50">
                        {filteredMovies.length > 0 ? (
                            <div className="py-2">
                                {filteredMovies.map((movie) => (
                                    <div
                                        key={movie.id}
                                        onClick={() => handleResultClick(movie.id)}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors"
                                    >
                                        <div className="w-10 h-14 rounded overflow-hidden bg-gray-800 flex-shrink-0">
                                            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-white">{movie.title}</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                                <span>{movie.year}</span>
                                                <span>•</span>
                                                <span className="capitalize">{movie.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-center text-gray-400 text-sm">
                                No results found for "{searchQuery}"
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile Search Icon (visible on small screens) */}
            <Button variant="ghost" size="icon" className="md:hidden text-gray-400 ml-auto">
                <Search className="w-5 h-5" />
            </Button>

            {/* Download App Button (Header) */}
            {settings.downloadAppUrl && (
                <a
                    href={settings.downloadAppUrl}
                    target="_blank"
                    rel="noreferrer"
                >
                    <Button
                        className="bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-black font-bold h-9 px-4 rounded-full flex items-center gap-2"
                    >
                        <DownloadIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Download App</span>
                    </Button>
                </a>
            )}
        </header>
    );
};

const MenuIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
)

const DownloadIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
)

export default TopBar;
