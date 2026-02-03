#!/bin/bash

echo "🚀 Iniciando aplicación de Pasivo No Corriente..."
echo ""

# Verificar si streamlit está instalado
if ! command -v streamlit &> /dev/null
then
    echo "❌ Streamlit no está instalado."
    echo "📦 Instalando dependencias..."
    pip install -r requirements.txt
    echo "✅ Dependencias instaladas correctamente."
    echo ""
fi

# Ejecutar la aplicación
echo "▶️  Ejecutando aplicación..."
streamlit run pasivo_no_corriente_app.py

# Si falla, mostrar mensaje de ayuda
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Error al ejecutar la aplicación."
    echo "💡 Intenta instalar las dependencias manualmente:"
    echo "   pip install -r requirements.txt"
fi