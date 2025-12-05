import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-semibold text-lg mb-4">HEIC Converter</h3>
            <p className="text-sm text-muted-foreground">
              Free online tool to convert HEIC files to JPEG, PNG, and PDF formats.
            </p>
          </div>

          {/* Converters */}
          <div>
            <h4 className="font-semibold mb-4">Converters</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/heic-to-jpg" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  HEIC to JPG
                </Link>
              </li>
              <li>
                <Link to="/heic-to-png" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  HEIC to PNG
                </Link>
              </li>
              <li>
                <Link to="/heic-to-pdf" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  HEIC to PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} HEIC Converter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};