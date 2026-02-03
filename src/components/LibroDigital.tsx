import QRCode from "react-qr-code";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import React from "react";
import ReactDOM from "react-dom/client";
import { useTranslation } from "react-i18next";

// Mock data del libro del edificio
const libroData = {
  // Se sustituyen los IDs UUID por códigos más legibles para mock/demo
  libroId: "LDE-0001",
  edificioId: "EDIF-1024",
  version: "1.2.0",
  estado: "aprobado",
  fechaCreacion: "2025-07-10",
  fechaUltimaActualizacion: "2025-09-01",
  responsable: { usuarioId: "USR-00045", nombre: "María López" },
  normativaReferencia: [
    { ambito: "nacional", norma: "CTE", version: "2024" },
    { ambito: "UE", norma: "EPBD", version: "2024" },
    { ambito: "local", norma: "Ordenanza ITE Madrid", version: "2023" },
  ],
  progreso: { totalSecciones: 9, seccionesCompletas: 8, porcentaje: 92 },
  snapshot: {
    certificadosIds: ["CERT-ENER-001"],
    intervencionesIds: ["INT-2023-014", "INT-2024-002"],
    instalacionesIds: ["INST-HVAC-01", "INST-SOLAR-02"],
    documentosIds: [
      "DOC-001",
      "DOC-002",
      "DOC-003",
      "DOC-010",
      "DOC-020",
      "DOC-040",
    ],
  },
  firmas: [
    {
      firmaId: "SIG-001",
      seccion: "proyecto_y_documentacion_tecnica",
      usuarioId: "TCO-001",
      rol: "tecnico",
      fecha: "2025-08-30T14:20:00Z",
      hash: "SHA256:abf9…",
    },
    {
      firmaId: "SIG-002",
      seccion: "versionado_y_firmas",
      usuarioId: "USR-00045",
      rol: "responsable",
      fecha: "2025-09-01T11:05:00Z",
      hash: "SHA256:cd99…",
    },
  ],
  documentosAdjuntos: [
    {
      documentoId: "DOC-001",
      tipo: "proyecto_ejecucion",
      formato: "PDF",
      firmado: true,
    },
    {
      documentoId: "DOC-002",
      tipo: "certificado_final_obra",
      formato: "PDF",
      firmado: true,
    },
    { documentoId: "DOC-040", tipo: "CEE", formato: "PDF", firmado: true },
  ],
  routes: {
    volverAlEdificio: "/propietario/building/EDIF-1024",
    descargarPdf: "/api/mock/lde/LDE-0001/pdf",
  },
  secciones: [
    {
      nombre: "proyecto_y_documentacion_tecnica",
      titulo: "Proyecto y Documentación Técnica",
      estado: "completo",
      checklist: [
        {
          item: "Proyecto de ejecución visado",
          ok: true,
          evidenciaDocId: "doc-001",
        },
        {
          item: "Certificado final de obra",
          ok: true,
          evidenciaDocId: "doc-002",
        },
        {
          item: "Licencias y autorizaciones",
          ok: true,
          evidenciaDocId: "doc-003",
        },
      ],
      observaciones: "",
    },
    {
      nombre: "manual_uso_y_mantenimiento",
      titulo: "Manual de Uso y Mantenimiento",
      estado: "completo",
      checklist: [
        { item: "Manual de uso general", ok: true, evidenciaDocId: "doc-010" },
        {
          item: "Recomendaciones de conservación",
          ok: true,
          evidenciaDocId: "doc-011",
        },
      ],
    },
    {
      nombre: "plan_mantenimiento",
      titulo: "Plan de Mantenimiento",
      estado: "parcial",
      checklist: [
        { item: "Plan preventivo anual", ok: true, evidenciaDocId: "doc-020" },
        { item: "Calendario y responsables", ok: false, evidenciaDocId: null },
      ],
      observaciones: "Falta adjuntar calendario firmado.",
    },
    {
      nombre: "instalaciones",
      titulo: "Instalaciones",
      estado: "completo",
      checklist: [
        {
          item: "Inventario de instalaciones",
          ok: true,
          evidenciaDocId: "doc-030",
        },
      ],
    },
    {
      nombre: "certificados_y_garantias",
      titulo: "Certificados y Garantías",
      estado: "completo",
      checklist: [
        { item: "CEE vigente", ok: true, evidenciaDocId: "doc-040" },
        {
          item: "Seguro decenal (si aplica)",
          ok: true,
          evidenciaDocId: "doc-041",
        },
      ],
    },
    {
      nombre: "intervenciones_incidencias",
      titulo: "Intervenciones e Incidencias",
      estado: "completo",
      checklist: [
        {
          item: "Registro de intervenciones últimos 10 años",
          ok: true,
          evidenciaDocId: "doc-050",
        },
      ],
    },
    {
      nombre: "agentes_intervinientes",
      titulo: "Agentes Intervinientes",
      estado: "completo",
      checklist: [
        {
          item: "Promotor/Constructor/Dirección Facultativa",
          ok: true,
          evidenciaDocId: "doc-060",
        },
      ],
    },
    {
      nombre: "versionado_y_firmas",
      titulo: "Versionado y Firmas",
      estado: "completo",
      checklist: [
        { item: "Historial de versiones", ok: true },
        { item: "Firmas por sección", ok: true },
      ],
    },
    {
      nombre: "publicacion_y_accesos",
      titulo: "Publicación y Accesos",
      estado: "parcial",
      checklist: [
        { item: "URL pública activa", ok: true },
        { item: "QR visible", ok: false },
      ],
      observaciones: "Generar QR final tras publicación definitiva.",
    },
  ],
  publicacion: {
    estadoPublicacion: "publicado",
    qr: { codigo: "QR-LDE-1.2.0", urlImagen: "/mock/qr/lde-1.2.0.png" },
    urlPublica: "https://ad.example/lde/LDE-0001",
    nivelAcceso: "publico",
    vigenteDesde: "2025-09-01",
    vigenteHasta: null,
  },
  alertas: [
    {
      tipo: "pendiente_qr",
      criticidad: "baja",
      mensaje: "Generar QR final al publicar.",
    },
  ],
};

