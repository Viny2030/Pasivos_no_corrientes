#!/bin/bash

# =============================================================================
# SCRIPT DE INSTALACIÓN: MÓDULO DE INFORMES DE AUDITORÍA
# =============================================================================

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   INSTALACIÓN: Módulo de Generación de Informes de Auditoría ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
NODE_MIN_VERSION="14.0.0"
PYTHON_MIN_VERSION="3.8.0"

# =============================================================================
# FUNCIONES AUXILIARES
# =============================================================================

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

version_ge() {
    # Compara versiones: devuelve 0 si $1 >= $2
    [ "$(printf '%s\n' "$1" "$2" | sort -V | head -n1)" = "$2" ]
}

# =============================================================================
# PASO 1: VERIFICAR PYTHON
# =============================================================================

echo "📍 Paso 1: Verificando Python..."

if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | awk '{print $2}')
    if version_ge "$PYTHON_VERSION" "$PYTHON_MIN_VERSION"; then
        print_success "Python $PYTHON_VERSION instalado"
    else
        print_error "Python $PYTHON_VERSION es muy antiguo. Se requiere $PYTHON_MIN_VERSION o superior."
        exit 1
    fi
else
    print_error "Python 3 no está instalado"
    echo "Por favor, instala Python 3.8 o superior:"
    echo "  Ubuntu/Debian: sudo apt-get install python3"
    echo "  macOS: brew install python3"
    exit 1
fi

# =============================================================================
# PASO 2: VERIFICAR/INSTALAR NODE.JS
# =============================================================================

echo ""
echo "📍 Paso 2: Verificando Node.js..."

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | sed 's/v//')
    if version_ge "$NODE_VERSION" "$NODE_MIN_VERSION"; then
        print_success "Node.js $NODE_VERSION instalado"
    else
        print_warning "Node.js $NODE_VERSION es muy antiguo. Se recomienda actualizar a v18+"
    fi
else
    print_error "Node.js no está instalado"
    echo ""
    echo "Instalando Node.js..."

    # Detectar sistema operativo
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt-get &> /dev/null; then
            # Ubuntu/Debian
            echo "Detectado: Ubuntu/Debian"
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
        elif command -v yum &> /dev/null; then
            # CentOS/RHEL
            echo "Detectado: CentOS/RHEL"
            curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
            sudo yum install -y nodejs
        else
            print_error "No se pudo instalar Node.js automáticamente"
            echo "Por favor, instala Node.js manualmente desde: https://nodejs.org"
            exit 1
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        echo "Detectado: macOS"
        if command -v brew &> /dev/null; then
            brew install node
        else
            print_error "Homebrew no está instalado"
            echo "Por favor, instala Homebrew primero: https://brew.sh"
            exit 1
        fi
    else
        print_error "Sistema operativo no soportado para instalación automática"
        echo "Por favor, instala Node.js manualmente desde: https://nodejs.org"
        exit 1
    fi

    # Verificar instalación
    if command -v node &> /dev/null; then
        print_success "Node.js instalado correctamente"
    else
        print_error "Error al instalar Node.js"
        exit 1
    fi
fi

# =============================================================================
# PASO 3: INSTALAR PAQUETE DOCX
# =============================================================================

echo ""
echo "📍 Paso 3: Instalando paquete docx..."

# Verificar si ya está instalado
if npm list -g docx &> /dev/null; then
    DOCX_VERSION=$(npm list -g docx --depth=0 | grep docx | awk '{print $2}' | sed 's/@//')
    print_success "docx $DOCX_VERSION ya está instalado"
else
    echo "Instalando docx globalmente..."
    if sudo npm install -g docx; then
        print_success "docx instalado correctamente"
    else
        # Intentar sin sudo si falla
        echo "Intentando sin sudo..."
        if npm install -g docx; then
            print_success "docx instalado correctamente"
        else
            print_error "Error al instalar docx"
            echo "Intenta instalarlo manualmente con: npm install -g docx"
            exit 1
        fi
    fi
fi

# =============================================================================
# PASO 4: INSTALAR DEPENDENCIAS DE PYTHON
# =============================================================================

echo ""
echo "📍 Paso 4: Instalando dependencias de Python..."

# Verificar si existe requirements.txt
if [ -f "requirements.txt" ]; then
    pip3 install -r requirements.txt
    print_success "Dependencias de Python instaladas"
else
    print_warning "No se encontró requirements.txt"
    echo "Instalando dependencias básicas..."
    pip3 install streamlit pandas numpy faker matplotlib seaborn scikit-learn
    print_success "Dependencias básicas instaladas"
fi

# =============================================================================
# PASO 5: VERIFICAR INSTALACIÓN
# =============================================================================

echo ""
echo "📍 Paso 5: Verificando instalación..."

# Verificar Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js: $NODE_VERSION"
else
    print_error "Node.js no encontrado"
fi

# Verificar npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm: v$NPM_VERSION"
else
    print_error "npm no encontrado"
fi

# Verificar docx
if npm list -g docx &> /dev/null; then
    DOCX_VERSION=$(npm list -g docx --depth=0 | grep docx | awk '{print $2}')
    print_success "docx: $DOCX_VERSION"
else
    print_error "docx no encontrado"
fi

# Verificar Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    print_success "$PYTHON_VERSION"
else
    print_error "Python 3 no encontrado"
fi

# =============================================================================
# PASO 6: PRUEBA DEL GENERADOR
# =============================================================================

echo ""
echo "📍 Paso 6: Probando el generador de informes..."

if [ -f "generar_informe_auditoria.js" ]; then
    echo "Ejecutando prueba..."
    if node generar_informe_auditoria.js; then
        if [ -f "INFORME_AUDITORIA_PASIVO_NO_CORRIENTE.docx" ]; then
            print_success "Informe de prueba generado correctamente"
            echo "   Archivo: INFORME_AUDITORIA_PASIVO_NO_CORRIENTE.docx"
        else
            print_warning "El script se ejecutó pero no se generó el archivo"
        fi
    else
        print_error "Error al ejecutar el generador"
    fi
else
    print_warning "No se encontró generar_informe_auditoria.js"
fi

# =============================================================================
# RESUMEN FINAL
# =============================================================================

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                   INSTALACIÓN COMPLETADA                      ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ Instalación completada exitosamente"
echo ""
echo "📖 Próximos pasos:"
echo "   1. Ejecutar la aplicación: streamlit run pasivo_no_corriente_app.py"
echo "   2. Navegar a la pestaña 'Resumen Consolidado'"
echo "   3. Hacer clic en 'Generar Informe Word'"
echo ""
echo "📚 Documentación:"
echo "   - README.md: Documentación general"
echo "   - README_INFORMES.md: Documentación del módulo de informes"
echo "   - GUIA_EXTENSION.md: Cómo extender la aplicación"
echo ""
echo "🔧 Comandos útiles:"
echo "   - Ejecutar app: streamlit run pasivo_no_corriente_app.py"
echo "   - Generar informe standalone: node generar_informe_auditoria.js"
echo "   - Ver versión de Node: node --version"
echo "   - Ver paquetes instalados: npm list -g"
echo ""
print_success "¡Listo para usar!"