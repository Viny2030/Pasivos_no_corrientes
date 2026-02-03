# =================================================================
# APLICACIÓN CONSOLIDADA: PASIVO NO CORRIENTE
# =================================================================
import pandas as pd
import numpy as np
import random
from faker import Faker
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import IsolationForest
import streamlit as st
import os
import PyPDF2

# =================================================================
# CONFIGURACIÓN GENERAL
# =================================================================
st.set_page_config(layout="wide", page_title="Análisis de Pasivo No Corriente")

# =================================================================
# FUNCIONES DE GENERACIÓN DE DATOS
# =================================================================


@st.cache_data
def generate_debt_dataframe():
    """Genera datos simulados de Deudas No Corrientes"""
    np.random.seed(1011)
    random.seed(1011)
    fake = Faker("es_AR")
    Faker.seed(1011)

    num_deudas = 30
    tipos_deuda_no_corriente = [
        "Préstamo Bancario a Largo Plazo",
        "Bonos Emitidos",
        "Hipoteca Inmobiliaria",
        "Arrendamiento Financiero (Leasing)",
        "Deuda con Partes Relacionadas (Largo Plazo)",
        "Obligaciones Negociables",
    ]
    plazos_anios = [3, 5, 7, 10, 15, 20]

    num_empresas_deudoras = 25
    empresas_deudoras = [
        {
            "empresa_id": 5000 + i,
            "nombre_empresa": fake.company(),
            "cuit": fake.unique.bothify(text="30-########-#"),
        }
        for i in range(num_empresas_deudoras)
    ]

    deudas_no_corrientes = []
    for i in range(num_deudas):
        deudora = random.choice(empresas_deudoras)
        tipo = random.choice(tipos_deuda_no_corriente)
        fecha_emision = fake.date_between(start_date="-10y", end_date="-90d")
        plazo_anios_elegido = random.choice(plazos_anios)
        fecha_vencimiento = fecha_emision + timedelta(days=plazo_anios_elegido * 365.25)
        monto_original = round(random.uniform(500000, 10000000), 2)

        if tipo == "Préstamo Bancario a Largo Plazo":
            tasa_interes_anual = round(random.uniform(0.06, 0.15), 4)
        elif tipo in ["Bonos Emitidos", "Obligaciones Negociables"]:
            tasa_interes_anual = round(random.uniform(0.04, 0.12), 4)
        else:
            tasa_interes_anual = round(random.uniform(0.03, 0.10), 4)

        today = datetime.now().date()
        days_passed = (today - fecha_emision).days

        if fecha_vencimiento < today:
            estado = random.choices(
                ["Pagada", "Incumplida", "Refinanciada"], weights=[0.6, 0.2, 0.2]
            )[0]
            saldo_pendiente_simulado = (
                0.0
                if estado == "Pagada"
                else round(monto_original * random.uniform(0.1, 1.0), 2)
            )
        else:
            estado = "Activa"
            total_days = (fecha_vencimiento - fecha_emision).days
            saldo_pendiente_simulado = (
                round(monto_original * (1 - (days_passed / total_days)), 2)
                if total_days > 0
                else monto_original
            )
            if saldo_pendiente_simulado < 0:
                saldo_pendiente_simulado = 0.0
            if random.random() < 0.02:
                estado = "Incumplida"

        intereses_acumulados_simulados = round(
            monto_original * tasa_interes_anual * (days_passed / 365.25), 2
        )
        if intereses_acumulados_simulados < 0:
            intereses_acumulados_simulados = 0.0

        deudas_no_corrientes.append(
            {
                "deuda_id": f"DNC-{50000 + i}",
                "empresa_id": deudora["empresa_id"],
                "tipo_deuda": tipo,
                "fecha_emision": fecha_emision,
                "fecha_vencimiento": fecha_vencimiento,
                "plazo_anios": plazo_anios_elegido,
                "monto_original": monto_original,
                "tasa_interes_anual": tasa_interes_anual,
                "saldo_pendiente_simulado": saldo_pendiente_simulado,
                "intereses_acumulados_simulados": intereses_acumulados_simulados,
                "estado_deuda": estado,
                "nombre_empresa_deudora": deudora["nombre_empresa"],
                "cuit_empresa_deudora": deudora["cuit"],
            }
        )

    df = pd.DataFrame(deudas_no_corrientes)
    df.sort_values(by="fecha_emision", inplace=True)
    return df


