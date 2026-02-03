#!/usr/bin/env node

/**
 * GENERADOR DE INFORMES DE AUDITORÍA
 * Genera documentos Word profesionales basados en análisis algorítmicos
 * Pasivo No Corriente - Deudas y Previsiones
 */

const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType,
        PageBreak, Header, Footer, PageNumber, LevelFormat } = require('docx');
const fs = require('fs');

// ============================================================================
// CONFIGURACIÓN DEL INFORME
// ============================================================================

const CONFIG_INFORME = {
    titulo: "INFORME DE AUDITORÍA DE SISTEMAS Y ALGORITMOS",
    subtitulo: "ANÁLISIS DE PASIVO NO CORRIENTE",
    referencia: "Evaluación de Salida Algorítmica y Detección de Anomalías",
    fecha: new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' }),
    responsable: "Sistema de Auditoría Algorítmica",
    version: "1.0"
};

// ============================================================================
// DATOS DE EJEMPLO (EN PRODUCCIÓN VENDRÍAN DEL ANÁLISIS)
// ============================================================================

const DATOS_ANALISIS = {
    deudas: {
        total: 30,
        montoOriginal: 145750000.50,
        saldoPendiente: 98450250.75,
        anomalias: 3,
        porcentajeDeteccion: 87,
        tiposDeuda: [
            { tipo: "Préstamo Bancario a Largo Plazo", monto: 35250000.00, porcentaje: 35.8 },
            { tipo: "Bonos Emitidos", monto: 28150000.50, porcentaje: 28.6 },
            { tipo: "Hipoteca Inmobiliaria", monto: 18500000.25, porcentaje: 18.8 },
            { tipo: "Arrendamiento Financiero", monto: 10200000.00, porcentaje: 10.4 },
            { tipo: "Obligaciones Negociables", monto: 6350250.00, porcentaje: 6.4 }
        ],
        estados: [
            { estado: "Activa", cantidad: 22, porcentaje: 73.3 },
            { estado: "Pagada", cantidad: 5, porcentaje: 16.7 },
            { estado: "Incumplida", cantidad: 2, porcentaje: 6.7 },
            { estado: "Refinanciada", cantidad: 1, porcentaje: 3.3 }
        ]
    },
    previsiones: {
        total: 30,
        montoEstimado: 52850000.00,
        anomalias: 4,
        porcentajeDeteccion: 85,
        tiposProvision: [
            { tipo: "Garantías", monto: 18250000.00, porcentaje: 34.5 },
            { tipo: "Litigios", monto: 15680000.00, porcentaje: 29.7 },
            { tipo: "Cobranzas Dudosas", monto: 10920000.00, porcentaje: 20.7 },
            { tipo: "Reestructuración", monto: 5200000.00, porcentaje: 9.8 },
            { tipo: "Desmantelamiento", monto: 2800000.00, porcentaje: 5.3 }
        ],
        estados: [
            { estado: "Activa", cantidad: 18, porcentaje: 60.0 },
            { estado: "Utilizada", cantidad: 6, porcentaje: 20.0 },
            { estado: "Revertida", cantidad: 4, porcentaje: 13.3 },
            { estado: "Ajustada", cantidad: 2, porcentaje: 6.7 }
        ]
    }
};

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

function formatearMoneda(monto) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    }).format(monto);
}

function crearBorde() {
    return {
        style: BorderStyle.SINGLE,
        size: 1,
        color: "CCCCCC"
    };
}

function crearBordes() {
    const borde = crearBorde();
    return {
        top: borde,
        bottom: borde,
        left: borde,
        right: borde
    };
}

// ============================================================================
// SECCIONES DEL DOCUMENTO
// ============================================================================

function crearPortada() {
    return [
        new Paragraph({
            children: [new TextRun({
                text: CONFIG_INFORME.titulo,
                bold: true,
                size: 36,
                font: "Arial"
            })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 2880, after: 480 }
        }),
        new Paragraph({
            children: [new TextRun({
                text: CONFIG_INFORME.subtitulo,
                bold: true,
                size: 28,
                font: "Arial"
            })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 960 }
        }),
        new Paragraph({
            children: [new TextRun({
                text: CONFIG_INFORME.referencia,
                italics: true,
                size: 22,
                font: "Arial"
            })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 1440 }
        }),
        new Paragraph({
            children: [new TextRun({
                text: `Fecha: ${CONFIG_INFORME.fecha}`,
                size: 22,
                font: "Arial"
            })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 }
        }),
        new Paragraph({
            children: [new TextRun({
                text: `Responsable: ${CONFIG_INFORME.responsable}`,
                size: 22,
                font: "Arial"
            })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 }
        }),
        new Paragraph({
            children: [new TextRun({
                text: `Versión: ${CONFIG_INFORME.version}`,
                size: 22,
                font: "Arial"
            })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 2880 }
        }),
        new Paragraph({
            children: [new PageBreak()]
        })
    ];
}

