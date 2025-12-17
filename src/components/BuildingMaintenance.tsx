import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

export function BuildingMaintenance() {
  interface PieData {
    name: string;
    value: number;
    color: string;
    [key: string]: any;
  }

  const data: PieData[] = [
    { name: "Category A", value: 400, color: "#10b981" }, // Verde
    { name: "Category B", value: 300, color: "#3b82f6" }, // Azul
    { name: "Category C", value: 200, color: "#f59e0b" }, // Amarillo/Naranja
    { name: "Category D", value: 100, color: "#ef4444" }, // Rojo
  ];

  const outerRadius = 65;
  const innerRadius = 40;

  const cx = "50%";
  const cy = 76.1;

  const CustomizedLegend: React.FC<any> = ({ payload }) => {
    return (
      <ul
        className="recharts-default-legend"
        style={{ padding: "0px", margin: "0px", textAlign: "center" }}
      >
        {payload.map((entry: any, index: number) => (
          <li
            key={`item-${index}`}
            className={`recharts-legend-item legend-item-${index}`}
            style={{ display: "inline-block", marginRight: "10px" }}
          >
            {/* El SVG del icono del color se renderiza por defecto, pero aquí solo dejamos el texto */}
            <svg
              aria-label={`Legend icon for ${entry.payload.name}`}
              className="recharts-surface"
              width="14"
              height="14"
              viewBox="0 0 32 32"
              style={{
                display: "inline-block",
                verticalAlign: "middle",
                marginRight: "4px",
              }}
            >
              {/* Imitación del path circular */}
              <path
                fill={entry.color}
                transform="translate(16, 16)"
                d="M16,0A16,16,0,1,1,-16,0A16,16,0,1,1,16,0"
              ></path>
            </svg>
            <span
              className="recharts-legend-item-text"
              // El color del texto del item original estaba asociado al color del segmento
              style={{ color: entry.color }}
            >
              {/* Aquí puedes ajustar el texto como necesites, ej. usando clases de Tailwind */}
              <span className="text-xs text-gray-700">
                {entry.payload.name}
              </span>
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <h2 className="text-sm mb-2">Plan de Mantenimiento</h2>
            <div className="h-48">
              <div style={{ width: "456px", height: "192px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      cx={cx}
                      cy={cy}
                      innerRadius={innerRadius}
                      outerRadius={outerRadius}
                      paddingAngle={0} // Sin espacios entre segmentos
                      fill="#8884d8" // Color de fallback
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="#fff"
                        />
                      ))}
                    </Pie>

                    {/* Esta es la leyenda que imita la estructura de tu HTML */}
                    <Legend
                      content={<CustomizedLegend />}
                      layout="horizontal"
                      align="center"
                      verticalAlign="bottom"
                      wrapperStyle={{
                        left: 5,
                        bottom: 5,
                        width: 446,
                        height: 24,
                      }} // Ajustes manuales para replicar tu 'recharts-legend-wrapper'
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="p-2 border border-gray-200 rounded">
                <div className="flex items-center gap-1.5 mb-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "rgb(16, 185, 129)" }}
                  ></div>
                  <span className="text-xs text-gray-600">Completado</span>
                </div>
                <p className="text-sm">40%</p>
              </div>
              <div className="p-2 border border-gray-200 rounded">
                <div className="flex items-center gap-1.5 mb-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "rgb(59, 130, 246)" }}
                  ></div>
                  <span className="text-xs text-gray-600">En curso</span>
                </div>
                <p className="text-sm">25%</p>
              </div>
              <div className="p-2 border border-gray-200 rounded">
                <div className="flex items-center gap-1.5 mb-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "rgb(245, 158, 11)" }}
                  ></div>
                  <span className="text-xs text-gray-600">Programado</span>
                </div>
                <p className="text-sm">20%</p>
              </div>
              <div className="p-2 border border-gray-200 rounded">
                <div className="flex items-center gap-1.5 mb-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "rgb(239, 68, 68)" }}
                  ></div>
                  <span className="text-xs text-gray-600">Atrasado</span>
                </div>
                <p className="text-sm">15%</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm">
            <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-purple-200 rounded">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-sparkles w-4 h-4 text-purple-700"
                    aria-hidden="true"
                  >
                    <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                    <path d="M20 2v4"></path>
                    <path d="M22 4h-4"></path>
                    <circle cx="4" cy="20" r="2"></circle>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-purple-600 mb-2">
                    IA • Optimización de mantenimientos
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-purple-900 leading-relaxed">
                      • Tienes 15% tareas vencidas. Prioriza: HVAC (8 días) y
                      ascensor (15 días)
                    </p>
                    <p className="text-sm text-purple-900 leading-relaxed">
                      • Agrupando mantenimientos trimestrales con un proveedor
                      ahorrarías €2,400/año (12%)
                    </p>
                    <p className="text-sm text-purple-900 leading-relaxed">
                      • Contratos preventivos reducirían costes reactivos un 35%
                    </p>
                    <p className="text-sm text-purple-900 leading-relaxed">
                      • Digitalizar histórico permitiría predecir averías con
                      85% precisión
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