@st.cache_data
def generar_dataframe_previsiones():
    """Genera datos simulados de Previsiones"""
    np.random.seed(42)
    random.seed(42)
    fake = Faker("es_AR")
    Faker.seed(42)

    num_previsiones = 30
    fecha_actual_referencia = datetime(2025, 7, 10)

    tipos_prevision = [
        "Garantías",
        "Litigios",
        "Cobranzas Dudosas",
        "Reestructuración",
        "Devoluciones de Ventas",
        "Desmantelamiento",
    ]
    probabilidades = ["Alta", "Media", "Baja"]
    estados_prevision = ["Activa", "Utilizada", "Revertida", "Ajustada"]

    data = []
    for i in range(num_previsiones):
        tipo = random.choice(tipos_prevision)
        estado = random.choices(estados_prevision, weights=[0.6, 0.2, 0.1, 0.1], k=1)[0]
        fecha_creacion = fecha_actual_referencia - timedelta(
            days=random.randint(30, 365 * 3)
        )
        monto_estimado = round(random.uniform(100000.0, 5000000.0), 2)

        fecha_ult_rev = fecha_creacion + timedelta(days=random.randint(15, 365))
        if fecha_ult_rev > fecha_actual_referencia:
            fecha_ult_rev = fecha_actual_referencia

        fecha_est_utilizacion = pd.NaT
        if estado in ["Activa", "Ajustada"]:
            fecha_est_utilizacion = fecha_actual_referencia + timedelta(
                days=random.randint(30, 365 * 2)
            )
        elif estado in ["Utilizada", "Revertida"]:
            fecha_est_utilizacion = fecha_creacion + timedelta(
                days=random.randint(30, 500)
            )
            if fecha_est_utilizacion > fecha_actual_referencia:
                fecha_est_utilizacion = fecha_actual_referencia - timedelta(
                    days=random.randint(1, 60)
                )

        data.append(
            {
                "id_prevision": f"PREV-{i:04d}",
                "tipo_prevision": tipo,
                "descripcion_breve": f"Previsión por {tipo} - Evento {i + 1}",
                "fecha_creacion": fecha_creacion,
                "monto_estimado_ars": monto_estimado,
                "probabilidad_ocurrencia": random.choice(probabilidades),
                "estado_actual": estado,
                "fecha_ultima_revision": fecha_ult_rev,
                "fecha_estimada_utilizacion": fecha_est_utilizacion,
            }
        )

    df_previsiones = pd.DataFrame(data)
    for col_fecha in [
        "fecha_creacion",
        "fecha_ultima_revision",
        "fecha_estimada_utilizacion",
    ]:
        df_previsiones[col_fecha] = pd.to_datetime(df_previsiones[col_fecha])

    return df_previsiones


# =================================================================
# FUNCIONES DE ANÁLISIS Y VISUALIZACIÓN
# =================================================================


