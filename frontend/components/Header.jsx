import Link from 'next/link';
import { FileImage } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <FileImage className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">HEIC Converter</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/heic-to-jpg" className="text-muted-foreground hover:text-foreground transition-colors">HEIC to JPG</Link>
            <Link href="/heic-to-png" className="text-muted-foreground hover:text-foreground transition-colors">HEIC to PNG</Link>
            <Link href="/heic-to-pdf" className="text-muted-foreground hover:text-foreground transition-colors">HEIC to PDF</Link>
            <Link href="/guides" className="text-muted-foreground hover:text-foreground transition-colors">Guides</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
