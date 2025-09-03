export default function Mantenimiento() {
  return (
    <div className="section animate-fadeInUp">
      <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-6">Plan de Mantenimiento</h2>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Plan de Mantenimiento</h3>
        <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 5v14m7-7H5" />
          </svg>
          <span>Nueva tarea</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Calendario */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Calendario de Mantenimiento</h3>
          <div className="grid grid-cols-7 gap-2 mb-4">
            <div className="text-center text-sm font-medium text-gray-500 py-2">Dom</div>
            <div className="text-center text-sm font-medium text-gray-500 py-2">Lun</div>
            <div className="text-center text-sm font-medium text-gray-500 py-2">Mar</div>
            <div className="text-center text-sm font-medium text-gray-500 py-2">Mié</div>
            <div className="text-center text-sm font-medium text-gray-500 py-2">Jue</div>
            <div className="text-center text-sm font-medium text-gray-500 py-2">Vie</div>
            <div className="text-center text-sm font-medium text-gray-500 py-2">Sáb</div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            <div className="aspect-square p-2 text-center text-sm text-gray-400">30</div>
            <div className="aspect-square p-2 text-center text-sm text-gray-400">31</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">1</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">2</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">3</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">4</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">5</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">6</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">7</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">8</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">9</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">10</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">11</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">12</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">13</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">14</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">15</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">16</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">17</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">18</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">19</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">20</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">21</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">22</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">23</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">24</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">25</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">26</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">27</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">28</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">29</div>
            <div className="aspect-square p-2 text-center text-sm hover:bg-gray-50 rounded cursor-pointer">30</div>
          </div>
        </div>
        {/* Estado de tareas */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Tareas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-500">Completadas</span>
              <span className="text-2xl font-bold text-green-600">24</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-500">En progreso</span>
              <span className="text-2xl font-bold text-blue-600">8</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg">
              <span className="text-sm text-gray-500">Programadas</span>
              <span className="text-2xl font-bold text-yellow-600">12</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg">
              <span className="text-sm text-gray-500">Vencidas</span>
              <span className="text-2xl font-bold text-red-600">3</span>
            </div>
          </div>
        </div>
      </div>
      {/* Lista de tareas de mantenimiento */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Tareas de Mantenimiento</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {/* Tarea 1 */}
          <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Revisión ascensor principal</h4>
                  <p className="text-sm text-gray-500">Sistema: Ascensor • Criticidad: Alta</p>
                  <p className="text-sm text-red-600">Vence en 3 días</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-md">Urgente</span>
                <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">Programar</button>
              </div>
            </div>
          </div>
          {/* Tarea 2 */}
          <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Limpieza filtros HVAC</h4>
                  <p className="text-sm text-gray-500">Sistema: HVAC • Criticidad: Media</p>
                  <p className="text-sm text-blue-600">En progreso</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md">En curso</span>
                <button className="px-3 py-1.5 bg-gray-100 text-blue-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">Ver detalles</button>
              </div>
            </div>
          </div>
          {/* Tarea 3 */}
          <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Inspección sistema PCI</h4>
                  <p className="text-sm text-gray-500">Sistema: PCI • Criticidad: Alta</p>
                  <p className="text-sm text-yellow-600">Programado para el 25/04</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-md">Programado</span>
                <button className="px-3 py-1.5 bg-gray-100 text-yellow-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">Editar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
