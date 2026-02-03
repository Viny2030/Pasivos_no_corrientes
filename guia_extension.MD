# 🔧 Guía para Extender la Aplicación

## Cómo agregar un nuevo componente al Pasivo No Corriente

### Ejemplo: Agregando "Obligaciones por Beneficios a Empleados"

#### Paso 1: Crear la función de generación de datos

```python
@st.cache_data
def generar_dataframe_beneficios_empleados():
    """Genera datos simulados de Obligaciones por Beneficios a Empleados"""
    np.random.seed(99)
    random.seed(99)
    fake = Faker('es_AR')
    Faker.seed(99)

    num_obligaciones = 25
    tipos_beneficio = [
        'Pensiones', 
        'Indemnizaciones por Despido',
        'Seguros de Vida',
        'Planes de Jubilación',
        'Bonos por Antigüedad'
    ]
    
    fecha_actual = datetime.now()
    
    data = []
    for i in range(num_obligaciones):
        tipo = random.choice(tipos_beneficio)
        empleado_nombre = fake.name()
        empleado_legajo = f"EMP-{1000 + i}"
        fecha_inicio = fake.date_between(start_date='-15y', end_date='-1y')
        anios_servicio = (fecha_actual - datetime.combine(fecha_inicio, datetime.min.time())).days / 365.25
        
        # Calcular monto según tipo
        if tipo == 'Pensiones':
            monto_estimado = round(anios_servicio * random.uniform(50000, 150000), 2)
        elif tipo == 'Indemnizaciones por Despido':
            monto_estimado = round(anios_servicio * random.uniform(80000, 200000), 2)
        else:
            monto_estimado = round(random.uniform(100000, 500000), 2)
        
        estado = random.choices(
            ['Activa', 'Suspendida', 'En Litigio', 'Pagada'],
            weights=[0.7, 0.1, 0.1, 0.1]
        )[0]
        
        data.append({
            'obligacion_id': f'OBE-{6000 + i}',
            'empleado_legajo': empleado_legajo,
            'empleado_nombre': empleado_nombre,
            'tipo_beneficio': tipo,
            'fecha_inicio': fecha_inicio,
            'anios_servicio': round(anios_servicio, 2),
            'monto_estimado': monto_estimado,
            'estado': estado,
            'fecha_estimada_pago': fecha_actual + timedelta(days=random.randint(365, 365*10))
        })
    
    df = pd.DataFrame(data)
    for col in ['fecha_inicio', 'fecha_estimada_pago']:
        df[col] = pd.to_datetime(df[col])
    
    return df
```

#### Paso 2: Crear la función de análisis

