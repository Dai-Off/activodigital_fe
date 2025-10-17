# Searchbar y Filtros de Activos

## Descripción

Funcionalidad profesional de búsqueda y filtros para la lista de activos inmobiliarios. Permite búsqueda por texto, filtrado por estado y clase energética, y ordenamiento por múltiples campos.

## Ubicación

- **Componente principal**: `src/components/ui/AssetsSearchBar.tsx`
- **Integración**: `src/components/AssetsList.tsx`

## Características

### 1. Búsqueda por texto
- Busca en nombre del edificio, dirección y referencia catastral
- Búsqueda en tiempo real (sin necesidad de presionar enter)
- Botón de limpieza rápida cuando hay texto

### 2. Ordenamiento
- **Campos disponibles**:
  - Nombre (alfabético)
  - Valor (precio del inmueble)
  - Estado (progreso del libro digital)
  - Clase energética (CEE)
  - ESG Score
  - Superficie (m²)

- **Orden**: Ascendente o descendente con botón toggle visual

### 3. Filtros avanzados
- **Por estado del libro digital**:
  - Pendiente
  - Listo
  - En curso
  - Completado (8/8 secciones)

- **Por clase energética (CEE)**:
  - A, B, C, D, E, F, G
  - Solo muestra edificios con certificado energético

### 4. Panel expandible
- Filtros adicionales se muestran/ocultan con botón toggle
- Indicador visual del número de filtros activos
- Botón para limpiar todos los filtros de una vez

### 5. Contador de resultados
- Muestra el número total de activos después de aplicar filtros
- Mensaje contextual cuando hay filtros aplicados

## Arquitectura

### Componente AssetsSearchBar

**Props**:
```typescript
interface AssetsSearchBarProps {
  onFiltersChange: (filters: SearchFilters) => void;
  totalResults: number;
  isLoading?: boolean;
}
```

**Tipos exportados**:
```typescript
export type SortField = 'name' | 'value' | 'status' | 'energyClass' | 'esgScore' | 'squareMeters';
export type SortOrder = 'asc' | 'desc';

export interface SearchFilters {
  searchTerm: string;
  sortField: SortField;
  sortOrder: SortOrder;
  statusFilter: string[];
  energyClassFilter: string[];
}
```

### Integración en AssetsList

1. **Estado local**: Mantiene los filtros actuales
2. **Memo de filtrado**: Calcula `filteredAndSortedBuildings` aplicando todos los filtros
3. **Paginación**: Se actualiza automáticamente con los resultados filtrados
4. **Reset de página**: Al cambiar filtros, vuelve a la página 1

## Lógica de filtrado

### Búsqueda por texto
```typescript
building.name.toLowerCase().includes(term) ||
building.address.toLowerCase().includes(term) ||
building.cadastralReference?.toLowerCase().includes(term)
```

### Filtro por estado
- Verifica el progreso del libro digital
- Si progress === 8, considera el estado como "completado"
- Si no, usa el campo `building.status`

### Filtro por clase energética
- Obtiene los certificados del edificio
- Usa `getLatestRating()` para obtener la clase más reciente
- Solo muestra edificios que tienen certificado

### Ordenamiento
- Usa `Array.sort()` con comparación personalizada según el campo
- Invierte el resultado si `sortOrder === 'desc'`
- Maneja casos donde no hay datos (valores por defecto)

## Estilos y UX

- **Responsive**: Se adapta a móvil, tablet y desktop
- **Animaciones**: Fade in suave al expandir filtros
- **Estados visuales**: 
  - Loading (campos deshabilitados)
  - Filtros activos (badge con número)
  - Hover states en todos los botones
- **Accesibilidad**: 
  - Labels y aria-labels apropiados
  - Focus states visibles
  - Keyboard navigation

## Performance

- **useMemo**: Los filtros y ordenamiento se memorizan
- **Paginación**: Solo se renderizan los items de la página actual
- **Cambio de página**: Al aplicar filtros, vuelve a página 1 automáticamente

## Escalabilidad

### Para agregar nuevos filtros:

1. Agregar el campo al tipo `SearchFilters` en `AssetsSearchBar.tsx`
2. Agregar el estado local y handler en el componente
3. Agregar el UI en el panel de filtros
4. Agregar la lógica de filtrado en `AssetsList.tsx` dentro del memo `filteredAndSortedBuildings`

### Para agregar nuevos campos de ordenamiento:

1. Agregar el valor al tipo `SortField`
2. Agregar la opción a `SORT_OPTIONS`
3. Agregar el caso en el switch de ordenamiento en `AssetsList.tsx`

## Notas técnicas

- **No afecta otros componentes**: El filtrado es local a `AssetsList`
- **Sin llamadas al backend**: Todo el filtrado es client-side
- **Compatible con paginación**: La paginación existente funciona con los resultados filtrados
- **Type-safe**: Tipos de TypeScript estrictos en toda la implementación

