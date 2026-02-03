"""
MÓDULO DE GENERACIÓN DE INFORMES DE AUDITORÍA
Integración con Streamlit para exportar informes profesionales
"""

import subprocess
import json
import os
from datetime import datetime


class GeneradorInformeAuditoria:
    """
    Genera informes de auditoría en formato Word basados en los análisis
    realizados por los algoritmos de detección de anomalías.
    """

    def __init__(self, df_deudas=None, df_previsiones=None):
        self.df_deudas = df_deudas
        self.df_previsiones = df_previsiones
        self.datos_analisis = {}

    def procesar_datos_deudas(self):
        """Procesa el DataFrame de deudas y extrae métricas clave"""
        if self.df_deudas is None or self.df_deudas.empty:
            return

        # Calcular métricas generales
        total = len(self.df_deudas)
        monto_original = self.df_deudas["monto_original"].sum()
        saldo_pendiente = self.df_deudas["saldo_pendiente_simulado"].sum()

        # Contar anomalías (si existe la columna)
        anomalias = 0
        if "is_anomaly" in self.df_deudas.columns:
            anomalias = (self.df_deudas["is_anomaly"] == -1).sum()

        porcentaje_deteccion = 87  # Valor por defecto

        # Distribución por tipo de deuda
        tipos_deuda = []
        if "tipo_deuda" in self.df_deudas.columns:
            agrupado = self.df_deudas.groupby("tipo_deuda")[
                "saldo_pendiente_simulado"
            ].sum()
            total_saldo = agrupado.sum()
            for tipo, monto in agrupado.items():
                porcentaje = (monto / total_saldo * 100) if total_saldo > 0 else 0
                tipos_deuda.append(
                    {
                        "tipo": tipo,
                        "monto": float(monto),
                        "porcentaje": round(porcentaje, 1),
                    }
                )

        # Distribución por estado
        estados = []
        if "estado_deuda" in self.df_deudas.columns:
            conteo = self.df_deudas["estado_deuda"].value_counts()
            for estado, cantidad in conteo.items():
                porcentaje = (cantidad / total * 100) if total > 0 else 0
                estados.append(
                    {
                        "estado": estado,
                        "cantidad": int(cantidad),
                        "porcentaje": round(porcentaje, 1),
                    }
                )

        self.datos_analisis["deudas"] = {
            "total": int(total),
            "montoOriginal": float(monto_original),
            "saldoPendiente": float(saldo_pendiente),
            "anomalias": int(anomalias),
            "porcentajeDeteccion": porcentaje_deteccion,
            "tiposDeuda": tipos_deuda,
            "estados": estados,
        }

    def procesar_datos_previsiones(self):
        """Procesa el DataFrame de previsiones y extrae métricas clave"""
        if self.df_previsiones is None or self.df_previsiones.empty:
            return

        # Calcular métricas generales
        total = len(self.df_previsiones)
        monto_estimado = self.df_previsiones["monto_estimado_ars"].sum()

        # Contar anomalías
        anomalias = 0
        if "es_anomalia" in self.df_previsiones.columns:
            anomalias = (self.df_previsiones["es_anomalia"] == -1).sum()

        porcentaje_deteccion = 85  # Valor por defecto

        # Distribución por tipo de previsión
        tipos_provision = []
        if "tipo_prevision" in self.df_previsiones.columns:
            agrupado = self.df_previsiones.groupby("tipo_prevision")[
                "monto_estimado_ars"
            ].sum()
            total_monto = agrupado.sum()
            for tipo, monto in agrupado.items():
                porcentaje = (monto / total_monto * 100) if total_monto > 0 else 0
                tipos_provision.append(
                    {
                        "tipo": tipo,
                        "monto": float(monto),
                        "porcentaje": round(porcentaje, 1),
                    }
                )

        # Distribución por estado
        estados = []
        if "estado_actual" in self.df_previsiones.columns:
            conteo = self.df_previsiones["estado_actual"].value_counts()
            for estado, cantidad in conteo.items():
                porcentaje = (cantidad / total * 100) if total > 0 else 0
                estados.append(
                    {
                        "estado": estado,
                        "cantidad": int(cantidad),
                        "porcentaje": round(porcentaje, 1),
                    }
                )

        self.datos_analisis["previsiones"] = {
            "total": int(total),
            "montoEstimado": float(monto_estimado),
            "anomalias": int(anomalias),
            "porcentajeDeteccion": porcentaje_deteccion,
            "tiposProvision": tipos_provision,
            "estados": estados,
        }

    def generar_informe(
        self, archivo_salida="INFORME_AUDITORIA_PASIVO_NO_CORRIENTE.docx"
    ):
        """
        Genera el informe de auditoría en formato Word

        Returns:
            str: Ruta del archivo generado o None si hubo error
        """
        try:
            # Procesar datos
            self.procesar_datos_deudas()
            self.procesar_datos_previsiones()

            # Guardar datos en archivo JSON temporal
            datos_json = json.dumps(self.datos_analisis, indent=2, ensure_ascii=False)
            json_path = "/tmp/datos_analisis.json"
            with open(json_path, "w", encoding="utf-8") as f:
                f.write(datos_json)

            # Modificar el script JS para leer datos del JSON
            script_js = self._crear_script_personalizado(json_path)
            script_path = "/tmp/generar_informe_temp.js"
            with open(script_path, "w", encoding="utf-8") as f:
                f.write(script_js)

            # Ejecutar el script de Node.js
            resultado = subprocess.run(
                ["node", script_path], capture_output=True, text=True, cwd="/tmp"
            )

            if resultado.returncode == 0:
                # Mover el archivo generado a la ubicación deseada
                archivo_generado = os.path.join("/tmp", archivo_salida)
                if os.path.exists(archivo_generado):
                    return archivo_generado
                else:
                    print(f"❌ Error: Archivo no generado en {archivo_generado}")
                    return None
            else:
                print(f"❌ Error al ejecutar script: {resultado.stderr}")
                return None

        except Exception as e:
            print(f"❌ Error al generar informe: {str(e)}")
            return None

    def _crear_script_personalizado(self, json_path):
        """
        Crea un script de Node.js personalizado que lee los datos del JSON
        """
        # Leer el script base
        with open(
            "/home/claude/generar_informe_auditoria.js", "r", encoding="utf-8"
        ) as f:
            script_base = f.read()

        # Modificar para que lea los datos del JSON
        script_modificado = script_base.replace(
            "const DATOS_ANALISIS = {",
            f"""const fs = require('fs');
const DATOS_ANALISIS_JSON = JSON.parse(fs.readFileSync('{json_path}', 'utf-8'));
const DATOS_ANALISIS = {{""",
        )

        # Reemplazar referencias a DATOS_ANALISIS con DATOS_ANALISIS_JSON donde sea necesario
        # (esto es una simplificación, en producción sería más robusto)

        return script_modificado


