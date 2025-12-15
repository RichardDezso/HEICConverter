import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileImage } from 'lucide-react';

export const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-semibold text-xl">
            <FileImage className="w-6 h-6 text-primary" />
            <span>HEIC Converter</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isHome ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Converter
            </Link>
            <Link 
              to="/guides" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Guides
            </Link>
            <Link 
              to="/heic-to-jpg" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              HEIC to JPG
            </Link>
            <Link 
              to="/heic-to-png" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              HEIC to PNG
            </Link>
            <Link 
              to="/heic-to-pdf" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              HEIC to PDF
            </Link>
            <Link 
              to="/about" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </nav>

          {/* CTA Button */}
          {!isHome && (
            <Link to="/">
              <Button size="sm">Start Converting</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};