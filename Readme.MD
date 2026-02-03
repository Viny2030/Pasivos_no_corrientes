# 📋 Aplicación Consolidada: Pasivo No Corriente

## 📖 Descripción

Esta aplicación consolida el análisis de todos los componentes del **Pasivo No Corriente** en un solo lugar, organizados mediante pestañas para facilitar la navegación y el análisis.

### Componentes incluidos:
1. **🏦 Deudas No Corrientes**: Préstamos bancarios, bonos, hipotecas, leasing, etc.
2. **⚠️ Previsiones**: Garantías, litigios, cobranzas dudosas, reestructuraciones, etc.
3. **📊 Resumen Consolidado**: Vista general de todos los componentes

## 🚀 Instalación

### Paso 1: Instalar dependencias

```bash
pip install streamlit pandas numpy faker matplotlib seaborn scikit-learn
```

### Paso 2: Verificar instalación

```bash
streamlit --version
```

## ▶️ Cómo ejecutar la aplicación

### Opción 1: Ejecución local

```bash
streamlit run pasivo_no_corriente_app.py
```

La aplicación se abrirá automáticamente en tu navegador en `http://localhost:8501`

### Opción 2: Despliegue en Render.com

1. Crea una cuenta en [Render.com](https://render.com)
2. Crea un nuevo "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `streamlit run pasivo_no_corriente_app.py --server.port=$PORT --server.address=0.0.0.0`
5. Despliega

## 📁 Archivos necesarios

### requirements.txt
```
streamlit==1.31.0
pandas==2.1.4
numpy==1.26.3
faker==22.6.0
matplotlib==3.8.2
seaborn==0.13.1
scikit-learn==1.4.0
```

### .streamlit/config.toml (opcional)
```toml
[theme]
primaryColor = "#1f77b4"
backgroundColor = "#ffffff"
secondaryBackgroundColor = "#f0f2f6"
textColor = "#262730"

[server]
headless = true
port = 8501
```

## 🎯 Características principales

### 1. Deudas No Corrientes
- Generación de datos simulados de deudas a largo plazo
- Análisis de montos originales, saldos pendientes e intereses
- Detección de anomalías usando Isolation Forest
- Visualizaciones interactivas:
  - Saldo pendiente por tipo de deuda
  - Distribución por estado
  - Detección de anomalías (IA)

### 2. Previsiones
- Generación de datos simulados de previsiones contables
- Análisis por tipo de previsión y probabilidad
- Detección de anomalías con machine learning
- Visualizaciones interactivas:
  - Monto estimado por tipo
  - Distribución por estado
  - Análisis de antigüedad vs. monto

### 3. Resumen Consolidado
- Vista general del Pasivo No Corriente
- Métricas agregadas de todos los componentes
- Comparación visual entre componentes
- Tabla resumen con porcentajes

## 📊 Uso de la aplicación

1. **Navegación por pestañas**: Usa las pestañas superiores para cambiar entre componentes
2. **Análisis automático**: Los datos se generan automáticamente al cargar la aplicación
3. **Detección de anomalías**: Revisa las alertas de IA para identificar casos que requieren atención
4. **Exportación de datos**: Los gráficos pueden descargarse usando el menú contextual

## 🔧 Personalización

### Modificar el número de registros
En el archivo `pasivo_no_corriente_app.py`, busca y modifica:

```python
# Para deudas:
num_deudas = 30  # Cambia este número

# Para previsiones:
num_previsiones = 30  # Cambia este número
```

### Agregar nuevos tipos de deuda o previsión
Modifica las listas en las funciones de generación:

```python
tipos_deuda_no_corriente = [
    'Préstamo Bancario a Largo Plazo',
    'Bonos Emitidos',
    # Agrega más tipos aquí
]

tipos_prevision = [
    'Garantías',
    'Litigios',
    # Agrega más tipos aquí
]
```

## 📈 Próximas mejoras sugeridas

Para crear aplicaciones similares para otros rubros:

1. **Activo Corriente**: 
   - Caja y bancos
   - Inversiones temporales
   - Cuentas por cobrar
   - Inventarios

2. **Activo No Corriente**:
   - Propiedades, planta y equipo
   - Inversiones a largo plazo
   - Activos intangibles

3. **Pasivo Corriente**:
   - Cuentas por pagar
   - Deudas a corto plazo
   - Provisiones corrientes

## 🤝 Contribuciones

Para agregar nuevos componentes al Pasivo No Corriente:

1. Crea una función de generación de datos: `@st.cache_data def generar_nuevo_componente()`
2. Crea una función de análisis: `def analizar_nuevo_componente(df)`
3. Agrega una nueva pestaña en la función `main()`
4. Actualiza el resumen consolidado

## 📝 Notas técnicas

- Los datos son completamente simulados con Faker y no representan información real
- El Isolation Forest usa un contamination=0.1 (10% de anomalías esperadas)
- Las semillas random están fijadas para reproducibilidad
- Los gráficos usan el estilo "whitegrid" de Seaborn

## ⚠️ Limitaciones

- No conecta a bases de datos reales
- Los datos se regeneran en cada sesión
- No incluye exportación a Excel (puede agregarse)
- No hay autenticación de usuarios

## 📞 Soporte

Para reportar problemas o sugerir mejoras, contacta al equipo de desarrollo.

---

**Versión**: 1.0.0  
**Última actualización**: Febrero 2026