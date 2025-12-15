import { FileText, Sparkles, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { type Building, BuildingsApiService } from "~/services/buildingsApi";
import {
  type PersistedEnergyCertificate,
  EnergyCertificatesService,
} from "~/services/energyCertificates";
import { getTimeRemaining } from "~/utils/getTimeRemaining";
import { BuildingCertificatesLoading } from "./ui/dashboardLoading";

export function BuildingCertificates() {
  const { id: buildingId } = useParams<{ id: string }>();
  const [certificates, setCertificates] = useState<
    PersistedEnergyCertificate[] | undefined
  >();
  const [building, setBuilding] = useState<Building | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    BuildingsApiService.getBuildingById(buildingId || "").then((data) =>
      setBuilding(data)
    );
    EnergyCertificatesService.getByBuilding(buildingId || "")
      .then((data) => setCertificates(data.certificates))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <BuildingCertificatesLoading />;
  }

  if (!certificates || certificates.length === 0) {
    return (
      <div className="flex-1 overflow-hidden mt-2">
        <div className="h-full flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 gap-2">
              {/* Encabezado y Botón (Estilo similar al que tienes) */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm mb-0.5">Certificados Energéticos</h2>
                    <p className="text-xs text-gray-500">
                      {building?.name || "Cargando nombre del edificio..."}
                    </p>
                  </div>
                  <button
                    data-slot="button"
                    className="inline-flex text-white items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs h-8"
                  >
                    <Upload className="w-3 h-3 mr-1.5" />
                    Cargar Certificado
                  </button>
                </div>
              </div>

              {/* --- Contenedor Principal de la Alerta de No Data --- */}
              <div className="bg-white rounded-lg shadow-sm">
                {/* Tabla Placeholder */}
                <div className="relative w-full overflow-x-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&amp;_tr]:border-b border-gray-200">
                      <tr className="border-b border-gray-200">
                        <th className="h-10 px-2 text-left text-xs py-2 w-1/6">
                          Tipo
                        </th>
                        <th className="h-10 px-2 text-left text-xs py-2 w-1/6">
                          Calificación
                        </th>
                        <th className="h-10 px-2 text-left text-xs py-2 w-1/6">
                          Emisiones
                        </th>
                        <th className="h-10 px-2 text-left text-xs py-2 w-1/6">
                          Emisión
                        </th>
                        <th className="h-10 px-2 text-left text-xs py-2 w-1/6">
                          Vencimiento
                        </th>
                        <th className="h-10 px-2 text-left text-xs py-2 w-1/6">
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&amp;_tr:last-child]:border-0 text-xs text-gray-400">
                      <tr className="border-b border-gray-100">
                        <td className="p-2 py-3">Certificado Energético</td>
                        <td className="p-2 py-3">-</td>
                        <td className="p-2 py-3">-</td>
                        <td className="p-2 py-3">-</td>
                        <td className="p-2 py-3">-</td>
                        <td className="p-2 py-3">Sin Datos</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="p-2 py-3">Inspección Técnica</td>
                        <td className="p-2 py-3">-</td>
                        <td className="p-2 py-3">-</td>
                        <td className="p-2 py-3">-</td>
                        <td className="p-2 py-3">-</td>
                        <td className="p-2 py-3">Sin Datos</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Gran Call-to-Action / Mensaje central (Estilo Seguros) */}
                <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-300 rounded-b-lg">
                  <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-lg text-gray-700 mb-2">
                    No hay certificados registrados.
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Sube el Certificado Energético y la ITE para comenzar a
                    gestionar los vencimientos y la IA de análisis.
                  </p>
                  <button className="flex items-center gap-2 px-6 py-2 mx-auto bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-md">
                    <Upload className="w-4 h-4" />
                    Cargar Documentos Ahora
                  </button>
                </div>
              </div>

              {/* Placeholder de Análisis IA (Para mantener el layout) */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-purple-200 rounded">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-purple-600 mb-2">
                        IA • Análisis de eficiencia energética
                      </p>
                      <div className="space-y-2 text-gray-500">
                        <p className="text-sm leading-relaxed">
                          • La IA espera los datos del Certificado Energético
                          para generar el análisis.
                        </p>
                        <p className="text-sm leading-relaxed">
                          • Una vez cargado, verás recomendaciones de mejora,
                          comparación de consumo y riesgo de caducidad.
                        </p>
                      </div>
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

  interface CertificateProps {
    certificate: PersistedEnergyCertificate;
  }

  function CertificatesComponent({ certificate }: CertificateProps) {
    const colorRating = {
      A: "bg-green-500",
      B: "bg-green-500",
      C: "bg-amber-500",
      D: "bg-amber-500",
      E: "bg-red-500",
      F: "bg-red-500",
      G: "bg-red-500",
      ND: "bg-red-500",
    };

    let issueDateFormat = certificate.issueDate.replaceAll("-", "/");
    let expiryDateFormat = certificate.expiryDate.replaceAll("-", "/");

    let TimeRemaining = getTimeRemaining(expiryDateFormat);

    return (
      <>
        <td
          data-slot="table-cell"
          className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;&gt;[role=checkbox]]:translate-y-[2px] py-2"
        >
          <div
            className={`w-7 h-7 ${
              colorRating[certificate.rating]
            } rounded flex items-center justify-center text-white text-xs`}
          >
            {certificate.rating}
          </div>
        </td>
        <td
          data-slot="table-cell"
          className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;&gt;[role=checkbox]]:translate-y-[2px] py-2"
        >
          {certificate.emissionsKgCo2PerM2Year} kg CO₂eq/m²·año
        </td>
        <td
          data-slot="table-cell"
          className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;&gt;[role=checkbox]]:translate-y-[2px] py-2"
        >
          {issueDateFormat}
        </td>
        <td
          data-slot="table-cell"
          className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;&gt;[role=checkbox]]:translate-y-[2px] py-2"
        >
          {expiryDateFormat}
        </td>
        <td
          data-slot="table-cell"
          className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;&gt;[role=checkbox]]:translate-y-[2px] py-2"
        >
          <span
            className={`inline-flex px-2 py-0.5 rounded text-xs ${
              TimeRemaining === "Ha vencido"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            } `}
          >
            {TimeRemaining === "Ha vencido" ? "Vencido" : "Vigente"}
          </span>
        </td>
      </>
    );
  }

  return (
    <div className="flex-1 overflow-hidden mt-2">
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm mb-0.5">Certificados Energéticos</h2>
                  <p className="text-xs text-gray-500">{building?.name}</p>
                </div>
                <button
                  data-slot="button"
                  className="inline-flex text-white items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-primary-foreground px-4 py-2 has-[&gt;svg]:px-3 bg-blue-600 hover:bg-blue-700 text-xs h-8"
                >
                  <Upload className="w-3 h-3 mr-1.5" />
                  Cargar Certificado
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div
                data-slot="table-container"
                className="relative w-full overflow-x-auto"
              >
                <table
                  data-slot="table"
                  className="w-full caption-bottom text-sm"
                >
                  <thead
                    data-slot="table-header"
                    className="[&amp;_tr]:border-b border-gray-200"
                  >
                    <tr
                      data-slot="table-row"
                      className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b border-gray-200 transition-colors"
                    >
                      <th
                        data-slot="table-head"
                        className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;&gt;[role=checkbox]]:translate-y-[2px] text-xs py-2"
                      >
                        Tipo
                      </th>
                      <th
                        data-slot="table-head"
                        className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;&gt;[role=checkbox]]:translate-y-[2px] text-xs py-2"
                      >
                        Calificación
                      </th>
                      <th
                        data-slot="table-head"
                        className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;&gt;[role=checkbox]]:translate-y-[2px] text-xs py-2"
                      >
                        Emisiones
                      </th>
                      <th
                        data-slot="table-head"
                        className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;&gt;[role=checkbox]]:translate-y-[2px] text-xs py-2"
                      >
                        Fecha de emisión
                      </th>
                      <th
                        data-slot="table-head"
                        className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;&gt;[role=checkbox]]:translate-y-[2px] text-xs py-2"
                      >
                        Fecha de Vencimiento
                      </th>
                      <th
                        data-slot="table-head"
                        className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;&gt;[role=checkbox]]:translate-y-[2px] text-xs py-2"
                      >
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    data-slot="table-body"
                    className="[&amp;_tr:last-child]:border-0"
                  >
                    <tr
                      data-slot="table-row"
                      className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b border-gray-200 transition-colors text-xs"
                    >
                      <td
                        data-slot="table-cell"
                        className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;&gt;[role=checkbox]]:translate-y-[2px] py-2"
                      >
                        Certificado Energético
                      </td>
                      {certificates.map((certificate) => {
                        return (
                          <CertificatesComponent certificate={certificate} />
                        );
                      })}
                    </tr>
                    <tr
                      data-slot="table-row"
                      className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors text-xs"
                    >
                      <td
                        data-slot="table-cell"
                        className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;&gt;[role=checkbox]]:translate-y-[2px] py-2"
                      >
                        Inspección Técnica
                      </td>
                      <td
                        data-slot="table-cell"
                        className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;&gt;[role=checkbox]]:translate-y-[2px] py-2"
                      >
                        <span className="text-gray-500">-</span>
                      </td>
                      <td
                        data-slot="table-cell"
                        className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;&gt;[role=checkbox]]:translate-y-[2px] py-2"
                      >
                        -
                      </td>
                      <td
                        data-slot="table-cell"
                        className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;&gt;[role=checkbox]]:translate-y-[2px] py-2"
                      >
                        15/03/2024
                      </td>
                      <td
                        data-slot="table-cell"
                        className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;&gt;[role=checkbox]]:translate-y-[2px] py-2"
                      >
                        15/03/2029
                      </td>
                      <td
                        data-slot="table-cell"
                        className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;&gt;[role=checkbox]]:translate-y-[2px] py-2"
                      >
                        <span className="inline-flex px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">
                          Vigente
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-purple-200 rounded">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-purple-600 mb-2">
                      IA • Análisis de eficiencia energética
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm text-purple-900 leading-relaxed">
                        • Tu consumo de 85.42 kWh/m²·año está 15% por debajo de
                        la media (100.5 kWh/m²·año)
                      </p>
                      <p className="text-sm text-purple-900 leading-relaxed">
                        • Estás cerca de calificación A+ (&lt;80 kWh/m²·año).
                        Con mejoras en aislamiento podrías alcanzarla
                      </p>
                      <p className="text-sm text-purple-900 leading-relaxed">
                        • El certificado válido hasta 13/07/2030. Renovar
                        anticipadamente podría aprovechar nuevas normativas
                      </p>
                    </div>
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
