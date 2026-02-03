# 📄 Informes de Auditoría PDF

## Descripción

Este directorio contiene los informes de auditoría generados en formato PDF para el análisis del Pasivo No Corriente.

## Archivos Generados

Los siguientes informes están disponibles:

- `informe_auditoria_2020.pdf` - Informe del ejercicio fiscal 2020
- `informe_auditoria_2021.pdf` - Informe del ejercicio fiscal 2021
- `informe_auditoria_2022.pdf` - Informe del ejercicio fiscal 2022
- `informe_auditoria_2023.pdf` - Informe del ejercicio fiscal 2023
- `informe_auditoria_2024.pdf` - Informe del ejercicio fiscal 2024

## Contenido de los Informes

Cada informe incluye:

### 1. **Portada**
   - Título del informe
   - Período analizado
   - Fecha de emisión
   - Información del responsable

### 2. **Resumen Ejecutivo**
   - Total de registros analizados
   - Monto total del pasivo
   - Anomalías detectadas
   - Conclusión general

### 3. **Marco Normativo**
   - **Normas Nacionales (Argentina)**
     - RT 37 y RT 41 (FACPCE)
     - Ley 25.506 (Firma Digital)
     - Ley 25.326 (Protección de Datos)
   - **Normas Internacionales**
     - ISA 315 (Identificación y Evaluación de Riesgos)
     - ISA 520 (Procedimientos Analíticos)
     - Marco COSO (Control Interno)

### 4. **Análisis de Deudas No Corrientes**
   - Resumen general
   - Distribución por tipo de deuda (tabla)
   - Distribución por estado
   - Anomalías detectadas
   - Recomendaciones específicas

### 5. **Análisis de Previsiones**
   - Resumen general
   - Distribución por tipo de previsión (tabla)
   - Distribución por estado
   - Anomalías detectadas
   - Recomendaciones específicas

### 6. **Matriz de Riesgos**
   - Riesgos identificados
   - Impacto potencial
   - Probabilidad de ocurrencia
   - Nivel de riesgo (Alto/Medio/Bajo)

### 7. **Conclusiones y Recomendaciones**
   - Certificación de cumplimiento normativo
   - Opinión técnica profesional
   - Recomendaciones prioritarias
   - Firma del responsable

## Cómo Regenerar los Informes

Si necesitas regenerar los informes con datos actualizados:

```bash
# Ejecutar el script generador
python generar_informes_pdf.py
```

Los informes se generarán en el directorio `data/informes_auditoria/`

## Requisitos

Los informes fueron generados con:

- Python 3.8+
- reportlab (para generación de PDFs)

### Instalación de dependencias

```bash
pip install reportlab
```

O agregar al `requirements.txt`:

```
reportlab>=3.6.0
```

## Uso en la Aplicación Streamlit

Los informes son automáticamente detectados y mostrados en la pestaña "Informes de Auditoría" de la aplicación.

La aplicación busca archivos PDF en `data/informes_auditoria/` y permite:
- Visualizar el contenido extraído
- Descargar los informes
- Analizar el texto con búsquedas

## Personalización

Para personalizar los informes, edita el archivo `generar_informes_pdf.py` y modifica:

- **Estilos**: Sección `_crear_estilos_personalizados()`
- **Contenido**: Funciones individuales por sección
- **Datos**: Objeto `datos_deudas` y `datos_previsiones`
- **Años**: Lista `años` en la función `generar_informes_ejemplo()`

## Estructura del Código

```python
class GeneradorInformePDF:
    """Clase principal para generar informes"""
    
    def _crear_portada()              # Crea la portada
    def _crear_resumen_ejecutivo()    # Resumen ejecutivo
    def _crear_analisis_normativo()   # Marco normativo
    def _crear_analisis_deudas()      # Análisis de deudas
    def _crear_analisis_previsiones() # Análisis de previsiones
    def _crear_matriz_riesgos()       # Matriz de riesgos
    def _crear_conclusiones()         # Conclusiones
    
    def generar_informe()             # Genera el PDF completo
```

## Ejemplo de Uso Programático

```python
from generar_informes_pdf import GeneradorInformePDF

# Crear generador para año 2024
datos_deudas = {
    'total': 35,
    'saldoPendiente': 120000000.00,
    'anomalias': 4,
    # ... más datos
}

datos_previsiones = {
    'total': 40,
    'montoEstimado': 65000000.00,
    'anomalias': 5,
    # ... más datos
}

generador = GeneradorInformePDF(2024, datos_deudas, datos_previsiones)
generador.generar_informe('mi_informe_2024.pdf')
```

## Integración con Datos Reales

Para usar datos reales de tu aplicación:

```python
import pandas as pd
from generar_informes_pdf import GeneradorInformePDF

# Cargar datos
df_deudas = pd.read_csv('data/pasivos_no_corrientes.csv')
df_previsiones = pd.read_csv('data/previsiones.csv')

# Procesar datos
datos_deudas = procesar_dataframe_deudas(df_deudas)
datos_previsiones = procesar_dataframe_previsiones(df_previsiones)

# Generar informe
generador = GeneradorInformePDF(2024, datos_deudas, datos_previsiones)
generador.generar_informe('informe_2024_real.pdf')
```

## Formato y Diseño

Los informes utilizan:
- **Tamaño de página**: A4
- **Márgenes**: 2 cm en todos los lados
- **Fuente principal**: Helvetica
- **Colores corporativos**: Azul (#1a237e, #3949ab) y Rojo (#c62828)
- **Tablas**: Con encabezados en color y filas alternadas
- **Espaciado**: Consistente y profesional

## Notas Importantes

- Los informes son de ejemplo con datos ficticios
- Para producción, reemplaza los datos con información real
- Los montos están en pesos argentinos (ARS)
- Cada informe tiene ~12 KB de tamaño
- Los PDFs son completamente navegables y tienen texto seleccionable

## Soporte

Para problemas o consultas:
1. Verifica que reportlab esté instalado correctamente
2. Revisa los permisos del directorio `data/informes_auditoria/`
3. Consulta los logs de errores en la consola

---

**Versión**: 1.0.0  
**Última actualización**: Febrero 2026  
**Formato**: PDF/A (compatible con archivado de largo plazo)
