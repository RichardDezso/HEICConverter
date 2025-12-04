import { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Upload, FileImage, Download, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState("jpeg");
  const [converting, setConverting] = useState(false);
  const [convertedFile, setConvertedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.heic') && !file.name.toLowerCase().endsWith('.heif')) {
        toast.error("Please select a HEIC or HEIF file");
        return;
      }
      setSelectedFile(file);
      setConvertedFile(null);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.heic') && !file.name.toLowerCase().endsWith('.heif')) {
        toast.error("Please select a HEIC or HEIF file");
        return;
      }
      setSelectedFile(file);
      setConvertedFile(null);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setConverting(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('output_format', outputFormat);

    try {
      const response = await axios.post(`${API}/convert`, formData, {
        params: { output_format: outputFormat },
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const extension = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
      const filename = `${selectedFile.name.replace(/\.[^/.]+$/, '')}.${extension}`;
      
      setConvertedFile({ url, filename });
      toast.success(`File converted successfully to ${outputFormat.toUpperCase()}!`);
    } catch (error) {
      console.error('Error converting file:', error);
      toast.error(error.response?.data?.detail || "Failed to convert file");
    } finally {
      setConverting(false);
    }
  };

  const handleDownload = () => {
    if (convertedFile) {
      const link = document.createElement('a');
      link.href = convertedFile.url;
      link.download = convertedFile.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetConverter = () => {
    setSelectedFile(null);
    setConvertedFile(null);
    setPreviewUrl(null);
    setOutputFormat("jpeg");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            HEIC Converter
          </h1>
          <p className="text-lg text-muted-foreground">
            Convert your HEIC files to JPEG, PNG, or PDF format instantly
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Upload HEIC File</CardTitle>
            <CardDescription>
              Select a HEIC or HEIF file and choose your desired output format
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
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-4">
                {selectedFile ? (
                  <>
                    <FileImage className="w-16 h-16 text-primary" />
                    <div>
                      <p className="font-medium text-lg">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="w-16 h-16 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-lg">Drop your HEIC file here</p>
                      <p className="text-sm text-muted-foreground">or click to browse</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Format Selection */}
            {selectedFile && (
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
                        Convert to {outputFormat.toUpperCase()}
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

            {/* Download Section */}
            {convertedFile && (
              <div data-testid="download-section" className="pt-6 border-t">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Conversion Complete!</p>
                      <p className="text-sm text-muted-foreground">{convertedFile.filename}</p>
                    </div>
                  </div>
                  <Button
                    data-testid="download-button"
                    onClick={handleDownload}
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
                Convert HEIC to JPEG format for universal compatibility
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">PNG Conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Convert HEIC to PNG format with lossless quality
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">PDF Conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Convert HEIC to PDF format for easy document sharing
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
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;