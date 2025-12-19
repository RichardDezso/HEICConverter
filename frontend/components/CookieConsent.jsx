'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          We use cookies to improve your experience. By using our site, you agree to our{' '}
          <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDecline}>Decline</Button>
          <Button size="sm" onClick={handleAccept}>Accept</Button>
        </div>
      </div>
    </div>
  );
}