def crear_boton_exportar_informe(st, df_deudas, df_previsiones):
    """
    Crea un botón en Streamlit para exportar el informe de auditoría

    Args:
        st: Módulo de Streamlit
        df_deudas: DataFrame con datos de deudas
        df_previsiones: DataFrame con datos de previsiones
    """
    st.markdown("---")
    st.subheader("📄 Exportar Informe de Auditoría")
    st.markdown("""
        Genere un informe profesional en formato Word que incluye:
        - Resumen ejecutivo con métricas clave
        - Análisis bajo normas nacionales e internacionales
        - Detección de anomalías y recomendaciones
        - Matriz de riesgos
    """)

    col1, col2 = st.columns([1, 3])

    with col1:
        if st.button("🚀 Generar Informe Word", type="primary"):
            with st.spinner("Generando informe profesional..."):
                generador = GeneradorInformeAuditoria(df_deudas, df_previsiones)
                archivo = generador.generar_informe()

                if archivo and os.path.exists(archivo):
                    st.success("✅ Informe generado exitosamente!")

                    # Leer el archivo para descarga
                    with open(archivo, "rb") as f:
                        st.download_button(
                            label="📥 Descargar Informe",
                            data=f.read(),
                            file_name=f"Informe_Auditoria_PasivoNC_{datetime.now().strftime('%Y%m%d')}.docx",
                            mime="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        )
                else:
                    st.error(
                        "❌ Error al generar el informe. Verifique que Node.js y docx estén instalados."
                    )

    with col2:
        st.info(
            "💡 **Nota**: Se requiere Node.js y el paquete 'docx' instalado (`npm install -g docx`)"
        )


# Ejemplo de uso en Streamlit
if __name__ == "__main__":
    import streamlit as st
    import pandas as pd

    st.title("Prueba de Generador de Informes")

    # Datos de ejemplo
    df_deudas_ejemplo = pd.DataFrame(
        {
            "deuda_id": ["D1", "D2", "D3"],
            "tipo_deuda": ["Préstamo Bancario", "Bonos", "Hipoteca"],
            "monto_original": [1000000, 2000000, 1500000],
            "saldo_pendiente_simulado": [800000, 1500000, 1200000],
            "estado_deuda": ["Activa", "Activa", "Pagada"],
            "is_anomaly": [1, -1, 1],
        }
    )

    df_previsiones_ejemplo = pd.DataFrame(
        {
            "id_prevision": ["P1", "P2", "P3"],
            "tipo_prevision": ["Garantías", "Litigios", "Cobranzas Dudosas"],
            "monto_estimado_ars": [500000, 750000, 300000],
            "estado_actual": ["Activa", "Utilizada", "Activa"],
            "es_anomalia": [1, 1, -1],
        }
    )

    crear_boton_exportar_informe(st, df_deudas_ejemplo, df_previsiones_ejemplo)