function crearResumenEjecutivo() {
    const totalPasivoNC = DATOS_ANALISIS.deudas.saldoPendiente + DATOS_ANALISIS.previsiones.montoEstimado;
    const totalRegistros = DATOS_ANALISIS.deudas.total + DATOS_ANALISIS.previsiones.total;
    const totalAnomalias = DATOS_ANALISIS.deudas.anomalias + DATOS_ANALISIS.previsiones.anomalias;
    const promedioDeteccion = ((DATOS_ANALISIS.deudas.porcentajeDeteccion + DATOS_ANALISIS.previsiones.porcentajeDeteccion) / 2).toFixed(1);

    return [
        new Paragraph({
            text: "1. RESUMEN EJECUTIVO",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 480, after: 240 }
        }),
        new Paragraph({
            children: [new TextRun({
                text: "El presente informe técnico evalúa los algoritmos desplegados en la plataforma de análisis, diseñados para el procesamiento y auditoría del Pasivo No Corriente. El sistema analiza estructuras de datos contables para identificar inconsistencias que podrían indicar errores materiales o irregularidades.",
                size: 24,
                font: "Arial"
            })],
            spacing: { after: 240 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: "Alcance: ", bold: true, size: 24, font: "Arial" }),
                new TextRun({ text: "Revisión de la lógica de procesamiento, detección de anomalías mediante Isolation Forest, y cumplimiento normativo (FACPCE/ISA).", size: 24, font: "Arial" })
            ],
            spacing: { after: 240 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: "Conclusión: ", bold: true, size: 24, font: "Arial" }),
                new TextRun({ text: `El sistema es Apto para soporte de decisiones de auditoría, con una capacidad de detección preventiva superior al ${promedioDeteccion}% en escenarios de prueba.`, size: 24, font: "Arial" })
            ],
            spacing: { after: 480 }
        }),
        new Paragraph({
            text: "Métricas Clave del Análisis",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 240 }
        }),
        crearTablaMetricas(totalPasivoNC, totalRegistros, totalAnomalias),
        new Paragraph({
            children: [new PageBreak()]
        })
    ];
}

function crearTablaMetricas(totalPasivoNC, totalRegistros, totalAnomalias) {
    const borders = crearBordes();

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [4680, 4680],
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                        margins: { top: 120, bottom: 120, left: 180, right: 180 },
                        width: { size: 4680, type: WidthType.DXA },
                        children: [new Paragraph({
                            children: [new TextRun({ text: "Métrica", bold: true, size: 24, font: "Arial" })],
                            alignment: AlignmentType.CENTER
                        })]
                    }),
                    new TableCell({
                        borders,
                        shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                        margins: { top: 120, bottom: 120, left: 180, right: 180 },
                        width: { size: 4680, type: WidthType.DXA },
                        children: [new Paragraph({
                            children: [new TextRun({ text: "Valor", bold: true, size: 24, font: "Arial" })],
                            alignment: AlignmentType.CENTER
                        })]
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        margins: { top: 120, bottom: 120, left: 180, right: 180 },
                        width: { size: 4680, type: WidthType.DXA },
                        children: [new Paragraph({ children: [new TextRun({ text: "Total Pasivo No Corriente", size: 22, font: "Arial" })] })]
                    }),
                    new TableCell({
                        borders,
                        margins: { top: 120, bottom: 120, left: 180, right: 180 },
                        width: { size: 4680, type: WidthType.DXA },
                        children: [new Paragraph({
                            children: [new TextRun({ text: formatearMoneda(totalPasivoNC), bold: true, size: 22, font: "Arial" })],
                            alignment: AlignmentType.RIGHT
                        })]
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        margins: { top: 120, bottom: 120, left: 180, right: 180 },
                        width: { size: 4680, type: WidthType.DXA },
                        children: [new Paragraph({ children: [new TextRun({ text: "Total de Registros Analizados", size: 22, font: "Arial" })] })]
                    }),
                    new TableCell({
                        borders,
                        margins: { top: 120, bottom: 120, left: 180, right: 180 },
                        width: { size: 4680, type: WidthType.DXA },
                        children: [new Paragraph({
                            children: [new TextRun({ text: totalRegistros.toString(), bold: true, size: 22, font: "Arial" })],
                            alignment: AlignmentType.RIGHT
                        })]
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        margins: { top: 120, bottom: 120, left: 180, right: 180 },
                        width: { size: 4680, type: WidthType.DXA },
                        children: [new Paragraph({ children: [new TextRun({ text: "Anomalías Detectadas", size: 22, font: "Arial" })] })]
                    }),
                    new TableCell({
                        borders,
                        margins: { top: 120, bottom: 120, left: 180, right: 180 },
                        width: { size: 4680, type: WidthType.DXA },
                        shading: { fill: "FFE6E6", type: ShadingType.CLEAR },
                        children: [new Paragraph({
                            children: [new TextRun({ text: totalAnomalias.toString(), bold: true, size: 22, font: "Arial", color: "CC0000" })],
                            alignment: AlignmentType.RIGHT
                        })]
                    })
                ]
            })
        ]
    });
}

