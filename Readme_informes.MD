# 📄 Módulo de Generación de Informes de Auditoría

## Descripción

Este módulo genera automáticamente informes profesionales de auditoría en formato Word (.docx) basados en los análisis algorítmicos realizados sobre el Pasivo No Corriente.

## 🎯 Características

- **Generación automática**: Crea informes completos a partir de los datos analizados
- **Formato profesional**: Documento Word con estilos consistentes y tablas formateadas
- **Contenido completo**: Incluye:
  - Portada con metadatos
  - Resumen ejecutivo con métricas clave
  - Análisis bajo normas nacionales (RT 37, RT 41, Ley 25.506)
  - Análisis bajo normas internacionales (ISA 315, ISA 520, COSO)
  - Análisis detallado de deudas no corrientes
  - Análisis detallado de previsiones
  - Matriz de riesgos y recomendaciones
  - Conclusiones y certificación

## 📋 Requisitos

### Software necesario

1. **Node.js** (v14 o superior)
   ```bash
   # Verificar instalación
   node --version
   ```

2. **Paquete docx**
   ```bash
   npm install -g docx
   ```

3. **Python 3.8+** con pandas

## 🚀 Instalación

### Paso 1: Instalar Node.js

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**macOS:**
```bash
brew install node
```

**Windows:**
Descargar desde [nodejs.org](https://nodejs.org)

### Paso 2: Instalar docx

```bash
npm install -g docx
```

### Paso 3: Verificar instalación

```bash
node --version
npm list -g docx
```

## 💻 Uso

### Opción 1: Uso independiente

```bash
# Generar informe con datos de ejemplo
node generar_informe_auditoria.js
```

Esto generará el archivo `INFORME_AUDITORIA_PASIVO_NO_CORRIENTE.docx` en el directorio actual.

### Opción 2: Integración con Streamlit

```python
from generador_informe_integracion import GeneradorInformeAuditoria

# Crear generador con tus DataFrames
generador = GeneradorInformeAuditoria(df_deudas, df_previsiones)

# Generar informe
archivo = generador.generar_informe()

if archivo:
    print(f"✅ Informe generado: {archivo}")
```

### Opción 3: Desde la aplicación Streamlit

1. Ejecuta la aplicación: `streamlit run pasivo_no_corriente_app.py`
2. Navega a la pestaña "Resumen Consolidado"
3. Haz clic en el botón "🚀 Generar Informe Word"
4. Descarga el archivo generado

## 📊 Estructura del Informe

### 1. Portada
- Título del informe
- Fecha de generación
- Información del responsable

### 2. Resumen Ejecutivo
- Total del Pasivo No Corriente
- Cantidad de registros analizados
- Anomalías detectadas
- Conclusión general

### 3. Análisis Normativo

#### 3.1 Normas Nacionales (Argentina)
- RT 37 y RT 41 (FACPCE)
- Ley 25.506 (Firma Digital)
- Ley 25.326 (Protección de Datos)

#### 3.2 Normas Internacionales
- ISA 315 y 520 (Procedimientos Analíticos)
- Marco COSO (Control Interno)

### 4. Análisis de Deudas No Corrientes
- Resumen general
- Distribución por tipo de deuda (tabla)
- Distribución por estado (tabla)
- Anomalías detectadas
- Recomendaciones

### 5. Análisis de Previsiones
- Resumen general
- Distribución por tipo de previsión (tabla)
- Distribución por estado (tabla)
- Anomalías detectadas
- Recomendaciones

### 6. Matriz de Riesgos
- Riesgos identificados
- Impacto potencial
- Probabilidad
- Nivel de riesgo

### 7. Conclusiones
- Certificación de cumplimiento
- Recomendación final
- Acciones recomendadas

## 🎨 Personalización

### Modificar la configuración del informe

Edita el objeto `CONFIG_INFORME` en `generar_informe_auditoria.js`:

```javascript
const CONFIG_INFORME = {
    titulo: "TU TÍTULO PERSONALIZADO",
    subtitulo: "TU SUBTÍTULO",
    responsable: "Tu Nombre",
    // ...
};
```

### Modificar estilos

Los estilos están definidos en la sección `styles` del documento:

```javascript
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 24 }
      }
    },
    // ...
  }
});
```

### Agregar nuevas secciones

Crea una función que retorne un array de `Paragraph` objects:

```javascript
function crearNuevaSeccion() {
    return [
        new Paragraph({
            text: "NUEVA SECCIÓN",
            heading: HeadingLevel.HEADING_1
        }),
        // ... más párrafos
    ];
}
```

Luego agrégala en la sección `children`:

```javascript
children: [
    ...crearPortada(),
    ...crearNuevaSeccion(),  // Tu nueva sección
    ...crearConclusiones()
]
```

## 📝 Formato de Datos

### Estructura esperada para deudas

```python
df_deudas = pd.DataFrame({
    'deuda_id': str,
    'tipo_deuda': str,
    'monto_original': float,
    'saldo_pendiente_simulado': float,
    'estado_deuda': str,
    'is_anomaly': int  # 1 o -1
})
```

### Estructura esperada para previsiones

```python
df_previsiones = pd.DataFrame({
    'id_prevision': str,
    'tipo_prevision': str,
    'monto_estimado_ars': float,
    'estado_actual': str,
    'es_anomalia': int  # 1 o -1
})
```

## 🔧 Solución de Problemas

### Error: "docx is not recognized"

**Solución**: Instalar docx globalmente
```bash
npm install -g docx
```

### Error: "Cannot find module 'docx'"

**Solución**: Verificar la instalación
```bash
npm list -g docx
```

Si no aparece, reinstalar:
```bash
npm uninstall -g docx
npm install -g docx
```

### Error: Archivo no se genera

**Verificar**:
1. Permisos de escritura en el directorio
2. Que Node.js pueda ejecutar scripts
3. Logs de error en la consola

### Tablas no se ven correctamente

**Causa**: Anchos inconsistentes
**Solución**: Verificar que `columnWidths` sume exactamente al `width` de la tabla

```javascript
// Incorrecto
columnWidths: [5000, 4000]  // Suma 9000
width: { size: 9360, type: WidthType.DXA }  // No coincide

// Correcto
columnWidths: [5000, 4360]  // Suma 9360
width: { size: 9360, type: WidthType.DXA }  // Coincide
```

## 📖 Ejemplos Adicionales

### Ejemplo 1: Informe con datos personalizados

```javascript
// Modificar DATOS_ANALISIS en generar_informe_auditoria.js
const DATOS_ANALISIS = {
    deudas: {
        total: 50,
        montoOriginal: 250000000.00,
        // ... tus datos
    }
};
```

### Ejemplo 2: Cambiar formato de fecha

```javascript
const CONFIG_INFORME = {
    fecha: new Date().toLocaleDateString('es-AR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'  // Agregar día de la semana
    })
};
```

### Ejemplo 3: Agregar logo

```javascript
// Agregar en la portada
new Paragraph({
    children: [new ImageRun({
        type: "png",
        data: fs.readFileSync("logo.png"),
        transformation: { width: 200, height: 100 }
    })],
    alignment: AlignmentType.CENTER
})
```

## 🎓 Referencias

- [Documentación de docx-js](https://docx.js.org/)
- [RT 37 FACPCE](https://www.facpce.org.ar)
- [Normas Internacionales de Auditoría](https://www.ifac.org/isa)

## 🤝 Contribuciones

Para agregar nuevas funcionalidades:

1. Crear nueva función de sección
2. Agregar a la secuencia de `children`
3. Probar la generación
4. Validar el documento con `python scripts/office/validate.py`

## 📞 Soporte

Para problemas o consultas:
- Revisar la sección de Solución de Problemas
- Verificar logs de Node.js
- Consultar documentación de docx-js

---

**Versión**: 1.0.0  
**Última actualización**: Febrero 2026  
**Compatibilidad**: Node.js 14+, Python 3.8+