import { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Upload, FileImage, Download, Loader2, Check, X, Package } from "lucide-react";
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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [outputFormat, setOutputFormat] = useState("jpeg");
  const [converting, setConverting] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [batchMode, setBatchMode] = useState(false);

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
      });

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
            Free HEIC Converter – Convert HEIC to PDF, JPG, or PNG Online
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Upload your HEIC or HEIF photos and convert them to PDF, JPG, or PNG in seconds, no sign-ups, no software, completely free.
          </p>
          <p className="text-base text-muted-foreground max-w-3xl mx-auto">
            HEIC files look great on iPhones, but many devices can't open them. With HEIC Converter Online, you can quickly turn HEIC images into PDF for documents, JPG for universal compatibility, or PNG for lossless quality. Just upload your photos and download the converted files instantly.
          </p>
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
            
            {/* Blog Routes */}
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            
            {/* Static Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            
            {/* Keyword/SEO Pages - Must be last to not override other routes */}
            <Route path="/:slug" element={<KeywordPage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;