import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function Terms() {
    const { t } = useTranslation();

    return (
        <div className="mobile-container">
            <div className="min-h-screen bg-background">
                <Head title={t('legal.terms_title')} />

                {/* Header */}
                <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <Link href="/" className="p-2 -ml-2 hover:bg-secondary rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-lg font-semibold">{t('legal.terms_title')}</h1>
                    </div>
                </header>

                {/* Content */}
                <main className="px-6 py-8 prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-muted-foreground text-sm mb-6">
                        {t('legal.last_updated')}: 6 de diciembre de 2025
                    </p>

                    <h2>1. Aceptación de los Términos</h2>
                    <p>
                        Al acceder y utilizar Agendatico ("la Plataforma"), aceptas estar sujeto a estos Términos y 
                        Condiciones. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar la Plataforma.
                    </p>

                    <h2>2. Descripción del Servicio</h2>
                    <p>
                        Agendatico es una plataforma de información que permite a los usuarios descubrir y publicar 
                        eventos locales. <strong>Agendatico actúa únicamente como intermediario de información</strong> y 
                        no organiza, produce ni es responsable de ningún evento publicado en la plataforma.
                    </p>

                    <h2>3. Uso de la Plataforma</h2>
                    <p>Al utilizar Agendatico, te comprometes a:</p>
                    <ul>
                        <li>Proporcionar información veraz y actualizada</li>
                        <li>No publicar contenido falso, engañoso, ilegal u ofensivo</li>
                        <li>No utilizar la plataforma para spam o actividades fraudulentas</li>
                        <li>Respetar los derechos de propiedad intelectual de terceros</li>
                        <li>No intentar acceder de forma no autorizada a la plataforma</li>
                    </ul>

                    <h2>4. Publicación de Eventos</h2>
                    <p>
                        Los usuarios que publiquen eventos son <strong>los únicos responsables</strong> de:
                    </p>
                    <ul>
                        <li>La veracidad y exactitud de la información del evento</li>
                        <li>Obtener los permisos necesarios para el evento</li>
                        <li>Cumplir con todas las leyes y regulaciones aplicables</li>
                        <li>El contenido de las imágenes y descripciones publicadas</li>
                        <li>Cualquier consecuencia derivada del evento</li>
                    </ul>
                    <p>
                        Agendatico se reserva el derecho de eliminar cualquier evento que viole estos términos o que 
                        consideremos inapropiado, sin previo aviso.
                    </p>

                    <h2>5. Exención de Responsabilidad</h2>
                    <p className="font-semibold bg-secondary/50 p-4 rounded-lg">
                        AGENDATICO NO GARANTIZA LA EXACTITUD, INTEGRIDAD O ACTUALIDAD DE LA INFORMACIÓN DE LOS EVENTOS. 
                        LA PLATAFORMA SE PROPORCIONA "TAL CUAL" Y "SEGÚN DISPONIBILIDAD".
                    </p>
                    <p>
                        <strong>Agendatico NO es responsable de:</strong>
                    </p>
                    <ul>
                        <li>La cancelación, modificación o calidad de los eventos publicados</li>
                        <li>Daños, lesiones o pérdidas sufridas en eventos encontrados a través de la plataforma</li>
                        <li>Disputas entre usuarios y organizadores de eventos</li>
                        <li>Transacciones económicas realizadas fuera de la plataforma</li>
                        <li>Contenido publicado por terceros</li>
                        <li>La conducta de otros usuarios o asistentes a eventos</li>
                        <li>Interrupciones del servicio o pérdida de datos</li>
                    </ul>

                    <h2>6. Limitación de Responsabilidad</h2>
                    <p>
                        En la máxima medida permitida por la ley aplicable, Agendatico y sus operadores no serán 
                        responsables por ningún daño directo, indirecto, incidental, especial, consecuente o punitivo, 
                        incluyendo pero no limitado a pérdida de beneficios, datos, uso u otras pérdidas intangibles, 
                        resultantes del uso o la imposibilidad de usar la plataforma.
                    </p>

                    <h2>7. Indemnización</h2>
                    <p>
                        Aceptas indemnizar y mantener indemne a Agendatico, sus operadores, afiliados y empleados de 
                        cualquier reclamación, demanda, pérdida, daño, costo o gasto (incluyendo honorarios legales) 
                        que surja de tu uso de la plataforma, tu violación de estos términos, o tu violación de 
                        cualquier derecho de terceros.
                    </p>

                    <h2>8. Propiedad Intelectual</h2>
                    <p>
                        El contenido original de Agendatico (diseño, código, logotipos) es propiedad de sus operadores. 
                        Los usuarios conservan los derechos sobre el contenido que publican, pero otorgan a Agendatico 
                        una licencia no exclusiva para mostrar dicho contenido en la plataforma.
                    </p>

                    <h2>9. Cuentas de Usuario</h2>
                    <p>
                        Eres responsable de mantener la confidencialidad de tu cuenta y de todas las actividades que 
                        ocurran bajo ella. Debes notificarnos inmediatamente sobre cualquier uso no autorizado.
                    </p>
                    <p>
                        Nos reservamos el derecho de suspender o eliminar cuentas que violen estos términos.
                    </p>

                    <h2>10. Modificaciones del Servicio</h2>
                    <p>
                        Nos reservamos el derecho de modificar, suspender o discontinuar la plataforma (o cualquier 
                        parte de ella) en cualquier momento, con o sin previo aviso.
                    </p>

                    <h2>11. Cambios a los Términos</h2>
                    <p>
                        Podemos modificar estos términos en cualquier momento. Los cambios entrarán en vigor 
                        inmediatamente después de su publicación. El uso continuado de la plataforma constituye 
                        la aceptación de los términos modificados.
                    </p>

                    <h2>12. Ley Aplicable</h2>
                    <p>
                        Estos términos se regirán e interpretarán de acuerdo con las leyes aplicables, sin 
                        consideración a sus disposiciones sobre conflictos de leyes.
                    </p>

                    <h2>13. Contacto</h2>
                    <p>
                        Para cualquier pregunta sobre estos Términos y Condiciones, contáctanos en:
                    </p>
                    <p className="font-medium">
                        contacto@agendatico.com
                    </p>
                </main>
            </div>
        </div>
    );
}