function crearAnalisisNormas() {
    return [
        new Paragraph({
            text: "2. ANÁLISIS BAJO NORMAS NACIONALES (ARGENTINA)",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 480, after: 240 }
        }),
        new Paragraph({
            text: "2.1. RT 37 y RT 41 (FACPCE)",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 240 }
        }),
        new Paragraph({
            children: [new TextRun({
                text: 'El algoritmo se alinea con la Resolución Técnica 37, proporcionando "elementos de juicio válidos y suficientes". La automatización reduce el riesgo de detección del auditor al aplicar procedimientos analíticos sobre el 100% del universo de datos, superando las limitaciones del muestreo tradicional (ISA 530). Bajo RT 41, el sistema fortalece el control interno al segregar la lógica de cálculo del operador humano.',
                size: 24,
                font: "Arial"
            })],
            spacing: { after: 240 }
        }),
        new Paragraph({
            text: "2.2. Ley 25.506 y Ley 25.326",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 240 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: "Trazabilidad: ", bold: true, size: 24, font: "Arial" }),
                new TextRun({ text: "Se recomienda que los reportes de salida sean exportados con hash SHA-256 para garantizar la integridad documental según la Ley de Firma Digital.", size: 24, font: "Arial" })
            ],
            spacing: { after: 240 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: "Protección de Datos: ", bold: true, size: 24, font: "Arial" }),
                new TextRun({ text: "Dado que el algoritmo analiza datos del Pasivo No Corriente, la salida debe cumplir con la Ley de Protección de Datos Personales, aplicando técnicas de anonimización en los campos de identificación de entidades.", size: 24, font: "Arial" })
            ],
            spacing: { after: 480 }
        }),
        new Paragraph({
            children: [new PageBreak()]
        })
    ];
}

function crearAnalisisInternacional() {
    return [
        new Paragraph({
            text: "3. ANÁLISIS BAJO NORMAS INTERNACIONALES",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 480, after: 240 }
        }),
        new Paragraph({
            text: "3.1. ISA 315 y 520 (Procedimientos Analíticos)",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 240 }
        }),
        new Paragraph({
            children: [new TextRun({
                text: 'El algoritmo funciona como un Procedimiento Analítico Sustantivo. Al comparar los datos declarados contra las variables detectadas, el sistema identifica "fluctuaciones o relaciones inconsistentes" que requieren investigación adicional por parte del auditor.',
                size: 24,
                font: "Arial"
            })],
            spacing: { after: 240 }
        }),
        new Paragraph({
            text: "3.2. Marco COSO (Control Interno)",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 240 }
        }),
        new Paragraph({
            children: [new TextRun({
                text: "El sistema impacta directamente en el componente de Actividades de Control. La robustez del código en Python permite una vigilancia continua, transformando la auditoría de \"ex-post\" a una de \"tiempo real\" (Continuous Auditing).",
                size: 24,
                font: "Arial"
            })],
            spacing: { after: 480 }
        }),
        new Paragraph({
            children: [new PageBreak()]
        })
    ];
}

function crearAnalisisDeudas() {
    return [
        new Paragraph({
            text: "4. ANÁLISIS DETALLADO: DEUDAS NO CORRIENTES",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 480, after: 240 }
        }),
        new Paragraph({
            text: "4.1. Resumen General",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 240 }
        }),
        new Paragraph({
            children: [new TextRun({
                text: `Se analizaron ${DATOS_ANALISIS.deudas.total} registros de deudas a largo plazo, con un monto original de ${formatearMoneda(DATOS_ANALISIS.deudas.montoOriginal)} y un saldo pendiente actual de ${formatearMoneda(DATOS_ANALISIS.deudas.saldoPendiente)}.`,
                size: 24,
                font: "Arial"
            })],
            spacing: { after: 240 }
        }),
        new Paragraph({
            text: "4.2. Distribución por Tipo de Deuda",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 240 }
        }),
        crearTablaTiposDeuda(),
        new Paragraph({
            text: "4.3. Distribución por Estado",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 480, after: 240 }
        }),
        crearTablaEstadosDeuda(),
        new Paragraph({
            text: "4.4. Detección de Anomalías",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 480, after: 240 }
        }),
        new Paragraph({
            children: [new TextRun({
                text: `El algoritmo Isolation Forest detectó ${DATOS_ANALISIS.deudas.anomalias} anomalías potenciales (${DATOS_ANALISIS.deudas.porcentajeDeteccion}% de efectividad). Estas deudas presentan características atípicas en cuanto a saldo pendiente, tasa de interés o plazo, y requieren revisión adicional.`,
                size: 24,
                font: "Arial"
            })],
            spacing: { after: 240 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: "Recomendación: ", bold: true, size: 24, font: "Arial", color: "CC0000" }),
                new TextRun({ text: "Investigar las deudas marcadas como anómalas para verificar su legitimidad y cumplimiento contractual.", size: 24, font: "Arial" })
            ],
            spacing: { after: 480 }
        }),
        new Paragraph({
            children: [new PageBreak()]
        })
    ];
}

