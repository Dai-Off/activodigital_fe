import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ChartColumn } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';
import type { FinancialSnapshotSummary, RegistroTable } from '../OpportunityRadar';
import { formatMoneyShort } from '~/lib/utils';


const BuildingOpportunityRowPrint = ({ data }: { data: RegistroTable[] }) => {
    return (
        <>
            {data.map((value, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div>
                                <div style={{ fontSize: '14px', color: '#1f2937' }}>{value?.activo}</div> {/* text-gray-900 -> #1f2937 */}
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>{value.direccion}</div> {/* text-gray-500 -> #6b7280 */}
                            </div>
                        </div>
                    </td>
                    {/* Tipo */}
                    <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: '12px', color: '#4b5563' }}>{value.tipo}</span> {/* text-gray-700 -> #4b5563 */}
                    </td>
                    {/* Estado Actual */}
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#FFFFFF', backgroundColor: '#f59e0b', borderRadius: '4px', padding: '4px 8px', display: 'inline-block', width: '32px' }}>
                            {value.estado_actual}
                        </div> {/* bg-yellow-500 -> #f59e0b, text-white -> #FFFFFF */}
                    </td>
                    {/* Potencial */}
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#FFFFFF', backgroundColor: '#059669', borderRadius: '4px', padding: '4px 8px', display: 'inline-block', width: '32px' }}>
                            {value.potencial.letra}
                        </div> {/* bg-green-600 -> #059669, text-white -> #FFFFFF */}
                        <div style={{ fontSize: '12px', color: '#059669' }}>{value.potencial.variacion}</div> {/* text-green-600 -> #059669 */}
                    </td>
                    {/* TIR */}
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', color: '#1e40af' }}>{value.tir.valor}</div> {/* text-blue-800 -> #1e40af */}
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{value.tir.plazo}</div> {/* text-gray-500 -> #6b7280 */}
                    </td>
                    {/* Cash on Cash */}
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', color: '#047857' }}>{value.cash_on_cash.valor}</div> {/* text-emerald-700 -> #047857 */}
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{value.cash_on_cash.multiplicador} mult.</div> {/* text-gray-500 -> #6b7280 */}
                    </td>
                    {/* CAPEX */}
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', color: '#1f2937' }}>{value.capex.total}€</div> {/* text-gray-900 -> #1f2937 */}
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{value.capex.descripcion}</div> {/* text-gray-500 -> #6b7280 */}
                    </td>
                    {/* Subvención */}
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', color: '#059669' }}>{value.subvencion.valor}€</div> {/* text-green-600 -> #059669 */}
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{value.subvencion.porcentaje}</div> {/* text-gray-500 -> #6b7280 */}
                    </td>
                    {/* Green Premium */}
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', color: '#047857' }}>{value.green_premium.valor}€</div> {/* text-green-700 -> #047857 */}
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{value.green_premium.roi}</div> {/* text-gray-500 -> #6b7280 */}
                    </td>
                    {/* Plazo */}
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#4b5563' }}>{value.plazo}</span> {/* text-gray-700 -> #4b5563 */}
                    </td>
                    {/* Taxonomía */}
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', color: '#1f2937' }}>{value.taxonomia.porcentaje}</div> {/* text-gray-900 -> #1f2937 */}
                    </td>
                    {/* Estado */}
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <div style={{
                            fontSize: '12px', fontWeight: '500', borderRadius: '4px', padding: '4px 8px',
                            backgroundColor: value?.estado?.etiqueta === "Bank-Ready" ? '#d1fae5' : '#fff7ed', // bg-green-100 / bg-orange-100
                            color: value?.estado?.etiqueta === "Bank-Ready" ? '#047857' : '#ea580c' // text-green-700 / text-orange-700
                        }}>
                            {value.estado.etiqueta}
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
};

// Componente principal de la vista estática: Actualizado con estilos HEX/RGB
const PrintableRadar = ({ dataFiltrada, summary }: { dataFiltrada: RegistroTable[], summary: FinancialSnapshotSummary }) => (
    <div id="pdf-content-container" style={{ padding: '24px', backgroundColor: '#FFFFFF', width: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ backgroundColor: '#1e3a8a', color: '#FFFFFF', padding: '12px', borderRadius: '12px' }}>
                    <ChartColumn style={{ width: 24, height: 24 }} />
                </div>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Radar de Oportunidades</h1>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Análisis de cartera para financiación verde institucional</p>
                </div>
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Reporte generado el {new Date().toLocaleDateString()}
            </div>
        </div>

        {/* CARDS HEADER */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {/* Usando estilos directos en lugar de clases de Tailwind problemáticas */}
            <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Total Activos</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af', margin: 0 }}>{summary?.total_activos}</p>
            </div>
            <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>CAPEX Total</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#f97316', margin: 0 }}>{formatMoneyShort(summary?.capex_total)}€</p>
            </div>
            <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Valor Creado</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669', margin: 0 }}>{formatMoneyShort(summary?.valor_creado)}€</p>
            </div>
            <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>TIR Promedio</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#9333ea', margin: 0 }}>{summary?.tir_promedio}%</p>
            </div>
        </div>

        {/* TABLA DE OPORTUNIDADES */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                        {/* ... (Encabezados de columna) ... */}
                        <tr>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#4b5563' }}>Activo</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#4b5563' }}>Tipo</th>
                            <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', color: '#4b5563' }}>Estado Actual</th>
                            <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', color: '#4b5563' }}>Potencial</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', color: '#4b5563' }}>TIR</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', color: '#4b5563' }}>Cash on Cash</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', color: '#4b5563' }}>CAPEX</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', color: '#4b5563' }}>Subvención</th>
                            <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', color: '#4b5563' }}>Green Premium</th>
                            <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', color: '#4b5563' }}>Plazo</th>
                            <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', color: '#4b5563' }}>Taxonomía</th>
                            <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', color: '#4b5563' }}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <BuildingOpportunityRowPrint data={dataFiltrada} />
                    </tbody>
                </table>
            </div>
        </div>

        {/* LEYENDA */}
        <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', marginTop: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563', marginBottom: '12px' }}>Leyenda</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', fontSize: '12px' }}>
                {/* ... (Contenido de leyenda con estilos en línea) ... */}
                <div>
                    <span style={{ color: '#6b7280', fontWeight: '500' }}>TIR:</span>
                    <span style={{ color: '#1f2937', marginLeft: '4px' }}>Tasa Interna de Retorno proyectada a 5 años</span>
                </div>
                <div>
                    <span style={{ color: '#6b7280', fontWeight: '500' }}>Cash on Cash:</span>
                    <span style={{ color: '#1f2937', marginLeft: '4px' }}>Rentabilidad anual del equity después de deuda</span>
                </div>
                <div>
                    <span style={{ color: '#6b7280', fontWeight: '500' }}>Green Premium:</span>
                    <span style={{ color: '#1f2937', marginLeft: '4px' }}>Valor creado por mejoras ESG</span>
                </div>
            </div>
        </div>
    </div>
);
export const exportToPdf = async (data: RegistroTable[], summary: FinancialSnapshotSummary, fileName: string = "Radar_Oportunidades.pdf") => {
    const htmlContent = ReactDOMServer.renderToString(
        <PrintableRadar dataFiltrada={data} summary={summary} />
    );

    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = htmlContent;

    document.body.appendChild(tempContainer);

    try {
        const canvas = await html2canvas(tempContainer.firstChild as HTMLElement, {
            scale: 2,
            useCORS: true,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' para layout horizontal (paisaje)
        const imgWidth = 297; // Ancho A4 en mm (paisaje)
        const pageHeight = 210; // Alto A4 en mm (paisaje)
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(fileName);

    } catch (error) {
        console.error("Error al generar el PDF:", error);
        alert("Hubo un error al generar el PDF.");
    } finally {
        document.body.removeChild(tempContainer);
    }
};