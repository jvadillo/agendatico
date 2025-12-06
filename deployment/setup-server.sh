#!/bin/bash

#############################################
# Script de Setup Inicial - Servidor Hetzner
# Para Laravel 12 + React 19 + Inertia.js
#############################################

set -e  # Salir si hay algún error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Cargar configuración
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config.sh"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Agendatico - Setup Servidor Hetzner  ${NC}"
echo -e "${GREEN}========================================${NC}"

# Función para imprimir mensajes
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Verificar que se ejecuta como root
if [ "$EUID" -ne 0 ]; then 
    print_error "Este script debe ejecutarse como root"
    exit 1
fi

print_warning "Dominio configurado: $APP_DOMAIN"
print_warning "Ruta de aplicación: $APP_PATH"
echo ""
read -p "¿Continuar con la instalación? (s/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    exit 1
fi

#############################################
# 1. ACTUALIZAR SISTEMA
#############################################
print_status "Actualizando sistema..."
apt update && apt upgrade -y

#############################################
# 2. INSTALAR DEPENDENCIAS BÁSICAS
#############################################
print_status "Instalando dependencias básicas..."
apt install -y curl git unzip software-properties-common ufw ca-certificates \
    apt-transport-https gnupg lsb-release

#############################################
# 3. CONFIGURAR FIREWALL
#############################################
print_status "Configurando firewall UFW..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

#############################################
# 4. CREAR USUARIO DEPLOY
#############################################
print_status "Creando usuario $DEPLOY_USER..."
if id "$DEPLOY_USER" &>/dev/null; then
    print_warning "Usuario $DEPLOY_USER ya existe, omitiendo..."
else
    adduser --disabled-password --gecos "" $DEPLOY_USER
    echo "$DEPLOY_USER:$DEPLOY_USER_PASSWORD" | chpasswd
    usermod -aG sudo $DEPLOY_USER
    
    # Copiar claves SSH de root a deploy user
    if [ -d /root/.ssh ]; then
        mkdir -p /home/$DEPLOY_USER/.ssh
        cp /root/.ssh/authorized_keys /home/$DEPLOY_USER/.ssh/ 2>/dev/null || true
        chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh
        chmod 700 /home/$DEPLOY_USER/.ssh
        chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys 2>/dev/null || true
    fi
fi

#############################################
# 5. INSTALAR NGINX
#############################################
print_status "Instalando Nginx..."
apt install -y nginx
systemctl start nginx
systemctl enable nginx

#############################################
# 6. INSTALAR POSTGRESQL
#############################################
print_status "Instalando PostgreSQL..."
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql

# Configurar base de datos
print_status "Configurando base de datos PostgreSQL..."
sudo -u postgres psql << EOF
-- Crear base de datos si no existe
SELECT 'CREATE DATABASE $DB_NAME' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec

-- Crear usuario si no existe
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_user WHERE usename = '$DB_USER') THEN
    CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
  END IF;
END
\$\$;

-- Asignar permisos
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER DATABASE $DB_NAME OWNER TO $DB_USER;
EOF

print_status "Base de datos configurada: $DB_NAME"

#############################################
# 7. INSTALAR PHP 8.4
#############################################
print_status "Instalando PHP $PHP_VERSION..."
add-apt-repository ppa:ondrej/php -y
apt update
apt install -y php$PHP_VERSION-fpm php$PHP_VERSION-cli php$PHP_VERSION-pgsql \
    php$PHP_VERSION-mbstring php$PHP_VERSION-xml php$PHP_VERSION-bcmath \
    php$PHP_VERSION-curl php$PHP_VERSION-zip php$PHP_VERSION-gd \
    php$PHP_VERSION-intl php$PHP_VERSION-redis

# Configurar PHP
sed -i 's/upload_max_filesize = .*/upload_max_filesize = 20M/' /etc/php/$PHP_VERSION/fpm/php.ini
sed -i 's/post_max_size = .*/post_max_size = 20M/' /etc/php/$PHP_VERSION/fpm/php.ini
sed -i 's/memory_limit = .*/memory_limit = 256M/' /etc/php/$PHP_VERSION/fpm/php.ini

systemctl restart php$PHP_VERSION-fpm

#############################################
# 8. INSTALAR COMPOSER
#############################################
print_status "Instalando Composer..."
if ! command -v composer &> /dev/null; then
    curl -sS https://getcomposer.org/installer | php
    mv composer.phar /usr/local/bin/composer
    chmod +x /usr/local/bin/composer
fi

#############################################
# 9. INSTALAR NODE.JS
#############################################
print_status "Instalando Node.js $NODE_VERSION..."
curl -fsSL https://deb.nodesource.com/setup_$NODE_VERSION | bash -
apt install -y nodejs

#############################################
# 10. PREPARAR DIRECTORIO DE APLICACIÓN
#############################################
print_status "Preparando directorio de aplicación..."
mkdir -p $(dirname $APP_PATH)
chown -R $DEPLOY_USER:$DEPLOY_USER $(dirname $APP_PATH)