def analizar_deudas_no_corrientes(df):
    """Análisis completo de Deudas No Corrientes"""
    st.subheader("📊 Análisis de Deudas No Corrientes")

    # Data Preprocessing
    df["fecha_emision"] = pd.to_datetime(df["fecha_emision"])
    df["fecha_vencimiento"] = pd.to_datetime(df["fecha_vencimiento"])
    numeric_cols = [
        "plazo_anios",
        "monto_original",
        "tasa_interes_anual",
        "saldo_pendiente_simulado",
        "intereses_acumulados_simulados",
    ]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    df.fillna(0, inplace=True)

    # Métricas clave
    col1, col2, col3 = st.columns(3)
    col1.metric("Total de deudas", len(df))
    col2.metric("Monto original total", f"${df['monto_original'].sum():,.2f}")
    col3.metric(
        "Saldo pendiente total", f"${df['saldo_pendiente_simulado'].sum():,.2f}"
    )

    # Detección de Anomalías
    st.markdown("---")
    st.subheader("🚨 Detección de Anomalías (Isolation Forest)")
    features = ["saldo_pendiente_simulado", "tasa_interes_anual", "plazo_anios"]
    df_active = df[df["estado_deuda"].isin(["Activa", "Incumplida"])].copy()

    if not df_active.empty:
        iso_forest = IsolationForest(random_state=42, contamination=0.1)
        df_active["is_anomaly"] = iso_forest.fit_predict(df_active[features])
        anomalies_count = (df_active["is_anomaly"] == -1).sum()
        st.write(f"Anomalías detectadas por IA: **{anomalies_count}**")
        if anomalies_count > 0:
            anomalies_df = df_active[df_active["is_anomaly"] == -1]
            st.warning("Deudas anómalas recomendadas para revisión:")
            st.dataframe(
                anomalies_df[
                    [
                        "deuda_id",
                        "nombre_empresa_deudora",
                        "tipo_deuda",
                        "saldo_pendiente_simulado",
                    ]
                ]
            )

    # Visualizaciones
    st.markdown("---")
    st.subheader("📈 Visualizaciones")
    sns.set(style="whitegrid", palette="viridis")

    # Gráfico 1
    fig1, ax1 = plt.subplots(figsize=(12, 7))
    saldo_por_tipo = (
        df.groupby("tipo_deuda")["saldo_pendiente_simulado"]
        .sum()
        .sort_values(ascending=False)
    )
    sns.barplot(x=saldo_por_tipo.index, y=saldo_por_tipo.values, hue=saldo_por_tipo.index, ax=ax1, legend=False)
    ax1.set_title("Saldo Pendiente Total por Tipo de Deuda", fontsize=16)
    ax1.set_ylabel("Saldo Pendiente Total", fontsize=12)
    ax1.set_xlabel("Tipo de Deuda", fontsize=12)
    ax1.tick_params(axis="x", rotation=45)
    st.pyplot(fig1)
    plt.close(fig1)

    # Gráfico 2
    fig2, ax2 = plt.subplots(figsize=(8, 6))
    sns.countplot(
        x="estado_deuda", data=df, hue="estado_deuda", order=df["estado_deuda"].value_counts().index, ax=ax2, legend=False
    )
    ax2.set_title("Distribución de Deudas por Estado", fontsize=16)
    ax2.set_xlabel("Estado de la Deuda", fontsize=12)
    ax2.set_ylabel("Cantidad de Deudas", fontsize=12)
    st.pyplot(fig2)
    plt.close(fig2)

    # Gráfico 3
    if not df_active.empty:
        fig3, ax3 = plt.subplots(figsize=(12, 8))
        sns.scatterplot(
            data=df_active,
            x="saldo_pendiente_simulado",
            y="tasa_interes_anual",
            hue="is_anomaly",
            style="is_anomaly",
            palette={1: "blue", -1: "red"},
            markers={1: "o", -1: "X"},
            s=100,
            ax=ax3,
        )
        ax3.set_title(
            "Detección de Anomalías (IA): Saldo vs. Tasa de Interés", fontsize=16
        )
        ax3.set_xlabel("Saldo Pendiente", fontsize=12)
        ax3.set_ylabel("Tasa de Interés Anual", fontsize=12)
        ax3.legend(title="¿Es Anomalía?", labels=["No", "Sí"])
        st.pyplot(fig3)
        plt.close(fig3)


