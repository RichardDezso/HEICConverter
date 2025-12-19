'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';
import { Upload, FileImage, Download, Loader2, Check, X, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

export function ConverterTool() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [outputFormat, setOutputFormat] = useState('jpeg');
  const [converting, setConverting] = useState(false);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [batchMode, setBatchMode] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [conversionStage, setConversionStage] = useState('');

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    const heicFiles = files.filter(file => 
      file.name.toLowerCase().endsWith('.heic') || 
      file.name.toLowerCase().endsWith('.heif')
    );
    
    if (heicFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...heicFiles]);
      setConvertedFiles([]);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const heicFiles = files.filter(file => 
      file.name.toLowerCase().endsWith('.heic') || 
      file.name.toLowerCase().endsWith('.heif')
    );
    
    if (heicFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...heicFiles]);
      setConvertedFiles([]);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const convertFiles = async () => {
    if (selectedFiles.length === 0) return;
    
    setConverting(true);
    setConversionStage('uploading');
    setUploadProgress(0);
    const results = [];
    
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('output_format', outputFormat);
        
        const response = await axios.post(`${API}/convert`, formData, {
          responseType: 'blob',
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setUploadProgress(progress);
          }
        });
        
        setConversionStage('processing');
        
        const extension = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
        const fileName = file.name.replace(/\.(heic|heif)$/i, `.${extension}`);
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const url = URL.createObjectURL(blob);
        
        results.push({ name: fileName, url, blob });
      }
      
      setConversionStage('complete');
      setConvertedFiles(results);
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Conversion failed. Please try again.');
    } finally {
      setConverting(false);
      setUploadProgress(0);
      setConversionStage('');
    }
  };

  const downloadFile = (file) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  const downloadAll = async () => {
    if (convertedFiles.length === 1) {
      downloadFile(convertedFiles[0]);
      return;
    }
    
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    
    convertedFiles.forEach(file => {
      zip.file(file.name, file.blob);
    });
    
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted-images.zip';
    link.click();
  };

  const clearAll = () => {
    setSelectedFiles([]);
    setConvertedFiles([]);
  };

  return (
    <Card className="shadow-xl border-2">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Convert Your HEIC Files</CardTitle>
        <CardDescription>Upload HEIC images and convert them to JPG, PNG, or PDF</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
        >
          <input
            type="file"
            accept=".heic,.heif"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium">Drop HEIC files here or click to upload</p>
            <p className="text-sm text-muted-foreground mt-2">Supports .heic and .heif files</p>
          </label>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{selectedFiles.length} file(s) selected</span>
              <Button variant="ghost" size="sm" onClick={clearAll}>Clear all</Button>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <FileImage className="w-4 h-4" />
                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Format Selection */}
        <div className="flex items-center gap-4">
          <span className="font-medium">Output format:</span>
          <div className="flex gap-2">
            {['jpeg', 'png', 'pdf'].map(format => (
              <Button
                key={format}
                variant={outputFormat === format ? 'default' : 'outline'}
                size="sm"
                onClick={() => setOutputFormat(format)}
              >
                {format.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        {converting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="capitalize">{conversionStage}...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Convert Button */}
        <Button 
          onClick={convertFiles} 
          disabled={selectedFiles.length === 0 || converting}
          className="w-full"
          size="lg"
        >
          {converting ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Converting...</>
          ) : (
            <>Convert {selectedFiles.length > 0 ? `${selectedFiles.length} File(s)` : 'Files'}</>
          )}
        </Button>

        {/* Converted Files */}
        {convertedFiles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                {convertedFiles.length} file(s) converted
              </span>
              <Button onClick={downloadAll} size="sm">
                <Package className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>
            <div className="space-y-2">
              {convertedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <Button variant="outline" size="sm" onClick={() => downloadFile(file)}>
                    <Download className="w-4 h-4 mr-2" /> Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
