import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, CheckCircle, Loader2 } from 'lucide-react';

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
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Contact - HEIC Converter';
  }, []);

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('https://formspree.io/f/xzaboree', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          subject: formState.subject,
          message: formState.message,
          _subject: `HEIC Converter Contact: ${formState.subject}`
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setFormState({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      setError('Failed to send message. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

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

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
        
        <Card className="shadow-lg">
          <CardContent className="pt-8">
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Message Sent!</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for reaching out. We'll get back to you as soon as possible.
                </p>
                <Button onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground mb-6">
                  Have questions, feedback, or need support? Fill out the form below and we'll get back to you shortly.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formState.name}
                        onChange={handleChange}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formState.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formState.subject}
                      onChange={handleChange}
                      placeholder="What is this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formState.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-sm text-muted-foreground mt-6 text-center">
                  Or email us directly at{' '}
                  <a href="mailto:rdezso@gmail.com" className="text-primary hover:underline">
                    rdezso@gmail.com
                  </a>
                </p>
              </>
            )}
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