# Clonar repositorio o crear directorio
if [ -n "$GIT_REPO" ]; then
    print_status "Clonando repositorio desde $GIT_REPO..."
    sudo -u $DEPLOY_USER git clone -b $GIT_BRANCH $GIT_REPO $APP_PATH
else
    print_warning "No se especificó GIT_REPO. Debes subir los archivos manualmente a $APP_PATH"
    mkdir -p $APP_PATH
    chown -R $DEPLOY_USER:$DEPLOY_USER $APP_PATH
fi

#############################################
# 11. CONFIGURAR APLICACIÓN
#############################################
if [ -f "$APP_PATH/composer.json" ]; then
    print_status "Instalando dependencias de Composer..."
    cd $APP_PATH
    sudo -u $DEPLOY_USER composer install --optimize-autoloader --no-dev
    
    print_status "Instalando dependencias de NPM..."
    sudo -u $DEPLOY_USER npm ci
    
    # Configurar .env
    print_status "Configurando archivo .env..."
    if [ ! -f "$APP_PATH/.env" ]; then
        sudo -u $DEPLOY_USER cp $APP_PATH/.env.example $APP_PATH/.env
        
        # Generar APP_KEY
        sudo -u $DEPLOY_USER php artisan key:generate --force
        
        # Configurar variables de entorno
        sudo -u $DEPLOY_USER sed -i "s|APP_NAME=.*|APP_NAME=\"$APP_NAME\"|" $APP_PATH/.env
        sudo -u $DEPLOY_USER sed -i "s|APP_ENV=.*|APP_ENV=production|" $APP_PATH/.env
        sudo -u $DEPLOY_USER sed -i "s|APP_DEBUG=.*|APP_DEBUG=false|" $APP_PATH/.env
        sudo -u $DEPLOY_USER sed -i "s|APP_URL=.*|APP_URL=https://$APP_DOMAIN|" $APP_PATH/.env
        sudo -u $DEPLOY_USER sed -i "s|APP_TIMEZONE=.*|APP_TIMEZONE=$APP_TIMEZONE|" $APP_PATH/.env
        
        # Base de datos
        sudo -u $DEPLOY_USER sed -i "s|DB_CONNECTION=.*|DB_CONNECTION=pgsql|" $APP_PATH/.env
        sudo -u $DEPLOY_USER sed -i "s|DB_HOST=.*|DB_HOST=127.0.0.1|" $APP_PATH/.env
        sudo -u $DEPLOY_USER sed -i "s|DB_PORT=.*|DB_PORT=5432|" $APP_PATH/.env
        sudo -u $DEPLOY_USER sed -i "s|DB_DATABASE=.*|DB_DATABASE=$DB_NAME|" $APP_PATH/.env
        sudo -u $DEPLOY_USER sed -i "s|DB_USERNAME=.*|DB_USERNAME=$DB_USER|" $APP_PATH/.env
        sudo -u $DEPLOY_USER sed -i "s|DB_PASSWORD=.*|DB_PASSWORD=$DB_PASSWORD|" $APP_PATH/.env
        
        # Email
        sudo -u $DEPLOY_USER sed -i "s|MAIL_MAILER=.*|MAIL_MAILER=$MAIL_MAILER|" $APP_PATH/.env
        sudo -u $DEPLOY_USER sed -i "s|MAIL_HOST=.*|MAIL_HOST=$MAIL_HOST|" $APP_PATH/.env
        sudo -u $DEPLOY_USER sed -i "s|MAIL_PORT=.*|MAIL_PORT=$MAIL_PORT|" $APP_PATH/.env
        sudo -u $DEPLOY_USER sed -i "s|MAIL_USERNAME=.*|MAIL_USERNAME=$MAIL_USERNAME|" $APP_PATH/.env
        sudo -u $DEPLOY_USER sed -i "s|MAIL_PASSWORD=.*|MAIL_PASSWORD=$MAIL_PASSWORD|" $APP_PATH/.env
        sudo -u $DEPLOY_USER sed -i "s|MAIL_ENCRYPTION=.*|MAIL_ENCRYPTION=$MAIL_ENCRYPTION|" $APP_PATH/.env
        sudo -u $DEPLOY_USER sed -i "s|MAIL_FROM_ADDRESS=.*|MAIL_FROM_ADDRESS=\"$MAIL_FROM_ADDRESS\"|" $APP_PATH/.env
    fi
    
    # Ejecutar migraciones
    print_status "Ejecutando migraciones..."
    sudo -u $DEPLOY_USER php artisan migrate --force --seed
    
    # Crear enlace simbólico para storage
    print_status "Creando enlace simbólico para storage..."
    sudo -u $DEPLOY_USER php artisan storage:link
    
    # Compilar assets
    print_status "Compilando assets..."
    sudo -u $DEPLOY_USER npm run build
    
    # Optimizar Laravel
    print_status "Optimizando Laravel..."
    sudo -u $DEPLOY_USER php artisan config:cache
    sudo -u $DEPLOY_USER php artisan route:cache
    sudo -u $DEPLOY_USER php artisan view:cache
    
    # Permisos
    print_status "Configurando permisos..."
    chown -R www-data:www-data $APP_PATH
    chmod -R 755 $APP_PATH
    chmod -R 775 $APP_PATH/storage
    chmod -R 775 $APP_PATH/bootstrap/cache