function crearTablaTiposDeuda() {
    const borders = crearBordes();
    const rows = [
        new TableRow({
            children: [
                new TableCell({
                    borders,
                    shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                    margins: { top: 120, bottom: 120, left: 180, right: 180 },
                    width: { size: 5850, type: WidthType.DXA },
                    children: [new Paragraph({
                        children: [new TextRun({ text: "Tipo de Deuda", bold: true, size: 22, font: "Arial" })],
                        alignment: AlignmentType.CENTER
                    })]
                }),
                new TableCell({
                    borders,
                    shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                    margins: { top: 120, bottom: 120, left: 180, right: 180 },
                    width: { size: 2340, type: WidthType.DXA },
                    children: [new Paragraph({
                        children: [new TextRun({ text: "Monto", bold: true, size: 22, font: "Arial" })],
                        alignment: AlignmentType.CENTER
                    })]
                }),
                new TableCell({
                    borders,
                    shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                    margins: { top: 120, bottom: 120, left: 180, right: 180 },
                    width: { size: 1170, type: WidthType.DXA },
                    children: [new Paragraph({
                        children: [new TextRun({ text: "%", bold: true, size: 22, font: "Arial" })],
                        alignment: AlignmentType.CENTER
                    })]
                })
            ]
        })
    ];

    DATOS_ANALISIS.deudas.tiposDeuda.forEach(tipo => {
        rows.push(new TableRow({
            children: [
                new TableCell({
                    borders,
                    margins: { top: 100, bottom: 100, left: 180, right: 180 },
                    width: { size: 5850, type: WidthType.DXA },
                    children: [new Paragraph({ children: [new TextRun({ text: tipo.tipo, size: 20, font: "Arial" })] })]
                }),
                new TableCell({
                    borders,
                    margins: { top: 100, bottom: 100, left: 180, right: 180 },
                    width: { size: 2340, type: WidthType.DXA },
                    children: [new Paragraph({
                        children: [new TextRun({ text: formatearMoneda(tipo.monto), size: 20, font: "Arial" })],
                        alignment: AlignmentType.RIGHT
                    })]
                }),
                new TableCell({
                    borders,
                    margins: { top: 100, bottom: 100, left: 180, right: 180 },
                    width: { size: 1170, type: WidthType.DXA },
                    children: [new Paragraph({
                        children: [new TextRun({ text: `${tipo.porcentaje}%`, size: 20, font: "Arial" })],
                        alignment: AlignmentType.RIGHT
                    })]
                })
            ]
        }));
    });

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [5850, 2340, 1170],
        rows: rows
    });
}

function crearTablaEstadosDeuda() {
    const borders = crearBordes();
    const rows = [
        new TableRow({
            children: [
                new TableCell({
                    borders,
                    shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                    margins: { top: 120, bottom: 120, left: 180, right: 180 },
                    width: { size: 4680, type: WidthType.DXA },
                    children: [new Paragraph({
                        children: [new TextRun({ text: "Estado", bold: true, size: 22, font: "Arial" })],
                        alignment: AlignmentType.CENTER
                    })]
                }),
                new TableCell({
                    borders,
                    shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                    margins: { top: 120, bottom: 120, left: 180, right: 180 },
                    width: { size: 3120, type: WidthType.DXA },
                    children: [new Paragraph({
                        children: [new TextRun({ text: "Cantidad", bold: true, size: 22, font: "Arial" })],
                        alignment: AlignmentType.CENTER
                    })]
                }),
                new TableCell({
                    borders,
                    shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                    margins: { top: 120, bottom: 120, left: 180, right: 180 },
                    width: { size: 1560, type: WidthType.DXA },
                    children: [new Paragraph({
                        children: [new TextRun({ text: "Porcentaje", bold: true, size: 22, font: "Arial" })],
                        alignment: AlignmentType.CENTER
                    })]
                })
            ]
        })
    ];

    DATOS_ANALISIS.deudas.estados.forEach(estado => {
        rows.push(new TableRow({
            children: [
                new TableCell({
                    borders,
                    margins: { top: 100, bottom: 100, left: 180, right: 180 },
                    width: { size: 4680, type: WidthType.DXA },
                    children: [new Paragraph({ children: [new TextRun({ text: estado.estado, size: 20, font: "Arial" })] })]
                }),
                new TableCell({
                    borders,
                    margins: { top: 100, bottom: 100, left: 180, right: 180 },
                    width: { size: 3120, type: WidthType.DXA },
                    children: [new Paragraph({
                        children: [new TextRun({ text: estado.cantidad.toString(), size: 20, font: "Arial" })],
                        alignment: AlignmentType.CENTER
                    })]
                }),
                new TableCell({
                    borders,
                    margins: { top: 100, bottom: 100, left: 180, right: 180 },
                    width: { size: 1560, type: WidthType.DXA },
                    children: [new Paragraph({
                        children: [new TextRun({ text: `${estado.porcentaje}%`, size: 20, font: "Arial" })],
                        alignment: AlignmentType.RIGHT
                    })]
                })
            ]
        }));
    });

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [4680, 3120, 1560],
        rows: rows
    });
}

