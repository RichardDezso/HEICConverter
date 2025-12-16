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
      const response = await fetch('https://formspree.io/rdezso@gmail.com', {
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
    document.title = 'Privacy Policy - HEIC Converter Online';
    window.scrollTo(0, 0);
  }, []);

  const SectionHeading = ({ children, id }) => (
    <h2 id={id} className="text-xl sm:text-2xl font-bold text-foreground mt-10 mb-4 pb-2 border-b border-border scroll-mt-20">
      {children}
    </h2>
  );

  const SubHeading = ({ children }) => (
    <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
      {children}
    </h3>
  );

  const Paragraph = ({ children }) => (
    <p className="text-muted-foreground leading-relaxed mb-4">
      {children}
    </p>
  );

  const BulletList = ({ items }) => (
    <ul className="space-y-2 text-muted-foreground mb-4 ml-4">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <span className="text-primary mt-1.5">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );

  const KeyPoint = ({ icon, title, description }) => (
    <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
      <div className="text-2xl">{icon}</div>
      <div>
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );

  const tableOfContents = [
    { id: 'introduction', label: '1. Introduction' },
    { id: 'info-collect', label: '2. Information We Collect' },
    { id: 'cookies', label: '3. Cookies & Tracking' },
    { id: 'advertising', label: '4. Advertising (Google AdSense)' },
    { id: 'third-party', label: '5. Third-Party Services' },
    { id: 'how-we-use', label: '6. How We Use Information' },
    { id: 'data-security', label: '7. Data Security' },
    { id: 'data-sharing', label: '8. How We Share Information' },
    { id: 'data-retention', label: '9. Data Retention' },
    { id: 'gdpr', label: '10. GDPR (EU Users)' },
    { id: 'ccpa', label: '11. CCPA (California Users)' },
    { id: 'children', label: '12. Children\'s Privacy (COPPA)' },
    { id: 'international', label: '13. International Transfers' },
    { id: 'changes', label: '14. Policy Changes' },
    { id: 'contact', label: '15. Contact Us' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Converter
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground">
            for HEIC Converter Online · <span className="font-medium">Last Updated: December 16, 2025</span>
          </p>
        </div>

        {/* Key Points Summary */}
        <Card className="shadow-lg mb-8 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🔑</span>
              <h2 className="text-xl font-bold text-foreground">Key Points at a Glance</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <KeyPoint 
                icon="🗑️" 
                title="Files Deleted Immediately" 
                description="Your uploaded files are automatically deleted right after conversion. We never store them."
              />
              <KeyPoint 
                icon="🔒" 
                title="No Personal Data Required" 
                description="Use our converter without registration. We don't collect names, emails, or any personal info."
              />
              <KeyPoint 
                icon="📊" 
                title="Anonymous Analytics Only" 
                description="We use Google Analytics for anonymous usage statistics to improve the service."
              />
              <KeyPoint 
                icon="📢" 
                title="Advertising Cookies" 
                description="Google AdSense may use cookies to show relevant ads. You can opt out anytime."
              />
              <KeyPoint 
                icon="🇪🇺" 
                title="GDPR Compliant" 
                description="EU users have full rights to access, correct, delete, and port their data."
              />
              <KeyPoint 
                icon="🇺🇸" 
                title="CCPA Compliant" 
                description="California residents can opt out of data sales and request data deletion."
              />
            </div>
          </CardContent>
        </Card>

        {/* Table of Contents */}
        <Card className="shadow-md mb-8">
          <CardContent className="pt-6">
            <h2 className="text-lg font-bold mb-4">📋 Table of Contents</h2>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
              {tableOfContents.map((item) => (
                <a 
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="shadow-lg">
          <CardContent className="pt-6 pb-10">
            
            {/* 1. Introduction */}
            <SectionHeading id="introduction">1. Introduction</SectionHeading>
            <Paragraph>
              This Privacy Policy explains how HEIC Converter Online ("Service", "we", "us", or "our") collects, uses, and protects information when you use our HEIC image conversion tool at heicconverteronline.com.
            </Paragraph>
            <Paragraph>
              By accessing or using the Service, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree, please do not use the Service.
            </Paragraph>

            {/* 2. Information We Collect */}
            <SectionHeading id="info-collect">2. Information We Collect</SectionHeading>
            
            <SubHeading>2.1 HEIC Files and Converted Images</SubHeading>
            <Paragraph>When you use the Service to convert HEIC images:</Paragraph>
            <BulletList items={[
              "Your uploaded files are processed on our secure servers to perform the conversion.",
              "Your files are automatically deleted immediately after conversion and are not retained on our servers.",
              "We do not store, share, or access your files for any secondary purpose beyond performing the requested conversion.",
              "We do not claim ownership of any files you upload.",
              "Your images are not used for training, marketing, analytics, or any other purpose."
            ]} />

            <SubHeading>2.2 Personal Information</SubHeading>
            <Paragraph>
              We do not collect personal information such as your name, email address, or other identifying details through normal use of the Service.
            </Paragraph>
            <Paragraph>
              However, if you contact us through our Contact Us form at heicconverteronline.com/contact, we may collect:
            </Paragraph>
            <BulletList items={[
              "Your name, email address, and message content to respond to your inquiry.",
              "This information is used solely for communicating with you and providing support."
            ]} />

            <SubHeading>2.3 Anonymous Usage Data</SubHeading>
            <Paragraph>We may collect anonymous usage statistics to improve our Service, including:</Paragraph>
            <BulletList items={[
              "Pages visited and actions taken within the Service.",
              "Time and date of access.",
              "Device information such as browser type and operating system.",
              "IP addresses (in anonymized form)."
            ]} />
            <Paragraph>
              This data cannot be used to identify individual users and is collected only in aggregate form.
            </Paragraph>

            {/* 3. Cookies and Tracking */}
            <SectionHeading id="cookies">3. Cookies and Tracking Technologies</SectionHeading>
            <Paragraph>We use cookies on the Service for the following purposes:</Paragraph>
            <BulletList items={[
              "Performance and analytics: Google Analytics collects usage statistics to help us understand how users interact with the Service and identify areas for improvement.",
              "Functionality: Cookies may be used to remember user preferences (such as cookie consent choices) or maintain session information.",
              "Advertising: Google AdSense uses cookies to serve personalized ads based on your interests and browsing history (see Section 4)."
            ]} />
            <Paragraph>
              You can control or disable cookies through your browser settings. However, disabling cookies may affect the functionality of certain features of the Service.
            </Paragraph>

            {/* 4. Advertising */}
            <SectionHeading id="advertising">4. Advertising (Google AdSense)</SectionHeading>
            <Paragraph>
              We use Google AdSense to display advertisements on our Service. Google AdSense is a third-party advertising service provided by Google LLC.
            </Paragraph>
            
            <SubHeading>4.1 How AdSense Works</SubHeading>
            <Paragraph>Google AdSense uses cookies and similar technologies to:</Paragraph>
            <BulletList items={[
              "Serve ads based on your prior visits to our website or other websites.",
              "Allow Google and its partners to serve ads based on your visit to our site and/or other sites on the Internet.",
              "Use the DoubleClick cookie to enable interest-based advertising."
            ]} />

            <SubHeading>4.2 Information Collected by AdSense</SubHeading>
            <Paragraph>Through AdSense, Google may collect:</Paragraph>
            <BulletList items={[
              "Your IP address (which may be used to estimate your general location).",
              "Device and browser information.",
              "Information about your interactions with ads.",
              "Browsing activity on websites that use Google advertising services."
            ]} />

            <SubHeading>4.3 Your Choices Regarding Ads</SubHeading>
            <Paragraph>You have several options to control ad personalization:</Paragraph>
            <BulletList items={[
              "Visit Google's Ad Settings (adssettings.google.com) to manage your preferences.",
              "Opt out of personalized advertising by visiting www.aboutads.info/choices.",
              "Use the Network Advertising Initiative opt-out page at optout.networkadvertising.org.",
              "Enable 'Do Not Track' in your browser settings.",
              "Use our cookie consent banner to decline non-essential cookies."
            ]} />
            <Paragraph>
              For more information about how Google uses data when you use sites that use their services, visit: <a href="https://policies.google.com/technologies/partner-sites" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">policies.google.com/technologies/partner-sites</a>
            </Paragraph>

            {/* 5. Third-Party Services */}
            <SectionHeading id="third-party">5. Third-Party Services</SectionHeading>
            
            <SubHeading>5.1 Google Analytics</SubHeading>
            <Paragraph>
              We use Google Analytics to collect and analyze anonymous usage data. Google Analytics may use cookies and other tracking technologies to track your interactions with the Service.
            </Paragraph>
            <Paragraph>
              Google Analytics data is subject to Google's Privacy Policy. For more information, visit: <a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>
            </Paragraph>
            <Paragraph>
              You can opt out of Google Analytics tracking by installing the <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics opt-out browser extension</a>.
            </Paragraph>

            <SubHeading>5.2 Formspree (Contact Form)</SubHeading>
            <Paragraph>
              Our contact form is powered by Formspree. When you submit a message, your name, email, and message content are processed by Formspree and delivered to us. Formspree's privacy policy applies to this data processing.
            </Paragraph>

            {/* 6. How We Use Information */}
            <SectionHeading id="how-we-use">6. How We Use Information</SectionHeading>
            <Paragraph>We use the information we collect for the following purposes:</Paragraph>
            <BulletList items={[
              "To provide and operate the Service, including processing HEIC files and delivering converted files.",
              "To improve and optimize the Service, using anonymous usage statistics to monitor performance.",
              "To maintain security, detect and address technical issues, and prevent abuse.",
              "To respond to inquiries and provide customer support.",
              "To display relevant advertisements through Google AdSense.",
              "To comply with legal obligations and enforce our Terms of Use."
            ]} />
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-4 my-4">
              <p className="text-green-800 dark:text-green-200 font-medium">
                ✓ We do not sell your personal information to third parties.
              </p>
            </div>

            {/* 7. Data Security */}
            <SectionHeading id="data-security">7. Data Security</SectionHeading>
            <Paragraph>We implement industry-standard security measures to protect your information:</Paragraph>
            <BulletList items={[
              "Use of secure protocols (HTTPS) to encrypt data in transit.",
              "Secure server infrastructure to protect against unauthorized access.",
              "Restricted access to systems that process files.",
              "Regular monitoring and maintenance to prevent vulnerabilities.",
              "Immediate deletion of files after conversion."
            ]} />
            <Paragraph>
              However, no method of transmission over the internet is completely secure. While we strive to protect your information, absolute security cannot be guaranteed.
            </Paragraph>

            {/* 8. Data Sharing */}
            <SectionHeading id="data-sharing">8. How We Share Information</SectionHeading>
            <Paragraph>We may share information in limited circumstances:</Paragraph>
            <BulletList items={[
              "Service providers: With Google Analytics, Google AdSense, Formspree, and other trusted providers who help us operate the Service.",
              "Legal requirements: When required by law, regulation, or legal process.",
              "Business transfers: In connection with a merger, acquisition, or sale of assets."
            ]} />
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4 my-4">
              <p className="text-blue-800 dark:text-blue-200 font-medium">
                ✓ We never share your uploaded files or image content with any third parties.
              </p>
            </div>

            {/* 9. Data Retention */}
            <SectionHeading id="data-retention">9. Data Retention</SectionHeading>
            <BulletList items={[
              "HEIC files and converted images: Deleted immediately after conversion.",
              "Anonymous usage data: Retained following Google Analytics' standard retention policies (typically 26 months).",
              "Contact form submissions: Retained for up to 90 days unless legal obligations require longer."
            ]} />

            {/* 10. GDPR */}
            <SectionHeading id="gdpr">10. Your Rights Under GDPR (European Union Users)</SectionHeading>
            <Paragraph>
              If you are located in the European Economic Area (EEA), the United Kingdom, or Switzerland, you have specific rights under the General Data Protection Regulation (GDPR):
            </Paragraph>

            <SubHeading>10.1 Your Rights</SubHeading>
            <BulletList items={[
              "Right to Access: Request a copy of the personal data we hold about you.",
              "Right to Rectification: Request correction of inaccurate or incomplete personal data.",
              "Right to Erasure ('Right to be Forgotten'): Request deletion of your personal data under certain circumstances.",
              "Right to Restrict Processing: Request that we limit how we use your data.",
              "Right to Data Portability: Receive your data in a structured, machine-readable format.",
              "Right to Object: Object to processing based on legitimate interests or direct marketing.",
              "Right to Withdraw Consent: Withdraw consent at any time where we rely on consent."
            ]} />

            <SubHeading>10.2 Legal Basis for Processing</SubHeading>
            <Paragraph>We process your data based on:</Paragraph>
            <BulletList items={[
              "Consent: For non-essential cookies and personalized advertising (you can withdraw anytime).",
              "Contract Performance: To provide the file conversion service you request.",
              "Legitimate Interests: For analytics, security, and service improvement.",
              "Legal Obligation: To comply with applicable laws."
            ]} />

            <SubHeading>10.3 How to Exercise Your Rights</SubHeading>
            <Paragraph>
              To exercise any of these rights, contact us at <a href="/contact" className="text-primary hover:underline">heicconverteronline.com/contact</a>. We will respond within 30 days.
            </Paragraph>
            <Paragraph>
              If you believe we have not adequately addressed your concerns, you have the right to lodge a complaint with your local Data Protection Authority.
            </Paragraph>

            {/* 11. CCPA */}
            <SectionHeading id="ccpa">11. Your Rights Under CCPA (California Residents)</SectionHeading>
            <Paragraph>
              If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA):
            </Paragraph>

            <SubHeading>11.1 Your Rights</SubHeading>
            <BulletList items={[
              "Right to Know: Request disclosure of what personal information we collect, use, disclose, and sell.",
              "Right to Delete: Request deletion of your personal information, subject to certain exceptions.",
              "Right to Opt-Out: Opt out of the 'sale' or 'sharing' of your personal information.",
              "Right to Correct: Request correction of inaccurate personal information.",
              "Right to Limit: Limit the use and disclosure of sensitive personal information.",
              "Right to Non-Discrimination: We will not discriminate against you for exercising your rights."
            ]} />

            <SubHeading>11.2 Do Not Sell or Share My Personal Information</SubHeading>
            <Paragraph>
              Under the CCPA, the use of certain cookies for targeted advertising may be considered a "sale" or "sharing" of personal information. You can opt out of this by:
            </Paragraph>
            <BulletList items={[
              "Using our cookie consent banner to decline advertising cookies.",
              "Visiting the opt-out links provided in Section 4.3.",
              "Contacting us to submit a 'Do Not Sell or Share' request."
            ]} />

            <SubHeading>11.3 Categories of Information</SubHeading>
            <Paragraph>In the past 12 months, we may have collected:</Paragraph>
            <BulletList items={[
              "Identifiers: IP address (anonymized), device identifiers for analytics.",
              "Internet activity: Browsing history on our site, interactions with the Service.",
              "Contact information: Only if you voluntarily submit it through our contact form."
            ]} />
            <Paragraph>
              To submit a CCPA request, contact us at <a href="/contact" className="text-primary hover:underline">heicconverteronline.com/contact</a>. We may need to verify your identity before processing your request.
            </Paragraph>

            {/* 12. Children's Privacy */}
            <SectionHeading id="children">12. Children's Privacy (COPPA Compliance)</SectionHeading>
            <Paragraph>
              HEIC Converter Online is committed to protecting children's privacy online. Our Service is designed for general audiences and is not directed at children under the age of 13 (or under 16 in certain jurisdictions).
            </Paragraph>

            <SubHeading>12.1 Our Policy on Children</SubHeading>
            <BulletList items={[
              "We do not knowingly collect personal information from children under 13.",
              "We do not knowingly allow children under 13 to use features that would require personal information.",
              "The file conversion service does not require any personal information and can be used anonymously."
            ]} />

            <SubHeading>12.2 Parental Rights</SubHeading>
            <Paragraph>If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. Upon verification, we will:</Paragraph>
            <BulletList items={[
              "Delete the child's personal information from our records.",
              "Take steps to prevent future collection of information from the child.",
              "Provide you with information about what data was collected (if any)."
            ]} />

            <SubHeading>12.3 Contact Form Protection</SubHeading>
            <Paragraph>
              If a child submits information through our contact form, we will delete this information upon discovery or notification. Parents may request deletion by contacting us at <a href="/contact" className="text-primary hover:underline">heicconverteronline.com/contact</a>.
            </Paragraph>

            {/* 13. International */}
            <SectionHeading id="international">13. International Data Transfers</SectionHeading>
            <Paragraph>
              HEIC Converter Online is operated in Canada. If you access the Service from outside Canada, your information may be processed in Canada, where privacy laws may differ from those in your jurisdiction.
            </Paragraph>
            <Paragraph>
              For EU users: Any transfer of data outside the EEA is conducted in compliance with GDPR requirements, including the use of Standard Contractual Clauses where applicable.
            </Paragraph>

            {/* 14. Changes */}
            <SectionHeading id="changes">14. Changes to This Privacy Policy</SectionHeading>
            <Paragraph>
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.
            </Paragraph>
            <Paragraph>
              When we make material changes, we will update the "Last Updated" date at the top of this page and may notify you through a prominent notice on our website. Your continued use of the Service after changes become effective constitutes your acceptance of the updated Privacy Policy.
            </Paragraph>

            {/* 15. Contact */}
            <SectionHeading id="contact">15. Contact Us</SectionHeading>
            <Paragraph>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
            </Paragraph>
            <div className="bg-muted/50 rounded-lg p-6 my-4">
              <p className="font-medium text-foreground mb-2">Contact Form:</p>
              <a href="/contact" className="text-primary hover:underline">heicconverteronline.com/contact</a>
              <p className="text-sm text-muted-foreground mt-4">
                We will make every effort to respond to your inquiry within 30 days.
              </p>
            </div>

            {/* Footer */}
            <div className="mt-10 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                © 2025 HEIC Converter Online. All rights reserved.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                This policy was last updated on December 16, 2025.
              </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};