```python
def analizar_beneficios_empleados(df):
    """Análisis completo de Obligaciones por Beneficios a Empleados"""
    st.subheader("📊 Análisis de Obligaciones por Beneficios a Empleados")
    
    # Métricas clave
    col1, col2, col3 = st.columns(3)
    col1.metric("Total de obligaciones", len(df))
    col2.metric("Monto total estimado", f"${df['monto_estimado'].sum():,.2f}")
    col3.metric("Obligaciones activas", len(df[df['estado'] == 'Activa']))
    
    # Análisis por tipo
    st.markdown("---")
    st.subheader("💼 Distribución por Tipo de Beneficio")
    monto_por_tipo = df.groupby('tipo_beneficio')['monto_estimado'].sum().sort_values(ascending=False)
    st.dataframe(monto_por_tipo.apply(lambda x: f"${x:,.2f}").to_frame())
    
    # Detección de Anomalías
    st.markdown("---")
    st.subheader("🚨 Detección de Anomalías")
    features = ['monto_estimado', 'anios_servicio']
    df_active = df[df['estado'] == 'Activa'].copy()
    
    if not df_active.empty and len(df_active) > 3:
        iso_forest = IsolationForest(random_state=42, contamination=0.1)
        df_active['is_anomaly'] = iso_forest.fit_predict(df_active[features])
        anomalias = df_active[df_active['is_anomaly'] == -1]
        
        st.write(f"Anomalías detectadas: **{len(anomalias)}**")
        if not anomalias.empty:
            st.warning("Obligaciones anómalas para revisión:")
            st.dataframe(anomalias[['obligacion_id', 'empleado_nombre', 'tipo_beneficio', 'monto_estimado']])
    
    # Visualizaciones
    st.markdown("---")
    st.subheader("📈 Visualizaciones")
    
    # Gráfico 1: Monto por tipo
    fig1, ax1 = plt.subplots(figsize=(12, 7))
    sns.barplot(x=monto_por_tipo.index, y=monto_por_tipo.values, palette='plasma', ax=ax1)
    ax1.set_title('Monto Total por Tipo de Beneficio', fontsize=16)
    ax1.set_ylabel('Monto Total (ARS)', fontsize=12)
    ax1.set_xlabel('Tipo de Beneficio', fontsize=12)
    ax1.tick_params(axis='x', rotation=45)
    st.pyplot(fig1)
    
    # Gráfico 2: Distribución por estado
    fig2, ax2 = plt.subplots(figsize=(8, 6))
    sns.countplot(x='estado', data=df, palette='rocket', 
                   order=df['estado'].value_counts().index, ax=ax2)
    ax2.set_title('Distribución por Estado', fontsize=16)
    ax2.set_xlabel('Estado', fontsize=12)
    ax2.set_ylabel('Cantidad', fontsize=12)
    st.pyplot(fig2)
    
    # Gráfico 3: Relación monto vs años de servicio
    if not df_active.empty:
        fig3, ax3 = plt.subplots(figsize=(12, 8))
        scatter = sns.scatterplot(
            data=df_active,
            x='anios_servicio',
            y='monto_estimado',
            hue='is_anomaly' if 'is_anomaly' in df_active.columns else None,
            style='tipo_beneficio',
            s=100,
            ax=ax3
        )
        ax3.set_title('Monto Estimado vs. Años de Servicio', fontsize=16)
        ax3.set_xlabel('Años de Servicio', fontsize=12)
        ax3.set_ylabel('Monto Estimado (ARS)', fontsize=12)
        st.pyplot(fig3)
```

#### Paso 3: Agregar la pestaña en main()

Modifica la función `main()` para incluir la nueva pestaña:

```python
def main():
    st.title('📋 Análisis Consolidado de Pasivo No Corriente')
    
    # Agregar la nueva pestaña aquí
    tab1, tab2, tab3, tab4 = st.tabs([
        "🏦 Deudas No Corrientes", 
        "⚠️ Previsiones",
        "👥 Beneficios a Empleados",  # Nueva pestaña
        "📊 Resumen Consolidado"
    ])

    # Generar datos (agregar el nuevo dataframe)
    with st.spinner('Generando datos...'):
        df_deudas = generate_debt_dataframe()
        df_previsiones = generar_dataframe_previsiones()
        df_beneficios = generar_dataframe_beneficios_empleados()  # Nuevo

    # Pestaña 1: Deudas
    with tab1:
        st.header("🏦 Deudas No Corrientes")
        analizar_deudas_no_corrientes(df_deudas)

    # Pestaña 2: Previsiones
    with tab2:
        st.header("⚠️ Previsiones")
        analizar_previsiones(df_previsiones)
    
    # Pestaña 3: Beneficios (NUEVA)
    with tab3:
        st.header("👥 Obligaciones por Beneficios a Empleados")
        st.markdown("""
            Análisis de obligaciones laborales a largo plazo como pensiones,
            indemnizaciones y otros beneficios post-empleo.
        """)
        analizar_beneficios_empleados(df_beneficios)

    # Pestaña 4: Resumen (actualizar para incluir nuevo componente)
    with tab4:
        st.header("📊 Resumen Consolidado del Pasivo No Corriente")
        
        # Agregar columna para el nuevo componente
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.subheader("💼 Deudas No Corrientes")
            st.metric("Total", f"${df_deudas['saldo_pendiente_simulado'].sum():,.2f}")
            
        with col2:
            st.subheader("⚠️ Previsiones")
            st.metric("Total", f"${df_previsiones['monto_estimado_ars'].sum():,.2f}")
        
        with col3:
            st.subheader("👥 Beneficios Empleados")
            st.metric("Total", f"${df_beneficios['monto_estimado'].sum():,.2f}")
        
        # Actualizar cálculo del total
        total_pasivo_nc = (
            df_deudas['saldo_pendiente_simulado'].sum() + 
            df_previsiones['monto_estimado_ars'].sum() +
            df_beneficios['monto_estimado'].sum()
        )
        
        st.markdown("---")
        st.subheader("💰 TOTAL PASIVO NO CORRIENTE")
        st.metric("Valor Total Estimado", f"${total_pasivo_nc:,.2f}")
        
        # Actualizar gráfico comparativo
        fig, ax = plt.subplots(figsize=(12, 6))
        componentes = ['Deudas No Corrientes', 'Previsiones', 'Beneficios Empleados']
        valores = [
            df_deudas['saldo_pendiente_simulado'].sum(),
            df_previsiones['monto_estimado_ars'].sum(),
            df_beneficios['monto_estimado'].sum()
        ]
        colors = ['#1f77b4', '#ff7f0e', '#2ca02c']
        ax.bar(componentes, valores, color=colors)
        ax.set_ylabel('Monto Total (ARS)', fontsize=12)
        ax.set_title('Composición del Pasivo No Corriente', fontsize=16)
        for i, v in enumerate(valores):
            ax.text(i, v, f'${v:,.0f}', ha='center', va='bottom', fontsize=10)
        st.pyplot(fig)
```