function crearAnalisisPrevisiones() {
    return [
        new Paragraph({
            text: "5. ANÁLISIS DETALLADO: PREVISIONES",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 480, after: 240 }
        }),
        new Paragraph({
            text: "5.1. Resumen General",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 240 }
        }),
        new Paragraph({
            children: [new TextRun({
                text: `Se analizaron ${DATOS_ANALISIS.previsiones.total} previsiones contables con un monto total estimado de ${formatearMoneda(DATOS_ANALISIS.previsiones.montoEstimado)}. Estas previsiones representan obligaciones potenciales que deben ser reconocidas conforme a las normas contables vigentes.`,
                size: 24,
                font: "Arial"
            })],
            spacing: { after: 240 }
        }),
        new Paragraph({
            text: "5.2. Distribución por Tipo de Previsión",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 240 }
        }),
        crearTablaTiposProvision(),
        new Paragraph({
            text: "5.3. Distribución por Estado",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 480, after: 240 }
        }),
        crearTablaEstadosProvision(),
        new Paragraph({
            text: "5.4. Detección de Anomalías",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 480, after: 240 }
        }),
        new Paragraph({
            children: [new TextRun({
                text: `El sistema detectó ${DATOS_ANALISIS.previsiones.anomalias} previsiones con características atípicas (${DATOS_ANALISIS.previsiones.porcentajeDeteccion}% de efectividad). Estas anomalías pueden indicar provisiones sobrevaloradas, subvaloradas o con probabilidades de ocurrencia inconsistentes.`,
                size: 24,
                font: "Arial"
            })],
            spacing: { after: 240 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: "Recomendación: ", bold: true, size: 24, font: "Arial", color: "CC0000" }),
                new TextRun({ text: "Revisar las estimaciones y probabilidades de las previsiones anómalas, considerando la evidencia disponible y la experiencia histórica.", size: 24, font: "Arial" })
            ],
            spacing: { after: 480 }
        }),
        new Paragraph({
            children: [new PageBreak()]
        })
    ];
}

function crearTablaTiposProvision() {
    const borders = crearBordes();
    const rows = [
        new TableRow({
            children: [
                new TableCell({
                    borders,
                    shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                    margins: { top: 120, bottom: 120, left: 180, right: 180 },
                    width: { size: 5850, type: WidthType.DXA },
                    children: [new Paragraph({
                        children: [new TextRun({ text: "Tipo de Previsión", bold: true, size: 22, font: "Arial" })],
                        alignment: AlignmentType.CENTER
                    })]
                }),
                new TableCell({
                    borders,
                    shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                    margins: { top: 120, bottom: 120, left: 180, right: 180 },
                    width: { size: 2340, type: WidthType.DXA },
                    children: [new Paragraph({
                        children: [new TextRun({ text: "Monto", bold: true, size: 22, font: "Arial" })],
                        alignment: AlignmentType.CENTER
                    })]
                }),
                new TableCell({
                    borders,
                    shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                    margins: { top: 120, bottom: 120, left: 180, right: 180 },
                    width: { size: 1170, type: WidthType.DXA },
                    children: [new Paragraph({
                        children: [new TextRun({ text: "%", bold: true, size: 22, font: "Arial" })],
                        alignment: AlignmentType.CENTER
                    })]
                })
            ]
        })
    ];

    DATOS_ANALISIS.previsiones.tiposProvision.forEach(tipo => {
        rows.push(new TableRow({
            children: [
                new TableCell({
                    borders,
                    margins: { top: 100, bottom: 100, left: 180, right: 180 },
                    width: { size: 5850, type: WidthType.DXA },
                    children: [new Paragraph({ children: [new TextRun({ text: tipo.tipo, size: 20, font: "Arial" })] })]
                }),
                new TableCell({
                    borders,
                    margins: { top: 100, bottom: 100, left: 180, right: 180 },
                    width: { size: 2340, type: WidthType.DXA },
                    children: [new Paragraph({
                        children: [new TextRun({ text: formatearMoneda(tipo.monto), size: 20, font: "Arial" })],
                        alignment: AlignmentType.RIGHT
                    })]
                }),
                new TableCell({
                    borders,
                    margins: { top: 100, bottom: 100, left: 180, right: 180 },
                    width: { size: 1170, type: WidthType.DXA },
                    children: [new Paragraph({
                        children: [new TextRun({ text: `${tipo.porcentaje}%`, size: 20, font: "Arial" })],
                        alignment: AlignmentType.RIGHT
                    })]
                })
            ]
        }));
    });

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [5850, 2340, 1170],
        rows: rows
    });
}

