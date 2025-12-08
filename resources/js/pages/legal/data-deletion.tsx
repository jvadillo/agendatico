import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function DataDeletion() {
    const { t } = useTranslation();

    return (
        <div className="mobile-container">
            <div className="min-h-screen bg-background">
                <Head title={t('legal.data_deletion_title')} />

                {/* Header */}
                <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <Link href="/" className="p-2 -ml-2 hover:bg-secondary rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-lg font-semibold">{t('legal.data_deletion_title')}</h1>
                    </div>
                </header>

                {/* Content */}
                <main className="px-6 py-8 prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-muted-foreground text-sm mb-6">
                        {t('legal.last_updated')}: 8 de diciembre de 2025
                    </p>

                    <h2>Cómo Eliminar tus Datos de Agendatico</h2>
                    <p>
                        En Agendatico respetamos tu privacidad y te damos control total sobre tus datos personales. 
                        A continuación te explicamos cómo puedes eliminar tu información de nuestra plataforma.
                    </p>

                    <h2>Opción 1: Eliminar tu cuenta desde la aplicación</h2>
                    <p>Si tienes una cuenta en Agendatico, puedes eliminarla siguiendo estos pasos:</p>
                    <ol>
                        <li>Inicia sesión en tu cuenta de Agendatico</li>
                        <li>Ve a <strong>Configuración</strong> (icono de engranaje)</li>
                        <li>Selecciona <strong>Cuenta</strong></li>
                        <li>Haz clic en <strong>Eliminar cuenta</strong></li>
                        <li>Confirma la eliminación</li>
                    </ol>

                    <h2>Opción 2: Solicitar eliminación por correo electrónico</h2>
                    <p>
                        También puedes solicitar la eliminación de tus datos enviando un correo electrónico a:
                    </p>
                    <p className="font-medium text-primary">
                        contacto@agendatico.com
                    </p>
                    <p>
                        En tu solicitud, incluye:
                    </p>
                    <ul>
                        <li>El asunto: <strong>"Solicitud de eliminación de datos"</strong></li>
                        <li>Tu dirección de correo electrónico asociada a la cuenta</li>
                        <li>Tu nombre (si lo proporcionaste al registrarte)</li>
                    </ul>
                    <p>
                        Procesaremos tu solicitud en un plazo máximo de <strong>30 días</strong>.
                    </p>

                    <h2>¿Qué datos se eliminarán?</h2>
                    <p>Al eliminar tu cuenta, se eliminarán permanentemente:</p>
                    <ul>
                        <li>Tu información de perfil (nombre, correo electrónico, foto)</li>
                        <li>Tus eventos publicados</li>
                        <li>Tu lista de eventos favoritos</li>
                        <li>Tu historial de actividad</li>
                        <li>Cualquier otra información personal asociada a tu cuenta</li>
                    </ul>

                    <h2>Datos que pueden conservarse</h2>
                    <p>
                        Algunos datos pueden conservarse por motivos legales o de seguridad:
                    </p>
                    <ul>
                        <li>Registros de transacciones (si aplica) por requisitos fiscales</li>
                        <li>Registros de seguridad durante un período limitado</li>
                        <li>Datos agregados y anónimos que no te identifican personalmente</li>
                    </ul>

                    <h2>Si iniciaste sesión con Facebook</h2>
                    <p>
                        Si utilizaste Facebook para iniciar sesión en Agendatico, también puedes revocar 
                        el acceso desde la configuración de Facebook:
                    </p>
                    <ol>
                        <li>Ve a <strong>Configuración de Facebook</strong></li>
                        <li>Selecciona <strong>Aplicaciones y sitios web</strong></li>
                        <li>Busca <strong>Agendatico</strong></li>
                        <li>Haz clic en <strong>Eliminar</strong></li>
                    </ol>
                    <p>
                        Esto revocará el acceso de Agendatico a tu cuenta de Facebook, pero para eliminar 
                        completamente tus datos de nuestra plataforma, debes seguir también los pasos 
                        mencionados anteriormente.
                    </p>

                    <h2>Si iniciaste sesión con Google</h2>
                    <p>
                        Si utilizaste Google para iniciar sesión, puedes revocar el acceso desde:
                    </p>
                    <ol>
                        <li>Ve a <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-primary">myaccount.google.com/permissions</a></li>
                        <li>Busca <strong>Agendatico</strong></li>
                        <li>Haz clic en <strong>Quitar acceso</strong></li>
                    </ol>

                    <h2>Contacto</h2>
                    <p>
                        Si tienes preguntas sobre la eliminación de tus datos o necesitas asistencia, 
                        contáctanos en:
                    </p>
                    <p className="font-medium">
                        contacto@agendatico.com
                    </p>
                </main>
            </div>
        </div>
    );
}
