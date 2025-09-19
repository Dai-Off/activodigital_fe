import type { 
  Building, 
  BuildingPhoto, 
  BuildingBook, 
  BookSection, 
  BookUpload,
  BuildingFormStep1,
  BuildingFormStep2
} from '../types/buildings';
import { BOOK_SECTIONS } from '../types/buildings';

// Keys para localStorage
const STORAGE_KEYS = {
  BUILDINGS: 'activodigital_buildings',
  BUILDING_PHOTOS: 'activodigital_building_photos',
  BUILDING_BOOKS: 'activodigital_building_books',
  BOOK_SECTIONS: 'activodigital_book_sections',
  BOOK_UPLOADS: 'activodigital_book_uploads'
};

// Utilidades de almacenamiento
const storage = {
  get: <T>(key: string): T[] => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  },
  
  set: <T>(key: string, data: T[]): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
};

// Generador de IDs únicos
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Convertir File a data URL para almacenamiento local
const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// CRUD Operaciones para Buildings
export const buildingService = {
  // Obtener todos los edificios
  getAll: (): Building[] => {
    const buildings = storage.get<Building>(STORAGE_KEYS.BUILDINGS);
    return buildings.map(b => ({
      ...b,
      createdAt: new Date(b.createdAt),
      updatedAt: new Date(b.updatedAt)
    }));
  },

  // Obtener edificio por ID
  getById: (id: string): Building | null => {
    const buildings = buildingService.getAll();
    return buildings.find(b => b.id === id) || null;
  },

  // Crear borrador de edificio (Paso 1)
  createDraft: (formData: BuildingFormStep1): Building => {
    const building: Building = {
      id: generateId(),
      name: formData.name,
      address: formData.address,
      constructionYear: parseInt(formData.constructionYear),
      typology: formData.typology,
      floors: parseInt(formData.floors),
      units: parseInt(formData.units),
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const buildings = buildingService.getAll();
    buildings.push(building);
    storage.set(STORAGE_KEYS.BUILDINGS, buildings);
    
    return building;
  },

  // Actualizar edificio
  update: (id: string, updates: Partial<Building>): Building | null => {
    const buildings = buildingService.getAll();
    const index = buildings.findIndex(b => b.id === id);
    
    if (index === -1) return null;

    buildings[index] = {
      ...buildings[index],
      ...updates,
      updatedAt: new Date()
    };

    storage.set(STORAGE_KEYS.BUILDINGS, buildings);
    return buildings[index];
  },

  // Completar edificio con ubicación y fotos (Paso 2)
  completeWithLocation: async (
    id: string, 
    locationData: BuildingFormStep2
  ): Promise<Building | null> => {
    const building = buildingService.getById(id);
    if (!building) return null;

    // Actualizar coordenadas
    const updatedBuilding = buildingService.update(id, {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      status: 'created'
    });

    if (!updatedBuilding) return null;

    // Procesar fotos
    const photos: BuildingPhoto[] = [];
    for (let i = 0; i < locationData.photos.length; i++) {
      const file = locationData.photos[i];
      const dataUrl = await fileToDataUrl(file);
      
      const photo: BuildingPhoto = {
        id: generateId(),
        buildingId: id,
        filename: file.name,
        url: dataUrl,
        isMain: i === locationData.mainPhotoIndex,
        uploadedAt: new Date()
      };
      
      photos.push(photo);
    }

    // Guardar fotos
    buildingPhotoService.addPhotos(photos);

    // Actualizar building con foto principal
    const mainPhoto = photos.find(p => p.isMain);
    if (mainPhoto) {
      buildingService.update(id, { mainPhotoId: mainPhoto.id });
    }

    return buildingService.getById(id);
  },

  // Eliminar edificio
  delete: (id: string): boolean => {
    const buildings = buildingService.getAll();
    const filteredBuildings = buildings.filter(b => b.id !== id);
    
    if (filteredBuildings.length === buildings.length) return false;
    
    storage.set(STORAGE_KEYS.BUILDINGS, filteredBuildings);
    
    // Limpiar datos relacionados
    buildingPhotoService.deleteByBuildingId(id);
    buildingBookService.deleteByBuildingId(id);
    
    return true;
  }
};

// CRUD Operaciones para BuildingPhotos
export const buildingPhotoService = {
  getByBuildingId: (buildingId: string): BuildingPhoto[] => {
    const photos = storage.get<BuildingPhoto>(STORAGE_KEYS.BUILDING_PHOTOS);
    return photos
      .filter(p => p.buildingId === buildingId)
      .map(p => ({ ...p, uploadedAt: new Date(p.uploadedAt) }));
  },

  addPhotos: (photos: BuildingPhoto[]): void => {
    const existingPhotos = storage.get<BuildingPhoto>(STORAGE_KEYS.BUILDING_PHOTOS);
    storage.set(STORAGE_KEYS.BUILDING_PHOTOS, [...existingPhotos, ...photos]);
  },

  deleteByBuildingId: (buildingId: string): void => {
    const photos = storage.get<BuildingPhoto>(STORAGE_KEYS.BUILDING_PHOTOS);
    const filteredPhotos = photos.filter(p => p.buildingId !== buildingId);
    storage.set(STORAGE_KEYS.BUILDING_PHOTOS, filteredPhotos);
  }
};

// CRUD Operaciones para BuildingBooks
export const buildingBookService = {
  getByBuildingId: (buildingId: string): BuildingBook | null => {
    const books = storage.get<BuildingBook>(STORAGE_KEYS.BUILDING_BOOKS);
    const book = books.find(b => b.buildingId === buildingId);
    
    if (!book) return null;
    
    return {
      ...book,
      createdAt: new Date(book.createdAt),
      updatedAt: new Date(book.updatedAt)
    };
  },

  create: (buildingId: string): BuildingBook => {
    const book: BuildingBook = {
      id: generateId(),
      buildingId,
      status: 'draft',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const books = storage.get<BuildingBook>(STORAGE_KEYS.BUILDING_BOOKS);
    books.push(book);
    storage.set(STORAGE_KEYS.BUILDING_BOOKS, books);

    // Crear secciones vacías
    const sections: BookSection[] = BOOK_SECTIONS.map(sectionTemplate => ({
      id: generateId(),
      bookId: book.id,
      sectionType: sectionTemplate.type,
      content: {},
      documents: [],
      isCompleted: false
    }));

    bookSectionService.addSections(sections);

    return book;
  },

  updateProgress: (bookId: string): BuildingBook | null => {
    const sections = bookSectionService.getByBookId(bookId);
    const completedSections = sections.filter(s => s.isCompleted);
    const progress = completedSections.length;

    const books = storage.get<BuildingBook>(STORAGE_KEYS.BUILDING_BOOKS);
    const index = books.findIndex(b => b.id === bookId);
    
    if (index === -1) return null;

    books[index] = {
      ...books[index],
      progress,
      status: progress === 8 ? 'completed' : progress > 0 ? 'in_progress' : 'draft',
      updatedAt: new Date()
    };

    storage.set(STORAGE_KEYS.BUILDING_BOOKS, books);
    return books[index];
  },

  deleteByBuildingId: (buildingId: string): void => {
    const books = storage.get<BuildingBook>(STORAGE_KEYS.BUILDING_BOOKS);
    const book = books.find(b => b.buildingId === buildingId);
    
    if (book) {
      // Eliminar secciones del libro
      bookSectionService.deleteByBookId(book.id);
      
      // Eliminar el libro
      const filteredBooks = books.filter(b => b.buildingId !== buildingId);
      storage.set(STORAGE_KEYS.BUILDING_BOOKS, filteredBooks);
    }
  }
};

// CRUD Operaciones para BookSections
export const bookSectionService = {
  getByBookId: (bookId: string): BookSection[] => {
    const sections = storage.get<BookSection>(STORAGE_KEYS.BOOK_SECTIONS);
    return sections
      .filter(s => s.bookId === bookId)
      .map(s => ({
        ...s,
        completedAt: s.completedAt ? new Date(s.completedAt) : undefined
      }));
  },

  getById: (sectionId: string): BookSection | null => {
    const sections = storage.get<BookSection>(STORAGE_KEYS.BOOK_SECTIONS);
    const section = sections.find(s => s.id === sectionId);
    
    return section ? {
      ...section,
      completedAt: section.completedAt ? new Date(section.completedAt) : undefined
    } : null;
  },

  addSections: (sections: BookSection[]): void => {
    const existingSections = storage.get<BookSection>(STORAGE_KEYS.BOOK_SECTIONS);
    storage.set(STORAGE_KEYS.BOOK_SECTIONS, [...existingSections, ...sections]);
  },

  updateSection: (
    sectionId: string, 
    updates: Partial<Pick<BookSection, 'content' | 'documents' | 'isCompleted'>>
  ): BookSection | null => {
    const sections = storage.get<BookSection>(STORAGE_KEYS.BOOK_SECTIONS);
    const index = sections.findIndex(s => s.id === sectionId);
    
    if (index === -1) return null;

    sections[index] = {
      ...sections[index],
      ...updates,
      completedAt: updates.isCompleted ? new Date() : sections[index].completedAt
    };

    storage.set(STORAGE_KEYS.BOOK_SECTIONS, sections);
    
    // Actualizar progreso del libro
    buildingBookService.updateProgress(sections[index].bookId);
    
    return sections[index];
  },

  deleteByBookId: (bookId: string): void => {
    const sections = storage.get<BookSection>(STORAGE_KEYS.BOOK_SECTIONS);
    const filteredSections = sections.filter(s => s.bookId !== bookId);
    storage.set(STORAGE_KEYS.BOOK_SECTIONS, filteredSections);
  }
};

// CRUD Operaciones para BookUploads
export const bookUploadService = {
  getByBookId: (bookId: string): BookUpload[] => {
    const uploads = storage.get<BookUpload>(STORAGE_KEYS.BOOK_UPLOADS);
    return uploads
      .filter(u => u.bookId === bookId)
      .map(u => ({ ...u, uploadedAt: new Date(u.uploadedAt) }));
  },

  add: async (bookId: string, file: File): Promise<BookUpload> => {
    const dataUrl = await fileToDataUrl(file);
    
    const upload: BookUpload = {
      id: generateId(),
      bookId,
      filename: file.name,
      url: dataUrl,
      pageMapping: [],
      uploadedAt: new Date()
    };

    const uploads = storage.get<BookUpload>(STORAGE_KEYS.BOOK_UPLOADS);
    uploads.push(upload);
    storage.set(STORAGE_KEYS.BOOK_UPLOADS, uploads);

    return upload;
  },

  updateMapping: (uploadId: string, pageMapping: BookUpload['pageMapping']): BookUpload | null => {
    const uploads = storage.get<BookUpload>(STORAGE_KEYS.BOOK_UPLOADS);
    const index = uploads.findIndex(u => u.id === uploadId);
    
    if (index === -1) return null;

    uploads[index] = {
      ...uploads[index],
      pageMapping
    };

    storage.set(STORAGE_KEYS.BOOK_UPLOADS, uploads);
    return uploads[index];
  }
};

// Utility para limpiar todo el almacenamiento (desarrollo/testing)
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};