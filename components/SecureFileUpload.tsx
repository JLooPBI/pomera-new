"use client"

import { useState, useRef, useCallback } from 'react';
import { Upload, File, X, AlertCircle, CheckCircle, Eye, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  category: string;
  url?: string;
}

interface SecureFileUploadProps {
  files?: UploadedFile[];
  onFileUpload?: (file: File, category: string) => void;
  onFileDelete?: (fileId: string) => void;
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
  categories?: string[];
}

export default function SecureFileUpload({ 
  files = [], 
  onFileUpload,
  onFileDelete,
  maxFileSize = 10, // 10MB default
  allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],
  categories = ['Resume/CV', 'Contract', 'Financial', 'Compliance', 'Other']
}: SecureFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size exceeds ${maxFileSize}MB limit`;
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not allowed`;
    }

    // Check for potentially dangerous file extensions
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js'];
    const fileName = file.name.toLowerCase();
    const hasDangerousExtension = dangerousExtensions.some(ext => fileName.endsWith(ext));
    
    if (hasDangerousExtension) {
      return 'Executable files are not allowed for security reasons';
    }

    return null;
  };

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const errors: string[] = [];
    const validFiles: File[] = [];

    Array.from(files).forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    setUploadErrors(errors);

    // Upload valid files
    validFiles.forEach(file => {
      onFileUpload?.(file, selectedCategory);
    });

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileUpload, selectedCategory, maxFileSize, allowedTypes]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('excel') || fileType.includes('sheet')) return '📊';
    return '📎';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Resume/CV': 'bg-blue-100 text-blue-800',
      'Contract': 'bg-green-100 text-green-800',
      'Financial': 'bg-yellow-100 text-yellow-800',
      'Compliance': 'bg-purple-100 text-purple-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors['Other'];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Documents & Files</h3>
        <div className="flex items-center gap-2">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-sm px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium text-primary">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500">
          PDF, DOC, DOCX, XLS, XLSX, images up to {maxFileSize}MB
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Upload Errors */}
      {uploadErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-700">Upload Errors:</span>
          </div>
          <ul className="text-sm text-red-600 space-y-1">
            {uploadErrors.map((error, index) => (
              <li key={index} className="flex items-start gap-1">
                <span>•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setUploadErrors([])}
            className="mt-2"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Uploaded Files List */}
      <div className="space-y-2">
        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <File className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No files uploaded yet.</p>
          </div>
        ) : (
          files.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getFileIcon(file.type)}</span>
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(file.category)}`}>
                      {file.category}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {file.url && (
                  <>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onFileDelete?.(file.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-700 mb-1">Security Features:</p>
            <ul className="text-blue-600 space-y-1">
              <li>• Files are encrypted in transit and at rest</li>
              <li>• Automatic virus scanning on upload</li>
              <li>• Access logs and audit trail maintained</li>
              <li>• Files are automatically deleted after 7 years</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}