## 📋 Checklist para agregar un nuevo componente

- [ ] Crear función `generar_dataframe_[nombre_componente]()`
- [ ] Usar `@st.cache_data` decorator
- [ ] Definir seed para reproducibilidad
- [ ] Crear función `analizar_[nombre_componente](df)`
- [ ] Incluir métricas clave
- [ ] Agregar detección de anomalías
- [ ] Crear al menos 3 visualizaciones
- [ ] Agregar nueva pestaña en `main()`
- [ ] Actualizar el resumen consolidado
- [ ] Actualizar el gráfico comparativo
- [ ] Actualizar el cálculo del total
- [ ] Probar la aplicación completa

## 🎨 Consejos de diseño

1. **Colores consistentes**: Usa la paleta de Seaborn
   - `viridis`, `plasma`, `inferno`, `magma`, `cividis`

2. **Tamaños de figura estándar**:
   - Gráficos de barras: `figsize=(12, 7)`
   - Gráficos de conteo: `figsize=(8, 6)`
   - Scatter plots: `figsize=(12, 8)`

3. **Estructura de análisis**:
   - Primero: Métricas clave (3 columnas)
   - Segundo: Tablas resumen
   - Tercero: Detección de anomalías
   - Cuarto: Visualizaciones (mínimo 3)

4. **Nomenclatura**:
   - IDs: Usar prefijo único (ej: `OBE-` para Obligaciones Beneficios Empleados)
   - Variables: snake_case en español
   - Funciones: snake_case con verbos descriptivos

## 🔄 Plantilla base para nuevo componente

```python
@st.cache_data
def generar_dataframe_[NOMBRE]():
    """Genera datos simulados de [DESCRIPCIÓN]"""
    np.random.seed([SEED])
    random.seed([SEED])
    fake = Faker('es_AR')
    Faker.seed([SEED])
    
    num_registros = [CANTIDAD]
    # ... tu lógica aquí ...
    
    df = pd.DataFrame(data)
    return df

def analizar_[NOMBRE](df):
    """Análisis completo de [DESCRIPCIÓN]"""
    st.subheader("📊 Análisis de [TÍTULO]")
    
    # Métricas
    col1, col2, col3 = st.columns(3)
    col1.metric("[MÉTRICA 1]", "[VALOR 1]")
    col2.metric("[MÉTRICA 2]", "[VALOR 2]")
    col3.metric("[MÉTRICA 3]", "[VALOR 3]")
    
    # Análisis
    st.markdown("---")
    # ... tu análisis aquí ...
    
    # Anomalías
    st.markdown("---")
    st.subheader("🚨 Detección de Anomalías")
    # ... detección aquí ...
    
    # Visualizaciones
    st.markdown("---")
    st.subheader("📈 Visualizaciones")
    # ... gráficos aquí ...
```

## 📚 Recursos adicionales

- [Documentación de Streamlit](https://docs.streamlit.io)
- [Seaborn Gallery](https://seaborn.pydata.org/examples/index.html)
- [Sklearn Isolation Forest](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.IsolationForest.html)
- [Faker Documentation](https://faker.readthedocs.io)