function crearTablaEstadosProvision() {
    const borders = crearBordes();
    const rows = [
        new TableRow({
            children: [
                new TableCell({
                    borders,
                    shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                    margins: { top: 120, bottom: 120, left: 180, right: 180 },
                    width: { size: 4680, type: WidthType.DXA },
                    children: [new Paragraph({
                        children: [new TextRun({ text: "Estado", bold: true, size: 22, font: "Arial" })],
                        alignment: AlignmentType.CENTER
                    })]
                }),
                new TableCell({
                    borders,
                    shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                    margins: { top: 120, bottom: 120, left: 180, right: 180 },
                    width: { size: 3120, type: WidthType.DXA },
                    children: [new Paragraph({
                        children: [new TextRun({ text: "Cantidad", bold: true, size: 22, font: "Arial" })],
                        alignment: AlignmentType.CENTER
                    })]
                }),
                new TableCell({
                    borders,
                    shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                    margins: { top: 120, bottom: 120, left: 180, right: 180 },
                    width: { size: 1560, type: WidthType.DXA },
                    children: [new Paragraph({
                        children: [new TextRun({ text: "Porcentaje", bold: true, size: 22, font: "Arial" })],
                        alignment: AlignmentType.CENTER
                    })]
                })
            ]
        })
    ];

    DATOS_ANALISIS.previsiones.estados.forEach(estado => {
        rows.push(new TableRow({
            children: [
                new TableCell({
                    borders,
                    margins: { top: 100, bottom: 100, left: 180, right: 180 },
                    width: { size: 4680, type: WidthType.DXA },
                    children: [new Paragraph({ children: [new TextRun({ text: estado.estado, size: 20, font: "Arial" })] })]
                }),
                new TableCell({
                    borders,
                    margins: { top: 100, bottom: 100, left: 180, right: 180 },
                    width: { size: 3120, type: WidthType.DXA },
                    children: [new Paragraph({
                        children: [new TextRun({ text: estado.cantidad.toString(), size: 20, font: "Arial" })],
                        alignment: AlignmentType.CENTER
                    })]
                }),
                new TableCell({
                    borders,
                    margins: { top: 100, bottom: 100, left: 180, right: 180 },
                    width: { size: 1560, type: WidthType.DXA },
                    children: [new Paragraph({
                        children: [new TextRun({ text: `${estado.porcentaje}%`, size: 20, font: "Arial" })],
                        alignment: AlignmentType.RIGHT
                    })]
                })
            ]
        }));
    });

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [4680, 3120, 1560],
        rows: rows
    });
}

function crearMatrizRiesgos() {
    return [
        new Paragraph({
            text: "6. MATRIZ DE RIESGOS Y RECOMENDACIONES",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 480, after: 240 }
        }),
        crearTablaRiesgos(),
        new Paragraph({
            children: [new PageBreak()]
        })
    ];
}

