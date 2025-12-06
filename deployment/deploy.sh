#!/bin/bash

#############################################
# Script de Deployment - Actualizaciones
# Ejecutar después de hacer git push
#############################################

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Cargar configuración
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config.sh"

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Agendatico - Deployment              ${NC}"
echo -e "${GREEN}========================================${NC}"

# Cambiar al directorio de la aplicación
cd $APP_PATH

# Activar modo mantenimiento
print_status "Activando modo mantenimiento..."
php artisan down || true

# Actualizar código
if [ -d ".git" ]; then
    print_status "Obteniendo últimos cambios..."
    git pull origin $GIT_BRANCH
else
    print_warning "No es un repositorio git. Asegúrate de haber subido los archivos actualizados."
fi

# Instalar dependencias
print_status "Instalando dependencias de Composer..."
composer install --optimize-autoloader --no-dev

print_status "Instalando dependencias de NPM..."
npm ci

# Compilar assets
print_status "Compilando assets..."
npm run build

# Ejecutar migraciones
print_status "Ejecutando migraciones..."
php artisan migrate --force

# Limpiar cachés
print_status "Limpiando cachés..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimizar
print_status "Optimizando aplicación..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Permisos
print_status "Configurando permisos..."
sudo chown -R www-data:www-data $APP_PATH
sudo chmod -R 755 $APP_PATH
sudo chmod -R 775 $APP_PATH/storage
sudo chmod -R 775 $APP_PATH/bootstrap/cache

# Reiniciar servicios
print_status "Reiniciando servicios..."
sudo systemctl restart php$PHP_VERSION-fpm
sudo systemctl restart agendatico-worker

# Desactivar modo mantenimiento
print_status "Desactivando modo mantenimiento..."
php artisan up

echo ""
print_status "¡Deployment completado!"
echo ""
print_warning "Verifica que todo funcione correctamente:"
echo "  https://$APP_DOMAIN"
