# Deployment Agendatico - Hetzner VPS

Scripts automatizados para deployment en servidor Hetzner.

## 📋 Requisitos Previos

1. **Servidor Hetzner creado** con Ubuntu 24.04 LTS
2. **Acceso SSH configurado** con tu clave pública
3. **Dominio configurado** apuntando a la IP del servidor (registros A)

## 🚀 Instalación Inicial (Primera vez)

### 1. Conectarte al servidor

```bash
ssh root@<IP_DEL_SERVIDOR>
```

### 2. Subir archivos de deployment

Desde tu máquina local (PowerShell):

```powershell
# Comprimir carpeta deployment
Compress-Archive -Path deployment -DestinationPath deployment.zip

# Subir al servidor
scp deployment.zip root@<IP_DEL_SERVIDOR>:/root/

# Conectar al servidor
ssh root@<IP_DEL_SERVIDOR>

# Descomprimir
cd /root
apt install -y unzip
unzip deployment.zip
cd deployment
```

### 3. Configurar variables

```bash
nano config.sh
```

**Variables importantes a cambiar:**

- `APP_DOMAIN` - Tu dominio (ej: `agendatico.com`)
- `DEPLOY_USER_PASSWORD` - Contraseña para el usuario deploy
- `DB_PASSWORD` - Contraseña segura para PostgreSQL
- `GIT_REPO` - URL de tu repositorio (opcional)
- `SSL_EMAIL` - Tu email para certificados SSL
- `MAIL_*` - Configuración de tu proveedor de email

### 4. Ejecutar instalación

```bash
chmod +x setup-server.sh
./setup-server.sh
```

El script te pedirá confirmación antes de:
- Iniciar la instalación
- Instalar certificados SSL

**Tiempo estimado:** 10-15 minutos

## 🔄 Deployment (Actualizaciones)

Para actualizar la aplicación después de hacer cambios:

### Opción A: Desde el servidor

```bash
ssh deploy@tudominio.com
cd /var/www/agendatico
./deployment/deploy.sh
```

### Opción B: Desde tu máquina local

```bash
ssh deploy@tudominio.com "cd /var/www/agendatico && ./deployment/deploy.sh"
```

## 📦 Sin Repositorio Git

Si no usas Git, sube los archivos manualmente:

```powershell
# Desde tu máquina local
scp -r C:\Users\amaia\Herd\agendatico deploy@tudominio.com:/var/www/

# Luego ejecuta el deployment
ssh deploy@tudominio.com
cd /var/www/agendatico
./deployment/deploy.sh
```

## ✅ Lo que hace el script de setup

- ✅ Actualiza el sistema operativo
- ✅ Instala Nginx, PostgreSQL, PHP 8.4, Node.js 22
- ✅ Configura firewall (UFW)
- ✅ Crea usuario `deploy` con acceso SSH
- ✅ Crea y configura base de datos PostgreSQL
- ✅ Clona/prepara la aplicación
- ✅ Instala dependencias (Composer + NPM)
- ✅ Configura `.env` de producción
- ✅ Ejecuta migraciones y seeders
- ✅ Compila assets frontend
- ✅ Configura Nginx con virtual host
- ✅ Instala certificados SSL (Let's Encrypt)
- ✅ Configura queue worker como servicio systemd
- ✅ Configura tareas programadas (cron)
- ✅ Configura backups automáticos diarios

## 🛠️ Comandos Útiles

### Ver estado de servicios

```bash
systemctl status nginx
systemctl status postgresql
systemctl status php8.4-fpm
systemctl status agendatico-worker
```

### Ver logs

```bash
# Laravel
tail -f /var/www/agendatico/storage/logs/laravel.log

# Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Queue worker
sudo journalctl -u agendatico-worker -f
```

### Ejecutar comandos artisan

```bash
cd /var/www/agendatico
php artisan tinker
php artisan migrate
php artisan cache:clear
```

### Backups manuales

```bash
sudo /usr/local/bin/backup-agendatico.sh
```

Ver backups:
```bash
ls -lh /var/backups/agendatico/
```

### Restaurar backup de base de datos

```bash
gunzip /var/backups/agendatico/db_YYYYMMDD_HHMMSS.sql.gz
sudo -u postgres psql agendatico < /var/backups/agendatico/db_YYYYMMDD_HHMMSS.sql
```

## 🔧 Troubleshooting

### Error de permisos

```bash
cd /var/www/agendatico
sudo chown -R www-data:www-data .
sudo chmod -R 755 .
sudo chmod -R 775 storage bootstrap/cache
```

### Limpiar todas las cachés

```bash
cd /var/www/agendatico
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
sudo systemctl restart php8.4-fpm
```

### Reiniciar todos los servicios

```bash
sudo systemctl restart nginx
sudo systemctl restart php8.4-fpm
sudo systemctl restart postgresql
sudo systemctl restart agendatico-worker
```

### Regenerar certificado SSL

```bash
sudo certbot renew
sudo systemctl reload nginx
```

## 🔐 Seguridad Post-Instalación

### 1. Cambiar contraseña del usuario deploy

```bash
passwd deploy
```

### 2. Deshabilitar login de root por SSH (opcional)

```bash
sudo nano /etc/ssh/sshd_config
```

Cambiar:
```
PermitRootLogin no
```

```bash
sudo systemctl restart sshd
```

### 3. Configurar fail2ban (opcional)

```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 📊 Monitoreo

### Espacio en disco

```bash
df -h
```

### Uso de memoria

```bash
free -h
```

### Procesos de PHP

```bash
ps aux | grep php
```

### Conexiones a la base de datos

```bash
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity WHERE datname='agendatico';"
```

## 🌐 DNS

Asegúrate de tener estos registros DNS configurados:

```
Tipo    Nombre    Valor
A       @         <IP_DEL_SERVIDOR>
A       www       <IP_DEL_SERVIDOR>
```

Verificar propagación DNS:
```bash
nslookup tudominio.com
```

## 📞 Soporte

Si encuentras problemas, revisa los logs:
```bash
# Ver últimos errores
sudo grep -i error /var/log/nginx/error.log | tail -20
tail -20 /var/www/agendatico/storage/logs/laravel.log
```
