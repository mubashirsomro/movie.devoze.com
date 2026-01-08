import { Link } from 'react-router-dom';
import { Film, Facebook, Twitter, Instagram, Youtube, Send } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import AdContainer from '@/components/AdContainer';

const Footer = () => {
  const { settings, footerSettings, adSettings } = useSettingsStore();

  const currentYear = new Date().getFullYear();
  const displayCopyright = footerSettings?.copyrightText?.replace('{year}', currentYear.toString())
    || `© ${currentYear} ${settings.siteName || 'StreamSphere'}. All rights reserved.`;

  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="container mx-auto px-4 py-12">
        {/* Ad Space */}
        <div className="mb-12">
          <AdContainer code={adSettings?.footerAdCode} label="Advertisement" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              {footerSettings?.footerLogoUrl || settings.logoUrl ? (
                <img
                  src={footerSettings?.footerLogoUrl || settings.logoUrl}
                  alt={settings.siteName}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-stream-accent-glow flex items-center justify-center">
                  <Film className="w-6 h-6 text-primary-foreground" />
                </div>
              )}
              <span className="font-display text-2xl tracking-wider">
                {settings.siteName && !footerSettings?.footerLogoUrl && !settings.logoUrl ? settings.siteName : (!settings.logoUrl && !footerSettings?.footerLogoUrl ? 'CINEMAX' : '')}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {settings.siteDescription || 'Your ultimate destination for movies and TV series. Stream unlimited content in HD quality.'}
            </p>
            <div className="flex gap-3">
              {footerSettings?.socialLinks?.facebook && (
                <a href={footerSettings.socialLinks.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {footerSettings?.socialLinks?.twitter && (
                <a href={footerSettings.socialLinks.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {footerSettings?.socialLinks?.instagram && (
                <a href={footerSettings.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {footerSettings?.socialLinks?.telegram && (
                <a href={footerSettings.socialLinks.telegram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary transition-colors">
                  <Send className="w-5 h-5" />
                </a>
              )}
              {/* Fallback socials if none set */}
              {!footerSettings?.socialLinks?.facebook && !footerSettings?.socialLinks?.twitter && !footerSettings?.socialLinks?.instagram && !footerSettings?.socialLinks?.telegram && (
                <>
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center opacity-50 cursor-not-allowed" title="No social links configured">
                    <Facebook className="w-5 h-5" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center opacity-50 cursor-not-allowed">
                    <Twitter className="w-5 h-5" />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Movies', 'TV Series', 'Trending', 'New Releases'].map((link) => (
                <li key={link}>
                  <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h4 className="font-display text-lg tracking-wider mb-4">Genres</h4>
            <ul className="space-y-2">
              {['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance'].map((genre) => (
                <li key={genre}>
                  <Link to={`/genre/${genre.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {genre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display text-lg tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2">
              {['Terms of Service', 'Privacy Policy', 'DMCA', 'Contact Us'].map((link) => (
                <li key={link}>
                  <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p dangerouslySetInnerHTML={{ __html: displayCopyright }} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
