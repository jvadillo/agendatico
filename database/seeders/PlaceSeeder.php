<?php

namespace Database\Seeders;

use App\Models\Place;
use App\Models\Town;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PlaceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $places = [
            // Puerto Viejo
            'puerto-viejo' => [
                ['name' => 'Selina Puerto Viejo', 'type' => 'hostel', 'address' => 'Playa Negra, Puerto Viejo'],
                ['name' => 'Caribeans', 'type' => 'bar', 'address' => 'Centro de Puerto Viejo'],
                ['name' => 'Koki Beach', 'type' => 'restaurant', 'address' => 'Playa Cocles'],
                ['name' => 'Lazy Mon', 'type' => 'bar', 'address' => 'Centro de Puerto Viejo'],
                ['name' => 'Salsa Brava', 'type' => 'restaurant', 'address' => 'Centro de Puerto Viejo'],
                ['name' => 'Playa Negra', 'type' => 'beach', 'address' => 'Playa Negra, Puerto Viejo'],
                ['name' => 'Playa Cocles', 'type' => 'beach', 'address' => 'Cocles, Limón'],
                ['name' => 'Outback Jack\'s', 'type' => 'bar', 'address' => 'Centro de Puerto Viejo'],
                ['name' => 'Bread & Chocolate', 'type' => 'restaurant', 'address' => 'Centro de Puerto Viejo'],
                ['name' => 'Hot Rocks', 'type' => 'bar', 'address' => 'Centro de Puerto Viejo'],
                ['name' => 'Centro Comunal de Puerto Viejo', 'type' => 'community_center', 'address' => 'Centro de Puerto Viejo'],
                ['name' => 'Kokopelli Yoga', 'type' => 'yoga_studio', 'address' => 'Puerto Viejo'],
                ['name' => 'Pure Jungle Spa', 'type' => 'spa', 'address' => 'Puerto Viejo'],
            ],
            // Cahuita
            'cahuita' => [
                ['name' => 'Parque Nacional Cahuita', 'type' => 'park', 'address' => 'Entrada principal de Cahuita'],
                ['name' => 'Playa Blanca', 'type' => 'beach', 'address' => 'Dentro del Parque Nacional'],
                ['name' => 'Coco\'s Bar', 'type' => 'bar', 'address' => 'Centro de Cahuita'],
                ['name' => 'Reggae Bar', 'type' => 'bar', 'address' => 'Centro de Cahuita'],
                ['name' => 'Miss Edith\'s', 'type' => 'restaurant', 'address' => 'Centro de Cahuita'],
                ['name' => 'Centro Comunal de Cahuita', 'type' => 'community_center', 'address' => 'Centro de Cahuita'],
                ['name' => 'Playa Principal Cahuita', 'type' => 'beach', 'address' => 'Centro de Cahuita'],
                ['name' => 'Tree of Life Wildlife Rescue', 'type' => 'sanctuary', 'address' => 'Cahuita'],
            ],
            // Manzanillo
            'manzanillo' => [
                ['name' => 'Refugio Nacional de Vida Silvestre Gandoca-Manzanillo', 'type' => 'park', 'address' => 'Manzanillo'],
                ['name' => 'Playa Manzanillo', 'type' => 'beach', 'address' => 'Centro de Manzanillo'],
                ['name' => 'Max\'s Restaurant', 'type' => 'restaurant', 'address' => 'Centro de Manzanillo'],
                ['name' => 'Cool & Calm Café', 'type' => 'restaurant', 'address' => 'Manzanillo'],
                ['name' => 'MANT Association', 'type' => 'community_center', 'address' => 'Manzanillo'],
            ],
            // Cocles
            'cocles' => [
                ['name' => 'La Pecora Nera', 'type' => 'restaurant', 'address' => 'Playa Cocles'],
                ['name' => 'Tasty Waves Cantina', 'type' => 'bar', 'address' => 'Playa Cocles'],
                ['name' => 'Yoga Cocles', 'type' => 'yoga_studio', 'address' => 'Cocles'],
                ['name' => 'Playa Cocles', 'type' => 'beach', 'address' => 'Cocles, Limón'],
            ],
            // Punta Uva
            'punta-uva' => [
                ['name' => 'Playa Punta Uva', 'type' => 'beach', 'address' => 'Punta Uva'],
                ['name' => 'Selvin\'s Restaurant', 'type' => 'restaurant', 'address' => 'Punta Uva'],
                ['name' => 'Punta Uva Lounge', 'type' => 'bar', 'address' => 'Punta Uva'],
            ],
            // Hone Creek
            'hone-creek' => [
                ['name' => 'Centro de Hone Creek', 'type' => 'community_center', 'address' => 'Hone Creek'],
                ['name' => 'Finca Educativa', 'type' => 'farm', 'address' => 'Hone Creek'],
            ],
        ];

        foreach ($places as $townSlug => $townPlaces) {
            $town = Town::where('slug', $townSlug)->first();
            
            if (!$town) {
                continue;
            }

            foreach ($townPlaces as $placeData) {
                Place::updateOrCreate(
                    ['slug' => Str::slug($placeData['name'])],
                    [
                        'name' => $placeData['name'],
                        'slug' => Str::slug($placeData['name']),
                        'town_id' => $town->id,
                        'type' => $placeData['type'],
                        'address' => $placeData['address'],
                        'is_active' => true,
                    ]
                );
            }
        }
    }
}
