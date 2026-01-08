import moviePoster1 from '@/assets/movie-poster-1.jpg';
import moviePoster2 from '@/assets/movie-poster-2.jpg';
import moviePoster3 from '@/assets/movie-poster-3.jpg';
import moviePoster4 from '@/assets/movie-poster-4.jpg';
import moviePoster5 from '@/assets/movie-poster-5.jpg';
import moviePoster6 from '@/assets/movie-poster-6.jpg';

export interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  duration: string;
  genres: string[];
  description: string;
  poster: string;
  backdrop?: string;
  quality: string;
  type: 'movie' | 'series';
  seasons?: number;
  episodes?: number;
  servers?: string[];
  // SEO Fields
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
  // Media Fields
  trailerUrl?: string;
  embedCode?: string;
  // Category Fields
  categories?: string[];
  // Episodes Fields (for TV Series)
  episodeList?: Episode[];
  // Custom Download Link
  downloadUrl?: string;
}

export interface Episode {
  id: string;
  title: string;
  season: number;
  episode: number;
  description?: string;
  duration?: string;
  thumbnail?: string;
  trailerUrl?: string;
  embedCode?: string;
  servers?: string[];
}

export const movies: Movie[] = [
  {
    id: '1',
    title: 'Dark Reckoning',
    year: 2024,
    rating: 8.5,
    duration: '2h 15m',
    genres: ['Action', 'Thriller'],
    description: 'A former special forces operative is drawn back into the world of covert operations when a mysterious threat emerges from his past. With time running out, he must confront his demons and save those he loves.',
    poster: moviePoster1,
    backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&h=1080&fit=crop',
    quality: 'HD',
    type: 'movie',
    servers: ['Vidcloud', 'Filemoon', 'StreamSB'],
    // SEO Fields
    slug: 'dark-reckoning-2024',
    metaTitle: 'Dark Reckoning (2024) - Watch Online Free',
    metaDescription: 'A former special forces operative is drawn back into the world of covert operations when a mysterious threat emerges from his past.',
    keywords: ['dark reckoning', '2024', 'action', 'thriller', 'watch online', 'free streaming'],
    ogImage: moviePoster1,
    // Media Fields
    trailerUrl: 'https://www.youtube.com/watch?v=avXzQhIYn3c',
    embedCode: '<iframe src="https://vidcloud.to/embed/movie/123" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>',
    categories: ['featured', 'trending']
  },
  {
    id: '2',
    title: 'Stellar Odyssey',
    year: 2024,
    rating: 9.1,
    duration: '2h 45m',
    genres: ['Sci-Fi', 'Adventure'],
    description: 'When Earth faces extinction, a team of astronauts embarks on humanity\'s most dangerous mission through a newly discovered wormhole. Their journey will challenge everything they know about space, time, and human connection.',
    poster: moviePoster2,
    backdrop: 'https://images.unsplash.com/photo-1446776847045-721324c05f6e?w=1920&h=1080&fit=crop',
    quality: 'CAM',
    type: 'movie',
    servers: ['Vidcloud', 'Mixdrop'],
    // Media Fields
    trailerUrl: 'https://www.youtube.com/watch?v=wZdp8gl14W0',
    categories: ['trending', 'popular']
  },
  {
    id: '3',
    title: 'The Hollow Woods',
    year: 2024,
    rating: 7.8,
    duration: '1h 58m',
    genres: ['Horror', 'Mystery'],
    description: 'A group of friends venture into the abandoned woods to investigate urban legends, only to discover that some stories are terrifyingly real. Now they must survive the night as ancient evil awakens.',
    poster: moviePoster3,
    backdrop: 'https://images.unsplash.com/photo-1536170280562-3f3c2b3b5cfd?w=1920&h=1080&fit=crop',
    quality: 'HD',
    type: 'movie',
    servers: ['Vidcloud', 'Filemoon', 'Upstream'],
    categories: ['horror', 'mystery']
  },
  {
    id: '4',
    title: 'Eternal Sunset',
    year: 2024,
    rating: 8.2,
    duration: '2h 05m',
    genres: ['Romance', 'Drama'],
    description: 'Two strangers meet at a crossroads in their lives and embark on a journey of self-discovery and love. As their paths intertwine, they must decide if their connection is worth fighting for.',
    poster: moviePoster4,
    backdrop: 'https://images.unsplash.com/photo-1506197603052-3cc29c2ba4eb?w=1920&h=1080&fit=crop',
    quality: 'HD',
    type: 'movie',
    servers: ['Vidcloud', 'StreamSB']
  },
  {
    id: '5',
    title: 'Midnight Detective',
    year: 2024,
    rating: 8.7,
    duration: '1h 52m',
    genres: ['Crime', 'Noir'],
    description: 'A hard-boiled detective navigates the rain-soaked streets of a corrupt city, hunting a serial killer who leaves cryptic messages. Each clue brings him closer to a truth that could destroy everything.',
    poster: moviePoster5,
    quality: 'HD',
    type: 'series',
    seasons: 2,
    episodes: 16,
    servers: ['Vidcloud', 'Filemoon', 'Mixdrop']
  },
  {
    id: '6',
    title: 'Dragon\'s Legacy',
    year: 2024,
    rating: 9.3,
    duration: '2h 30m',
    genres: ['Fantasy', 'Adventure'],
    description: 'In a world where dragons once ruled the skies, a young warrior discovers she is the last of an ancient bloodline capable of bonding with these magnificent creatures. Epic battles await.',
    poster: moviePoster6,
    quality: 'HD',
    type: 'series',
    seasons: 3,
    episodes: 24,
    servers: ['Vidcloud', 'StreamSB', 'Upstream']
  },
  {
    id: '7',
    title: 'Code Breaker',
    year: 2023,
    rating: 8.0,
    duration: '1h 45m',
    genres: ['Thriller', 'Tech'],
    description: 'A brilliant hacker discovers a conspiracy that goes to the highest levels of government. Racing against time, she must expose the truth before becoming the next target.',
    poster: moviePoster2,
    quality: 'HD',
    type: 'movie',
    servers: ['Vidcloud', 'Filemoon']
  },
  {
    id: '8',
    title: 'Last Stand',
    year: 2023,
    rating: 7.5,
    duration: '2h 10m',
    genres: ['Action', 'War'],
    description: 'A small band of soldiers holds the line against overwhelming odds to protect civilians during a devastating invasion. Their courage becomes legend.',
    poster: moviePoster1,
    quality: 'CAM',
    type: 'movie',
    servers: ['Vidcloud', 'Mixdrop']
  },
  {
    id: '9',
    title: 'Silent Whispers',
    year: 2024,
    rating: 8.4,
    duration: '1h 55m',
    genres: ['Horror', 'Supernatural'],
    description: 'A deaf woman moves into an old mansion, only to discover she can sense the spirits trapped within its walls. She must uncover their stories to set them free.',
    poster: moviePoster3,
    quality: 'HD',
    type: 'movie',
    servers: ['Vidcloud', 'StreamSB']
  },
  {
    id: '10',
    title: 'Hearts Divided',
    year: 2024,
    rating: 7.9,
    duration: '2h 00m',
    genres: ['Romance', 'Historical'],
    description: 'Set against the backdrop of a nation at war, two lovers from opposing families must choose between duty and their forbidden love.',
    poster: moviePoster4,
    quality: 'HD',
    type: 'series',
    seasons: 1,
    episodes: 8,
    servers: ['Vidcloud', 'Filemoon']
  },
  {
    id: '11',
    title: 'Shadow Protocol',
    year: 2024,
    rating: 8.6,
    duration: '2h 20m',
    genres: ['Spy', 'Action'],
    description: 'An elite spy is framed for a crime she didn\'t commit. Now on the run from her own agency, she must uncover the mole before it\'s too late.',
    poster: moviePoster5,
    quality: 'HD',
    type: 'movie',
    servers: ['Vidcloud', 'StreamSB', 'Mixdrop']
  },
  {
    id: '12',
    title: 'Kingdom of Ash',
    year: 2024,
    rating: 9.0,
    duration: '2h 35m',
    genres: ['Fantasy', 'Epic'],
    description: 'When darkness threatens to consume the realm, an unlikely hero must unite the fractured kingdoms and lead them into the final battle for survival.',
    poster: moviePoster6,
    quality: 'HD',
    type: 'movie',
    servers: ['Vidcloud', 'Filemoon', 'Upstream']
  }
];

export const getFeaturedMovies = () => movies.slice(0, 4);
export const getTrendingMovies = () => movies.filter(m => m.rating >= 8.5);
export const getLatestMovies = () => movies.filter(m => m.year === 2024);
export const getMoviesByGenre = (genre: string) => movies.filter(m => m.genres.includes(genre));
export const getSeries = () => movies.filter(m => m.type === 'series');
export const getMovieById = (id: string) => movies.find(m => m.id === id);
