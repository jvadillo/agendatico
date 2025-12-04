<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Event;
use App\Models\Place;
use App\Models\Town;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create a test user
        $user = User::firstOrCreate(
            ['email' => 'test@agendatico.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
            ]
        );

        // Get towns and categories
        $towns = Town::all()->keyBy('slug');
        $categories = Category::all()->keyBy('slug');
        $places = Place::all();

        $events = [
            // Live Music Events
            [
                'title' => 'Reggae Night con Dub Foundation',
                'description' => 'Una noche mágica de reggae roots con la banda local Dub Foundation. Vibras positivas, buena música y la mejor energía caribeña. Bar con bebidas y comida disponible.',
                'category' => 'live-music',
                'town' => 'puerto-viejo',
                'starts_at' => now()->addDays(2)->setHour(20)->setMinute(0),
                'ends_at' => now()->addDays(3)->setHour(1)->setMinute(0),
                'price_type' => 'paid',
                'price_amount' => '₡3000',
                'organizer_name' => 'Lazy Mon',
                'address' => 'Playa Cocles, frente al mar',
                'instagram_url' => 'https://instagram.com/lazymon',
            ],
            [
                'title' => 'Open Mic Night',
                'description' => 'Noche de micrófono abierto para músicos, poetas y artistas. Trae tu instrumento o simplemente ven a disfrutar del talento local. Todos son bienvenidos.',
                'category' => 'live-music',
                'town' => 'puerto-viejo',
                'starts_at' => now()->addDays(4)->setHour(19)->setMinute(30),
                'ends_at' => now()->addDays(4)->setHour(23)->setMinute(0),
                'price_type' => 'free',
                'organizer_name' => 'Bread & Chocolate',
                'address' => 'Calle principal, Puerto Viejo',
            ],
            [
                'title' => 'Jazz Tropical Fusion',
                'description' => 'Disfruta de una velada única con jazz fusionado con ritmos caribeños. Músicos de Costa Rica y el extranjero se unen para crear una experiencia sonora inolvidable.',
                'category' => 'live-music',
                'town' => 'cahuita',
                'starts_at' => now()->addDays(7)->setHour(19)->setMinute(0),
                'ends_at' => now()->addDays(7)->setHour(22)->setMinute(30),
                'price_type' => 'donation',
                'organizer_name' => 'Cahuita Jazz Club',
                'address' => 'Centro de Cahuita',
            ],

            // Yoga & Wellness
            [
                'title' => 'Yoga al Amanecer en la Playa',
                'description' => 'Empieza el día con una sesión de yoga vinyasa frente al mar. Clase para todos los niveles. Trae tu mat y una botella de agua. Punto de encuentro: entrada de Playa Negra.',
                'category' => 'yoga-wellness',
                'town' => 'puerto-viejo',
                'starts_at' => now()->addDays(1)->setHour(6)->setMinute(30),
                'ends_at' => now()->addDays(1)->setHour(8)->setMinute(0),
                'price_type' => 'donation',
                'organizer_name' => 'Selina Puerto Viejo',
                'address' => 'Playa Negra',
                'instagram_url' => 'https://instagram.com/selinapuertoviejo',
            ],
            [
                'title' => 'Círculo de Meditación y Sanación',
                'description' => 'Únete a un círculo de meditación guiada y sanación energética. Incluye breathwork, cuencos tibetanos y tiempo para compartir. Espacio limitado a 15 personas.',
                'category' => 'yoga-wellness',
                'town' => 'cocles',
                'starts_at' => now()->addDays(3)->setHour(17)->setMinute(0),
                'ends_at' => now()->addDays(3)->setHour(19)->setMinute(0),
                'price_type' => 'paid',
                'price_amount' => '₡5000',
                'organizer_name' => 'Jungle Healing Center',
                'address' => 'Camino a Cocles, 200m del súper',
                'whatsapp_url' => 'https://wa.me/50688887777',
            ],
            [
                'title' => 'Retiro de Yoga de Fin de Semana',
                'description' => 'Dos días de yoga, meditación, alimentación consciente y conexión con la naturaleza. Incluye alojamiento, 3 comidas veganas y 4 clases de yoga.',
                'category' => 'yoga-wellness',
                'town' => 'punta-uva',
                'starts_at' => now()->addDays(10)->setHour(15)->setMinute(0),
                'ends_at' => now()->addDays(12)->setHour(12)->setMinute(0),
                'price_type' => 'paid',
                'price_amount' => 'Desde $150',
                'organizer_name' => 'Pura Vida Retreat',
                'address' => 'Punta Uva, camino a la playa',
                'website_url' => 'https://puravidaretreat.com',
            ],

            // Parties / DJ
            [
                'title' => 'Full Moon Party',
                'description' => '¡Celebra la luna llena bailando en la playa! DJs locales e internacionales tocando house, techno y música electrónica tropical. Decoración UV y arte visual.',
                'category' => 'parties-dj',
                'town' => 'cocles',
                'starts_at' => now()->addDays(5)->setHour(21)->setMinute(0),
                'ends_at' => now()->addDays(6)->setHour(4)->setMinute(0),
                'price_type' => 'paid',
                'price_amount' => '₡5000 early / ₡7000 puerta',
                'organizer_name' => 'Caribeans',
                'address' => 'Playa Cocles',
                'instagram_url' => 'https://instagram.com/caribeans',
            ],
            [
                'title' => 'Sunset Sessions Domingueras',
                'description' => 'Cada domingo, música chill y house para despedir el sol. Ambiente relajado, cócteles tropicales y buenas vibras. Perfecto para cerrar el fin de semana.',
                'category' => 'parties-dj',
                'town' => 'puerto-viejo',
                'starts_at' => now()->next('Sunday')->setHour(16)->setMinute(0),
                'ends_at' => now()->next('Sunday')->setHour(22)->setMinute(0),
                'price_type' => 'free',
                'organizer_name' => 'Koki Beach',
                'address' => 'Koki Beach, Puerto Viejo',
            ],

            // Workshops
            [
                'title' => 'Taller de Cocina Caribeña',
                'description' => 'Aprende a preparar los platos típicos del Caribe costarricense: rice and beans, patí, pan bon y más. Incluye degustación y recetas para llevar.',
                'category' => 'workshops',
                'town' => 'cahuita',
                'starts_at' => now()->addDays(6)->setHour(10)->setMinute(0),
                'ends_at' => now()->addDays(6)->setHour(14)->setMinute(0),
                'price_type' => 'paid',
                'price_amount' => '₡15000',
                'organizer_name' => 'Miss Edith',
                'address' => 'Centro de Cahuita',
                'whatsapp_url' => 'https://wa.me/50699998888',
            ],
            [
                'title' => 'Workshop de Macramé',
                'description' => 'Crea tu propio colgante de plantas en macramé. Todos los materiales incluidos. No se necesita experiencia previa. Máximo 10 personas.',
                'category' => 'workshops',
                'town' => 'puerto-viejo',
                'starts_at' => now()->addDays(8)->setHour(14)->setMinute(0),
                'ends_at' => now()->addDays(8)->setHour(17)->setMinute(0),
                'price_type' => 'paid',
                'price_amount' => '₡12000',
                'organizer_name' => 'Trópico Crafts',
                'address' => 'Frente al parque de Puerto Viejo',
                'instagram_url' => 'https://instagram.com/tropicocrafts',
            ],
            [
                'title' => 'Clase de Surf para Principiantes',
                'description' => 'Aprende a surfear con instructores certificados. Incluye tabla, rashguard y 2 horas de instrucción. Grupos pequeños de máximo 4 personas.',
                'category' => 'workshops',
                'town' => 'cocles',
                'starts_at' => now()->addDays(2)->setHour(8)->setMinute(0),
                'ends_at' => now()->addDays(2)->setHour(10)->setMinute(0),
                'price_type' => 'paid',
                'price_amount' => '$40',
                'organizer_name' => 'Caribbean Surf School',
                'address' => 'Playa Cocles, junto al parking',
                'instagram_url' => 'https://instagram.com/caribbeansurfschool',
            ],

            // Outdoor / Nature
            [
                'title' => 'Caminata Nocturna en el Refugio',
                'description' => 'Explora la vida nocturna del Refugio de Vida Silvestre Gandoca-Manzanillo. Observa ranas, serpientes, insectos y más. Guía bilingüe incluido.',
                'category' => 'outdoor-nature',
                'town' => 'manzanillo',
                'starts_at' => now()->addDays(3)->setHour(18)->setMinute(30),
                'ends_at' => now()->addDays(3)->setHour(21)->setMinute(0),
                'price_type' => 'paid',
                'price_amount' => '₡8000',
                'organizer_name' => 'Manzanillo Tours',
                'address' => 'Centro de Manzanillo',
                'whatsapp_url' => 'https://wa.me/50677776666',
            ],
            [
                'title' => 'Tour de Snorkel en Cahuita',
                'description' => 'Descubre el arrecife de coral del Parque Nacional Cahuita. Equipo incluido. Verás peces tropicales, estrellas de mar y con suerte, tortugas.',
                'category' => 'outdoor-nature',
                'town' => 'cahuita',
                'starts_at' => now()->addDays(4)->setHour(9)->setMinute(0),
                'ends_at' => now()->addDays(4)->setHour(12)->setMinute(0),
                'price_type' => 'paid',
                'price_amount' => '₡20000',
                'organizer_name' => 'Cahuita Tours',
                'address' => 'Entrada del Parque Nacional',
            ],
            [
                'title' => 'Limpieza de Playa Comunitaria',
                'description' => 'Únete a la limpieza mensual de Playa Negra. Guantes y bolsas proporcionados. Después: refrigerio y música. ¡Cada acción cuenta!',
                'category' => 'outdoor-nature',
                'town' => 'puerto-viejo',
                'starts_at' => now()->addDays(9)->setHour(7)->setMinute(0),
                'ends_at' => now()->addDays(9)->setHour(10)->setMinute(0),
                'price_type' => 'free',
                'organizer_name' => 'Caribbean Conservation',
                'address' => 'Playa Negra, punto de entrada principal',
                'instagram_url' => 'https://instagram.com/caribbeanconservation',
            ],

            // Markets / Crafts
            [
                'title' => 'Feria Orgánica Semanal',
                'description' => 'Frutas, verduras, pan artesanal, productos locales y más. Apoya a los productores de la zona. Cada sábado de 8am a 12pm.',
                'category' => 'markets-crafts',
                'town' => 'puerto-viejo',
                'starts_at' => now()->next('Saturday')->setHour(8)->setMinute(0),
                'ends_at' => now()->next('Saturday')->setHour(12)->setMinute(0),
                'price_type' => 'free',
                'organizer_name' => 'Feria Verde Caribe',
                'address' => 'Parque de Puerto Viejo',
            ],
            [
                'title' => 'Mercadito de Artesanías',
                'description' => 'Artesanías locales, joyería, ropa hecha a mano, arte y más. Más de 20 vendedores locales. Música en vivo y comida.',
                'category' => 'markets-crafts',
                'town' => 'cahuita',
                'starts_at' => now()->addDays(7)->setHour(10)->setMinute(0),
                'ends_at' => now()->addDays(7)->setHour(17)->setMinute(0),
                'price_type' => 'free',
                'organizer_name' => 'Asociación de Artesanos de Cahuita',
                'address' => 'Calle principal de Cahuita',
            ],

            // Culture / Community
            [
                'title' => 'Noche de Cine al Aire Libre',
                'description' => 'Proyección de película bajo las estrellas. Esta semana: documental sobre la cultura afrocaribeña de Limón. Palomitas gratis.',
                'category' => 'culture-community',
                'town' => 'puerto-viejo',
                'starts_at' => now()->addDays(5)->setHour(19)->setMinute(30),
                'ends_at' => now()->addDays(5)->setHour(22)->setMinute(0),
                'price_type' => 'free',
                'organizer_name' => 'Cine Caribe',
                'address' => 'Cancha de Puerto Viejo',
            ],
            [
                'title' => 'Clase de Baile Afrocaribeño',
                'description' => 'Aprende los ritmos tradicionales del Caribe: calypso, soca y dancehall. Clase para todos los niveles. ¡Ven a mover el cuerpo!',
                'category' => 'culture-community',
                'town' => 'cahuita',
                'starts_at' => now()->addDays(6)->setHour(18)->setMinute(0),
                'ends_at' => now()->addDays(6)->setHour(20)->setMinute(0),
                'price_type' => 'paid',
                'price_amount' => '₡4000',
                'organizer_name' => 'Cahuita Dance Academy',
                'address' => 'Salón comunal de Cahuita',
            ],

            // Kids & Family
            [
                'title' => 'Tarde de Juegos para Niños',
                'description' => 'Juegos, pintacaritas, manualidades y merienda para los más pequeños. Padres pueden relajarse mientras los niños se divierten. Edades: 3-10 años.',
                'category' => 'kids-family',
                'town' => 'puerto-viejo',
                'starts_at' => now()->addDays(4)->setHour(15)->setMinute(0),
                'ends_at' => now()->addDays(4)->setHour(18)->setMinute(0),
                'price_type' => 'paid',
                'price_amount' => '₡3000 por niño',
                'organizer_name' => 'Pequeños Caribes',
                'address' => 'Parque de Puerto Viejo',
            ],
            [
                'title' => 'Tour de Chocolate para Familias',
                'description' => 'Aprende todo sobre el cacao: desde el árbol hasta la barra de chocolate. Tour interactivo perfecto para familias. Incluye degustación.',
                'category' => 'kids-family',
                'town' => 'hone-creek',
                'starts_at' => now()->addDays(5)->setHour(10)->setMinute(0),
                'ends_at' => now()->addDays(5)->setHour(13)->setMinute(0),
                'price_type' => 'paid',
                'price_amount' => '₡12000 adultos / ₡6000 niños',
                'organizer_name' => 'Caribeans Chocolate',
                'address' => 'Hone Creek, 2km de la carretera principal',
                'website_url' => 'https://caribeanschocolate.com',
            ],

            // Sports
            [
                'title' => 'Torneo de Voleibol Playa',
                'description' => 'Torneo abierto de voleibol de playa. Equipos de 2 personas. Inscripción hasta el día anterior. Premios para los ganadores.',
                'category' => 'sports',
                'town' => 'puerto-viejo',
                'starts_at' => now()->addDays(8)->setHour(9)->setMinute(0),
                'ends_at' => now()->addDays(8)->setHour(17)->setMinute(0),
                'price_type' => 'paid',
                'price_amount' => '₡5000 por equipo',
                'organizer_name' => 'Beach Sports PV',
                'address' => 'Playa Negra',
                'instagram_url' => 'https://instagram.com/beachsportspv',
            ],
            [
                'title' => 'Carrera 5K Sunrise Run',
                'description' => 'Corre al amanecer por la costa caribeña. Ruta: Puerto Viejo - Cocles - Puerto Viejo. Medalla para todos los finishers.',
                'category' => 'sports',
                'town' => 'puerto-viejo',
                'starts_at' => now()->addDays(14)->setHour(6)->setMinute(0),
                'ends_at' => now()->addDays(14)->setHour(9)->setMinute(0),
                'price_type' => 'paid',
                'price_amount' => '₡8000',
                'organizer_name' => 'Running Caribe',
                'address' => 'Parque de Puerto Viejo',
                'whatsapp_url' => 'https://wa.me/50666665555',
            ],
        ];

        foreach ($events as $eventData) {
            $town = $towns[$eventData['town']] ?? $towns->first();
            $category = $categories[$eventData['category']] ?? $categories->first();

            // Try to find a place in the same town
            $place = $places->where('town_id', $town->id)->random();

            Event::create([
                'title' => $eventData['title'],
                'slug' => Str::slug($eventData['title']),
                'description' => $eventData['description'],
                'user_id' => $user->id,
                'category_id' => $category->id,
                'town_id' => $town->id,
                'place_id' => $place?->id,
                'starts_at' => $eventData['starts_at'],
                'ends_at' => $eventData['ends_at'] ?? null,
                'price_type' => $eventData['price_type'],
                'price_amount' => $eventData['price_amount'] ?? null,
                'organizer_name' => $eventData['organizer_name'] ?? null,
                'address' => $eventData['address'] ?? null,
                'instagram_url' => $eventData['instagram_url'] ?? null,
                'whatsapp_url' => $eventData['whatsapp_url'] ?? null,
                'website_url' => $eventData['website_url'] ?? null,
                'image_path' => null, // No images for now
                'views_count' => rand(5, 150),
                'favorites_count' => rand(0, 30),
            ]);
        }

        $this->command->info('Created ' . count($events) . ' sample events.');
    }
}