function crearTablaRiesgos() {
    const borders = crearBordes();

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [2808, 2808, 1872, 1872],
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                        margins: { top: 120, bottom: 120, left: 180, right: 180 },
                        width: { size: 2808, type: WidthType.DXA },
                        children: [new Paragraph({
                            children: [new TextRun({ text: "Riesgo Identificado", bold: true, size: 20, font: "Arial" })],
                            alignment: AlignmentType.CENTER
                        })]
                    }),
                    new TableCell({
                        borders,
                        shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                        margins: { top: 120, bottom: 120, left: 180, right: 180 },
                        width: { size: 2808, type: WidthType.DXA },
                        children: [new Paragraph({
                            children: [new TextRun({ text: "Impacto", bold: true, size: 20, font: "Arial" })],
                            alignment: AlignmentType.CENTER
                        })]
                    }),
                    new TableCell({
                        borders,
                        shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                        margins: { top: 120, bottom: 120, left: 180, right: 180 },
                        width: { size: 1872, type: WidthType.DXA },
                        children: [new Paragraph({
                            children: [new TextRun({ text: "Probabilidad", bold: true, size: 20, font: "Arial" })],
                            alignment: AlignmentType.CENTER
                        })]
                    }),
                    new TableCell({
                        borders,
                        shading: { fill: "D5E8F0", type: ShadingType.CLEAR },
                        margins: { top: 120, bottom: 120, left: 180, right: 180 },
                        width: { size: 1872, type: WidthType.DXA },
                        children: [new Paragraph({
                            children: [new TextRun({ text: "Nivel", bold: true, size: 20, font: "Arial" })],
                            alignment: AlignmentType.CENTER
                        })]
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        margins: { top: 100, bottom: 100, left: 180, right: 180 },
                        width: { size: 2808, type: WidthType.DXA },
                        children: [new Paragraph({ children: [new TextRun({ text: "Anomalías no investigadas", size: 18, font: "Arial" })] })]
                    }),
                    new TableCell({
                        borders,
                        margins: { top: 100, bottom: 100, left: 180, right: 180 },
                        width: { size: 2808, type: WidthType.DXA },
                        children: [new Paragraph({ children: [new TextRun({ text: "Potenciales errores materiales", size: 18, font: "Arial" })] })]
                    }),
                    new TableCell({
                        borders,
                        margins: { top: 100, bottom: 100, left: 180, right: 180 },
                        width: { size: 1872, type: WidthType.DXA },
                        children: [new Paragraph({
                            children: [new TextRun({ text: "Media", size: 18, font: "Arial" })],
                            alignment: AlignmentType.CENTER
                        })]
                    }),
                    new TableCell({
                        borders,
                        shading: { fill: "FFE6CC", type: ShadingType.CLEAR },
                        margins: { top: 100, bottom: 100, left: 180, right: 180 },
                        width: { size: 1872, type: WidthType.DXA },
                        children: [new Paragraph({
                            children: [new TextRun({ text: "Medio", bold: true, size: 18, font: "Arial" })],
                            alignment: AlignmentType.CENTER
                        })]
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        margins: { top: 100, bottom: 100, left: 180, right: 180 },
                        width: { size: 2808, type: WidthType.DXA },
                        children: [new Paragraph({ children: [new TextRun({ text: "Deudas incumplidas", size: 18, font: "Arial" })] })]
                    }),
                    new TableCell({
                        borders,
                        margins: { top: 100, bottom: 100, left: 180, right: 180 },
                        width: { size: 2808, type: WidthType.DXA },
                        children: [new Paragraph({ children: [new TextRun({ text: "Deterioro financiero", size: 18, font: "Arial" })] })]
                    }),
                    new TableCell({
                        borders,
                        margins: { top: 100, bottom: 100, left: 180, right: 180 },
                        width: { size: 1872, type: WidthType.DXA },
                        children: [new Paragraph({
                            children: [new TextRun({ text: "Baja", size: 18, font: "Arial" })],
                            alignment: AlignmentType.CENTER
                        })]
                    }),
                    new TableCell({
                        borders,
                        shading: { fill: "FFE6CC", type: ShadingType.CLEAR },
                        margins: { top: 100, bottom: 100, left: 180, right: 180 },
                        width: { size: 1872, type: WidthType.DXA },
                        children: [new Paragraph({
                            children: [new TextRun({ text: "Medio", bold: true, size: 18, font: "Arial" })],
                            alignment: AlignmentType.CENTER
                        })]
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        margins: { top: 100, bottom: 100, left: 180, right: 180 },
                        width: { size: 2808, type: WidthType.DXA },
                        children: [new Paragraph({ children: [new TextRun({ text: "Previsiones subvaloradas", size: 18, font: "Arial" })] })]
                    }),
                    new TableCell({
                        borders,
                        margins: { top: 100, bottom: 100, left: 180, right: 180 },
                        width: { size: 2808, type: WidthType.DXA },
                        children: [new Paragraph({ children: [new TextRun({ text: "Sobrestimación patrimonial", size: 18, font: "Arial" })] })]
                    }),
                    new TableCell({
                        borders,
                        margins: { top: 100, bottom: 100, left: 180, right: 180 },
                        width: { size: 1872, type: WidthType.DXA },
                        children: [new Paragraph({
                            children: [new TextRun({ text: "Media", size: 18, font: "Arial" })],
                            alignment: AlignmentType.CENTER
                        })]
                    }),
                    new TableCell({
                        borders,
                        shading: { fill: "FFE6CC", type: ShadingType.CLEAR },
                        margins: { top: 100, bottom: 100, left: 180, right: 180 },
                        width: { size: 1872, type: WidthType.DXA },
                        children: [new Paragraph({
                            children: [new TextRun({ text: "Medio", bold: true, size: 18, font: "Arial" })],
                            alignment: AlignmentType.CENTER
                        })]
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        borders,
                        margins: { top: 100, bottom: 100, left: 180, right: 180 },
                        width: { size: 2808, type: WidthType.DXA },
                        children: [new Paragraph({ children: [new TextRun({ text: "Falta de trazabilidad", size: 18, font: "Arial" })] })]
                    }),
                    new TableCell({
                        borders,
                        margins: { top: 100, bottom: 100, left: 180, right: 180 },
                        width: { size: 2808, type: WidthType.DXA },
                        children: [new Paragraph({ children: [new TextRun({ text: "Imposibilidad de validar origen", size: 18, font: "Arial" })] })]
                    }),
                    new TableCell({
                        borders,
                        margins: { top: 100, bottom: 100, left: 180, right: 180 },
                        width: { size: 1872, type: WidthType.DXA },
                        children: [new Paragraph({
                            children: [new TextRun({ text: "Baja", size: 18, font: "Arial" })],
                            alignment: AlignmentType.CENTER
                        })]
                    }),
                    new TableCell({
                        borders,
                        shading: { fill: "E6FFE6", type: ShadingType.CLEAR },
                        margins: { top: 100, bottom: 100, left: 180, right: 180 },
                        width: { size: 1872, type: WidthType.DXA },
                        children: [new Paragraph({
                            children: [new TextRun({ text: "Bajo", bold: true, size: 18, font: "Arial" })],
                            alignment: AlignmentType.CENTER
                        })]
                    })
                ]
            })
        ]
    });
}

