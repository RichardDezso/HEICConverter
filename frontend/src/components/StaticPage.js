import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const AboutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'About - HEIC Converter';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Converter
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-5xl font-bold mb-6">About HEIC Converter</h1>
        
        <Card className="shadow-lg">
          <CardContent className="pt-8 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                We built this free HEIC converter to help users easily convert their Apple device photos 
                to more universally compatible formats. Our tool is fast, secure, and requires no registration.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Why We Created This Tool</h2>
              <p className="text-muted-foreground leading-relaxed">
                Since iOS 11, Apple devices save photos in HEIC format by default. While this format offers 
                excellent compression, it's not widely supported on older devices and platforms. Our converter 
                bridges this gap, allowing you to share and view your photos anywhere.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Features</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Convert HEIC to JPEG, PNG, or PDF</li>
                <li>• Batch conversion support</li>
                <li>• No file size limits</li>
                <li>• Privacy-focused (files deleted after conversion)</li>
                <li>• Free forever</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const ContactPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Contact - HEIC Converter';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Converter
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
        
        <Card className="shadow-lg">
          <CardContent className="pt-8 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Have questions, feedback, or need support? We'd love to hear from you!
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-muted-foreground">support@heicconverter.com</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Support Hours</h3>
              <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 5:00 PM EST</p>
            </div>

            <div className="pt-6">
              <p className="text-sm text-muted-foreground">
                We typically respond within 24 hours during business days.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const PrivacyPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Privacy Policy - HEIC Converter';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Converter
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
        
        <Card className="shadow-lg">
          <CardContent className="pt-8 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Privacy Matters</h2>
              <p className="text-muted-foreground leading-relaxed">
                We take your privacy seriously. This policy explains how we handle your files and data.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">File Processing</h2>
              <p className="text-muted-foreground leading-relaxed">
                All file conversions are processed on our secure servers. Your uploaded files are automatically 
                deleted immediately after conversion. We do not store, share, or access your files in any way.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Data Collection</h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not collect personal information. We may collect anonymous usage statistics to improve 
                our service, but this data cannot be used to identify individual users.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use industry-standard security measures to protect your files during the conversion process. 
                All connections are encrypted using HTTPS.
              </p>
            </div>

            <div className="pt-6 text-sm text-muted-foreground">
              <p>Last updated: December 2024</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};