else
    print_warning "No se encontró composer.json. Sube los archivos a $APP_PATH y ejecuta este script nuevamente."
fi

#############################################
# 12. CONFIGURAR NGINX
#############################################
print_status "Configurando Nginx..."
cat > /etc/nginx/sites-available/$APP_DOMAIN << EOF
server {
    listen 80;
    server_name $APP_DOMAIN www.$APP_DOMAIN;
    root $APP_PATH/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php$PHP_VERSION-fpm.sock;
        fastcgi_param SCRIPT_FILENAME \$realpath_root\$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    client_max_body_size 20M;
}
EOF

# Activar sitio
ln -sf /etc/nginx/sites-available/$APP_DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Habilitar gzip
sed -i 's/# gzip_vary on;/gzip_vary on;\n\tgzip_types text\/plain text\/css application\/json application\/javascript text\/xml application\/xml image\/svg+xml;/' /etc/nginx/nginx.conf

# Verificar configuración
nginx -t

# Reiniciar Nginx
systemctl restart nginx

#############################################
# 13. INSTALAR SSL CON LET'S ENCRYPT
#############################################
print_status "Instalando Certbot para SSL..."
apt install -y certbot python3-certbot-nginx

print_warning "Asegúrate de que tu dominio $APP_DOMAIN apunte a la IP de este servidor"
read -p "¿Continuar con la instalación de SSL? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    certbot --nginx -d $APP_DOMAIN -d www.$APP_DOMAIN --non-interactive --agree-tos -m $SSL_EMAIL
    systemctl restart nginx
    print_status "SSL instalado correctamente"
else
    print_warning "SSL omitido. Puedes instalarlo después con: certbot --nginx -d $APP_DOMAIN"
fi

#############################################
# 14. CONFIGURAR QUEUE WORKER
#############################################
print_status "Configurando Queue Worker..."
cat > /etc/systemd/system/agendatico-worker.service << EOF
[Unit]
Description=Agendatico Queue Worker
After=network.target

[Service]
User=www-data
Group=www-data
Restart=always
ExecStart=/usr/bin/php $APP_PATH/artisan queue:work --sleep=3 --tries=3 --max-time=3600

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable agendatico-worker
systemctl start agendatico-worker

#############################################
# 15. CONFIGURAR CRON
#############################################
print_status "Configurando Cron..."
(crontab -u www-data -l 2>/dev/null; echo "* * * * * cd $APP_PATH && php artisan schedule:run >> /dev/null 2>&1") | crontab -u www-data -

#############################################
# 16. CONFIGURAR BACKUPS
#############################################
print_status "Configurando sistema de backups..."
mkdir -p $BACKUP_PATH

cat > /usr/local/bin/backup-agendatico.sh << EOF
#!/bin/bash
BACKUP_DIR="$BACKUP_PATH"
DATE=\$(date +%Y%m%d_%H%M%S)

mkdir -p \$BACKUP_DIR

# Backup de base de datos
sudo -u postgres pg_dump $DB_NAME > \$BACKUP_DIR/db_\$DATE.sql
gzip \$BACKUP_DIR/db_\$DATE.sql

# Backup de archivos subidos
tar -czf \$BACKUP_DIR/storage_\$DATE.tar.gz $APP_PATH/storage/app/public

# Eliminar backups antiguos (más de 7 días)
find \$BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completado: \$DATE"
EOF

chmod +x /usr/local/bin/backup-agendatico.sh

# Agregar a cron (diario a las 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-agendatico.sh >> /var/log/agendatico-backup.log 2>&1") | crontab -

#############################################
# FINALIZADO
#############################################
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✓ Instalación Completada              ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
print_status "Servidor configurado correctamente"
print_status "Aplicación: $APP_PATH"
print_status "Dominio: https://$APP_DOMAIN"
print_status "Usuario deploy: $DEPLOY_USER"
echo ""
print_warning "IMPORTANTE:"
echo "  1. Cambia la contraseña del usuario deploy:"
echo "     passwd $DEPLOY_USER"
echo ""
echo "  2. Verifica que tu dominio apunte a la IP de este servidor"
echo ""
echo "  3. Verifica el estado de los servicios:"
echo "     systemctl status nginx"
echo "     systemctl status postgresql"
echo "     systemctl status php$PHP_VERSION-fpm"
echo "     systemctl status agendatico-worker"
echo ""
echo "  4. Ver logs:"
echo "     tail -f $APP_PATH/storage/logs/laravel.log"
echo "     tail -f /var/log/nginx/error.log"
echo ""
print_status "¡Deployment completado!"
