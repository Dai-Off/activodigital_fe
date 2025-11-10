import { useTranslation } from 'react-i18next';
import React, { useState, useCallback } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { uploadBuildingImage, deleteBuildingImage } from '../../services/imageUpload';
import { BuildingsApiService, type BuildingImage } from '../../services/buildingsApi';
import FileUpload from './FileUpload';

interface ImageManagerProps {
  buildingId: string;
  existingImages: BuildingImage[];
  onImagesUpdated: (images: BuildingImage[]) => void;
  maxImages?: number;
  allowMainImageSelection?: boolean;
  className?: string;
}

const ImageManager: React.FC<ImageManagerProps> = ({
  buildingId,
  existingImages,
  onImagesUpdated,
  maxImages = 10,
  allowMainImageSelection = true,
  className = ''
}) => {
  const { t } = useTranslation();
  const { showSuccess, showError, showInfo } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Manejar subida de nuevas imágenes
  const handleFilesSelected = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    // Verificar límite de imágenes
    if (existingImages.length + files.length > maxImages) {
      showError(
        t('imageLimitExceeded', 'Límite de imágenes excedido'),
        t('maxImagesMsg', {
          max: maxImages,
          current: existingImages.length,
          defaultValue: 'Solo puedes subir hasta {{max}} imágenes. Actualmente tienes {{current}}.',
        })
      );
      return;
    }

    setIsUploading(true);
    showInfo(t('uploadingImages', 'Subiendo imágenes...'), t('imagesProcessing', 'Las imágenes se están procesando'));

    try {
      const uploadPromises = files.map((file, index) => {
        // La primera imagen será principal solo si no hay imágenes existentes
        const isMain = existingImages.length === 0 && index === 0;
        return uploadBuildingImage(file, buildingId, isMain);
      });

      const uploadResults = await Promise.all(uploadPromises);

      // Verificar resultados
      const successfulUploads = uploadResults.filter(result => result.success && result.image);
      const failedUploads = uploadResults.filter(result => !result.success);

      if (failedUploads.length > 0) {
        console.warn('Algunas imágenes no se pudieron subir:', failedUploads);
        showError(
          t('someImagesError', 'Error en algunas imágenes'),
          t('someImagesErrorMsg', {
            failed: failedUploads.length,
            total: uploadResults.length,
            defaultValue: '{{failed}} de {{total}} imágenes no se pudieron subir.',
          })
        );
      }

      if (successfulUploads.length > 0) {
        // Convertir a formato BuildingImage
        const newBuildingImages: BuildingImage[] = successfulUploads.map(result => ({
          id: result.image!.id,
          url: result.image!.url,
          title: result.image!.filename,
          filename: result.image!.filename,
          isMain: result.image!.isMain,
          uploadedAt: result.image!.uploadedAt.toISOString()
        }));

        // Actualizar en el backend
        await BuildingsApiService.uploadBuildingImages(buildingId, newBuildingImages);

        // Actualizar estado local
        const updatedImages = [...existingImages, ...newBuildingImages];
        onImagesUpdated(updatedImages);

        showSuccess(
          t('imageManager.uploadSuccessTitle', 'Imágenes subidas'),
          t('imageManager.uploadSuccessMessage', {
            count: successfulUploads.length,
            defaultValue: '{{count}} imagen(es) subida(s) correctamente.',
          })
        );
      }

    } catch (error) {
      console.error('Error subiendo imágenes:', error);
      showError(
        t('imageManager.uploadErrorTitle', 'Error subiendo imágenes'),
        error instanceof Error ? error.message : t('common.unknownError', 'Error desconocido')
      );
    } finally {
      setIsUploading(false);
    }
  }, [buildingId, existingImages, maxImages, onImagesUpdated, showError, showInfo, showSuccess]);

  // Manejar eliminación de imagen
  const handleDeleteImage = useCallback(async (imageId: string, imageUrl: string) => {
    if (!confirm(t('imageManager.confirmDelete', '¿Estás seguro de que quieres eliminar esta imagen?'))) {
      return;
    }

    setIsDeleting(imageId);
    
    try {
      // Eliminar de Supabase Storage
      const deleteResult = await deleteBuildingImage(imageUrl);
      
      if (!deleteResult.success) {
        throw new Error(deleteResult.error || 'Error eliminando imagen');
      }

      // Eliminar del backend
      await BuildingsApiService.deleteBuildingImage(buildingId, imageId);

      // Actualizar estado local
      const updatedImages = existingImages.filter(img => img.id !== imageId);
      
      // Si se eliminó la imagen principal, establecer la primera como principal
      const deletedImage = existingImages.find(img => img.id === imageId);
      if (deletedImage?.isMain && updatedImages.length > 0) {
        // Actualizar la primera imagen como principal en el backend
        const firstImage = updatedImages[0];
        await BuildingsApiService.updateBuilding(buildingId, {
          images: updatedImages.map(img => ({
            ...img,
            isMain: img.id === firstImage.id
          }))
        });
        
        // Actualizar estado local
        updatedImages[0].isMain = true;
      }

      onImagesUpdated(updatedImages);
      showSuccess(
        t('imageManager.deleteSuccessTitle', 'Imagen eliminada'),
        t('imageManager.deleteSuccessMessage', 'La imagen se ha eliminado correctamente.')
      );

    } catch (error) {
      console.error('Error eliminando imagen:', error);
      showError(
        t('imageManager.deleteErrorTitle', 'Error eliminando imagen'),
        error instanceof Error ? error.message : t('common.unknownError', 'Error desconocido')
      );
    } finally {
      setIsDeleting(null);
    }
  }, [buildingId, existingImages, onImagesUpdated, showError, showSuccess]);

  // Manejar cambio de imagen principal
  const handleSetMainImage = useCallback(async (imageId: string) => {
    if (!allowMainImageSelection) return;

    try {
      // Actualizar todas las imágenes para que solo la seleccionada sea principal
      const updatedImages = existingImages.map(img => ({
        ...img,
        isMain: img.id === imageId
      }));

      // Actualizar en el backend
      await BuildingsApiService.updateBuilding(buildingId, {
        images: updatedImages
      });

      // Actualizar estado local
      onImagesUpdated(updatedImages);
      showSuccess(
        t('imageManager.updateMainSuccessTitle', 'Imagen principal actualizada'),
        t('imageManager.updateMainSuccessMessage', 'La imagen principal se ha cambiado correctamente.')
      );

    } catch (error) {
      console.error('Error actualizando imagen principal:', error);
      showError(
        t('imageManager.updateMainErrorTitle', 'Error actualizando imagen principal'),
        error instanceof Error ? error.message : t('common.unknownError', 'Error desconocido')
      );
    }
  }, [allowMainImageSelection, buildingId, existingImages, onImagesUpdated, showError, showSuccess]);

  // Nota: no usamos mainImage directamente; calculamos por imagen al renderizar
  const canUploadMore = existingImages.length < maxImages;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Subida de archivos */}
      {canUploadMore && (
        <FileUpload
          onFilesSelected={handleFilesSelected}
          acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
          maxFiles={maxImages - existingImages.length}
          maxSizeInMB={10}
          label={t('imageManager.uploadLabel', 'Subir imágenes')}
          description={t('imageManager.uploadDescription', 'Arrastra imágenes aquí o haz clic para seleccionar')}
          disabled={isUploading}
        />
      )}

      {/* Estado de carga */}
      {isUploading && (
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">{t('imageManager.uploading', 'Subiendo imágenes...')}</span>
        </div>
      )}

      {/* Grid de imágenes */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {existingImages.map((image) => {
            const isMain = image.isMain;
            const isDeletingThis = isDeleting === image.id;
            
            return (
              <div key={image.id} className="relative group">
                <div 
                  className={`relative rounded-lg overflow-hidden border-2 ${
                    isMain ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-32 object-cover"
                  />
                  
                  {/* Overlay de carga al eliminar */}
                  {isDeletingThis && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                  
                  {/* Badge de imagen principal */}
                  {isMain && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded">
                        {t('imageManager.mainBadge', 'Principal')}
                      </span>
                    </div>
                  )}
                  
                  {/* Botones de acción */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {allowMainImageSelection && !isMain && (
                      <button
                        type="button"
                        onClick={() => handleSetMainImage(image.id)}
                        className="p-1 text-white bg-black bg-opacity-50 rounded hover:bg-opacity-70"
                        title={t('imageManager.setAsMain', 'Establecer como principal')}
                        disabled={isDeletingThis}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(image.id, image.url)}
                      className="p-1 text-white bg-red-500 bg-opacity-70 rounded hover:bg-opacity-90"
                      title={t('imageManager.deleteImage', 'Eliminar imagen')}
                      disabled={isDeletingThis}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Nombre del archivo */}
                <p className="mt-1 text-xs text-gray-500 truncate">
                  {image.filename}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Información de límite */}
      {existingImages.length >= maxImages && (
        <p className="text-sm text-gray-500 text-center">
          {t('imageManager.limitReached', {
            max: maxImages,
            defaultValue: 'Has alcanzado el límite máximo de {{max}} imágenes.',
          })}
        </p>
      )}
    </div>
  );
};

export default ImageManager;