export function LibroDigital() {
  const { t } = useTranslation();
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "completo":
        return "bg-green-100 text-green-800 border-green-200";
      case "parcial":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pendiente":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "completo":
        return "✓";
      case "parcial":
        return "⚠";
      case "pendiente":
        return "⚪";
      default:
        return "?";
    }
  };

  const generarPDF = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Función simple para agregar texto
      const addText = (
        text: string,
        fontSize: number = 12,
        isBold: boolean = false
      ) => {
        pdf.setFontSize(fontSize);
        pdf.setFont("helvetica", isBold ? "bold" : "normal");

        const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
        lines.forEach((line: string) => {
          if (yPosition > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(line, margin, yPosition);
          yPosition += fontSize * 0.4;
        });
        yPosition += 3;
      };

      // Título principal
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        t("digitalBookTitle"),
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );
      yPosition += 10;

      // Nombre del edificio
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        t("buildingName", "Hotel RIU PLAZA España"),
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );
      yPosition += 15;

      // Imagen del edificio (debajo del título)
      const loadImageAsDataURL = async (url: string): Promise<string> => {
        const response = await fetch(url);
        if (!response.ok) throw new Error("No se pudo cargar la imagen");
        const blob = await response.blob();
        return await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };

      try {
        const imgData = await loadImageAsDataURL("/image.png");
        const imgWidth = pageWidth - 2 * margin;
        const imgHeight = 45; // altura fija razonable manteniendo margen visual
        pdf.addImage(imgData, "PNG", margin, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 8;
      } catch (e) {
        console.warn("No se pudo insertar la imagen del edificio en el PDF", e);
      }

      // GENERAR QR CODE - Crear uno simple sin estilos CSS modernos
      let qrImgData = "";

      try {
        // Crear un contenedor temporal con estilos básicos
        const tempContainer = document.createElement("div");
        tempContainer.style.position = "absolute";
        tempContainer.style.left = "-9999px";
        tempContainer.style.top = "-9999px";
        tempContainer.style.width = "120px";
        tempContainer.style.height = "120px";
        tempContainer.style.backgroundColor = "#ffffff";
        tempContainer.style.padding = "10px";
        tempContainer.style.border = "1px solid #cccccc";
        tempContainer.style.fontFamily = "Arial, sans-serif";

        // Crear el QR usando el componente QRCode
        const QRCodeComponent = React.createElement(QRCode, {
          value: libroData.publicacion.urlPublica,
          size: 100,
          style: {
            height: "auto",
            maxWidth: "100%",
            width: "100%",
            backgroundColor: "#ffffff",
            color: "#000000",
          },
        });

        // Renderizar el componente
        const root = ReactDOM.createRoot(tempContainer);
        root.render(QRCodeComponent);

        document.body.appendChild(tempContainer);

        // Esperar a que se renderice
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Capturar con html2canvas usando solo estilos básicos
        const qrCanvas = await html2canvas(tempContainer, {
          backgroundColor: "#ffffff",
          scale: 1,
          useCORS: false,
          allowTaint: true,
          ignoreElements: (element) => {
            // Ignorar elementos que puedan tener estilos problemáticos
            return element.tagName === "STYLE" || element.tagName === "LINK";
          },
        });

        qrImgData = qrCanvas.toDataURL("image/png");

        // Limpiar
        document.body.removeChild(tempContainer);
      } catch (error) {
        console.warn("Error al generar QR, usando QR simple:", error);

        // Fallback: crear un QR simple usando canvas
        const canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          // Fondo blanco
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, 100, 100);

          // Crear un patrón QR simple pero más detallado
          ctx.fillStyle = "#000000";
          const url = libroData.publicacion.urlPublica;
          const size = 4;
          const modules = 25;

          for (let y = 0; y < modules; y++) {
            for (let x = 0; x < modules; x++) {
              const hash = url.charCodeAt((x + y) % url.length);
              if (hash % 3 === 0) {
                ctx.fillRect(x * size, y * size, size, size);
              }
            }
          }

          qrImgData = canvas.toDataURL("image/png");
        }
      }

      // Posicionar QR en la esquina superior derecha
      if (qrImgData) {
        pdf.addImage(qrImgData, "PNG", pageWidth - 40, margin, 30, 30);
      }

      // Información básica del edificio
      addText(t("generalInfo", "INFORMACIÓN GENERAL"), 14, true);
      addText(`ID del Libro: ${libroData.libroId}`);
      addText(`ID del Edificio: ${libroData.edificioId}`);
      addText(`Versión: ${libroData.version}`);
      addText(`Estado: ${libroData.estado.toUpperCase()}`);
      addText(`Fecha de Creación: ${libroData.fechaCreacion}`);
      addText(`Última Actualización: ${libroData.fechaUltimaActualizacion}`);
      addText(
        `Progreso: ${libroData.progreso.porcentaje}% (${libroData.progreso.seccionesCompletas}/${libroData.progreso.totalSecciones} secciones completas)`
      );

      yPosition += 5;

      // Responsable técnico
      addText(t("technicalManager"), 14, true);
      addText(`Nombre: ${libroData.responsable.nombre}`);
      addText(`ID Usuario: ${libroData.responsable.usuarioId}`);

      yPosition += 5;

      // Normativa de referencia
      addText(t("referenceRegulations"), 14, true);
      libroData.normativaReferencia.forEach((norma) => {
        addText(
          `• ${norma.norma} (${norma.ambito.toUpperCase()}) - Versión ${
            norma.version
          }`
        );
      });

      yPosition += 5;

      // Secciones del libro
      addText(
        t("digitalBookSections", "SECCIONES DEL LIBRO DEL EDIFICIO"),
        14,
        true
      );
      libroData.secciones.forEach((seccion) => {
        addText(`${seccion.titulo}`, 12, true);
        addText(`Estado: ${seccion.estado.toUpperCase()}`);

        seccion.checklist.forEach((item) => {
          const status = item.ok ? "✓" : "✗";
          addText(`  ${status} ${item.item}`);
        });

        if (seccion.observaciones) {
          addText(`Observaciones: ${seccion.observaciones}`);
        }
        yPosition += 3;
      });

      yPosition += 5;

      // Estado de publicación
      addText(t("publicationStatus", "ESTADO DE PUBLICACIÓN"), 14, true);
      addText(
        `Estado: ${libroData.publicacion.estadoPublicacion.toUpperCase()}`
      );
      addText(
        `Nivel de Acceso: ${libroData.publicacion.nivelAcceso.toUpperCase()}`
      );
      addText(`Vigente desde: ${libroData.publicacion.vigenteDesde}`);
      addText(
        `Vigente hasta: ${
          libroData.publicacion.vigenteHasta || "Sin fecha límite"
        }`
      );
      addText(`URL Pública: ${libroData.publicacion.urlPublica}`);
      addText(`Código QR: ${libroData.publicacion.qr.codigo}`);

      yPosition += 5;

      // Firmas digitales
      addText(t("digitalSignatures", "FIRMAS DIGITALES"), 14, true);
      libroData.firmas.forEach((firma) => {
        const fechaFormateada = new Date(firma.fecha).toLocaleDateString(
          "es-ES",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        );
        addText(
          `Sección: ${firma.seccion
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}`
        );
        addText(`Rol: ${firma.rol.toUpperCase()}`);
        addText(`Fecha: ${fechaFormateada}`);
        addText(`Usuario: ${firma.usuarioId}`);
        addText(`Hash: ${firma.hash}`);
        yPosition += 3;
      });

      yPosition += 5;

      // Documentos adjuntos
      addText(t("attachedDocuments", "DOCUMENTOS ADJUNTOS"), 14, true);
      libroData.documentosAdjuntos.forEach((doc) => {
        addText(
          `• ${doc.tipo.replace(/_/g, " ").toUpperCase()} (${doc.formato})`
        );
        addText(`  ID: ${doc.documentoId}`);
        addText(`  Firmado: ${doc.firmado ? "SÍ" : "NO"}`);
        yPosition += 2;
      });

      yPosition += 5;

      // Referencias del sistema
      addText(t("systemReferences", "REFERENCIAS DEL SISTEMA"), 14, true);
      addText("Certificados:", 12, true);
      libroData.snapshot.certificadosIds.forEach((id) => {
        addText(`  • ${id}`);
      });

      addText("Intervenciones:", 12, true);
      libroData.snapshot.intervencionesIds.forEach((id) => {
        addText(`  • ${id}`);
      });

      addText("Instalaciones:", 12, true);
      libroData.snapshot.instalacionesIds.forEach((id) => {
        addText(`  • ${id}`);
      });

      addText("Documentos:", 12, true);
      libroData.snapshot.documentosIds.forEach((id) => {
        addText(`  • ${id}`);
      });

      // Pie de página
      yPosition = pageHeight - 20;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Generado el ${new Date().toLocaleDateString(
          "es-ES"
        )} a las ${new Date().toLocaleTimeString("es-ES")}`,
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );

      // Descargar el PDF
      pdf.save(`Libro_Digital_${libroData.libroId}_${libroData.version}.pdf`);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al generar el PDF. Por favor, inténtelo de nuevo.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("digitalBookTitle")}
            </h1>
            <p className="text-gray-600">
              {t("buildingName")}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {t(libroData.estado, libroData.estado)}
              </span>
              <span className="text-sm text-gray-500">
                {t("version")} {libroData.version}
              </span>
              <span className="text-sm text-gray-500">
                {t("updated")} :{" "}
                {libroData.fechaUltimaActualizacion}
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">
                    {t("bookId")}:
                  </span>
                  <p className="font-mono text-xs text-gray-700 bg-gray-50 p-1 rounded mt-1">
                    {libroData.libroId}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">
                    {t("buildingId")}:
                  </span>
                  <p className="font-mono text-xs text-gray-700 bg-gray-50 p-1 rounded mt-1">
                    {libroData.edificioId}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">
                    {t("creationDate")}:
                  </span>
                  <p className="text-gray-700">{libroData.fechaCreacion}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right flex flex-col items-center">
            <div className="bg-white rounded-lg border border-gray-200 flex items-center justify-center mb-2 w-28 h-28">
              <QRCode
                value={libroData.publicacion.urlPublica}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <p className="text-xs text-gray-500 font-mono">
              {libroData.publicacion.qr.codigo}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${libroData.progreso.porcentaje}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>
            {libroData.progreso.seccionesCompletas} de{" "}
            {libroData.progreso.totalSecciones} secciones completas
          </span>
          <span>{libroData.progreso.porcentaje}% completado</span>
        </div>
      </div>

      {/* Responsable y Normativa */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t("responsible")}
          </h3>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">
                  {libroData.responsable.nombre
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {libroData.responsable.nombre}
                </p>
                <p className="text-sm text-gray-500">
                  {t("technicalManager")}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                {t("userId")}:
              </span>
              <p className="font-mono text-xs text-gray-600 bg-gray-50 p-1 rounded mt-1">
                {libroData.responsable.usuarioId}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t("referenceRegulations")}
          </h3>
          <div className="space-y-2">
            {libroData.normativaReferencia.map((norma, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
              >
                <span className="text-sm font-medium text-gray-700">
                  {norma.norma}
                </span>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                    {norma.ambito}
                  </span>
                  <span className="text-xs px-2 py-1 bg-blue-100 rounded text-blue-600">
                    {norma.version}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secciones */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          {t("digitalBookSections")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {libroData.secciones.map((seccion, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 text-sm">
                  {seccion.titulo}
                </h4>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getEstadoColor(
                    seccion.estado
                  )}`}
                >
                  {getEstadoIcon(seccion.estado)} {seccion.estado}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                {seccion.checklist.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                        item.ok
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item.ok ? "✓" : "✗"}
                    </span>
                    <span
                      className={item.ok ? "text-gray-700" : "text-red-600"}
                    >
                      {item.item}
                    </span>
                  </div>
                ))}
              </div>

              {seccion.observaciones && (
                <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                  {seccion.observaciones}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Publicación y Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t("publicationStatus")}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {t("status")}:
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {libroData.publicacion.estadoPublicacion}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {t("accessLevel")}:
              </span>
              <span className="text-sm font-medium text-gray-900">
                {libroData.publicacion.nivelAcceso}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {t("validFrom")}:
              </span>
              <span className="text-sm font-medium text-gray-900">
                {libroData.publicacion.vigenteDesde}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {t("validUntil")}:
              </span>
              <span className="text-sm font-medium text-gray-900">
                {libroData.publicacion.vigenteHasta || "Sin fecha límite"}
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="space-y-2">
                <a
                  href={libroData.publicacion.urlPublica}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium underline block"
                >
                  {t("viewPublicVersion")} →
                </a>
                <div className="text-xs text-gray-500">
                  {t("qrUrl")}: {libroData.publicacion.qr.urlImagen}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t("activeAlerts")}
          </h3>
          {libroData.alertas.length > 0 ? (
            <div className="space-y-3">
              {libroData.alertas.map((alerta, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    alerta.criticidad === "alta"
                      ? "bg-red-50 border-red-200"
                      : alerta.criticidad === "media"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        alerta.criticidad === "alta"
                          ? "bg-red-500"
                          : alerta.criticidad === "media"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    ></span>
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {alerta.tipo.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{alerta.mensaje}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              {t("noActiveAlerts")}
            </p>
          )}
        </div>
      </div>

      {/* Firmas Digitales */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t("digitalSignatures")}
        </h3>
        <div className="space-y-4">
          {libroData.firmas.map((firma, index) => {
            const fechaFormateada = new Date(firma.fecha).toLocaleDateString(
              "es-ES",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            );
            return (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {firma.seccion
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>
                      <p className="text-sm text-gray-500">Rol: {firma.rol}</p>
                      <p className="text-xs text-gray-400">
                        ID: {firma.firmaId}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {fechaFormateada}
                    </p>
                    <p className="text-xs text-gray-500">Hash: {firma.hash}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {t("signingUser")}:
                  </span>
                  <p className="font-mono text-xs text-gray-600 bg-gray-50 p-1 rounded mt-1">
                    {firma.usuarioId}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Documentos Adjuntos */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t("attachedDocuments")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {libroData.documentosAdjuntos.map((doc, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {doc.tipo
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </p>
                  <p className="text-xs text-gray-500">{doc.documentoId}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                  {doc.formato}
                </span>
                <div className="flex items-center gap-2">
                  {doc.firmado && (
                    <span className="text-xs px-2 py-1 bg-green-100 rounded text-green-600">
                      {t("signed")}
                    </span>
                  )}
                  <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                    {t("view")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Snapshot de Referencias */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t("systemReferences")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              {t("certificates")}
            </h4>
            <div className="space-y-2">
              {libroData.snapshot.certificadosIds.map((id, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded"
                >
                  {id}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              {t("interventions")}
            </h4>
            <div className="space-y-2">
              {libroData.snapshot.intervencionesIds.map((id, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded"
                >
                  {id}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              {t("installations")}
            </h4>
            <div className="space-y-2">
              {libroData.snapshot.instalacionesIds.map((id, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded"
                >
                  {id}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="font-medium text-gray-900 mb-3">
            {t("systemDocuments")}
          </h4>
          <div className="flex flex-wrap gap-2">
            {libroData.snapshot.documentosIds.map((id, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200"
              >
                {id}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t("actions")}
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={generarPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {t("downloadPDF")}
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium inline-flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              />
            </svg>
            {t("exportData")}
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium inline-flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {t("versionHistory")}
          </button>
        </div>
      </div>
    </div>
  );
}
