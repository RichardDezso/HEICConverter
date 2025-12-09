import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Upload, FileImage, Download, Loader2, Check, X, Package, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { DisplayAd } from "@/components/AdUnit";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const ConverterGuidePage = ({ postId, pageTitle, pageDescription, relatedPages = [] }) => {
  const navigate = useNavigate();
  const [postContent, setPostContent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Converter state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [outputFormat, setOutputFormat] = useState("pdf"); // Default to PDF for these pages
  const [converting, setConverting] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [batchMode, setBatchMode] = useState(false);

  // Fetch blog post content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`${API}/blog/posts/${postId}`);
        setPostContent(response.data);
        
        // Set page meta
        document.title = pageTitle || response.data.title;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && response.data.metaDescription) {
          metaDescription.setAttribute('content', response.data.metaDescription);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, [postId, pageTitle]);

  // Converter functions (same as Home component)
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
      
      toast.success(`${selectedFiles.length} files converted successfully!`);
      
      setTimeout(() => {
        setSelectedFiles([]);
        setBatchMode(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error converting files:', error);
      toast.error("Failed to convert files");
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

      const url = window.URL.createObjectURL(response.data);
      const extension = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
      const filename = `${selectedFiles[0].name.replace(/\.[^/.]+$/, '')}.${extension}`;
      
      setConvertedFiles([{ url, filename }]);
      toast.success(`File converted successfully to ${outputFormat.toUpperCase()}!`);
    } catch (error) {
      console.error('Error converting file:', error);
      toast.error("Failed to convert file");
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
    const link = document.createElement('a');
    link.href = convertedFile.url;
    link.download = convertedFile.filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
    
    toast.success('Download started!');
  };

  const resetConverter = () => {
    convertedFiles.forEach(file => {
      if (file?.url) {
        window.URL.revokeObjectURL(file.url);
      }
    });
    
    setSelectedFiles([]);
    setConvertedFiles([]);
    setOutputFormat("pdf");
    setBatchMode(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Header with back button */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Main Converter
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            {pageTitle || postContent?.title}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
            {pageDescription || postContent?.excerpt}
          </p>
        </div>

        {/* Ad Placement - Top */}
        <div className="mb-8">
          <DisplayAd slot="top-converter-ad" />
        </div>

        {/* Converter Tool */}
        <Card className="shadow-lg mb-12">
          <CardHeader>
            <CardTitle>Convert Your HEIC Files</CardTitle>
            <CardDescription>
              Upload HEIC/HEIF files and convert them to PDF, JPG, or PNG
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer"
              onClick={() => document.getElementById('file-input-guide').click()}
            >
              <input
                id="file-input-guide"
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
                        Total: {(selectedFiles.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="w-16 h-16 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-lg">Drop HEIC files here</p>
                      <p className="text-sm text-muted-foreground">or click to browse</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Selected Files</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
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
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Button
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
                    variant="outline"
                    onClick={resetConverter}
                    size="lg"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            )}

            {/* Download Section */}
            {convertedFiles.length > 0 && !batchMode && (
              <div className="pt-6 border-t">
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

        {/* Ad Placement - Mid */}
        <div className="my-12">
          <DisplayAd slot="mid-content-ad" />
        </div>

        {/* SEO Content */}
        {postContent && (
          <div className="prose prose-lg max-w-none mb-12">
            <Card className="shadow-lg">
              <CardContent className="pt-8">
                <div 
                  className="text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: postContent.content }}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Ad Placement - Bottom */}
        <div className="my-12">
          <DisplayAd slot="bottom-content-ad" />
        </div>

        {/* Related Pages */}
        {relatedPages.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Guides</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedPages.map((page, index) => (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(page.path)}
                >
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">{page.title}</h3>
                    <p className="text-sm text-muted-foreground">{page.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