function crearConclusiones() {
    const promedioDeteccion = ((DATOS_ANALISIS.deudas.porcentajeDeteccion + DATOS_ANALISIS.previsiones.porcentajeDeteccion) / 2).toFixed(1);

    return [
        new Paragraph({
            text: "7. CONCLUSIONES Y CERTIFICACIÓN",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 480, after: 240 }
        }),
        new Paragraph({
            text: "7.1. Certificación de Cumplimiento",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 240 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: "• ", size: 24, font: "Arial" }),
                new TextRun({ text: "Cumplimiento Normativo Global: ", bold: true, size: 24, font: "Arial" }),
                new TextRun({ text: "85%", size: 24, font: "Arial", color: "008000" })
            ],
            spacing: { after: 180 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: "• ", size: 24, font: "Arial" }),
                new TextRun({ text: "Nivel de Auditabilidad: ", bold: true, size: 24, font: "Arial" }),
                new TextRun({ text: "Excelente", size: 24, font: "Arial", color: "008000" })
            ],
            spacing: { after: 180 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: "• ", size: 24, font: "Arial" }),
                new TextRun({ text: "Capacidad de Detección de Anomalías: ", bold: true, size: 24, font: "Arial" }),
                new TextRun({ text: `${promedioDeteccion}%`, size: 24, font: "Arial", color: "008000" })
            ],
            spacing: { after: 480 }
        }),
        new Paragraph({
            text: "7.2. Recomendación Final",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 240 }
        }),
        new Paragraph({
            children: [new TextRun({
                text: "El sistema algorítmico implementado para el análisis del Pasivo No Corriente demuestra una sólida capacidad para identificar anomalías y proporcionar elementos de juicio válidos para el proceso de auditoría. La automatización del análisis permite una cobertura completa del universo de datos, superando las limitaciones del muestreo tradicional.",
                size: 24,
                font: "Arial"
            })],
            spacing: { after: 240 }
        }),
        new Paragraph({
            children: [new TextRun({
                text: "El algoritmo es una herramienta fundamental para la modernización de la profesión contable y el fortalecimiento de los controles internos, contribuyendo significativamente al combate contra irregularidades financieras.",
                size: 24,
                font: "Arial",
                bold: true
            })],
            spacing: { after: 480 }
        }),
        new Paragraph({
            text: "7.3. Acciones Recomendadas",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 240 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: "1. ", bold: true, size: 24, font: "Arial" }),
                new TextRun({ text: "Investigar inmediatamente las anomalías detectadas en deudas y previsiones.", size: 24, font: "Arial" })
            ],
            spacing: { after: 180 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: "2. ", bold: true, size: 24, font: "Arial" }),
                new TextRun({ text: "Implementar hash SHA-256 para garantizar trazabilidad de los reportes.", size: 24, font: "Arial" })
            ],
            spacing: { after: 180 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: "3. ", bold: true, size: 24, font: "Arial" }),
                new TextRun({ text: "Revisar las deudas en estado de incumplimiento y evaluar su recuperabilidad.", size: 24, font: "Arial" })
            ],
            spacing: { after: 180 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: "4. ", bold: true, size: 24, font: "Arial" }),
                new TextRun({ text: "Validar las estimaciones de previsiones activas contra evidencia reciente.", size: 24, font: "Arial" })
            ],
            spacing: { after: 480 }
        }),
        new Paragraph({
            children: [new TextRun({
                text: "_______________________________________________",
                size: 24,
                font: "Arial"
            })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 960, after: 240 }
        }),
        new Paragraph({
            children: [new TextRun({
                text: CONFIG_INFORME.responsable,
                bold: true,
                size: 24,
                font: "Arial"
            })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 }
        }),
        new Paragraph({
            children: [new TextRun({
                text: CONFIG_INFORME.fecha,
                size: 22,
                font: "Arial"
            })],
            alignment: AlignmentType.CENTER
        })
    ];
}

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================

function generarInforme() {
    console.log('🚀 Generando informe de auditoría...');

    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: { font: "Arial", size: 24 }
                }
            },
            paragraphStyles: [
                {
                    id: "Heading1",
                    name: "Heading 1",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: { size: 32, bold: true, font: "Arial", color: "000000" },
                    paragraph: { spacing: { before: 480, after: 240 }, outlineLevel: 0 }
                },
                {
                    id: "Heading2",
                    name: "Heading 2",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: { size: 28, bold: true, font: "Arial", color: "000000" },
                    paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 1 }
                }
            ]
        },
        numbering: {
            config: [
                {
                    reference: "bullets",
                    levels: [
                        {
                            level: 0,
                            format: LevelFormat.BULLET,
                            text: "•",
                            alignment: AlignmentType.LEFT,
                            style: {
                                paragraph: {
                                    indent: { left: 720, hanging: 360 }
                                }
                            }
                        }
                    ]
                }
            ]
        },
        sections: [
            {
                properties: {
                    page: {
                        size: {
                            width: 12240,
                            height: 15840
                        },
                        margin: {
                            top: 1440,
                            right: 1440,
                            bottom: 1440,
                            left: 1440
                        }
                    }
                },
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun("Página "),
                                    new TextRun({
                                        children: [PageNumber.CURRENT]
                                    }),
                                    new TextRun(" de "),
                                    new TextRun({
                                        children: [PageNumber.TOTAL_PAGES]
                                    })
                                ],
                                alignment: AlignmentType.CENTER
                            })
                        ]
                    })
                },
                children: [
                    ...crearPortada(),
                    ...crearResumenEjecutivo(),
                    ...crearAnalisisNormas(),
                    ...crearAnalisisInternacional(),
                    ...crearAnalisisDeudas(),
                    ...crearAnalisisPrevisiones(),
                    ...crearMatrizRiesgos(),
                    ...crearConclusiones()
                ]
            }
        ]
    });

    Packer.toBuffer(doc).then(buffer => {
        fs.writeFileSync("INFORME_AUDITORIA_PASIVO_NO_CORRIENTE.docx", buffer);
        console.log('✅ Informe generado exitosamente: INFORME_AUDITORIA_PASIVO_NO_CORRIENTE.docx');
    }).catch(error => {
        console.error('❌ Error al generar el informe:', error);
        process.exit(1);
    });
}

// Ejecutar
generarInforme();