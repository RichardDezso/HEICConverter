import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Upload, FileImage, Download, Loader2, Check, X, Package, CheckCircle, Users, Briefcase, GraduationCap, Smartphone, Quote, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { KeywordPage } from "@/components/KeywordPage";
import { AboutPage, ContactPage, PrivacyPage } from "@/components/StaticPage";
import { BlogListPage } from "@/components/Blog";
import { BlogPostPage } from "@/components/BlogPost";
import { FAQPage } from "@/components/FAQPage";
import { AdminLogin } from "@/components/Admin/AdminLogin";
import { AdminDashboard } from "@/components/Admin/AdminDashboard";
import { PostEditor } from "@/components/Admin/PostEditor";
import { DisplayAd } from "@/components/AdUnit";
import { Navigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [outputFormat, setOutputFormat] = useState("jpeg");
  const [converting, setConverting] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [batchMode, setBatchMode] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [conversionStage, setConversionStage] = useState(''); // 'uploading', 'processing', 'complete'

  // Add FAQ Schema for SEO
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a HEIC file?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "HEIC is the default image format used by modern iPhones. It saves space while keeping image quality high."
          }
        },
        {
          "@type": "Question",
          "name": "How do I convert HEIC to PDF, JPG, or PNG?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Upload your HEIC files to this tool, choose your format, and download the converted images instantly."
          }
        },
        {
          "@type": "Question",
          "name": "Is this HEIC converter free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. All conversions are free and happen directly in your browser."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use this on Windows or Android?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. HEIC Converter Online works on any modern device and browser."
          }
        },
        {
          "@type": "Question",
          "name": "Will converting HEIC reduce quality?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "PNG keeps lossless quality; JPG compresses slightly; PDF preserves resolution for printing and sharing."
          }
        }
      ]
    };

    // Create or update script tag for FAQ schema
    let script = document.getElementById('faq-schema');
    if (!script) {
      script = document.createElement('script');
      script.id = 'faq-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(faqSchema);

    // Cleanup function to remove script when component unmounts
    return () => {
      const existingScript = document.getElementById('faq-schema');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => 
      file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')
    );
    
    if (validFiles.length === 0) {
      toast.error("Please select HEIC or HEIF files");
      return;
    }
    
    if (validFiles.length !== files.length) {
      toast.warning(`${files.length - validFiles.length} non-HEIC file(s) skipped`);
    }
    
    setSelectedFiles(validFiles);
    setConvertedFiles([]);
    
    if (validFiles.length > 1) {
      setBatchMode(true);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const validFiles = files.filter(file => 
      file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')
    );
    
    if (validFiles.length === 0) {
      toast.error("Please select HEIC or HEIF files");
      return;
    }
    
    if (validFiles.length !== files.length) {
      toast.warning(`${files.length - validFiles.length} non-HEIC file(s) skipped`);
    }
    
    setSelectedFiles(validFiles);
    setConvertedFiles([]);
    
    if (validFiles.length > 1) {
      setBatchMode(true);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    
    if (newFiles.length <= 1) {
      setBatchMode(false);
    }
  };

  const handleConvertBatch = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files first");
      return;
    }

    setConverting(true);
    setUploadProgress(0);
    setConversionStage('uploading');
    
    const formData = new FormData();
    
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });
    formData.append('output_format', outputFormat);

    try {
      const response = await axios.post(`${API}/convert-batch`, formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
          if (percentCompleted === 100) {
            setConversionStage('processing');
          }
        },
      });

      setConversionStage('complete');

      // Handle ZIP file download
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'converted_files.zip';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast.success(`${selectedFiles.length} files converted successfully! Check your downloads.`);
      
      // Reset after successful conversion
      setTimeout(() => {
        setSelectedFiles([]);
        setBatchMode(false);
        setUploadProgress(0);
        setConversionStage('');
      }, 1000);
      
    } catch (error) {
      console.error('Error converting files:', error);
      
      let errorMessage = "Failed to convert files";
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const errorData = JSON.parse(text);
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          errorMessage = "Failed to convert files";
        }
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setConverting(false);
    }
  };

  const handleConvertSingle = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select a file first");
      return;
    }

    setConverting(true);
    const formData = new FormData();
    formData.append('file', selectedFiles[0]);
    formData.append('output_format', outputFormat);

    try {
      const response = await axios.post(`${API}/convert`, formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // response.data is already a blob due to responseType: 'blob'
      const url = window.URL.createObjectURL(response.data);
      const extension = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
      const filename = `${selectedFiles[0].name.replace(/\.[^/.]+$/, '')}.${extension}`;
      
      setConvertedFiles([{ url, filename }]);
      toast.success(`File converted successfully to ${outputFormat.toUpperCase()}!`);
    } catch (error) {
      console.error('Error converting file:', error);
      
      // Handle blob error responses
      let errorMessage = "Failed to convert file";
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const errorData = JSON.parse(text);
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          errorMessage = "Failed to convert file";
        }
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setConverting(false);
    }
  };

  const handleConvert = () => {
    if (batchMode || selectedFiles.length > 1) {
      handleConvertBatch();
    } else {
      handleConvertSingle();
    }
  };

  const handleDownload = (convertedFile) => {
    if (!convertedFile) {
      toast.error('No file to download');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = convertedFile.url;
      link.download = convertedFile.filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
      
      toast.success('Download started! Check your downloads folder.');
      
      console.log('Download initiated:', convertedFile.filename);
    } catch (error) {
      console.error('Download error:', error);
      
      try {
        window.open(convertedFile.url, '_blank');
        toast.info('Opening file in new tab. Right-click to save.');
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        toast.error('Failed to download. Please try a different browser.');
      }
    }
  };

  const resetConverter = () => {
    // Clean up blob URLs to prevent memory leaks
    convertedFiles.forEach(file => {
      if (file?.url) {
        window.URL.revokeObjectURL(file.url);
      }
    });
    
    setSelectedFiles([]);
    setConvertedFiles([]);
    setOutputFormat("jpeg");
    setBatchMode(false);
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Free HEIC Converter: Convert HEIC to PDF, JPG, or PNG Online
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Upload your HEIC or HEIF photos and convert them to PDF, JPG, or PNG in seconds, no sign-ups, no software, completely free.
          </p>
          <p className="text-base text-muted-foreground max-w-3xl mx-auto">
            HEIC files look great on iPhones, but many devices can't open them. With HEIC Converter Online, you can quickly turn HEIC images into PDF for documents, JPG for universal compatibility, or PNG for lossless quality. Just upload your photos and download the converted files instantly.
          </p>
        </div>

        {/* Ad Placement - Homepage Top Banner */}
        <div className="my-8">
          <DisplayAd slot="8498373823" />
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Upload HEIC Files</CardTitle>
            <CardDescription>
              {batchMode 
                ? "Select multiple HEIC/HEIF files for batch conversion"
                : "Select HEIC or HEIF files and choose your desired output format"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload Area */}
            <div
              data-testid="file-upload-area"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer"
              onClick={() => document.getElementById('file-input').click()}
            >
              <input
                id="file-input"
                data-testid="file-input"
                type="file"
                accept=".heic,.heif"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-4">
                {selectedFiles.length > 0 ? (
                  <>
                    <Package className="w-16 h-16 text-primary" />
                    <div>
                      <p className="font-medium text-lg">
                        {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total size: {(selectedFiles.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="w-16 h-16 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-lg">Drop your HEIC/HEIF files here</p>
                      <p className="text-sm text-muted-foreground">or click to browse (supports multiple files)</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Selected Files</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      data-testid={`file-item-${index}`}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileImage className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        data-testid={`remove-file-${index}`}
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Format Selection */}
            {selectedFiles.length > 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Output Format</label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger data-testid="format-selector">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jpeg" data-testid="format-jpeg">JPEG</SelectItem>
                      <SelectItem value="png" data-testid="format-png">PNG</SelectItem>
                      <SelectItem value="pdf" data-testid="format-pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Convert Button */}
                <div className="flex gap-3">
                  <Button
                    data-testid="convert-button"
                    onClick={handleConvert}
                    disabled={converting}
                    className="flex-1"
                    size="lg"
                  >
                    {converting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-5 w-5" />
                        Convert {batchMode ? `${selectedFiles.length} Files` : 'to ' + outputFormat.toUpperCase()}
                      </>
                    )}
                  </Button>
                  <Button
                    data-testid="reset-button"
                    variant="outline"
                    onClick={resetConverter}
                    size="lg"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            )}

            {/* Download Section (Single File) */}
            {convertedFiles.length > 0 && !batchMode && (
              <div data-testid="download-section" className="pt-6 border-t">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Conversion Complete!</p>
                      <p className="text-sm text-muted-foreground">{convertedFiles[0].filename}</p>
                    </div>
                  </div>
                  <Button
                    data-testid="download-button"
                    onClick={() => handleDownload(convertedFiles[0])}
                    size="lg"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">JPEG Conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Convert HEIC to JPG format for fast sharing, social uploads, Windows compatibility, and smaller file sizes.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">PNG Conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Convert HEIC to PNG for transparent backgrounds, crisp detail, and high-quality, lossless image output.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">PDF Conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Convert HEIC to PDF for easy printing, attaching to documents, and sharing photos in a format that opens everywhere.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-12">How to Convert HEIC to PDF, JPG, or PNG</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Upload your HEIC files</h3>
                <p className="text-muted-foreground">Drag and drop your photos or click to browse.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Choose your format</h3>
                <p className="text-muted-foreground">Select PDF, JPG, or PNG.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Download instantly</h3>
                <p className="text-muted-foreground">Your converted files are ready in a few seconds.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Why Use This Tool Section */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-12">Why Use HEIC Converter Online?</h2>
          <Card className="shadow-lg">
            <CardContent className="pt-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">100% free HEIC to PDF, JPG, and PNG conversion</h3>
                    <p className="text-sm text-muted-foreground">No hidden charges, unlimited conversions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">No software installs or sign-ups</h3>
                    <p className="text-sm text-muted-foreground">Works directly in your browser</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Fast processing, clean interface</h3>
                    <p className="text-sm text-muted-foreground">Convert files in seconds with an intuitive design</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Works on Mac, Windows, iPhone, and Android</h3>
                    <p className="text-sm text-muted-foreground">Universal compatibility across all devices</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Multiple file upload support</h3>
                    <p className="text-sm text-muted-foreground">Convert multiple HEIC files at once</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Privacy-focused</h3>
                    <p className="text-sm text-muted-foreground">Your files are processed securely and removed after conversion</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Who Uses This Tool Section */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-4">Who Uses HEIC Converter Online?</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our free HEIC converter helps thousands of users every day. Here's who benefits most from our tool.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileImage className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Photographers</h3>
                <p className="text-sm text-muted-foreground">
                  Convert client photos from iPhone shoots to universally shareable JPG or archival PDF formats.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Business Users</h3>
                <p className="text-sm text-muted-foreground">
                  Process receipts, product photos, and documentation for expense reports and presentations.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Students</h3>
                <p className="text-sm text-muted-foreground">
                  Convert assignment photos and research images to PDF for easy submission to school systems.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Everyday Users</h3>
                <p className="text-sm text-muted-foreground">
                  Share iPhone photos with Windows and Android friends who can't open HEIC files.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Format Comparison Table */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-4">HEIC vs Other Formats: Which Should You Choose?</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Not sure which format to convert to? This comparison helps you pick the right one for your needs.
          </p>
          <Card className="shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold">HEIC</th>
                    <th className="px-6 py-4 text-center font-semibold">JPG</th>
                    <th className="px-6 py-4 text-center font-semibold">PNG</th>
                    <th className="px-6 py-4 text-center font-semibold">PDF</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-6 py-4 font-medium">File Size</td>
                    <td className="px-6 py-4 text-center text-green-600">Smallest</td>
                    <td className="px-6 py-4 text-center">Small</td>
                    <td className="px-6 py-4 text-center text-orange-600">Large</td>
                    <td className="px-6 py-4 text-center">Medium</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="px-6 py-4 font-medium">Image Quality</td>
                    <td className="px-6 py-4 text-center text-green-600">Excellent</td>
                    <td className="px-6 py-4 text-center">Good</td>
                    <td className="px-6 py-4 text-center text-green-600">Excellent</td>
                    <td className="px-6 py-4 text-center text-green-600">Excellent</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Compatibility</td>
                    <td className="px-6 py-4 text-center text-orange-600">Apple Only</td>
                    <td className="px-6 py-4 text-center text-green-600">Universal</td>
                    <td className="px-6 py-4 text-center text-green-600">Universal</td>
                    <td className="px-6 py-4 text-center text-green-600">Universal</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="px-6 py-4 font-medium">Transparency</td>
                    <td className="px-6 py-4 text-center">Yes</td>
                    <td className="px-6 py-4 text-center text-red-500">No</td>
                    <td className="px-6 py-4 text-center text-green-600">Yes</td>
                    <td className="px-6 py-4 text-center text-red-500">No</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Best For</td>
                    <td className="px-6 py-4 text-center text-sm">iPhone storage</td>
                    <td className="px-6 py-4 text-center text-sm">Web & sharing</td>
                    <td className="px-6 py-4 text-center text-sm">Graphics & logos</td>
                    <td className="px-6 py-4 text-center text-sm">Documents & printing</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Testimonials Section */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-4">What Our Users Say</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join thousands of satisfied users who convert their HEIC files with us every day.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <Quote className="w-8 h-8 text-primary/30 mb-4" />
                <p className="text-muted-foreground mb-4">
                  "Finally, my Windows PC can open iPhone photos! This tool is a lifesaver. Fast, free, and just works."
                </p>
                <p className="font-semibold">— Sarah M.</p>
                <p className="text-sm text-muted-foreground">Windows User</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Quote className="w-8 h-8 text-primary/30 mb-4" />
                <p className="text-muted-foreground mb-4">
                  "Batch conversion saved me hours of work. I converted 50 product photos in minutes instead of one by one."
                </p>
                <p className="font-semibold">— James L.</p>
                <p className="text-sm text-muted-foreground">E-commerce Seller</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Quote className="w-8 h-8 text-primary/30 mb-4" />
                <p className="text-muted-foreground mb-4">
                  "Simple and clean interface. No annoying ads or confusing options. Exactly what I needed for my school project."
                </p>
                <p className="font-semibold">— Emily R.</p>
                <p className="text-sm text-muted-foreground">College Student</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Guides Section */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-center mb-4">Learn More About HEIC Conversion</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Explore our in-depth guides to get the most out of your HEIC files.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/guides/what-is-heic-file-complete-guide'}>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">What Is a HEIC File?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  A complete guide to Apple's modern photo format and why it matters.
                </p>
                <span className="text-primary text-sm font-medium flex items-center gap-1">
                  Read Guide <ArrowRight className="w-4 h-4" />
                </span>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/guides/heic-to-pdf-converter'}>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">HEIC to PDF Converter Guide</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn how to convert HEIC images to PDF for documents and printing.
                </p>
                <span className="text-primary text-sm font-medium flex items-center gap-1">
                  Read Guide <ArrowRight className="w-4 h-4" />
                </span>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/guides/how-to-batch-convert-heic-to-pdf'}>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Batch Convert Multiple Files</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Save time by converting dozens of HEIC files at once.
                </p>
                <span className="text-primary text-sm font-medium flex items-center gap-1">
                  Read Guide <ArrowRight className="w-4 h-4" />
                </span>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Ad Placement - Above FAQ */}
        <div className="mt-20 mb-16 max-w-4xl mx-auto">
          <DisplayAd slot="YOUR_AD_SLOT_ID" className="mb-12" />
        </div>

        {/* FAQ Section */}
        <div className="mt-20 mb-16">
          <h2 className="text-4xl font-bold text-center mb-12">HEIC Converter FAQ</h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">What is a HEIC file?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">HEIC is the default image format used by modern iPhones. It saves space while keeping image quality high.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">How do I convert HEIC to PDF, JPG, or PNG?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Upload your HEIC files to this tool, choose your format, and download the converted images instantly.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Is this HEIC converter free?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Yes. All conversions are free and happen directly in your browser.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Can I use this on Windows or Android?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Yes. HEIC Converter Online works on any modern device and browser.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Will converting HEIC reduce quality?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">PNG keeps lossless quality; JPG compresses slightly; PDF preserves resolution for printing and sharing.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Why are my iPhone photos in HEIC format?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Apple introduced HEIC with iOS 11 to save storage space. HEIC files are about 50% smaller than JPG while maintaining the same quality, helping you store more photos on your iPhone.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Can I convert multiple HEIC files at once?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">There's no hard limit. Users regularly convert 50+ standard iPhone photos at once. For very large files (48MP ProRAW), we recommend batches of 20-30 files. Performance depends on file sizes, your browser, and internet speed.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Is my data secure when using this converter?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Absolutely. Your files are processed securely on our servers and automatically deleted immediately after conversion. We never store, share, or access your images.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">What's the maximum file size I can convert?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Our converter handles files up to 50MB per image, which covers even the highest resolution photos from iPhone Pro models with 48MP cameras.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">How long does conversion take?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Most conversions complete in just a few seconds. Larger files or batch conversions may take slightly longer depending on file sizes and your internet connection.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App flex flex-col min-h-screen">
      <BrowserRouter>
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Guides Routes */}
            <Route path="/guides" element={<BlogListPage />} />
            <Route path="/guides/:id" element={<BlogPostPage />} />
            
            {/* Redirect old blog URLs to guides */}
            <Route path="/blog" element={<Navigate to="/guides" replace />} />
            <Route path="/blog/:id" element={<Navigate to="/guides/:id" replace />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/post/new" element={<PostEditor />} />
            <Route path="/admin/post/edit/:id" element={<PostEditor />} />
            
            {/* Static Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/faq" element={<FAQPage />} />
            
            {/* Keyword/SEO Pages - Includes converter guide pages, must be last */}
            <Route path="/:slug" element={<KeywordPage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;