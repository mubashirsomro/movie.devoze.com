import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Film, Tv, Users, Settings, BarChart3, Plus, Search,
  Edit, Trash2, Eye, TrendingUp, Star, X,
  Home, Layers, FolderOpen, Bell, Save, Upload, Globe, Code, Video,
  Type, Image as ImageIcon, Download, GripVertical, CheckCircle,
  Facebook, Twitter, Instagram, LayoutTemplate, Megaphone, Lock, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import ImageUpload from '@/components/ImageUpload';
import { AdminErrorBoundary } from '@/components/AdminErrorBoundary';
import { useSettingsStore } from '@/store/settingsStore';
import { useMovieStore, initialMovies } from '@/store/movieStore';
import { useGenreStore } from '@/store/genreStore';
import { useCategoryStore } from '@/store/categoryStore';
import { useDownloadStore } from '@/store/downloadStore';
import { useViewStore } from '@/store/viewsStore';
import { useUserStore } from '@/store/userStore';
import { Movie } from '@/data/movies';

// Utility function to generate URL-friendly slugs
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

// Auto-generate SEO fields from title and description
const generateSEOFields = (title: string, description: string, year: number) => {
  return {
    slug: generateSlug(title) + `-${year}`,
    metaTitle: `${title} (${year}) - Watch Online Free`,
    metaDescription: description.substring(0, 155) + (description.length > 155 ? '...' : ''),
    keywords: `${title.toLowerCase()}, ${year}, watch online, free streaming, movie, film`
  };
};

