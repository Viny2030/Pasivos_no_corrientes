#!/bin/bash

# =============================================================================
# SCRIPT: Subir Informes de Auditoría a GitHub
# =============================================================================

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║      SUBIR INFORMES DE AUDITORÍA AL REPOSITORIO GITHUB       ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}PASO 1: Crear la estructura de directorios${NC}"
echo "------------------------------------------------------------"
echo "Ejecuta estos comandos en tu terminal local:"
echo ""
echo "mkdir -p data/informes_auditoria"
echo ""

echo -e "${YELLOW}PASO 2: Copiar los archivos PDF${NC}"
echo "------------------------------------------------------------"
echo "Descarga los 5 archivos PDF y colócalos en la carpeta:"
echo "  data/informes_auditoria/"
echo ""
echo "Archivos a copiar:"
echo "  • informe_auditoria_2020.pdf"
echo "  • informe_auditoria_2021.pdf"
echo "  • informe_auditoria_2022.pdf"
echo "  • informe_auditoria_2023.pdf"
echo "  • informe_auditoria_2024.pdf"
echo ""

echo -e "${YELLOW}PASO 3: Actualizar requirements.txt${NC}"
echo "------------------------------------------------------------"
echo "Agrega esta línea al archivo requirements.txt:"
echo ""
echo "reportlab>=3.6.0"
echo ""

echo -e "${YELLOW}PASO 4: Agregar archivos a Git${NC}"
echo "------------------------------------------------------------"
echo "Ejecuta estos comandos:"
echo ""
echo "git add data/informes_auditoria/*.pdf"
echo "git add requirements.txt"
echo "git commit -m 'Agregar informes de auditoría PDF (2020-2024)'"
echo "git push origin main"
echo ""

echo -e "${YELLOW}PASO 5: Verificar en Render${NC}"
echo "------------------------------------------------------------"
echo "Render detectará automáticamente los cambios y redesplegará."
echo "Espera unos minutos y luego visita:"
echo "  https://pasivos-no-corrientes.onrender.com/"
echo ""
echo "Navega a la pestaña 'Informes de Auditoría' para verificar."
echo ""

echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Instrucciones completadas${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "📌 RESUMEN DE ARCHIVOS A SUBIR:"
echo ""
echo "data/informes_auditoria/"
echo "├── informe_auditoria_2020.pdf (12 KB)"
echo "├── informe_auditoria_2021.pdf (12 KB)"
echo "├── informe_auditoria_2022.pdf (12 KB)"
echo "├── informe_auditoria_2023.pdf (12 KB)"
echo "└── informe_auditoria_2024.pdf (12 KB)"
echo ""
echo "Total: ~60 KB"
echo ""

echo "💡 CONSEJOS:"
echo "  • Verifica que los archivos se copiaron correctamente"
echo "  • No olvides actualizar requirements.txt"
echo "  • Revisa los logs de Render después del despliegue"
echo "  • Si hay errores, descarga los logs de Render para diagnóstico"
echo ""

echo "🔗 ENLACES ÚTILES:"
echo "  • Tu app: https://pasivos-no-corrientes.onrender.com/"
echo "  • Dashboard Render: https://dashboard.render.com/"
echo ""