def analizar_previsiones(df_previsiones):
    """Análisis completo de Previsiones"""
    st.subheader("📊 Análisis de Previsiones")

    # Data Preprocessing
    prob_map = {"Baja": 0.25, "Media": 0.50, "Alta": 0.75}
    df_previsiones["probabilidad_valor"] = (
        df_previsiones["probabilidad_ocurrencia"].map(prob_map).fillna(0.5)
    )
    fecha_actual_referencia = datetime(2025, 7, 10)
    df_previsiones["dias_desde_creacion"] = (
        fecha_actual_referencia - df_previsiones["fecha_creacion"]
    ).dt.days

    # Métricas clave
    col1, col2, col3 = st.columns(3)
    col1.metric("Total de previsiones", len(df_previsiones))
    col2.metric(
        "Monto total estimado", f"${df_previsiones['monto_estimado_ars'].sum():,.2f}"
    )
    col3.metric(
        "Previsiones activas",
        len(df_previsiones[df_previsiones["estado_actual"] == "Activa"]),
    )

    # Tabla resumen
    st.markdown("---")
    st.subheader("💰 Monto Total Estimado por Tipo de Previsión")
    monto_por_tipo = (
        df_previsiones.groupby("tipo_prevision")["monto_estimado_ars"]
        .sum()
        .sort_values(ascending=False)
    )
    st.dataframe(monto_por_tipo.apply(lambda x: f"${x:,.2f}").to_frame())

    # Detección de Anomalías
    st.markdown("---")
    st.subheader("🤖 Detección de Anomalías con Isolation Forest")
    features = ["monto_estimado_ars", "probabilidad_valor", "dias_desde_creacion"]
    df_ia = df_previsiones[features].copy().fillna(0)

    iso_forest = IsolationForest(random_state=42, contamination=0.1)
    df_previsiones["es_anomalia"] = iso_forest.fit_predict(df_ia)

    anomalias_detectadas = df_previsiones[df_previsiones["es_anomalia"] == -1]
    st.warning(f"Se detectaron {len(anomalias_detectadas)} anomalías potenciales.")
    if not anomalias_detectadas.empty:
        st.dataframe(
            anomalias_detectadas[
                [
                    "id_prevision",
                    "tipo_prevision",
                    "monto_estimado_ars",
                    "estado_actual",
                ]
            ]
        )

    # Visualizaciones
    st.markdown("---")
    st.subheader("📈 Visualizaciones")
    sns.set_style("whitegrid")

    # Gráfico 1
    fig1, ax1 = plt.subplots(figsize=(12, 7))
    sns.barplot(
        x=monto_por_tipo.index, y=monto_por_tipo.values, hue=monto_por_tipo.index, 
        palette="viridis", ax=ax1, legend=False
    )
    ax1.set_title("Monto Total Estimado por Tipo de Previsión", fontsize=16)
    ax1.set_ylabel("Monto Total Estimado (ARS)", fontsize=12)
    ax1.set_xlabel("Tipo de Previsión", fontsize=12)
    ax1.tick_params(axis="x", rotation=45)
    st.pyplot(fig1)
    plt.close(fig1)

    # Gráfico 2
    fig2, ax2 = plt.subplots(figsize=(8, 6))
    sns.countplot(
        x="estado_actual",
        data=df_previsiones,
        hue="estado_actual",
        palette="cividis",
        order=df_previsiones["estado_actual"].value_counts().index,
        ax=ax2,
        legend=False
    )
    ax2.set_title("Distribución de Previsiones por Estado", fontsize=16)
    ax2.set_xlabel("Estado Actual", fontsize=12)
    ax2.set_ylabel("Cantidad de Previsiones", fontsize=12)
    st.pyplot(fig2)
    plt.close(fig2)

    # Gráfico 3
    fig3, ax3 = plt.subplots(figsize=(12, 8))
    sns.scatterplot(
        data=df_previsiones,
        x="monto_estimado_ars",
        y="dias_desde_creacion",
        hue="es_anomalia",
        style="es_anomalia",
        palette={1: "blue", -1: "red"},
        markers={1: "o", -1: "X"},
        s=100,
        ax=ax3,
    )
    ax3.set_title("Detección de Anomalías: Monto vs. Antigüedad", fontsize=16)
    ax3.set_xlabel("Monto Estimado (ARS)", fontsize=12)
    ax3.set_ylabel("Días desde la Creación", fontsize=12)
    handles, labels = ax3.get_legend_handles_labels()
    ax3.legend(handles, ["Normal", "Anomalía"], title="¿Es Anomalía?")
    st.pyplot(fig3)
    plt.close(fig3)


# =================================================================
# FUNCIONES PARA INFORMES DE AUDITORÍA
# =================================================================


