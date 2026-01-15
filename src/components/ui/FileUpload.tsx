import { useTranslation } from 'react-i18next';
import React, { useRef, useState } from 'react';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  acceptedTypes?: string[];
  multiple?: boolean;
  maxFiles?: number;
  maxSizeInMB?: number;
  className?: string;
  label?: string;
  description?: string;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  acceptedTypes = ['image/*'],
  multiple = true,
  maxFiles = 10,
  maxSizeInMB = 5,
  className = '',
  label = 'Subir archivos',
  description = 'Arrastra archivos aquí o haz clic para seleccionar',
  disabled = false
}) => {
  const { t } = useTranslation();
  label = t('uploadFiles', label);
  description = t('dragOrClick', description);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = [];
    let errorMsg = '';

    // Validar número máximo de archivos
    if (files.length > maxFiles) {
      errorMsg = `Máximo ${maxFiles} archivos permitidos`;
      setError(errorMsg);
      return [];
    }

    for (const file of files) {
      // Validar tipo de archivo
      const isValidType = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', '/'));
        }
        // Comparación exacta
        if (file.type === type) return true;
        // También validar por extensión como fallback
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        if (!fileExt) return false;
        // Mapeo de extensiones comunes a tipos MIME
        const extToMime: Record<string, string[]> = {
          'pdf': ['application/pdf', 'application/x-pdf'],
          'doc': ['application/msword'],
          'docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
          'xls': ['application/vnd.ms-excel'],
          'xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
          'ppt': ['application/vnd.ms-powerpoint'],
          'pptx': ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
          'jpg': ['image/jpeg'],
          'jpeg': ['image/jpeg'],
          'png': ['image/png'],
          'txt': ['text/plain']
        };
        const validMimesForExt = extToMime[fileExt] || [];
        return validMimesForExt.includes(type);
      });

      if (!isValidType) {
        errorMsg = `Tipo de archivo no válido: ${file.type || 'desconocido'} (${file.name})`;
        continue;
      }

      // Validar tamaño
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > maxSizeInMB) {
        errorMsg = `Archivo demasiado grande: ${file.name} (${fileSizeInMB.toFixed(1)}MB)`;
        continue;
      }

      validFiles.push(file);
    }

    if (errorMsg) {
      setError(errorMsg);
    } else {
      setError(null);
    }

    return validFiles;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const fileArray = Array.from(files);
    const validFiles = validateFiles(fileArray);
    
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  return (
    <div className={className}>
      <div
        className={`
          border border-dashed rounded-md p-4 text-center cursor-pointer
          transition-colors duration-200
          ${isDragOver 
            ? 'border-blue-300 bg-blue-50' 
            : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
          }
          ${error ? 'border-red-300 bg-red-50' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && !disabled && handleClick()}
        role="button"
        tabIndex={0}
      >
        {/* Icono */}
        <div className="mb-3">
          <svg 
            className="w-9 h-9 mx-auto text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
        </div>

        {/* Texto principal */}
        <div className="mb-1.5">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>

        {/* Información adicional */}
        <div className="text-[11px] text-gray-400">
          <p>Archivos permitidos: {acceptedTypes.join(', ')}</p>
          <p>Tamaño máximo: {maxSizeInMB}MB por archivo</p>
          {multiple && <p>Máximo {maxFiles} archivos</p>}
        </div>
      </div>

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={acceptedTypes.map(type => {
          // Convertir tipos MIME a extensiones para el atributo accept
          if (type === 'application/pdf') return '.pdf';
          if (type === 'application/msword') return '.doc';
          if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return '.docx';
          if (type === 'application/vnd.ms-excel') return '.xls';
          if (type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return '.xlsx';
          if (type === 'application/vnd.ms-powerpoint') return '.ppt';
          if (type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') return '.pptx';
          if (type === 'image/jpeg') return '.jpg,.jpeg';
          if (type === 'image/png') return '.png';
          if (type === 'text/plain') return '.txt';
          return type;
        }).join(',')}
        multiple={multiple}
        onChange={handleInputChange}
        disabled={disabled}
      />

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;