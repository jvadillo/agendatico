import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function Privacy() {
    const { t } = useTranslation();

    return (
        <div className="mobile-container">
            <div className="min-h-screen bg-background">
                <Head title={t('legal.privacy_title')} />

                {/* Header */}
                <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <Link href="/" className="p-2 -ml-2 hover:bg-secondary rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-lg font-semibold">{t('legal.privacy_title')}</h1>
                    </div>
                </header>

                {/* Content */}
                <main className="px-6 py-8 prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-muted-foreground text-sm mb-6">
                        {t('legal.last_updated')}: 6 de diciembre de 2025
                    </p>

                    <h2>1. Información que Recopilamos</h2>
                    <p>
                        Agendatico recopila la siguiente información cuando utilizas nuestra plataforma:
                    </p>
                    <ul>
                        <li><strong>Información de cuenta:</strong> Nombre, dirección de correo electrónico y foto de perfil (si te registras mediante redes sociales).</li>
                        <li><strong>Contenido publicado:</strong> Eventos que publiques, incluyendo títulos, descripciones, fechas, ubicaciones e imágenes.</li>
                        <li><strong>Datos de uso:</strong> Información sobre cómo interactúas con la aplicación, como eventos vistos y favoritos guardados.</li>
                        <li><strong>Información del dispositivo:</strong> Tipo de navegador, idioma preferido y dirección IP.</li>
                    </ul>

                    <h2>2. Cómo Usamos tu Información</h2>
                    <p>Utilizamos la información recopilada para:</p>
                    <ul>
                        <li>Permitirte publicar y gestionar eventos</li>
                        <li>Mostrarte eventos relevantes en tu zona</li>
                        <li>Guardar tus preferencias y favoritos</li>
                        <li>Mejorar y optimizar la plataforma</li>
                        <li>Comunicarnos contigo sobre tu cuenta o eventos</li>
                    </ul>

                    <h2>3. Compartición de Información</h2>
                    <p>
                        <strong>No vendemos tu información personal.</strong> Los eventos que publiques serán visibles públicamente para todos los usuarios de la plataforma. 
                        Tu información de contacto (si la proporcionas en un evento) será visible para quienes vean el evento.
                    </p>
                    <p>
                        Podemos compartir información con:
                    </p>
                    <ul>
                        <li>Proveedores de servicios que nos ayudan a operar la plataforma (hosting, análisis)</li>
                        <li>Autoridades legales cuando sea requerido por ley</li>
                    </ul>

                    <h2>4. Autenticación con Terceros</h2>
                    <p>
                        Si eliges iniciar sesión con Google, Facebook o Apple, recibiremos información básica de tu perfil 
                        según lo permitido por cada servicio. No tenemos acceso a tus contraseñas de estos servicios.
                    </p>

                    <h2>5. Cookies y Almacenamiento Local</h2>
                    <p>
                        Utilizamos cookies y almacenamiento local del navegador para:
                    </p>
                    <ul>
                        <li>Mantener tu sesión iniciada</li>
                        <li>Recordar tus preferencias de idioma</li>
                        <li>Guardar eventos favoritos (incluso sin cuenta)</li>
                    </ul>

                    <h2>6. Seguridad</h2>
                    <p>
                        Implementamos medidas de seguridad técnicas y organizativas para proteger tu información. 
                        Sin embargo, ningún sistema es 100% seguro y no podemos garantizar la seguridad absoluta de tus datos.
                    </p>

                    <h2>7. Tus Derechos</h2>
                    <p>Tienes derecho a:</p>
                    <ul>
                        <li>Acceder a la información que tenemos sobre ti</li>
                        <li>Corregir información inexacta</li>
                        <li>Eliminar tu cuenta y datos asociados</li>
                        <li>Exportar tus datos</li>
                    </ul>
                    <p>
                        Para ejercer estos derechos, contáctanos a través del correo indicado al final de esta política.
                    </p>

                    <h2>8. Retención de Datos</h2>
                    <p>
                        Conservamos tu información mientras mantengas una cuenta activa. Los eventos pasados pueden 
                        permanecer visibles en el historial de la plataforma. Si eliminas tu cuenta, eliminaremos 
                        tu información personal, aunque algunos datos agregados y anónimos pueden conservarse.
                    </p>

                    <h2>9. Menores de Edad</h2>
                    <p>
                        Agendatico no está dirigido a menores de 13 años. No recopilamos intencionalmente información 
                        de menores de esta edad.
                    </p>

                    <h2>10. Cambios a esta Política</h2>
                    <p>
                        Podemos actualizar esta política ocasionalmente. Te notificaremos sobre cambios significativos 
                        publicando la nueva política en esta página y actualizando la fecha de "última actualización".
                    </p>

                    <h2>11. Contacto</h2>
                    <p>
                        Si tienes preguntas sobre esta Política de Privacidad, puedes contactarnos en:
                    </p>
                    <p className="font-medium">
                        contacto@agendatico.com
                    </p>
                </main>
            </div>
        </div>
    );
}