const AdminPageContent = () => {
  const { toast } = useToast();
  const { tab } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTabState] = useState(tab || 'dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('admin_auth') === 'true');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setLoginData({ username: '', password: '' });
    window.location.reload();
  };

  // Sync state with URL params
  useEffect(() => {
    if (tab) {
      setActiveTabState(tab);
    }
  }, [tab]);

  // Wrapper to update URL instead of just state
  const setActiveTab = (tabName: string) => {
    navigate(`/admin/${tabName}`);
  };
  const moviesList = useMovieStore((state) => state.movies);
  const addMovie = useMovieStore((state) => state.addMovie);
  const updateMovie = useMovieStore((state) => state.updateMovie);
  const deleteMovie = useMovieStore((state) => state.deleteMovie);
  const genres = useGenreStore((state) => state.genres);
  const addGenre = useGenreStore((state) => state.addGenre);
  const updateGenre = useGenreStore((state) => state.updateGenre);
  const deleteGenre = useGenreStore((state) => state.deleteGenre);
  const categories = useCategoryStore((state) => state.categories);
  const isOnline = useMovieStore((state) => state.isOnline);
  const lastSyncTime = useMovieStore((state) => state.lastSyncTime);
  const syncStatus = useMovieStore((state) => state.syncStatus);
  const syncWithServer = useMovieStore((state) => state.syncWithServer);
  const importMovies = useMovieStore((state) => state.importMovies);

  const downloads = useDownloadStore((state) => state.downloads);
  const importDownloads = useDownloadStore((state) => state.importDownloads);

  const importGenres = useGenreStore((state) => state.importGenres);
  const importCategories = useCategoryStore((state) => state.importCategories);
  const { getTodayViews } = useViewStore();
  const [searchQuery, setSearchQuery] = useState('');

  // State for episode management
  const [selectedSeasonForEpisode, setSelectedSeasonForEpisode] = useState<number | 'all'>(1);

  interface User {
    id: string;
    name: string;
    email: string;
    role: 'SuperAdmin' | 'Admin' | 'Editor' | 'Uploader';
    status: 'Active' | 'Inactive';
  }

  // User Management states
  const users = useUserStore((state) => state.users);
  const addUser = useUserStore((state) => state.addUser);
  const updateUser = useUserStore((state) => state.updateUser);
  const deleteUser = useUserStore((state) => state.deleteUser);
  const getTotalUsers = useUserStore((state) => state.getTotalUsers);
  const getActiveUsersToday = useUserStore((state) => state.getActiveUsersToday);
  const getRecentUsers = useUserStore((state) => state.getRecentUsers);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // User Modal states
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);

  // Settings states

  const [showApiKey, setShowApiKey] = useState(false);

  // Settings Store hooks
  const {
    settings,
    updateSettings,
    updateAdminCredentials,
    codeInjection,
    updateCodeInjection,
    menuItems: navItems,
    updateMenuItems,
    addMenuItem,
    removeMenuItem,
    toggleMenuItem,
    footerSettings,
    updateFooterSettings,
    adSettings,
    updateAdSettings,
    exportSettings,
    importSettings
  } = useSettingsStore();

  const [jsonImport, setJsonImport] = useState('');

  const [activeSettingsTab, setActiveSettingsTab] = useState('general');

  // Real-time backup functionality
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false);
  const [backupInterval, setBackupInterval] = useState<number>(30); // in minutes
  const [lastBackupTime, setLastBackupTime] = useState<Date | null>(null);

  // Auto-backup interval reference
  const autoBackupIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to create auto backup
  const createAutoBackup = () => {
    if (autoBackupEnabled) {
      handleBackup();
      setLastBackupTime(new Date());
      toast({
        title: "Auto Backup Created",
        description: `Automatic backup completed at ${new Date().toLocaleTimeString()}`,
      });
    }
  };

  // Setup auto backup when enabled
  useEffect(() => {
    if (autoBackupEnabled) {
      // Clear any existing interval
      if (autoBackupIntervalRef.current) {
        clearInterval(autoBackupIntervalRef.current);
      }

      // Set up new interval based on backupInterval state
      autoBackupIntervalRef.current = setInterval(() => {
        createAutoBackup();
      }, backupInterval * 60 * 1000); // Convert minutes to milliseconds

      // Create initial backup
      createAutoBackup();
    } else {
      // Clear interval when disabled
      if (autoBackupIntervalRef.current) {
        clearInterval(autoBackupIntervalRef.current);
        autoBackupIntervalRef.current = null;
      }
    }

    // Cleanup on unmount or when autoBackupEnabled changes
    return () => {
      if (autoBackupIntervalRef.current) {
        clearInterval(autoBackupIntervalRef.current);
      }
    };
  }, [autoBackupEnabled, backupInterval]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminUser = settings?.adminCredentials?.username || 'admin';
    const adminPass = settings?.adminCredentials?.password || 'admin';

    if (loginData.username === adminUser && loginData.password === adminPass) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  // Check user permissions based on role
  const hasPermission = (action: 'movies' | 'series' | 'genres' | 'categories' | 'users' | 'downloads' | 'settings'): boolean => {
    const currentRole = settings?.adminCredentials?.role || 'SuperAdmin';

    switch (action) {
      case 'movies':
      case 'series':
        return ['SuperAdmin', 'Admin', 'Editor', 'Uploader'].includes(currentRole);
      case 'genres':
      case 'categories':
        return ['SuperAdmin', 'Admin', 'Editor'].includes(currentRole);
      case 'users':
      case 'settings':
        return ['SuperAdmin', 'Admin'].includes(currentRole);
      case 'downloads':
        return ['SuperAdmin', 'Admin', 'Editor', 'Uploader'].includes(currentRole);
      default:
        return ['SuperAdmin', 'Admin'].includes(currentRole);
    }
  };



  // Existing states...
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User' as 'SuperAdmin' | 'Admin' | 'Editor' | 'Uploader',
    status: 'Active' as 'Active' | 'Inactive'
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Genre Modal states
  const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<any>(null);
  const [genreFormData, setGenreFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6'
  });

  // Category Modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6'
  });
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const addCategory = useCategoryStore((state) => state.addCategory);
  const updateCategory = useCategoryStore((state) => state.updateCategory);
  const deleteCategory = useCategoryStore((state) => state.deleteCategory);

  const [selectedBackupFile, setSelectedBackupFile] = useState<File | null>(null);

  // Form state
  type FormData = {
    title: string;
    year: number;
    rating: number;
    duration: string;
    genres: string;
    description: string;
    quality: string;
    type: 'movie' | 'series';
    seasons: number;
    episodes: number;
    servers: string;
    poster: string;
    backdrop: string;
    categories: string[];
    // SEO Fields
    slug: string;
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogImage: string;
    // Media Fields
    trailerUrl: string;
    embedCode: string;
    // Episodes Fields
    episodeList: any[];
    downloadUrl: string;
  };

  const [formData, setFormData] = useState<FormData>({
    title: '',
    year: new Date().getFullYear(),
    rating: 7.5,
    duration: '2h 00m',
    genres: '',
    description: '',
    quality: 'HD',
    type: 'movie' as 'movie' | 'series',
    seasons: 1,
    episodes: 8,
    servers: 'Vidcloud, Filemoon',
    poster: '',
    backdrop: '',
    categories: [],
    // SEO Fields
    slug: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    ogImage: '',
    // Media Fields
    trailerUrl: '',
    embedCode: '',
    // Episodes Fields
    episodeList: [],
    downloadUrl: ''
  });

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'series', label: 'TV Series', icon: Tv },
    { id: 'genres', label: 'Genres', icon: Layers },
    { id: 'categories', label: 'Categories', icon: FolderOpen },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'system', label: 'System', icon: Globe },
  ];

  const movieCount = moviesList.filter(m => m.type === 'movie').length;
  const seriesCount = moviesList.filter(m => m.type === 'series').length;
  const userCount = getTotalUsers();
  const activeUsersToday = getActiveUsersToday();
  const viewsToday = getTodayViews();

  const stats = [
    { label: 'Total Movies', value: movieCount.toString(), icon: Film, color: 'from-red-500 to-orange-500' },
    { label: 'TV Series', value: seriesCount.toString(), icon: Tv, color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Users', value: userCount.toString(), icon: Users, color: 'from-green-500 to-emerald-500' },
    { label: 'Active Today', value: activeUsersToday.toString(), icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
  ];

  const filteredMovies = moviesList.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const resetUserForm = () => {
    setUserFormData({
      name: '',
      email: '',
      password: '',
      role: 'Uploader',
      status: 'Active'
    });
    setSelectedUser(null);
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your configuration has been updated successfully.",
    });
  };

  const handleBackup = () => {
    try {
      // Collect specific data from stores
      const settingsState = useSettingsStore.getState();
      const movieState = useMovieStore.getState();
      const genreState = useGenreStore.getState();
      const categoryState = useCategoryStore.getState();
      const downloadState = useDownloadStore.getState();

      const backupData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        settings: settingsState.settings,
        codeInjection: settingsState.codeInjection,
        menuItems: settingsState.menuItems,
        movies: movieState.movies,
        genres: genreState.genres,
        categories: categoryState.categories,
        downloads: downloadState.downloads
      };

      const data = JSON.stringify(backupData, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `streamsphere-full-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Full Site Backup Downloaded",
        description: `Exported ${backupData.movies.length} movies, ${backupData.genres.length} genres, and all settings.`,
      });
    } catch (error) {
      console.error('Backup failed:', error);
      toast({
        title: "Backup Failed",
        description: "An error occurred while creating the backup.",
        variant: "destructive"
      });
    }
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          try {
            const parsed = JSON.parse(event.target.result as string);

            // Validate basic structure
            if (!parsed.settings && !parsed.movies) {
              throw new Error("Invalid backup file format");
            }

            // Restore Settings
            if (parsed.settings) updateSettings(parsed.settings);
            if (parsed.codeInjection) updateCodeInjection(parsed.codeInjection);
            if (parsed.menuItems) updateMenuItems(parsed.menuItems);

            // Restore Content
            if (parsed.movies && Array.isArray(parsed.movies)) {
              importMovies(parsed.movies);
            }

            if (parsed.genres && Array.isArray(parsed.genres)) {
              importGenres(parsed.genres);
            }

            if (parsed.categories && Array.isArray(parsed.categories)) {
              importCategories(parsed.categories);
            }

            if (parsed.downloads && Array.isArray(parsed.downloads)) {
              importDownloads(parsed.downloads);
            }

            toast({
              title: "Restore Successful",
              description: "Full site data has been restored from backup.",
              variant: "default"
            });
            setSelectedBackupFile(null);
          } catch (error) {
            console.error('Restore failed:', error);
            toast({
              title: "Restore Failed",
              description: "Invalid or corrupted backup file.",
              variant: "destructive"
            });
          }
        }
      };
      reader.readAsText(file);
    }
  };

  // Drag and Drop for Menu (simplified as button moves for now to avoid complex dnd libs)
  const moveMenuItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...navItems];
    if (direction === 'up' && index > 0) {
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
    } else if (direction === 'down' && index < newItems.length - 1) {
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    }
    updateMenuItems(newItems);
  };


  const resetForm = () => {
    setFormData({
      title: '',
      year: new Date().getFullYear(),
      rating: 7.5,
      duration: '2h 00m',
      genres: '',
      description: '',
      quality: 'HD',
      type: 'movie',
      seasons: 1,
      episodes: 8,
      servers: 'Vidcloud, Filemoon',
      poster: '',
      backdrop: '',
      categories: [],
      // SEO Fields
      slug: '',
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      ogImage: '',
      // Media Fields
      trailerUrl: '',
      embedCode: '',
      // Episodes Fields
      episodeList: [],
      downloadUrl: ''
    });
    // Reset season selection
    setSelectedSeasonForEpisode(1);
  };

  const handleAddMovie = () => {
    const newMovie: Movie = {
      id: Date.now().toString(),
      title: formData.title,
      year: formData.year,
      rating: formData.rating,
      duration: formData.duration,
      genres: formData.genres.split(',').map(g => g.trim()),
      description: formData.description,
      poster: formData.poster || initialMovies[0]?.poster || '',
      backdrop: formData.backdrop || undefined,
      quality: formData.quality,
      type: formData.type,
      seasons: formData.type === 'series' ? formData.seasons : undefined,
      episodes: formData.type === 'series' ? formData.episodes : undefined,
      servers: formData.servers.split(',').map(s => s.trim()),
      // SEO Fields
      slug: formData.slug || generateSlug(formData.title),
      metaTitle: formData.metaTitle || `${formData.title} (${formData.year}) - Stream Online`,
      metaDescription: formData.metaDescription || formData.description.substring(0, 160),
      keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
      ogImage: formData.ogImage || formData.poster || initialMovies[0]?.poster || '',
      // Media Fields
      trailerUrl: formData.trailerUrl,
      embedCode: formData.embedCode,
      // Category Fields
      categories: formData.categories,
      // Episodes Fields
      episodeList: formData.episodeList,
      downloadUrl: formData.downloadUrl
    };

    addMovie(newMovie);
    setIsAddModalOpen(false);
    resetForm();
    toast({
      title: "Success!",
      description: `${formData.title} has been added successfully.`,
    });
  };

  const handleEditMovie = () => {
    if (!selectedMovie) return;

    const updatedMovie: Partial<Movie> = {
      title: formData.title,
      year: formData.year,
      rating: formData.rating,
      duration: formData.duration,
      genres: formData.genres.split(',').map(g => g.trim()),
      description: formData.description,
      poster: formData.poster || selectedMovie.poster,
      backdrop: formData.backdrop || selectedMovie.backdrop,
      quality: formData.quality,
      type: formData.type,
      seasons: formData.type === 'series' ? formData.seasons : undefined,
      episodes: formData.type === 'series' ? formData.episodes : undefined,
      servers: formData.servers.split(',').map(s => s.trim()),
      // SEO Fields
      slug: formData.slug || generateSlug(formData.title),
      metaTitle: formData.metaTitle || `${formData.title} (${formData.year}) - Stream Online`,
      metaDescription: formData.metaDescription || formData.description.substring(0, 160),
      keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
      ogImage: formData.ogImage || formData.poster || selectedMovie.poster,
      // Media Fields
      trailerUrl: formData.trailerUrl,
      embedCode: formData.embedCode,
      // Category Fields
      categories: formData.categories,
      // Episodes Fields
      episodeList: formData.episodeList,
      downloadUrl: formData.downloadUrl
    };

    updateMovie(selectedMovie.id, updatedMovie);
    setIsEditModalOpen(false);
    setSelectedMovie(null);
    resetForm();
    toast({
      title: "Updated!",
      description: `${formData.title} has been updated successfully.`,
    });
  };

  const handleDeleteMovie = () => {
    if (!selectedMovie) return;

    deleteMovie(selectedMovie.id);
    setIsDeleteDialogOpen(false);
    toast({
      title: "Deleted!",
      description: `${selectedMovie.title} has been deleted.`,
      variant: "destructive"
    });
    setSelectedMovie(null);
  };

  const openEditModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setFormData({
      title: movie.title,
      year: movie.year,
      rating: movie.rating,
      duration: movie.duration,
      genres: movie.genres.join(', '),
      description: movie.description,
      quality: movie.quality,
      type: movie.type,
      seasons: movie.seasons || 1,
      episodes: movie.episodes || 8,
      servers: movie.servers?.join(', ') || '',
      poster: movie.poster || '',
      backdrop: movie.backdrop || '',
      categories: movie.categories || [],
      // Episodes Fields
      episodeList: movie.episodeList || [],
      // SEO Fields
      slug: movie.slug || '',
      metaTitle: movie.metaTitle || '',
      metaDescription: movie.metaDescription || '',
      keywords: movie.keywords?.join(', ') || '',
      ogImage: movie.ogImage || '',
      // Media Fields
      trailerUrl: movie.trailerUrl || '',
      embedCode: movie.embedCode || '',
      downloadUrl: movie.downloadUrl || ''
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsViewModalOpen(true);
  };

  const openDeleteDialog = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsDeleteDialogOpen(true);
  };

  // Admin Sidebar Items
  const adminSidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'series', label: 'Series', icon: Tv },
    hasPermission('genres') && { id: 'genres', label: 'Genres', icon: Layers },
    hasPermission('categories') && { id: 'categories', label: 'Categories', icon: FolderOpen },
    hasPermission('users') && { id: 'users', label: 'Users', icon: Users },
    hasPermission('downloads') && { id: 'downloads', label: 'Downloads', icon: Download },
    hasPermission('settings') && { id: 'settings', label: 'Settings', icon: Settings },
  ].filter(Boolean); // Filter out any false values

  // Safety Check for critical stores
  if (!settings || !moviesList) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading Resources...</h2>
          <p className="text-muted-foreground">Please wait while we initialize the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Login Form - Only show when not authenticated */}
      {!isAuthenticated && (
        <div className="flex items-center justify-center w-full min-h-screen bg-background p-4">
          <div className="w-full max-w-md">
            <div className="bg-card rounded-xl border border-border p-8 space-y-6 shadow-lg">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-stream-accent-glow flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="font-display text-2xl tracking-wider">Admin Access</h2>
                <p className="text-muted-foreground mt-2">Enter your credentials to access the admin panel</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Username</label>
                  <Input
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    placeholder="Enter username"
                    className="h-11"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Password</label>
                  <Input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="Enter password"
                    className="h-11"
                  />
                </div>

                {loginError && (
                  <div className="text-destructive text-sm">{loginError}</div>
                )}

                <Button type="submit" className="w-full h-11 gap-2">
                  <Lock className="w-4 h-4" />
                  Sign In
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground mt-4">
                Default credentials: admin / admin
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Interface - Only show when authenticated */}
      {isAuthenticated && (
        <>
          {/* Sidebar */}
          <aside className={cn(
            'fixed left-0 top-0 h-full bg-card border-r border-border transition-all duration-300 z-50',
            sidebarOpen ? 'w-48' : 'w-16'
          )}>
            {/* Logo */}
            <div className="h-14 flex items-center justify-center border-b border-border pt-1">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-stream-accent-glow flex items-center justify-center">
                  <Film className="w-6 h-6 text-primary-foreground" />
                </div>
                {sidebarOpen && (
                  <span className="font-display text-lg tracking-wide">ADMIN</span>
                )}
              </Link>
            </div>

            {/* Menu */}
            <nav className="p-3 space-y-2">
              {adminSidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    activeTab === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              ))}
            </nav>

            {/* Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border">
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <Home className="w-5 h-5" />
                {sidebarOpen && <span>Back to Site</span>}
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className={cn(
            'flex-1 transition-all duration-300',
            sidebarOpen ? 'ml-48' : 'ml-16'
          )}>
            {/* Header */}
            <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <h1 className="font-display text-xl tracking-normal capitalize">{activeTab}</h1>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon">
                  <Bell className="w-5 h-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                      <div className="h-full w-full rounded-full bg-primary flex items-center justify-center">
                        <span className="font-medium text-primary-foreground uppercase text-lg">
                          {(settings?.adminCredentials?.username?.[0]) || 'A'}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none capitalize">{settings?.adminCredentials?.username || 'Admin'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          Administrator
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setActiveTab('settings')} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500 focus:text-red-500 cursor-pointer" onClick={handleLogout}>
                      <Lock className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.filter(stat =>
                      stat.label === 'Total Movies' ||
                      stat.label === 'TV Series' ||
                      (hasPermission('users') && (stat.label === 'Total Users' || stat.label === 'Active Today'))
                    ).map((stat) => (
                      <div key={stat.label} className="bg-card rounded-xl p-6 border border-border">
                        <div className="flex items-center justify-between mb-4">
                          <div className={cn(
                            'w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center',
                            stat.color
                          )}>
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                          <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <h3 className="font-display text-3xl">{stat.value}</h3>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent Content */}
                  <div className="bg-card rounded-xl border border-border">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                      <h2 className="font-display text-xl tracking-wider">Recent Content</h2>
                      <Button className="gap-2" onClick={() => { resetForm(); setIsAddModalOpen(true); }}>
                        <Plus className="w-4 h-4" />
                        Add New
                      </Button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left p-4 font-medium text-muted-foreground">Title</th>
                            <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                            <th className="text-left p-4 font-medium text-muted-foreground">Rating</th>
                            <th className="text-left p-4 font-medium text-muted-foreground">Year</th>
                            <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {moviesList.slice(0, 5).map((movie) => (
                            <tr key={movie.id} className="border-b border-border hover:bg-secondary/50">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
                                    <img
                                      src={movie.poster}
                                      alt={movie.title}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement.innerHTML = '<div class="w-full h-full bg-muted flex items-center justify-center"><span class="text-xs text-muted-foreground">No Image</span></div>';
                                      }}
                                    />
                                  </div>
                                  <span className="font-medium">{movie.title}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className={cn(
                                  'px-2 py-1 rounded text-xs font-medium capitalize',
                                  movie.type === 'movie' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-400'
                                )}>
                                  {movie.type}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-stream-gold fill-stream-gold" />
                                  {movie.rating}
                                </div>
                              </td>
                              <td className="p-4 text-muted-foreground">{movie.year}</td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => openViewModal(movie)}>
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => openEditModal(movie)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => openDeleteDialog(movie)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {(activeTab === 'movies' || activeTab === 'series') && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder={`Search ${activeTab}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-full md:w-80"
                      />
                    </div>
                    {hasPermission('movies') && (
                      <Button className="gap-2" onClick={() => {
                        resetForm();
                        setFormData(prev => ({ ...prev, type: activeTab === 'series' ? 'series' : 'movie' }));
                        setIsAddModalOpen(true);
                      }}>
                        <Plus className="w-4 h-4" />
                        Add {activeTab === 'series' ? 'Series' : 'Movie'}
                      </Button>
                    )}
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredMovies
                      .filter(m => activeTab === 'series' ? m.type === 'series' : m.type === 'movie')
                      .map((movie) => (
                        <div key={movie.id} className="bg-card rounded-lg overflow-hidden border border-border group">
                          <div className="relative aspect-[2/3]">
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement.innerHTML = '<div class="w-full h-full bg-muted flex items-center justify-center"><span class="text-xs text-muted-foreground">No Image</span></div>';
                              }}
                            />
                            <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button size="sm" variant="outline" onClick={() => openViewModal(movie)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => openEditModal(movie)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => openDeleteDialog(movie)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium text-sm truncate">{movie.title}</h3>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs text-muted-foreground">{movie.year}</p>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-stream-gold fill-stream-gold" />
                                <span className="text-xs">{movie.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {filteredMovies.filter(m => activeTab === 'series' ? m.type === 'series' : m.type === 'movie').length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No {activeTab} found.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'genres' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">Manage your content genres</p>
                    {hasPermission('genres') && (
                      <Button
                        className="gap-2"
                        onClick={() => {
                          setSelectedGenre(null);
                          setGenreFormData({ name: '', description: '', color: '#3b82f6' });
                          setIsGenreModalOpen(true);
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        Add Genre
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {genres.map((genre) => (
                      <div key={genre.id} className="bg-card rounded-lg p-4 border border-border flex items-center justify-between group hover:border-primary transition-colors">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: genre.color }}
                          />
                          <span className="font-medium">{genre.name}</span>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="ghost" onClick={() => {
                            setSelectedGenre(genre);
                            setGenreFormData({
                              name: genre.name,
                              description: genre.description || '',
                              color: genre.color || '#3b82f6'
                            });
                            setIsGenreModalOpen(true);
                          }}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${genre.name}"?`)) {
                                deleteGenre(genre.id);
                                toast({
                                  title: "Genre Deleted",
                                  description: `${genre.name} has been removed.`,
                                  variant: "destructive"
                                });
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        className="pl-10 w-full md:w-80"
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                      />
                    </div>
                    {hasPermission('users') && (
                      <Button className="gap-2" onClick={() => {
                        resetUserForm();
                        setIsAddUserModalOpen(true);
                      }}>
                        <Plus className="w-4 h-4" />
                        Add User
                      </Button>
                    )}
                  </div>
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-secondary/50">
                          <th className="text-left p-4 font-medium text-muted-foreground">User</th>
                          <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                          <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
                          <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                          <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-border hover:bg-secondary/30">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                  <span className="font-medium text-primary">{user.name[0]}</span>
                                </div>
                                <span className="font-medium">{user.name}</span>
                              </div>
                            </td>
                            <td className="p-4 text-muted-foreground">{user.email}</td>
                            <td className="p-4">
                              <span className={cn(
                                'px-2 py-1 rounded text-xs font-medium',
                                user.role === 'SuperAdmin' ? 'bg-red-500/20 text-red-400' :
                                  user.role === 'Admin' ? 'bg-primary/20 text-primary' :
                                    user.role === 'Editor' ? 'bg-blue-500/20 text-blue-400' :
                                      user.role === 'Uploader' ? 'bg-purple-500/20 text-purple-400' :
                                        'bg-secondary text-secondary-foreground'
                              )}>
                                {user.role}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={cn(
                                'px-2 py-1 rounded text-xs font-medium',
                                user.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-destructive/20 text-destructive'
                              )}>
                                {user.status}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setUserFormData({
                                      name: user.name,
                                      email: user.email,
                                      password: '', // Don't expose existing password for security
                                      role: user.role as 'SuperAdmin' | 'Admin' | 'Editor' | 'Uploader',
                                      status: user.status as 'Active' | 'Inactive'
                                    });
                                    setIsEditUserModalOpen(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setIsDeleteUserDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">Site Settings</h2>
                      <p className="text-muted-foreground">Manage your website configuration, navigation, and SEO.</p>
                    </div>
                    {hasPermission('settings') && (
                      <Button onClick={handleSaveSettings} className="gap-2">
                        <Save className="w-4 h-4" />
                        Save Changes
                      </Button>
                    )}
                  </div>

                  <Tabs defaultValue="general" value={activeSettingsTab} onValueChange={setActiveSettingsTab}>
                    <TabsList className="grid w-full grid-cols-4 lg:w-[38rem]">
                      <TabsTrigger value="general">General</TabsTrigger>
                      <TabsTrigger value="menu">Menu</TabsTrigger>
                      <TabsTrigger value="injection">Code Injection</TabsTrigger>
                      <TabsTrigger value="monetization">Monetization</TabsTrigger>
                    </TabsList>

                    {/* General Settings */}
                    <TabsContent value="general" className="space-y-4 mt-6">
                      <div className="bg-card p-6 rounded-xl border border-border space-y-6">
                        <div className="space-y-4">
                          <div className="grid gap-2">
                            <Label>Site Name</Label>
                            <Input
                              value={settings?.siteName || ''}
                              onChange={(e) => updateSettings({ siteName: e.target.value })}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Site Description</Label>
                            <Textarea
                              rows={3}
                              value={settings?.siteDescription || ''}
                              onChange={(e) => updateSettings({ siteDescription: e.target.value })}
                            />
                          </div>
                          <Separator />
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <Label>Logo URL</Label>
                              <div className="flex gap-4 items-start">
                                <div className="w-20 h-20 rounded bg-secondary flex items-center justify-center overflow-hidden border border-border">
                                  {settings?.logoUrl ? (
                                    <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                  ) : (
                                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                  )}
                                </div>
                                <div className="flex-1 space-y-2">
                                  <Input
                                    placeholder="https://..."
                                    value={settings.logoUrl}
                                    onChange={(e) => updateSettings({ logoUrl: e.target.value })}
                                  />
                                </div>
                              </div>
                            </div>


                            <div className="space-y-4">
                              <Label>Layout Design</Label>
                              <select
                                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                                value={settings?.layoutMode || 'classic'}
                                onChange={(e) => updateSettings({ layoutMode: e.target.value as 'sidebar' | 'classic' })}
                              >
                                <option value="classic">Classic Top Navbar</option>
                                <option value="sidebar">Modern Sidebar (MovieBox Style)</option>
                              </select>
                              <p className="text-xs text-muted-foreground">"Modern Sidebar" enables the left-side navigation layout.</p>
                            </div>

                            <div className="space-y-4">
                              <Label>Download App URL</Label>
                              <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                                  <Download className="w-5 h-5" />
                                </div>
                                <div className="flex-1 space-y-2">
                                  <Input
                                    placeholder="https://..."
                                    value={settings?.downloadAppUrl || ''}
                                    onChange={(e) => updateSettings({ downloadAppUrl: e.target.value })}
                                  />
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">Link for the "Download App" button in the header/sidebar.</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Logo Size ({settings?.logoSize || 40}px)</Label>
                            <input
                              type="range"
                              min="20"
                              max="100"
                              value={settings?.logoSize || 40}
                              onChange={(e) => updateSettings({ logoSize: parseInt(e.target.value) })}
                              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                          </div>

                          <div className="space-y-4">
                            <Label>Default Language</Label>
                            <select
                              className="w-full h-10 px-3 rounded-md border border-input bg-background"
                              value={settings?.language || 'en'}
                              onChange={(e) => updateSettings({ language: e.target.value as any })}
                            >
                              <option value="en">English</option>
                              <option value="ar">العربية</option>
                              <option value="fr">Français</option>
                              <option value="id">Bahasa Indonesia</option>
                              <option value="hi">Hindi</option>
                              <option value="ur">Urdu</option>
                              <option value="fil">Filipino</option>
                            </select>
                          </div>

                          <div className="space-y-4">
                            <Label>Font Style</Label>
                            <select
                              className="w-full h-10 px-3 rounded-md border border-input bg-background" // Should be Inter, Roboto, etc.
                              value={settings?.fontStyle || 'Inter'}
                              onChange={(e) => updateSettings({ fontStyle: e.target.value })}
                            >
                              <option value="Inter">Inter (Default)</option>
                              <option value="Roboto">Roboto</option>
                              <option value="Poppins">Poppins</option>
                              <option value="Outfit">Outfit</option>
                              <option value="Open Sans">Open Sans</option>
                              <option value="Lato">Lato</option>
                              <option value="Montserrat">Montserrat</option>
                            </select>
                          </div>
                          <div className="space-y-4">
                            <Label>Font Weight</Label>
                            <select
                              className="w-full h-10 px-3 rounded-md border border-input bg-background"
                              value={settings?.fontWeight || '400'}
                              onChange={(e) => updateSettings({ fontWeight: e.target.value })}
                            >
                              <option value="300">Light (300)</option>
                              <option value="400">Regular (400)</option>
                              <option value="500">Medium (500)</option>
                              <option value="600">Semi Bold (600)</option>
                              <option value="700">Bold (700)</option>
                            </select>
                          </div>
                        </div>

                        {/* Admin Credentials Section */}
                        <div className="pt-6 border-t border-border">
                          <h3 className="text-lg font-semibold mb-4 text-foreground/80">Admin Credentials</h3>
                          <div className="grid gap-4 p-4 bg-secondary/10 rounded-xl border border-border/50">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Admin Username</Label>
                                <Input
                                  value={settings?.adminCredentials?.username || ''}
                                  onChange={(e) => {
                                    updateAdminCredentials({ username: e.target.value });
                                  }}
                                  placeholder="Enter admin username"
                                  className="bg-background"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Admin Password</Label>
                                <Input
                                  type="password"
                                  value={settings?.adminCredentials?.password || ''}
                                  onChange={(e) => {
                                    updateAdminCredentials({ password: e.target.value });
                                  }}
                                  placeholder="Enter admin password"
                                  className="bg-background"
                                />
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <p>These credentials are used to access the admin panel.</p>
                              <p className="mt-1">Current username: <span className="font-medium">{settings?.adminCredentials?.username || 'admin'}</span></p>
                            </div>
                          </div>
                        </div>

                        {/* Generate Editor/Uploader Credentials */}
                        <div className="pt-4 border-t border-border/50">
                          <h4 className="text-md font-medium mb-3 text-foreground/80">Generate Editor/Uploader Credentials</h4>
                          <div className="grid gap-3">
                            <Button
                              variant="outline"
                              className="gap-2 w-full"
                              onClick={() => {
                                const randomUser = 'editor_' + Math.random().toString(36).substring(2, 10);
                                const randomPass = Math.random().toString(36).substring(2, 12);

                                // Create a new user with editor role
                                const newUser = {
                                  id: `user_${Date.now()}`,
                                  name: `Editor ${randomUser.substring(7)}`,
                                  email: `${randomUser}@example.com`,
                                  role: 'Editor' as const,
                                  status: 'Active' as const,
                                  lastSeen: new Date(),
                                  joinedDate: new Date(),
                                  viewsToday: 0,
                                  totalViews: 0,
                                };

                                addUser(newUser);

                                toast({
                                  title: "Editor Account Created",
                                  description: `Username: ${randomUser}\nPassword: ${randomPass}\n\nThis user can upload movies and series.`,
                                  duration: 10000
                                });
                              }}
                            >
                              <User className="w-4 h-4" />
                              Generate Editor Credentials
                            </Button>
                            <Button
                              variant="outline"
                              className="gap-2 w-full"
                              onClick={() => {
                                const randomUser = 'uploader_' + Math.random().toString(36).substring(2, 10);
                                const randomPass = Math.random().toString(36).substring(2, 12);

                                // Create a new user with uploader role
                                const newUser = {
                                  id: `user_${Date.now()}`,
                                  name: `Uploader ${randomUser.substring(8)}`,
                                  email: `${randomUser}@example.com`,
                                  role: 'Uploader' as const,
                                  status: 'Active' as const,
                                  lastSeen: new Date(),
                                  joinedDate: new Date(),
                                  viewsToday: 0,
                                  totalViews: 0,
                                };

                                addUser(newUser);

                                toast({
                                  title: "Uploader Account Created",
                                  description: `Username: ${randomUser}\nPassword: ${randomPass}\n\nThis user can upload movies and series.`,
                                  duration: 10000
                                });
                              }}
                            >
                              <Upload className="w-4 h-4" />
                              Generate Uploader Credentials
                            </Button>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-border">
                          <h3 className="text-lg font-semibold mb-4 text-foreground/80">Footer Settings</h3>
                          <div className="grid gap-6 p-4 bg-secondary/10 rounded-xl border border-border/50">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Footer Logo URL</Label>
                                <Input
                                  value={footerSettings?.footerLogoUrl || ''}
                                  onChange={(e) => updateFooterSettings({ footerLogoUrl: e.target.value })}
                                  placeholder="Leave empty to use main Site Logo"
                                  className="bg-background"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Copyright Text</Label>
                                <Input
                                  value={footerSettings?.copyrightText || ''}
                                  onChange={(e) => updateFooterSettings({ copyrightText: e.target.value })}
                                  className="bg-background"
                                />
                              </div>
                            </div>

                            <div className="space-y-3">
                              <Label>Social Media Links</Label>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                  <span className="w-24 text-sm text-muted-foreground flex items-center gap-2"><Facebook className="w-3 h-3" /> Facebook</span>
                                  <Input
                                    value={footerSettings?.socialLinks?.facebook || ''}
                                    onChange={(e) => updateFooterSettings((prev) => ({
                                      socialLinks: { ...prev.socialLinks, facebook: e.target.value }
                                    }))}
                                    placeholder="https://facebook.com/..."
                                    className="bg-background h-9"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="w-24 text-sm text-muted-foreground flex items-center gap-2"><Twitter className="w-3 h-3" /> Twitter</span>
                                  <Input
                                    value={footerSettings?.socialLinks?.twitter || ''}
                                    onChange={(e) => updateFooterSettings((prev) => ({
                                      socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                                    }))}
                                    placeholder="https://twitter.com/..."
                                    className="bg-background h-9"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="w-24 text-sm text-muted-foreground flex items-center gap-2"><Instagram className="w-3 h-3" /> Instagram</span>
                                  <Input
                                    value={footerSettings?.socialLinks?.instagram || ''}
                                    onChange={(e) => updateFooterSettings((prev) => ({
                                      socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                                    }))}
                                    placeholder="https://instagram.com/..."
                                    className="bg-background h-9"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="w-24 text-sm text-muted-foreground flex items-center gap-2"><Users className="w-3 h-3" /> Telegram</span>
                                  <Input
                                    value={footerSettings?.socialLinks?.telegram || ''}
                                    onChange={(e) => updateFooterSettings((prev) => ({
                                      socialLinks: { ...prev.socialLinks, telegram: e.target.value }
                                    }))}
                                    placeholder="https://t.me/..."
                                    className="bg-background h-9"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Menu Manager */}
                    <TabsContent value="menu" className="space-y-4 mt-6">
                      <div className="bg-card p-6 rounded-xl border border-border">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium">Navbar Items</h3>
                          <Button size="sm" variant="outline" onClick={() => addMenuItem({
                            id: Date.now().toString(),
                            label: 'New Link',
                            path: '/',
                            type: 'link',
                            visible: true
                          })}>
                            <Plus className="w-4 h-4 mr-2" /> Add Item
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {(navItems || []).map((item, index) => (
                            <div key={item.id} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg group border border-transparent hover:border-border transition-all">
                              <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input
                                  value={item.label}
                                  onChange={(e) => {
                                    const newItems = [...navItems];
                                    newItems[index].label = e.target.value;
                                    updateMenuItems(newItems);
                                  }}
                                  placeholder="Label"
                                  className="h-9"
                                />

                                <select
                                  className="h-9 px-3 rounded-md border border-input bg-background text-sm"
                                  value={item.type || 'link'}
                                  onChange={(e) => {
                                    const newItems = [...navItems];
                                    newItems[index].type = e.target.value as any;
                                    updateMenuItems(newItems);
                                  }}
                                >
                                  <option value="link">Link</option>
                                  <option value="dropdown">Dropdown (Manual)</option>
                                  <option value="dynamic-genres">Dynamic Genres</option>
                                  <option value="dynamic-categories">Dynamic Categories</option>
                                </select>

                                {(!item.type || item.type === 'link' || item.type === 'dropdown') ? (
                                  <Input
                                    value={item.path}
                                    onChange={(e) => {
                                      const newItems = [...navItems];
                                      newItems[index].path = e.target.value;
                                      updateMenuItems(newItems);
                                    }}
                                    placeholder="Path"
                                    className="h-9 font-mono text-xs"
                                  />
                                ) : (
                                  <div className="h-9 flex items-center px-3 text-xs text-muted-foreground bg-muted/50 rounded-md border border-transparent">
                                    Auto-generated
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <Switch
                                  checked={item.visible}
                                  onCheckedChange={() => toggleMenuItem(item.id)}
                                />
                                <div className="flex flex-col gap-0.5 ml-2">
                                  <Button
                                    variant="ghost" size="icon" className="h-5 w-5"
                                    disabled={index === 0}
                                    onClick={() => moveMenuItem(index, 'up')}
                                  >
                                    <TrendingUp className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost" size="icon" className="h-5 w-5"
                                    disabled={index === navItems.length - 1}
                                    onClick={() => moveMenuItem(index, 'down')}
                                  >
                                    <TrendingUp className="w-3 h-3 rotate-180" />
                                  </Button>
                                </div>
                                <Button
                                  variant="ghost" size="icon"
                                  className="h-8 w-8 text-destructive hover:bg-destructive/20"
                                  onClick={() => removeMenuItem(item.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Code Injection */}
                    <TabsContent value="injection" className="space-y-4 mt-6">
                      <div className="bg-card p-6 rounded-xl border border-border space-y-6">
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-4">
                          <p className="text-sm text-yellow-500 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Code added here will be injected globally. Use with caution.
                          </p>
                        </div>
                        <div className="space-y-3">
                          <Label className="flex items-center gap-2">
                            HEAD Code <span className="text-xs text-muted-foreground font-normal">(Analytics, Meta tags)</span>
                          </Label>
                          <Textarea
                            className="font-mono text-xs bg-secondary/50 min-h-[150px]"
                            placeholder="<script>...</script>"
                            value={codeInjection?.headCode || ''}
                            onChange={(e) => updateCodeInjection({ headCode: e.target.value })}
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="flex items-center gap-2">
                            BODY Start <span className="text-xs text-muted-foreground font-normal">(After &lt;body&gt; tag)</span>
                          </Label>
                          <Textarea
                            className="font-mono text-xs bg-secondary/50 min-h-[100px]"
                            placeholder="<!-- Custom HTML -->"
                            value={codeInjection?.bodyCode || ''}
                            onChange={(e) => updateCodeInjection({ bodyCode: e.target.value })}
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="flex items-center gap-2">
                            Footer Code <span className="text-xs text-muted-foreground font-normal">(Before &lt;/body&gt;)</span>
                          </Label>
                          <Textarea
                            className="font-mono text-xs bg-secondary/50 min-h-[100px]"
                            placeholder="<script>...</script>"
                            value={codeInjection?.footerCode || ''}
                            onChange={(e) => updateCodeInjection({ footerCode: e.target.value })}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    {/* Monetization */}
                    <TabsContent value="monetization" className="space-y-4 mt-6">
                      <div className="bg-card p-6 rounded-xl border border-border space-y-8">
                        {/* Ads Section */}
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                              <LayoutTemplate className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">Advertisement Placements</h3>
                              <p className="text-sm text-muted-foreground">Configure banner ads and scripts (e.g., Adsterra) for monetization.</p>
                            </div>
                          </div>

                          <div className="grid gap-6 p-4 border border-border/50 rounded-xl bg-secondary/5">
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                Home Page Ad <span className="text-xs text-muted-foreground font-normal">(Below Hero Section)</span>
                              </Label>
                              <Textarea
                                className="font-mono text-xs min-h-[100px] bg-background"
                                placeholder="<!-- Paste Ad Code Here -->"
                                value={adSettings?.homeAdCode || ''}
                                onChange={(e) => updateAdSettings({ homeAdCode: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                Watch Page Ad <span className="text-xs text-muted-foreground font-normal">(Below Video Player)</span>
                              </Label>
                              <Textarea
                                className="font-mono text-xs min-h-[100px] bg-background"
                                placeholder="<!-- Paste Ad Code Here -->"
                                value={adSettings?.watchAdCode || ''}
                                onChange={(e) => updateAdSettings({ watchAdCode: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                Between Categories Ad <span className="text-xs text-muted-foreground font-normal">(Home Page, Middle)</span>
                              </Label>
                              <Textarea
                                className="font-mono text-xs min-h-[100px] bg-background"
                                placeholder="<!-- Paste Ad Code Here -->"
                                value={adSettings?.interCategoryAdCode || ''}
                                onChange={(e) => updateAdSettings({ interCategoryAdCode: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                Global Popunder/Script <span className="text-xs text-muted-foreground font-normal">(Injected in Body)</span>
                              </Label>
                              <Textarea
                                className="font-mono text-xs min-h-[100px] bg-background"
                                placeholder="<script>...</script>"
                                value={adSettings?.popunderCode || ''}
                                onChange={(e) => updateAdSettings({ popunderCode: e.target.value })}
                              />
                            </div>

                            {/* AdMob Configuration */}
                            <div className="border-t border-border pt-6 mt-6">
                              <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                  <Megaphone className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold">AdMob Configuration (Mobile App)</h3>
                                  <p className="text-sm text-muted-foreground">Manage AdMob IDs for your mobile applications.</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                  <Label>AdMob App ID</Label>
                                  <Input
                                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx~xxxxxxxxxx"
                                    value={adSettings?.admob?.appId || ''}
                                    onChange={(e) => updateAdSettings({ admob: { ...adSettings.admob, appId: e.target.value } })}
                                    className="bg-background font-mono text-sm"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Banner Unit ID</Label>
                                  <Input
                                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx"
                                    value={adSettings?.admob?.bannerId || ''}
                                    onChange={(e) => updateAdSettings({ admob: { ...adSettings.admob, bannerId: e.target.value } })}
                                    className="bg-background font-mono text-xs"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Interstitial Unit ID</Label>
                                  <Input
                                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx"
                                    value={adSettings?.admob?.interstitialId || ''}
                                    onChange={(e) => updateAdSettings({ admob: { ...adSettings.admob, interstitialId: e.target.value } })}
                                    className="bg-background font-mono text-xs"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Rewarded Unit ID</Label>
                                  <Input
                                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx"
                                    value={adSettings?.admob?.rewardedId || ''}
                                    onChange={(e) => updateAdSettings({ admob: { ...adSettings.admob, rewardedId: e.target.value } })}
                                    className="bg-background font-mono text-xs"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Native Unit ID</Label>
                                  <Input
                                    placeholder="ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx"
                                    value={adSettings?.admob?.nativeId || ''}
                                    onChange={(e) => updateAdSettings({ admob: { ...adSettings.admob, nativeId: e.target.value } })}
                                    className="bg-background font-mono text-xs"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Timer-Locked Popup Settings */}
                            <div className="border-t border-border pt-6 mt-6">
                              <h3 className="text-md font-semibold mb-4 text-primary">Timer-Locked Popup (Interstitial)</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <Label>Status</Label>
                                  <select
                                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                                    value={adSettings.popupSettings?.enabled ? 'true' : 'false'}
                                    onChange={(e) => updateAdSettings({ popupSettings: { ...adSettings.popupSettings, enabled: e.target.value === 'true' } })}
                                  >
                                    <option value="false">Disabled</option>
                                    <option value="true">Enabled</option>
                                  </select>
                                </div>

                                {adSettings.popupSettings?.enabled && (
                                  <>
                                    <div className="space-y-2">
                                      <Label>Popup Type</Label>
                                      <select
                                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                                        value={adSettings.popupSettings?.type || 'image'}
                                        onChange={(e) => updateAdSettings({ popupSettings: { ...adSettings.popupSettings, type: e.target.value as any } })}
                                      >
                                        <option value="image">Image Banner</option>
                                        <option value="code">Custom Code (HTML/JS)</option>
                                      </select>
                                    </div>

                                    <div className="space-y-2">
                                      <Label>Timer (Seconds before Close)</Label>
                                      <Input
                                        type="number"
                                        value={adSettings.popupSettings?.timer || 20}
                                        onChange={(e) => updateAdSettings({ popupSettings: { ...adSettings.popupSettings, timer: parseInt(e.target.value) || 0 } })}
                                        className="bg-background"
                                      />
                                    </div>

                                    {adSettings.popupSettings?.type === 'code' ? (
                                      <div className="space-y-2 md:col-span-2">
                                        <Label>Ad Code (Adsterra / Script)</Label>
                                        <Textarea
                                          className="font-mono text-xs min-h-[150px] bg-background"
                                          placeholder="Paste your ad script here..."
                                          value={adSettings.popupSettings?.code || ''}
                                          onChange={(e) => updateAdSettings({ popupSettings: { ...adSettings.popupSettings, code: e.target.value } })}
                                        />
                                      </div>
                                    ) : (
                                      <>
                                        <div className="space-y-2 md:col-span-2">
                                          <Label>Banner Image URL</Label>
                                          <Input
                                            placeholder="https://..."
                                            value={adSettings.popupSettings?.imageUrl || ''}
                                            onChange={(e) => updateAdSettings({ popupSettings: { ...adSettings.popupSettings, imageUrl: e.target.value } })}
                                            className="bg-background"
                                          />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                          <Label>Target Link (Click URL)</Label>
                                          <Input
                                            placeholder="https://..."
                                            value={adSettings.popupSettings?.targetUrl || ''}
                                            onChange={(e) => updateAdSettings({ popupSettings: { ...adSettings.popupSettings, targetUrl: e.target.value } })}
                                            className="bg-background"
                                          />
                                        </div>
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Brand Promotion Section */}
                        <div className="pt-6 border-t border-border">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Megaphone className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold">Featured Brand Promotion</h3>
                                <p className="text-sm text-muted-foreground">Display a custom promotional banner or popup for a specific partner.</p>
                              </div>
                            </div>
                            <Switch
                              checked={adSettings?.brandPromotion?.enabled || false}
                              onCheckedChange={(checked) => updateAdSettings((prev) => ({
                                brandPromotion: { ...prev.brandPromotion, enabled: checked }
                              }))}
                            />
                          </div>

                          {adSettings?.brandPromotion?.enabled && (
                            <div className="grid gap-6 p-6 bg-primary/5 rounded-xl border border-primary/20 animate-in fade-in slide-in-from-top-4">
                              <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Banner Image URL</Label>
                                    <div className="flex gap-2">
                                      <Input
                                        value={adSettings.brandPromotion.imageUrl}
                                        onChange={(e) => updateAdSettings((prev) => ({
                                          brandPromotion: { ...prev.brandPromotion, imageUrl: e.target.value }
                                        }))}
                                        placeholder="https://example.com/banner.jpg"
                                        className="bg-background"
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Target Link URL</Label>
                                    <Input
                                      value={adSettings.brandPromotion.targetUrl}
                                      onChange={(e) => updateAdSettings((prev) => ({
                                        brandPromotion: { ...prev.brandPromotion, targetUrl: e.target.value }
                                      }))}
                                      placeholder="https://brand.com/special-offer"
                                      className="bg-background"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Display Position</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                      {['popup', 'header', 'footer'].map((pos) => (
                                        <div
                                          key={pos}
                                          onClick={() => updateAdSettings((prev) => ({
                                            brandPromotion: { ...prev.brandPromotion, position: pos as any }
                                          }))}
                                          className={cn(
                                            "cursor-pointer rounded-lg border p-3 text-center text-sm transition-all hover:border-primary",
                                            adSettings.brandPromotion.position === pos
                                              ? "border-primary bg-primary/10 text-primary font-medium"
                                              : "border-border bg-background"
                                          )}
                                        >
                                          {pos.charAt(0).toUpperCase() + pos.slice(1)}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label>Live Preview</Label>
                                  <div className="aspect-video rounded-lg border border-border bg-background/50 flex items-center justify-center overflow-hidden relative group">
                                    {adSettings.brandPromotion.imageUrl ? (
                                      <>
                                        <img
                                          src={adSettings.brandPromotion.imageUrl}
                                          alt="Promotion Preview"
                                          className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                          <a
                                            href={adSettings.brandPromotion.targetUrl || '#'}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-white bg-primary px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform"
                                          >
                                            Test Link
                                          </a>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="text-center text-muted-foreground p-4">
                                        <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-xs">Enter an image URL to see preview</p>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground text-center">
                                    This banner will appear as a
                                    <span className="font-medium text-foreground"> {adSettings.brandPromotion.position} </span>
                                    on your site.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Monetization */}
                    <TabsContent value="monetization" className="space-y-4 mt-6">
                      <div className="bg-card p-6 rounded-xl border border-border space-y-8">
                        {/* Ads Section */}
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                              <LayoutTemplate className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">Advertisement Placements</h3>
                              <p className="text-sm text-muted-foreground">Configure banner ads and scripts (e.g., Adsterra) for monetization.</p>
                            </div>
                          </div>
                          <div className="grid gap-6 p-4 border border-border/50 rounded-xl bg-secondary/5">
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                Home Page Ad <span className="text-xs text-muted-foreground font-normal">(Below Hero Section)</span>
                              </Label>
                              <Textarea
                                className="font-mono text-xs min-h-[100px] bg-background"
                                placeholder="<!-- Paste Ad Code Here -->"
                                value={adSettings?.homeAdCode || ''}
                                onChange={(e) => updateAdSettings({ homeAdCode: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                Watch Page Ad <span className="text-xs text-muted-foreground font-normal">(Below Video Player)</span>
                              </Label>
                              <Textarea
                                className="font-mono text-xs min-h-[100px] bg-background"
                                placeholder="<!-- Paste Ad Code Here -->"
                                value={adSettings?.watchAdCode || ''}
                                onChange={(e) => updateAdSettings({ watchAdCode: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                Global Popunder/Script <span className="text-xs text-muted-foreground font-normal">(Injected in Body)</span>
                              </Label>
                              <Textarea
                                className="font-mono text-xs min-h-[100px] bg-background"
                                placeholder="<script>...</script>"
                                value={adSettings?.popunderCode || ''}
                                onChange={(e) => updateAdSettings({ popunderCode: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                Movies Page Ad
                              </Label>
                              <Textarea
                                className="font-mono text-xs min-h-[100px] bg-background"
                                placeholder="<!-- Paste Ad Code Here -->"
                                value={adSettings?.moviesAdCode || ''}
                                onChange={(e) => updateAdSettings({ moviesAdCode: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                Series Page Ad
                              </Label>
                              <Textarea
                                className="font-mono text-xs min-h-[100px] bg-background"
                                placeholder="<!-- Paste Ad Code Here -->"
                                value={adSettings?.seriesAdCode || ''}
                                onChange={(e) => updateAdSettings({ seriesAdCode: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                Trending Page Ad
                              </Label>
                              <Textarea
                                className="font-mono text-xs min-h-[100px] bg-background"
                                placeholder="<!-- Paste Ad Code Here -->"
                                value={adSettings?.trendingAdCode || ''}
                                onChange={(e) => updateAdSettings({ trendingAdCode: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                Footer Ad
                              </Label>
                              <Textarea
                                className="font-mono text-xs min-h-[100px] bg-background"
                                placeholder="<!-- Paste Ad Code Here -->"
                                value={adSettings?.footerAdCode || ''}
                                onChange={(e) => updateAdSettings({ footerAdCode: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Brand Promotion Section */}
                        <div className="pt-6 border-t border-border">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Megaphone className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold">Featured Brand Promotion</h3>
                                <p className="text-sm text-muted-foreground">Display a custom promotional banner or popup for a specific partner.</p>
                              </div>
                            </div>
                            <Switch
                              checked={adSettings?.brandPromotion?.enabled || false}
                              onCheckedChange={(checked) => updateAdSettings((prev) => ({
                                brandPromotion: { ...prev.brandPromotion, enabled: checked }
                              }))}
                            />
                          </div>

                          {adSettings?.brandPromotion?.enabled && (
                            <div className="grid gap-6 p-6 bg-primary/5 rounded-xl border border-primary/20 animate-in fade-in slide-in-from-top-4">
                              <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Banner Image URL</Label>
                                    <Input
                                      value={adSettings.brandPromotion.imageUrl}
                                      onChange={(e) => updateAdSettings((prev) => ({
                                        brandPromotion: { ...prev.brandPromotion, imageUrl: e.target.value }
                                      }))}
                                      placeholder="https://example.com/banner.jpg"
                                      className="bg-background"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Target Link URL</Label>
                                    <Input
                                      value={adSettings.brandPromotion.targetUrl}
                                      onChange={(e) => updateAdSettings((prev) => ({
                                        brandPromotion: { ...prev.brandPromotion, targetUrl: e.target.value }
                                      }))}
                                      placeholder="https://brand.com/special-offer"
                                      className="bg-background"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Display Position</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                      {['popup', 'header', 'footer'].map((pos) => (
                                        <div
                                          key={pos}
                                          onClick={() => updateAdSettings((prev) => ({
                                            brandPromotion: { ...prev.brandPromotion, position: pos as any }
                                          }))}
                                          className={cn(
                                            "cursor-pointer rounded-lg border p-3 text-center text-sm transition-all hover:border-primary",
                                            adSettings.brandPromotion.position === pos
                                              ? "border-primary bg-primary/10 text-primary font-medium"
                                              : "border-border bg-background"
                                          )}
                                        >
                                          {pos.charAt(0).toUpperCase() + pos.slice(1)}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label>Live Preview</Label>
                                  <div className="aspect-video rounded-lg border border-border bg-background/50 flex items-center justify-center overflow-hidden relative group">
                                    {adSettings.brandPromotion.imageUrl ? (
                                      <>
                                        <img
                                          src={adSettings.brandPromotion.imageUrl}
                                          alt="Promotion Preview"
                                          className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                          <a
                                            href={adSettings.brandPromotion.targetUrl || '#'}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-white bg-primary px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform"
                                          >
                                            Test Link
                                          </a>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="text-center text-muted-foreground p-4">
                                        <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-xs">Enter an image URL to see preview</p>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground text-center">
                                    This banner will appear as a
                                    <span className="font-medium text-foreground"> {adSettings.brandPromotion.position} </span>
                                    on your site.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    {/* System Reference in Monetization */}
                    <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-2 bg-blue-100 rounded-lg">
                          <Globe className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-blue-900 mb-2">System Management</h3>
                          <p className="text-sm text-blue-700 mb-3">Access system-wide settings including backup, restore, cache management, and system logs.</p>
                          <Button
                            variant="outline"
                            className="text-blue-700 border-blue-300 hover:bg-blue-100"
                            onClick={() => setActiveTab('system')}
                          >
                            Go to System Settings
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* System */}
                    <TabsContent value="system" className="space-y-4 mt-6">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                              <Download className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-medium">Backup Site Data</h3>
                              <p className="text-sm text-muted-foreground">Export all settings, menus, and code.</p>
                            </div>
                          </div>
                          <Button onClick={handleBackup} className="w-full" variant="outline">
                            Download Backup JSON
                          </Button>
                        </div>
                        <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                              <Upload className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-medium">Restore From Backup</h3>
                              <p className="text-sm text-muted-foreground">Overwrite current settings with a backup file.</p>
                            </div>
                          </div>
                          <div className="relative">
                            <input
                              type="file"
                              accept=".json"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setSelectedBackupFile(file);
                                  toast({
                                    title: "Backup Selected",
                                    description: `Ready to restore from ${file.name}`,
                                  });
                                }
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <Button className="w-full" variant="secondary">
                              {selectedBackupFile ? selectedBackupFile.name : 'Select Backup File'}
                            </Button>
                          </div>
                          <Button
                            onClick={() => {
                              if (selectedBackupFile) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  if (event.target?.result) {
                                    try {
                                      const parsed = JSON.parse(event.target.result as string);

                                      // Validate basic structure
                                      if (!parsed.settings && !parsed.movies) {
                                        throw new Error("Invalid backup file format");
                                      }

                                      // Restore Settings
                                      if (parsed.settings) updateSettings(parsed.settings);
                                      if (parsed.codeInjection) updateCodeInjection(parsed.codeInjection);
                                      if (parsed.menuItems) updateMenuItems(parsed.menuItems);

                                      // Restore Content
                                      if (parsed.movies && Array.isArray(parsed.movies)) {
                                        importMovies(parsed.movies);
                                      }

                                      if (parsed.genres && Array.isArray(parsed.genres)) {
                                        importGenres(parsed.genres);
                                      }

                                      if (parsed.categories && Array.isArray(parsed.categories)) {
                                        importCategories(parsed.categories);
                                      }

                                      if (parsed.downloads && Array.isArray(parsed.downloads)) {
                                        importDownloads(parsed.downloads);
                                      }

                                      toast({
                                        title: "Restore Successful",
                                        description: "Full site data has been restored from backup.",
                                        variant: "default"
                                      });
                                      setSelectedBackupFile(null);
                                    } catch (error) {
                                      console.error('Restore failed:', error);
                                      toast({
                                        title: "Restore Failed",
                                        description: "Invalid or corrupted backup file.",
                                        variant: "destructive"
                                      });
                                    }
                                  }
                                };
                                reader.readAsText(selectedBackupFile);
                              }
                            }}
                            className="w-full gap-2"
                            disabled={!selectedBackupFile}
                          >
                            <Save className="w-4 h-4" />
                            Restore Now
                          </Button>
                        </div>
                        <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                              <Globe className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-medium">Auto Backup</h3>
                              <p className="text-sm text-muted-foreground">Enable automatic backups at regular intervals.</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Enable Auto Backup</span>
                              <Switch
                                checked={autoBackupEnabled}
                                onCheckedChange={setAutoBackupEnabled}
                              />
                            </div>
                            {autoBackupEnabled && (
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Backup Interval (minutes)</Label>
                                <Input
                                  type="number"
                                  min="5"
                                  max="1440" // 24 hours
                                  value={backupInterval}
                                  onChange={(e) => setBackupInterval(Math.max(5, Math.min(1440, parseInt(e.target.value) || 30)))}
                                  className="w-full"
                                />
                                {lastBackupTime && (
                                  <p className="text-xs text-muted-foreground">
                                    Last backup: {lastBackupTime.toLocaleTimeString()}
                                  </p>
                                )}
                              </div>
                            )}
                            <Button
                              onClick={createAutoBackup}
                              className="w-full"
                              variant="secondary"
                              disabled={autoBackupEnabled}
                            >
                              Create Manual Backup Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div >
              )}

              {
                activeTab === 'categories' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground">Manage content categories</p>
                      {hasPermission('categories') && (
                        <Button
                          className="gap-2"
                          onClick={() => {
                            setCategoryFormData({ name: '', description: '', color: '#3b82f6' });
                            setIsCategoryModalOpen(true);
                          }}
                        >
                          <Plus className="w-4 h-4" />
                          Add Category
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categories.map((category) => (
                        <div key={category.id} className="bg-card rounded-lg p-4 border border-border flex items-center justify-between group hover:border-primary transition-colors">
                          <div>
                            <span className="font-medium" style={{ color: category.color }}>{category.name}</span>
                            <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setCategoryFormData({
                                  name: category.name,
                                  description: category.description || '',
                                  color: category.color || '#3b82f6'
                                });
                                setSelectedCategory(category);
                                setIsCategoryModalOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
                                  deleteCategory(category.id);
                                  toast({
                                    title: "Category Deleted",
                                    description: `${category.name} has been removed.`,
                                    variant: "destructive"
                                  });
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }

              {
                activeTab === 'system' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
                        <p className="text-muted-foreground">Manage backups, restores, and system configurations.</p>
                      </div>
                    </div>

                    <Tabs defaultValue="backup" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 lg:w-[38rem]">
                        <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
                        <TabsTrigger value="cache">Cache Management</TabsTrigger>
                        <TabsTrigger value="logs">System Logs</TabsTrigger>
                      </TabsList>

                      <TabsContent value="backup" className="space-y-4 mt-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Download className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="font-medium">Backup Site Data</h3>
                                <p className="text-sm text-muted-foreground">Export all settings, menus, and code.</p>
                              </div>
                            </div>
                            <Button onClick={handleBackup} className="w-full" variant="outline">
                              Download Backup JSON
                            </Button>
                          </div>
                          <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <Upload className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="font-medium">Restore From Backup</h3>
                                <p className="text-sm text-muted-foreground">Overwrite current settings with a backup file.</p>
                              </div>
                            </div>
                            <div className="relative">
                              <input
                                type="file"
                                accept=".json"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setSelectedBackupFile(file);
                                    toast({
                                      title: "Backup Selected",
                                      description: `Ready to restore from ${file.name}`,
                                    });
                                  }
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                              <Button className="w-full" variant="secondary">
                                {selectedBackupFile ? selectedBackupFile.name : 'Select Backup File'}
                              </Button>
                            </div>
                            <Button
                              onClick={() => {
                                if (selectedBackupFile) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    if (event.target?.result) {
                                      try {
                                        const parsed = JSON.parse(event.target.result as string);

                                        // Validate basic structure
                                        if (!parsed.settings && !parsed.movies) {
                                          throw new Error("Invalid backup file format");
                                        }

                                        // Restore Settings
                                        if (parsed.settings) updateSettings(parsed.settings);
                                        if (parsed.codeInjection) updateCodeInjection(parsed.codeInjection);
                                        if (parsed.menuItems) updateMenuItems(parsed.menuItems);

                                        // Restore Content
                                        if (parsed.movies && Array.isArray(parsed.movies)) {
                                          importMovies(parsed.movies);
                                        }

                                        if (parsed.genres && Array.isArray(parsed.genres)) {
                                          importGenres(parsed.genres);
                                        }

                                        if (parsed.categories && Array.isArray(parsed.categories)) {
                                          importCategories(parsed.categories);
                                        }

                                        if (parsed.downloads && Array.isArray(parsed.downloads)) {
                                          importDownloads(parsed.downloads);
                                        }

                                        toast({
                                          title: "Restore Successful",
                                          description: "Full site data has been restored from backup.",
                                          variant: "default"
                                        });
                                        setSelectedBackupFile(null);
                                      } catch (error) {
                                        console.error('Restore failed:', error);
                                        toast({
                                          title: "Restore Failed",
                                          description: "Invalid or corrupted backup file.",
                                          variant: "destructive"
                                        });
                                      }
                                    }
                                  };
                                  reader.readAsText(selectedBackupFile);
                                }
                              }}
                              className="w-full gap-2"
                              disabled={!selectedBackupFile}
                            >
                              <Save className="w-4 h-4" />
                              Restore Now
                            </Button>
                          </div>
                          <div className="bg-card p-6 rounded-xl border border-border space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                <Globe className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="font-medium">Auto Backup</h3>
                                <p className="text-sm text-muted-foreground">Enable automatic backups at regular intervals.</p>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Enable Auto Backup</span>
                                <Switch
                                  checked={autoBackupEnabled}
                                  onCheckedChange={setAutoBackupEnabled}
                                />
                              </div>
                              {autoBackupEnabled && (
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Backup Interval (minutes)</Label>
                                  <Input
                                    type="number"
                                    min="5"
                                    max="1440" // 24 hours
                                    value={backupInterval}
                                    onChange={(e) => setBackupInterval(Math.max(5, Math.min(1440, parseInt(e.target.value) || 30)))}
                                    className="w-full"
                                  />
                                  {lastBackupTime && (
                                    <p className="text-xs text-muted-foreground">
                                      Last backup: {lastBackupTime.toLocaleTimeString()}
                                    </p>
                                  )}
                                </div>
                              )}
                              <Button
                                onClick={createAutoBackup}
                                className="w-full"
                                variant="secondary"
                                disabled={autoBackupEnabled}
                              >
                                Create Manual Backup Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="cache" className="space-y-4 mt-6">
                        <div className="bg-card p-6 rounded-xl border border-border">
                          <h3 className="font-medium mb-4">Cache Management</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                              <div>
                                <p className="font-medium">Browser Cache</p>
                                <p className="text-sm text-muted-foreground">Clear cached data for all users</p>
                              </div>
                              <Button variant="outline" className="h-8 px-3">
                                Clear
                              </Button>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                              <div>
                                <p className="font-medium">Image Cache</p>
                                <p className="text-sm text-muted-foreground">Clear cached images and thumbnails</p>
                              </div>
                              <Button variant="outline" className="h-8 px-3">
                                Clear
                              </Button>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                              <div>
                                <p className="font-medium">Data Cache</p>
                                <p className="text-sm text-muted-foreground">Clear temporary data storage</p>
                              </div>
                              <Button variant="outline" className="h-8 px-3">
                                Clear
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="logs" className="space-y-4 mt-6">
                        <div className="bg-card p-6 rounded-xl border border-border">
                          <h3 className="font-medium mb-4">System Logs</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Log Level</p>
                                <p className="text-sm text-muted-foreground">Configure logging detail</p>
                              </div>
                              <select className="h-8 px-3 rounded-md border border-input bg-background text-sm">
                                <option value="info">Info</option>
                                <option value="warn">Warning</option>
                                <option value="error">Error</option>
                                <option value="debug">Debug</option>
                              </select>
                            </div>
                            <div className="p-4 bg-secondary/50 rounded-lg">
                              <p className="text-sm font-mono text-muted-foreground mb-2">Recent Log Entries:</p>
                              <div className="space-y-1 text-xs font-mono max-h-60 overflow-y-auto">
                                <p className="text-green-500">[INFO] System initialized successfully - {new Date().toLocaleString()}</p>
                                <p className="text-blue-500">[INFO] User admin logged in - {new Date().toLocaleString()}</p>
                                <p className="text-yellow-500">[WARN] Low disk space warning - {new Date().toLocaleString()}</p>
                                <p className="text-green-500">[INFO] Backup completed successfully - {new Date().toLocaleString()}</p>
                                <p className="text-green-500">[INFO] Cache cleared - {new Date().toLocaleString()}</p>
                              </div>
                            </div>
                            <Button variant="outline" className="w-full">
                              Download Logs
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )
              }
            </div >
          </main >

          {/* Add/Edit Movie Modal */}
          < Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={(open) => {
            if (!open) {
              setIsAddModalOpen(false);
              setIsEditModalOpen(false);
              setSelectedMovie(null);
              resetForm();
            }
          }}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">
                  {isEditModalOpen ? 'Edit' : 'Add New'} {formData.type === 'series' ? 'Series' : 'Movie'}
                </DialogTitle>
                <DialogDescription>
                  Fill in the details below to {isEditModalOpen ? 'update' : 'add'} content.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-2 block">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter title"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Year</label>
                    <Input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Rating (0-10)</label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Duration</label>
                    <Input
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g., 2h 30m"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Quality</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={formData.quality}
                      onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                    >
                      <option value="HD">HD</option>
                      <option value="CAM">CAM</option>
                      <option value="4K">4K</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Type</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'movie' | 'series' })}
                    >
                      <option value="movie">Movie</option>
                      <option value="series">TV Series</option>
                    </select>
                  </div>

                  {formData.type === 'series' && (
                    <>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Seasons</label>
                        <Input
                          type="number"
                          value={formData.seasons}
                          onChange={(e) => setFormData({ ...formData, seasons: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Episodes</label>
                        <Input
                          type="number"
                          value={formData.episodes}
                          onChange={(e) => setFormData({ ...formData, episodes: parseInt(e.target.value) })}
                        />
                      </div>
                    </>
                  )}

                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-2 block">Genres (comma separated)</label>
                    <Input
                      value={formData.genres}
                      onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                      placeholder="e.g., Action, Thriller, Drama"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-2 block">Servers (comma separated)</label>
                    <Input
                      value={formData.servers}
                      onChange={(e) => setFormData({ ...formData, servers: e.target.value })}
                      placeholder="e.g., Vidcloud, Filemoon, StreamSB"
                    />
                  </div>

                  {/* Images Section */}
                  <div className="col-span-2 border-t pt-4 mt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Upload className="w-5 h-5 text-primary" />
                      <h3 className="font-display text-lg">Images</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Poster Image</label>
                        <ImageUpload
                          value={formData.poster}
                          onChange={(value) => setFormData({ ...formData, poster: value })}
                          placeholder="Enter poster image URL or upload"
                          aspectRatio="2:3"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Movie poster (2:3 ratio recommended)</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Backdrop Image</label>
                        <ImageUpload
                          value={formData.backdrop}
                          onChange={(value) => setFormData({ ...formData, backdrop: value })}
                          placeholder="Enter backdrop image URL or upload"
                          aspectRatio="16:9"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Hero banner image (16:9 ratio recommended)</p>
                      </div>
                    </div>
                  </div>

                  {/* Category Section */}
                  <div className="col-span-2 border-t pt-4 mt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <FolderOpen className="w-5 h-5 text-primary" />
                      <h3 className="font-display text-lg">Categories</h3>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Categories</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => {
                              if (formData.categories.includes(category.slug)) {
                                setFormData({
                                  ...formData,
                                  categories: formData.categories.filter(c => c !== category.slug)
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  categories: [...formData.categories, category.slug]
                                });
                              }
                            }}
                            className={`px-3 py-1 rounded-full text-sm ${formData.categories.includes(category.slug) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                            style={formData.categories.includes(category.slug) ? { backgroundColor: category.color } : {}}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Select one or more categories for this content</p>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter movie/series description"
                      rows={4}
                    />
                  </div>

                  {/* SEO Section */}
                  <div className="col-span-2 border-t pt-4 mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        <h3 className="font-display text-lg">SEO Options</h3>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const seoFields = generateSEOFields(formData.title, formData.description, formData.year);
                          setFormData({
                            ...formData,
                            slug: seoFields.slug,
                            metaTitle: seoFields.metaTitle,
                            metaDescription: seoFields.metaDescription,
                            keywords: seoFields.keywords
                          });
                          toast({
                            title: "SEO Generated!",
                            description: "SEO fields have been auto-generated.",
                          });
                        }}
                        className="gap-2"
                      >
                        <Code className="w-4 h-4" />
                        Auto Generate
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">URL Slug</label>
                        <Input
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          placeholder="e.g., dark-reckoning-2024"
                          className="font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground mt-1">URL-friendly version of the title</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Meta Title</label>
                        <Input
                          value={formData.metaTitle}
                          onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                          placeholder="SEO title (60 chars max)"
                          maxLength={60}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Title for search engines</p>
                      </div>

                      <div className="col-span-1 md:col-span-2">
                        <label className="text-sm font-medium mb-2 block">Meta Description</label>
                        <Textarea
                          value={formData.metaDescription}
                          onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                          placeholder="SEO description (160 chars max)"
                          maxLength={160}
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Description for search engines</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Keywords</label>
                        <Input
                          value={formData.keywords}
                          onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                          placeholder="e.g., action, thriller, 2024, movie"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Comma-separated keywords</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Open Graph Image</label>
                        <Input
                          value={formData.ogImage}
                          onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                          placeholder="URL for social media preview"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Image for social sharing</p>
                      </div>
                    </div>
                  </div>

                  {/* Media Section */}
                  <div className="col-span-2 border-t pt-4 mt-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Video className="w-5 h-5 text-primary" />
                      <h3 className="font-display text-lg">Media Options</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Trailer URL</label>
                        <Input
                          value={formData.trailerUrl}
                          onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                          placeholder="e.g., https://youtube.com/watch?v=..."
                        />
                        <p className="text-xs text-muted-foreground mt-1">YouTube or other video platform URL</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Embed Code</label>
                        <div className="flex gap-2">
                          <Textarea
                            value={formData.embedCode}
                            onChange={(e) => setFormData({ ...formData, embedCode: e.target.value })}
                            placeholder="Paste iframe embed code here..."
                            rows={3}
                            className="font-mono text-sm"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">HTML embed code for video player</p>
                      </div>

                      {/* <div>
                        <label className="text-sm font-medium mb-2 block">Download Link (Custom)</label>
                        <Input
                          value={formData.downloadUrl || ''}
                          onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                          placeholder="e.g., https://example.com/download"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Optional: Custom URL for the download button</p>
                      </div> */}
                    </div>
                  </div>

                  {/* Episodes Section - Only for Series */}
                  {formData.type === 'series' && (
                    <div className="col-span-2 border-t pt-4 mt-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Video className="w-5 h-5 text-primary" />
                          <h3 className="font-display text-lg">Episodes Management</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedSeasonForEpisode}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSelectedSeasonForEpisode(value === 'all' ? 'all' : parseInt(value));
                            }}
                            className="px-3 py-1 rounded-md border border-input bg-background text-sm"
                          >
                            <option value="all">All Seasons</option>
                            {Array.from({ length: 10 }, (_, i) => i + 1).map(season => (
                              <option key={season} value={season}>Season {season}</option>
                            ))}
                          </select>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const seasonEpisodes = formData.episodeList.filter(ep => ep.season === selectedSeasonForEpisode);
                              const nextEpisodeNumber = seasonEpisodes.length + 1;

                              const newEpisode = {
                                id: Date.now().toString(),
                                title: `Season ${selectedSeasonForEpisode}, Episode ${nextEpisodeNumber}`,
                                season: selectedSeasonForEpisode,
                                episode: nextEpisodeNumber,
                                description: '',
                                duration: '45 min',
                                thumbnail: '',
                                trailerUrl: '',
                                embedCode: '',
                                servers: []
                              };
                              setFormData({
                                ...formData,
                                episodeList: [...formData.episodeList, newEpisode]
                              });
                            }}
                            className="gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add Episode
                          </Button>
                        </div>
                      </div>

                      {formData.episodeList.length > 0 ? (
                        <div className="space-y-6">
                          {(selectedSeasonForEpisode === 'all'
                            ? Array.from(new Set(formData.episodeList.map(ep => ep.season)))
                              .sort((a, b) => a - b)
                            : [selectedSeasonForEpisode])
                            .map(season => {
                              const seasonEpisodes = formData.episodeList.filter(ep => ep.season === season);
                              return (
                                <div key={season} className="border rounded-lg p-4 bg-secondary/10">
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-display text-lg">Season {season}</h4>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const seasonEpisodeCount = formData.episodeList.filter(ep => ep.season === season).length;
                                        const nextEpisodeNumber = seasonEpisodeCount + 1;

                                        const newEpisode = {
                                          id: Date.now().toString(),
                                          title: `Season ${season}, Episode ${nextEpisodeNumber}`,
                                          season: season,
                                          episode: nextEpisodeNumber,
                                          description: '',
                                          duration: '45 min',
                                          thumbnail: '',
                                          trailerUrl: '',
                                          embedCode: '',
                                          servers: []
                                        };
                                        setFormData({
                                          ...formData,
                                          episodeList: [...formData.episodeList, newEpisode]
                                        });
                                      }}
                                      className="gap-2"
                                    >
                                      <Plus className="w-4 h-4" />
                                      Add to S{season}
                                    </Button>
                                  </div>

                                  <div className="space-y-3">
                                    {seasonEpisodes
                                      .sort((a, b) => a.episode - b.episode)
                                      .map((episode, index) => (
                                        <div key={episode.id} className="border rounded-lg p-4 bg-background">
                                          <div className="flex items-center justify-between mb-3">
                                            <h5 className="font-medium">Episode {episode.episode}</h5>
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => {
                                                setFormData({
                                                  ...formData,
                                                  episodeList: formData.episodeList.filter(ep => ep.id !== episode.id)
                                                });
                                              }}
                                              className="text-destructive hover:text-destructive"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </Button>
                                          </div>

                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                              <label className="text-sm font-medium mb-2 block">Episode Title</label>
                                              <Input
                                                value={episode.title}
                                                onChange={(e) => {
                                                  const updatedEpisodes = [...formData.episodeList];
                                                  const epIndex = updatedEpisodes.findIndex(ep => ep.id === episode.id);
                                                  updatedEpisodes[epIndex].title = e.target.value;
                                                  setFormData({ ...formData, episodeList: updatedEpisodes });
                                                }}
                                                placeholder="Enter episode title"
                                              />
                                            </div>

                                            <div>
                                              <label className="text-sm font-medium mb-2 block">Duration</label>
                                              <Input
                                                value={episode.duration}
                                                onChange={(e) => {
                                                  const updatedEpisodes = [...formData.episodeList];
                                                  const epIndex = updatedEpisodes.findIndex(ep => ep.id === episode.id);
                                                  updatedEpisodes[epIndex].duration = e.target.value;
                                                  setFormData({ ...formData, episodeList: updatedEpisodes });
                                                }}
                                                placeholder="e.g., 45 min"
                                              />
                                            </div>

                                            <div className="md:col-span-2">
                                              <label className="text-sm font-medium mb-2 block">Description</label>
                                              <Textarea
                                                value={episode.description}
                                                onChange={(e) => {
                                                  const updatedEpisodes = [...formData.episodeList];
                                                  const epIndex = updatedEpisodes.findIndex(ep => ep.id === episode.id);
                                                  updatedEpisodes[epIndex].description = e.target.value;
                                                  setFormData({ ...formData, episodeList: updatedEpisodes });
                                                }}
                                                placeholder="Enter episode description"
                                                rows={2}
                                              />
                                            </div>

                                            <div className="md:col-span-2">
                                              <label className="text-sm font-medium mb-2 block">Embed Code</label>
                                              <Textarea
                                                value={episode.embedCode}
                                                onChange={(e) => {
                                                  const updatedEpisodes = [...formData.episodeList];
                                                  const epIndex = updatedEpisodes.findIndex(ep => ep.id === episode.id);
                                                  updatedEpisodes[epIndex].embedCode = e.target.value;
                                                  setFormData({ ...formData, episodeList: updatedEpisodes });
                                                }}
                                                placeholder="Paste iframe embed code for this episode..."
                                                rows={3}
                                                className="font-mono text-sm"
                                              />
                                              <p className="text-xs text-muted-foreground mt-1">HTML embed code for this episode's video player</p>
                                            </div>

                                            <div>
                                              <label className="text-sm font-medium mb-2 block">Season</label>
                                              <Input
                                                type="number"
                                                value={episode.season}
                                                onChange={(e) => {
                                                  const updatedEpisodes = [...formData.episodeList];
                                                  const epIndex = updatedEpisodes.findIndex(ep => ep.id === episode.id);
                                                  updatedEpisodes[epIndex].season = parseInt(e.target.value);
                                                  setFormData({ ...formData, episodeList: updatedEpisodes });
                                                }}
                                                min="1"
                                              />
                                            </div>

                                            <div>
                                              <label className="text-sm font-medium mb-2 block">Episode Number</label>
                                              <Input
                                                type="number"
                                                value={episode.episode}
                                                onChange={(e) => {
                                                  const updatedEpisodes = [...formData.episodeList];
                                                  const epIndex = updatedEpisodes.findIndex(ep => ep.id === episode.id);
                                                  updatedEpisodes[epIndex].episode = parseInt(e.target.value);
                                                  setFormData({ ...formData, episodeList: updatedEpisodes });
                                                }}
                                                min="1"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No episodes added yet. Click "Add Episode" to get started.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button onClick={isEditModalOpen ? handleEditMovie : handleAddMovie} className="gap-2">
                  <Save className="w-4 h-4" />
                  {isEditModalOpen ? 'Update' : 'Save'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog >

          {/* View Movie Modal */}
          < Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen} >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">{selectedMovie?.title}</DialogTitle>
              </DialogHeader>
              {selectedMovie && (
                <div className="grid grid-cols-3 gap-6 py-4">
                  <div className="col-span-1">
                    <img src={selectedMovie.poster} alt={selectedMovie.title} className="w-full rounded-lg" />
                  </div>
                  <div className="col-span-2 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="quality-badge">{selectedMovie.quality}</span>
                      <span className="rating-badge">
                        <Star className="w-3 h-3 fill-current" />
                        {selectedMovie.rating}
                      </span>
                      <span className="text-muted-foreground">{selectedMovie.year}</span>
                      <span className="text-muted-foreground">{selectedMovie.duration}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedMovie.genres.map(g => (
                        <span key={g} className="px-3 py-1 rounded-full bg-secondary text-sm">{g}</span>
                      ))}
                    </div>
                    <p className="text-muted-foreground">{selectedMovie.description}</p>
                    {selectedMovie.type === 'series' && (
                      <>
                        <p className="text-sm"><strong>Seasons:</strong> {selectedMovie.seasons} | <strong>Episodes:</strong> {selectedMovie.episodes}</p>
                        {selectedMovie.episodeList && selectedMovie.episodeList.length > 0 && (
                          <div>
                            <p className="font-medium mb-2">Episode List:</p>
                            <div className="max-h-60 overflow-y-auto space-y-3 border rounded-lg p-3 bg-secondary/20">
                              {Array.from(new Set(selectedMovie.episodeList.map(ep => ep.season)))
                                .sort((a, b) => a - b)
                                .map(season => {
                                  const seasonEpisodes = selectedMovie.episodeList!.filter(ep => ep.season === season);
                                  return (
                                    <div key={season} className="border-l-2 border-primary pl-3">
                                      <h5 className="font-medium text-sm mb-2">Season {season}</h5>
                                      <div className="space-y-1">
                                        {seasonEpisodes
                                          .sort((a, b) => a.episode - b.episode)
                                          .map((episode) => (
                                            <div key={episode.id} className="flex items-center justify-between text-sm">
                                              <div className="flex items-center gap-2">
                                                <span className="font-medium">E{episode.episode}</span>
                                                <span>{episode.title}</span>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                {episode.duration && <span className="text-muted-foreground">{episode.duration}</span>}
                                                {episode.embedCode && (
                                                  <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                                                    Embed
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    {selectedMovie.categories && selectedMovie.categories.length > 0 && (
                      <div>
                        <p className="font-medium mb-1">Categories:</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedMovie.categories.map(cat => {
                            const category = categories.find(c => c.slug === cat);
                            return (
                              <span
                                key={cat}
                                className="px-2 py-1 rounded text-xs"
                                style={{ backgroundColor: category?.color || '#6b7280', color: 'white' }}
                              >
                                {category?.name || cat}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    <p className="text-sm"><strong>Servers:</strong> {selectedMovie.servers?.join(', ')}</p>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog >

          {/* Delete Confirmation */}
          < AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete "{selectedMovie?.title}". This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteMovie} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog >

          {/* Category Modal */}
          < Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen} >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">
                  {selectedCategory ? 'Edit' : 'Add New'} Category
                </DialogTitle>
                <DialogDescription>
                  Create or update a category for content organization.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category Name</label>
                  <Input
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                    placeholder="e.g., Featured, Trending"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={categoryFormData.description}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                    placeholder="Optional description for this category"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={categoryFormData.color}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, color: e.target.value })}
                      className="w-12 h-12 rounded cursor-pointer"
                    />
                    <Input
                      value={categoryFormData.color}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, color: e.target.value })}
                      placeholder="#3b82f6"
                      className="font-mono"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Choose a color for category badges</p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsCategoryModalOpen(false);
                  setSelectedCategory(null);
                }}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (categoryFormData.name.trim()) {
                      if (selectedCategory) {
                        // Update existing category
                        updateCategory(selectedCategory.id, {
                          name: categoryFormData.name.trim(),
                          description: categoryFormData.description.trim(),
                          color: categoryFormData.color
                        });
                        toast({
                          title: "Category Updated!",
                          description: `${categoryFormData.name} has been updated successfully.`,
                        });
                      } else {
                        // Add new category
                        addCategory({
                          name: categoryFormData.name.trim(),
                          description: categoryFormData.description.trim(),
                          color: categoryFormData.color
                        });
                        toast({
                          title: "Category Added!",
                          description: `${categoryFormData.name} has been created successfully.`,
                        });
                      }
                      setIsCategoryModalOpen(false);
                      setSelectedCategory(null);
                    }
                  }}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {selectedCategory ? 'Update' : 'Add'} Category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog >

          {/* Add User Modal */}
          < Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen} >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account for your platform.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input
                    value={userFormData.name}
                    onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                    placeholder="Enter user's full name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input
                    type="email"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    placeholder="user@example.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Password</label>
                  <Input
                    type="password"
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Role</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={userFormData.role}
                      onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as 'SuperAdmin' | 'Admin' | 'Editor' | 'Uploader' })}
                    >
                      <option value="SuperAdmin">Super Admin</option>
                      <option value="Admin">Admin</option>
                      <option value="Editor">Editor</option>
                      <option value="Uploader">Uploader</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={userFormData.status}
                      onChange={(e) => setUserFormData({ ...userFormData, status: e.target.value as 'Active' | 'Inactive' })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsAddUserModalOpen(false);
                  resetUserForm();
                }}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (userFormData.name && userFormData.email) {
                      addUser({
                        name: userFormData.name,
                        email: userFormData.email,
                        password: userFormData.password,
                        role: userFormData.role,
                        status: userFormData.status,
                        lastSeen: new Date(),
                        joinedDate: new Date(),
                        viewsToday: 0,
                        totalViews: 0,
                      });
                      setIsAddUserModalOpen(false);
                      resetUserForm();
                      toast({
                        title: "User Added!",
                        description: `${userFormData.name} has been created successfully.`,
                      });
                    }
                  }}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  Add User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog >

          {/* Edit User Modal */}
          < Dialog open={isEditUserModalOpen} onOpenChange={setIsEditUserModalOpen} >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">Edit User</DialogTitle>
                <DialogDescription>
                  Update user account details.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input
                    value={userFormData.name}
                    onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                    placeholder="Enter user's full name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input
                    type="email"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    placeholder="user@example.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">New Password</label>
                  <Input
                    type="password"
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    placeholder="Enter new password (leave blank to keep current)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Role</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={userFormData.role}
                      onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as 'SuperAdmin' | 'Admin' | 'Editor' | 'Uploader' })}
                    >
                      <option value="SuperAdmin">Super Admin</option>
                      <option value="Admin">Admin</option>
                      <option value="Editor">Editor</option>
                      <option value="Uploader">Uploader</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={userFormData.status}
                      onChange={(e) => setUserFormData({ ...userFormData, status: e.target.value as 'Active' | 'Inactive' })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsEditUserModalOpen(false);
                  resetUserForm();
                }}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (selectedUser && userFormData.name && userFormData.email) {
                      // Only update password if a new one is provided
                      const updatedUser: any = {
                        name: userFormData.name,
                        email: userFormData.email,
                        role: userFormData.role,
                        status: userFormData.status
                      };

                      if (userFormData.password) {
                        updatedUser.password = userFormData.password;
                      }

                      updateUser(selectedUser.id, updatedUser);
                      setIsEditUserModalOpen(false);
                      resetUserForm();
                      toast({
                        title: "User Updated!",
                        description: `${userFormData.name} has been updated successfully.`,
                      });
                    }
                  }}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  Update User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog >

          {/* Delete User Confirmation */}
          < AlertDialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen} >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete "{selectedUser?.name}". This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDeleteUserDialogOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    if (selectedUser) {
                      const userName = selectedUser.name; // Store the name before setting to null
                      deleteUser(selectedUser.id);
                      setIsDeleteUserDialogOpen(false);
                      setSelectedUser(null);
                      toast({
                        title: "User Deleted",
                        description: `${userName} has been removed.`,
                        variant: "destructive"
                      });
                    }
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog >

          {/* Genre Modal */}
          < Dialog open={isGenreModalOpen} onOpenChange={setIsGenreModalOpen} >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">
                  {selectedGenre ? 'Edit' : 'Add New'} Genre
                </DialogTitle>
                <DialogDescription>
                  Create a new genre for content categorization.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Genre Name</label>
                  <Input
                    value={genreFormData.name}
                    onChange={(e) => setGenreFormData({ ...genreFormData, name: e.target.value })}
                    placeholder="e.g., Horror, Comedy"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={genreFormData.description}
                    onChange={(e) => setGenreFormData({ ...genreFormData, description: e.target.value })}
                    placeholder="Optional description for this genre"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={genreFormData.color}
                      onChange={(e) => setGenreFormData({ ...genreFormData, color: e.target.value })}
                      className="w-12 h-12 rounded cursor-pointer"
                    />
                    <Input
                      value={genreFormData.color}
                      onChange={(e) => setGenreFormData({ ...genreFormData, color: e.target.value })}
                      placeholder="#3b82f6"
                      className="font-mono"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Choose a color for genre badges</p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsGenreModalOpen(false);
                  setSelectedGenre(null);
                }}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (genreFormData.name.trim()) {
                      if (selectedGenre) {
                        updateGenre(selectedGenre.id, {
                          name: genreFormData.name.trim(),
                          description: genreFormData.description.trim(),
                          color: genreFormData.color
                        });
                        toast({
                          title: "Genre Updated!",
                          description: `${genreFormData.name} has been updated successfully.`,
                        });
                      } else {
                        addGenre({
                          name: genreFormData.name.trim(),
                          description: genreFormData.description.trim(),
                          color: genreFormData.color
                        });
                        toast({
                          title: "Genre Added!",
                          description: `${genreFormData.name} has been created successfully.`,
                        });
                      }
                      setIsGenreModalOpen(false);
                      setSelectedGenre(null);
                    }
                  }}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {selectedGenre ? 'Update' : 'Add'} Genre
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog >
        </>
      )}
    </div > /* End of main container */
  );
};

const AdminPage = () => (
  <AdminErrorBoundary>
    <AdminPageContent />
  </AdminErrorBoundary>
);

export default AdminPage;
