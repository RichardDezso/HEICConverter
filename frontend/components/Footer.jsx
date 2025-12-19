import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">HEIC Converter Online</h3>
            <p className="text-sm text-muted-foreground">
              Free online tool to convert HEIC images to JPG, PNG, or PDF format.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Convert</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/heic-to-jpg" className="text-muted-foreground hover:text-foreground">HEIC to JPG</Link></li>
              <li><Link href="/heic-to-png" className="text-muted-foreground hover:text-foreground">HEIC to PNG</Link></li>
              <li><Link href="/heic-to-pdf" className="text-muted-foreground hover:text-foreground">HEIC to PDF</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/guides" className="text-muted-foreground hover:text-foreground">Guides</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 HEIC Converter Online. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