def extraer_texto_pdf(ruta_archivo):
    """Extrae texto de un archivo PDF"""
    try:
        with open(ruta_archivo, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            texto = ""
            for page in pdf_reader.pages:
                texto += page.extract_text() + "\n"
            return texto
    except Exception as e:
        return f"Error al leer el PDF: {str(e)}"


def mostrar_informes_auditoria():
    """Muestra los informes de auditoría disponibles"""
    st.header("📄 Informes de Auditoría")
    st.markdown("""
        Informes profesionales de auditoría generados mediante análisis algorítmico del Pasivo No Corriente.
        Cada informe incluye análisis bajo normas nacionales (RT 37, RT 41) e internacionales (ISA 315, ISA 520).
    """)
    
    # Ruta de los informes
    ruta_informes = "data/informes_auditoria"
    
    # Verificar si existe el directorio
    if not os.path.exists(ruta_informes):
        st.warning(f"⚠️ No se encontró el directorio de informes: {ruta_informes}")
        st.info("Los informes se generarán automáticamente cuando se configure el sistema.")
        return
    
    # Buscar archivos PDF
    archivos_pdf = sorted([f for f in os.listdir(ruta_informes) if f.endswith('.pdf')])
    
    if not archivos_pdf:
        st.warning("⚠️ No se encontraron informes de auditoría en el directorio.")
        st.info("Asegúrese de que los archivos PDF estén en la carpeta data/informes_auditoria/")
        return
    
    st.success(f"✅ Se encontraron {len(archivos_pdf)} informes de auditoría")
    st.markdown("---")
    
    # Selector de informe
    informe_seleccionado = st.selectbox(
        "📂 Seleccione un informe:",
        archivos_pdf,
        format_func=lambda x: x.replace('_', ' ').replace('.pdf', '').title()
    )
    
    if informe_seleccionado:
        ruta_completa = os.path.join(ruta_informes, informe_seleccionado)
        
        # Mostrar información del informe
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.subheader(f"📋 {informe_seleccionado.replace('_', ' ').replace('.pdf', '').title()}")
            
            # Extraer año del nombre del archivo
            try:
                año = informe_seleccionado.split('_')[-1].replace('.pdf', '')
                st.info(f"📅 **Ejercicio Fiscal:** {año}")
            except:
                pass
        
        with col2:
            # Botón de descarga
            with open(ruta_completa, 'rb') as file:
                st.download_button(
                    label="⬇️ Descargar PDF",
                    data=file.read(),
                    file_name=informe_seleccionado,
                    mime="application/pdf"
                )
        
        st.markdown("---")
        
        # Opciones de visualización
        opcion = st.radio(
            "Seleccione qué desea ver:",
            ["📖 Resumen del Contenido", "📄 Texto Completo Extraído"],
            horizontal=True
        )
        
        if opcion == "📖 Resumen del Contenido":
            st.subheader("📊 Contenido del Informe")
            st.markdown("""
            Este informe incluye:
            
            **1. Portada y Datos Generales**
            - Título del informe
            - Período analizado
            - Fecha de emisión
            - Información del responsable
            
            **2. Resumen Ejecutivo**
            - Total de registros analizados
            - Monto total del pasivo
            - Anomalías detectadas
            - Tasa de precisión del algoritmo
            
            **3. Marco Normativo Aplicado**
            - **Normas Nacionales:** RT 37, RT 41 (FACPCE), Ley 25.506, Ley 25.326
            - **Normas Internacionales:** ISA 315, ISA 520, Marco COSO
            
            **4. Análisis de Deudas No Corrientes**
            - Distribución por tipo de deuda (tabla)
            - Distribución por estado
            - Anomalías identificadas
            - Recomendaciones específicas
            
            **5. Análisis de Previsiones**
            - Distribución por tipo de previsión (tabla)
            - Distribución por estado
            - Anomalías detectadas
            - Recomendaciones
            
            **6. Matriz de Riesgos**
            - Riesgos identificados
            - Impacto y probabilidad
            - Nivel de riesgo (Alto/Medio/Bajo)
            
            **7. Conclusiones y Recomendaciones**
            - Certificación de cumplimiento normativo
            - Opinión técnica profesional
            - Acciones recomendadas
            - Firma del responsable
            """)
            
        else:
            # Extraer y mostrar texto
            with st.spinner("Extrayendo texto del PDF..."):
                texto = extraer_texto_pdf(ruta_completa)
            
            st.subheader("📄 Texto Extraído del PDF")
            
            # Opción de búsqueda
            busqueda = st.text_input("🔍 Buscar en el documento:", "")
            
            if busqueda:
                # Resaltar texto buscado
                texto_mostrar = texto.replace(busqueda, f"**{busqueda}**")
                st.markdown(f"Se encontraron {texto.count(busqueda)} coincidencias")
            else:
                texto_mostrar = texto
            
            # Mostrar texto en un contenedor con scroll
            st.text_area(
                "Contenido:",
                texto_mostrar,
                height=600,
                disabled=True
            )
            
            # Estadísticas
            st.markdown("---")
            col1, col2, col3 = st.columns(3)
            with col1:
                st.metric("📝 Palabras", len(texto.split()))
            with col2:
                st.metric("🔤 Caracteres", len(texto))
            with col3:
                num_paginas = texto.count('\f') + 1  # Contador aproximado
                st.metric("📄 Páginas aprox.", num_paginas)


# =================================================================
# APLICACIÓN PRINCIPAL
# =================================================================


def main():
    # Título principal
    st.title("📋 Análisis Consolidado de Pasivo No Corriente")
    st.markdown("""
        Esta aplicación consolida el análisis de todos los componentes del **Pasivo No Corriente**, 
        incluyendo detección de anomalías mediante inteligencia artificial.
    """)
    st.markdown("---")

    # Crear pestañas
    tab1, tab2, tab3, tab4 = st.tabs(
        ["🏦 Deudas No Corrientes", "⚠️ Previsiones", "📊 Resumen Consolidado", "📄 Informes de Auditoría"]
    )

    # Generar datos
    with st.spinner("Generando datos..."):
        df_deudas = generate_debt_dataframe()
        df_previsiones = generar_dataframe_previsiones()

    # Pestaña 1: Deudas No Corrientes
    with tab1:
        st.header("🏦 Deudas No Corrientes")
        st.markdown("""
            Análisis de préstamos, bonos, hipotecas y otras obligaciones a largo plazo.
        """)
        analizar_deudas_no_corrientes(df_deudas)

    # Pestaña 2: Previsiones
    with tab2:
        st.header("⚠️ Previsiones")
        st.markdown("""
            Análisis de previsiones para contingencias, garantías y otros pasivos estimados.
        """)
        analizar_previsiones(df_previsiones)

    # Pestaña 3: Resumen Consolidado
    with tab3:
        st.header("📊 Resumen Consolidado del Pasivo No Corriente")
        st.markdown("---")

        # Métricas consolidadas
        col1, col2 = st.columns(2)

        with col1:
            st.subheader("💼 Deudas No Corrientes")
            st.metric("Total Deudas", len(df_deudas))
            st.metric(
                "Saldo Pendiente Total",
                f"${df_deudas['saldo_pendiente_simulado'].sum():,.2f}",
            )

        with col2:
            st.subheader("⚠️ Previsiones")
            st.metric("Total Previsiones", len(df_previsiones))
            st.metric(
                "Monto Estimado Total",
                f"${df_previsiones['monto_estimado_ars'].sum():,.2f}",
            )

        st.markdown("---")

        # Total consolidado
        total_pasivo_nc = (
            df_deudas["saldo_pendiente_simulado"].sum()
            + df_previsiones["monto_estimado_ars"].sum()
        )
        st.subheader("💰 TOTAL PASIVO NO CORRIENTE")
        st.metric("Valor Total Estimado", f"${total_pasivo_nc:,.2f}")

        st.markdown("---")

        # Gráfico comparativo
        st.subheader("📊 Comparación de Componentes")
        fig, ax = plt.subplots(figsize=(10, 6))
        componentes = ["Deudas No Corrientes", "Previsiones"]
        valores = [
            df_deudas["saldo_pendiente_simulado"].sum(),
            df_previsiones["monto_estimado_ars"].sum(),
        ]
        colors = ["#1f77b4", "#ff7f0e"]
        ax.bar(componentes, valores, color=colors)
        ax.set_ylabel("Monto Total (ARS)", fontsize=12)
        ax.set_title("Composición del Pasivo No Corriente", fontsize=16)
        for i, v in enumerate(valores):
            ax.text(i, v, f"${v:,.0f}", ha="center", va="bottom", fontsize=10)
        st.pyplot(fig)
        plt.close(fig)

        # Tabla detallada
        st.markdown("---")
        st.subheader("📋 Detalle por Componente")
        resumen_data = {
            "Componente": ["Deudas No Corrientes", "Previsiones", "TOTAL"],
            "Cantidad de Registros": [
                len(df_deudas),
                len(df_previsiones),
                len(df_deudas) + len(df_previsiones),
            ],
            "Monto Total (ARS)": [
                f"${df_deudas['saldo_pendiente_simulado'].sum():,.2f}",
                f"${df_previsiones['monto_estimado_ars'].sum():,.2f}",
                f"${total_pasivo_nc:,.2f}",
            ],
            "Porcentaje del Total": [
                f"{(df_deudas['saldo_pendiente_simulado'].sum() / total_pasivo_nc * 100):.1f}%",
                f"{(df_previsiones['monto_estimado_ars'].sum() / total_pasivo_nc * 100):.1f}%",
                "100.0%",
            ],
        }
        df_resumen = pd.DataFrame(resumen_data)
        st.dataframe(df_resumen, use_container_width=True)

    # Pestaña 4: Informes de Auditoría
    with tab4:
        mostrar_informes_auditoria()


if __name__ == "__main__":
    main()

# Nota: Para habilitar la exportación de informes Word, instalar:
# npm install -g docx
# Luego descomentar las líneas relacionadas con la exportación en la pestaña de resumen