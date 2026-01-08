# StreamSphere Hub - Movie & TV Series Streaming Platform

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Customization](#customization)
6. [Admin Panel](#admin-panel)
7. [Content Management](#content-management)
8. [Responsive Design](#responsive-design)
9. [Support](#support)

## Introduction

StreamSphere Hub is a modern, responsive movie and TV series streaming platform built with React, TypeScript, and Tailwind CSS. It features a comprehensive admin panel, movie/series management, download functionality, and a beautiful UI designed for both desktop and mobile users.

### Technology Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **UI Components**: Custom components with shadcn/ui integration

## Features

### Core Features
- **Movie & TV Series Management**: Add, edit, and delete movies and TV series
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Admin Panel**: Full-featured admin dashboard with content management
- **Download Functionality**: Download movies and series with proper file size calculation
- **Video Player**: Integrated video player with embed code support
- **Search & Filter**: Find content by genre, category, or search terms
- **Multi-language Support**: Ready for internationalization
- **SEO Optimized**: Proper meta tags and structured data

### Admin Features
- **Content Management**: Add/edit movies, series, genres, and categories
- **User Management**: Manage admin and user accounts
- **Site Settings**: Configure site name, description, logo, and layout
- **Navigation Management**: Customize main navigation menu
- **Ad Management**: Add ad codes for monetization
- **Backup & Restore**: Import/export site data
- **Embed Code Support**: Add video embed codes for direct streaming

### Frontend Features
- **Modern UI**: Clean, modern interface with gradient accents
- **Hero Slider**: Featured content slider on homepage
- **Movie Cards**: Responsive movie/series cards with hover effects
- **Video Player**: Integrated player with multiple server support
- **Download Page**: Track and manage downloads
- **Mobile Navigation**: Optimized mobile menu and navigation

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/streamsphere-hub.git
   cd streamsphere-hub
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   # or
   yarn build
   ```

### Environment Setup
The application doesn't require specific environment variables for basic operation, but you can customize the following in `vite.config.ts`:
- API endpoints
- Environment-specific configurations

## Configuration

### Site Settings
Access the admin panel at `/admin` (default credentials: admin/admin) to configure:
- Site name and description
- Logo and favicon
- Layout preferences
- Language settings
- Font styles
- Footer settings
- Social media links
- Ad codes

### Navigation Menu
Customize the main navigation in the admin panel:
- Add/remove menu items
- Set menu item visibility
- Create dynamic genre/category menus
- Reorder menu items

### Video Integration
Add video content by:
- Using embed codes (iframe) for direct streaming
- Adding trailer URLs (YouTube supported)
- Configuring multiple streaming servers
- Adding episode-specific embed codes for series

## Customization

### Branding
1. **Logo**: Upload your logo in the admin settings
2. **Colors**: Theme colors can be customized in `tailwind.config.ts`
3. **Fonts**: Change fonts through admin settings (Inter, Roboto, Poppins, etc.)
4. **Layout**: Choose between sidebar or classic layout

### UI Customization
The theme uses Tailwind CSS classes that can be easily modified:

#### Color Scheme
Located in `tailwind.config.ts`:
```js
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      // Add your custom colors here
    }
  }
}
```

#### Typography
Customize fonts in `admin panel > Settings > Font Style` or directly in the code:
- Font family options: Inter, Roboto, Poppins, Outfit, Open Sans, Lato, Montserrat
- Font weights: 300-700

### Component Customization
Components are located in `src/components/` and can be modified:
- UI components (buttons, inputs, cards) in `src/components/ui/`
- Layout components (Navbar, Sidebar, Footer)
- Feature components (VideoPlayer, MovieCard, HeroSlider)

## Admin Panel

### Access
- Navigate to `/admin`
- Default credentials: username `admin`, password `admin`
- Credentials can be changed in the admin settings

### Main Sections

#### Dashboard
- Overview of content statistics
- Quick access to main functions

#### Movies
- Add new movies with detailed information
- Edit existing movie details
- Upload posters and backdrops
- Add embed codes and trailers
- Set genres and categories

#### TV Series
- Add TV series with seasons and episodes
- Create individual episode entries
- Set episode-specific embed codes
- Manage series metadata

#### Genres & Categories
- Create and manage content genres
- Organize content by categories
- Customize genre colors and descriptions

#### Users
- Manage admin and user accounts
- Set user roles and permissions
- Control account status

#### Settings
- Site-wide configuration
- Navigation management
- Code injection options
- Monetization settings
- System preferences

### Security
- Default admin credentials should be changed immediately
- Session-based authentication
- Credentials stored in browser session storage

## Content Management

### Adding Movies
1. Go to Admin Panel > Movies
2. Click "Add New Movie"
3. Fill in movie details:
   - Title and year
   - Rating and duration
   - Quality (HD, 4K, etc.)
   - Genres (comma-separated)
   - Servers (comma-separated)
   - Images (poster and backdrop)
   - SEO settings
   - Media options (trailer URL, embed code)

### Adding TV Series
1. Go to Admin Panel > TV Series
2. Click "Add New Series"
3. Fill in series details including:
   - Number of seasons and episodes
   - Episode management with individual details
   - Season-specific organization

### Embed Code Integration
Supports various video platforms:
- YouTube (both URL and embed code)
- Vimeo
- Dailymotion
- Custom streaming services (Vidcloud, Filemoon, StreamSB, Streamtape)
- Direct iframe embed codes

## Responsive Design

### Desktop Features
- Sidebar navigation layout
- Full-featured video player
- Detailed content information
- Multi-column movie grids

### Mobile Features
- Bottom navigation bar
- Optimized touch controls
- Collapsible menus
- Mobile-optimized video player
- Touch-friendly interface

### Breakpoints
- Mobile: Up to 640px
- Tablet: 641px to 1024px
- Desktop: 1025px and above

## Support

### Included Files
- Complete source code
- Documentation
- All components and assets
- Configuration files

### Support Scope
- Installation assistance
- Configuration help
- Bug fixes
- Feature explanation

### How to Get Support
1. Check the documentation first
2. Review the code comments
3. Contact through ThemeForest profile

### Known Issues
- Mobile download functionality is simulated (requires backend for actual file serving)
- Video streaming requires external services for production use
- Some features may need backend integration for full functionality

## License
This item is available under the Regular License or Extended License from ThemeForest. Please review the license terms before use.

## Changelog

### Version 1.0.0
- Initial release
- Complete movie/series streaming platform
- Admin panel with full content management
- Responsive design for all devices
- Download functionality
- Video player with embed code support