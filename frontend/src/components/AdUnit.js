import React, { useEffect } from 'react';

/**
 * Google AdSense Ad Unit Component
 * 
 * Props:
 * - slot: Your AdSense ad slot ID
 * - format: 'auto', 'rectangle', 'horizontal', 'vertical'
 * - responsive: true/false (default: true)
 * - style: custom styling object
 */
export const AdUnit = ({ 
  slot = '', 
  format = 'auto',
  responsive = true,
  style = {},
  className = ''
}) => {
  useEffect(() => {
    try {
      // Push ad to AdSense
      if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  // Only show ads in production
  if (process.env.NODE_ENV !== 'production') {
    return (
      <div className={`border-2 border-dashed border-gray-300 p-4 text-center ${className}`} style={style}>
        <p className="text-gray-500 text-sm">Ad Placeholder (AdSense)</p>
        <p className="text-xs text-gray-400">Will show in production</p>
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-8786338957589056"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

/**
 * Pre-configured Ad Components
 */

// Display ad (responsive)
export const DisplayAd = ({ slot, className = '' }) => (
  <AdUnit
    slot={slot}
    format="auto"
    responsive={true}
    className={className}
    style={{ minHeight: '250px' }}
  />
);

// In-article ad
export const InArticleAd = ({ slot, className = '' }) => (
  <AdUnit
    slot={slot}
    format="fluid"
    responsive={true}
    className={className}
    style={{ minHeight: '200px' }}
  />
);

// Sidebar ad (vertical)
export const SidebarAd = ({ slot, className = '' }) => (
  <AdUnit
    slot={slot}
    format="auto"
    responsive={true}
    className={className}
    style={{ minHeight: '600px' }}
  />
);

// Horizontal banner
export const BannerAd = ({ slot, className = '' }) => (
  <AdUnit
    slot={slot}
    format="horizontal"
    responsive={true}
    className={className}
    style={{ minHeight: '90px' }}
  />
);
