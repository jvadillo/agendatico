<?php

namespace Database\Seeders;

use App\Models\Town;
use Illuminate\Database\Seeder;

class TownSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $towns = [
            [
                'name' => 'Puerto Viejo',
                'slug' => 'puerto-viejo',
                'latitude' => 9.6561,
                'longitude' => -82.7546,
                'sort_order' => 1,
            ],
            [
                'name' => 'Cahuita',
                'slug' => 'cahuita',
                'latitude' => 9.7375,
                'longitude' => -82.8392,
                'sort_order' => 2,
            ],
            [
                'name' => 'Manzanillo',
                'slug' => 'manzanillo',
                'latitude' => 9.6333,
                'longitude' => -82.6500,
                'sort_order' => 3,
            ],
            [
                'name' => 'Cocles',
                'slug' => 'cocles',
                'latitude' => 9.6422,
                'longitude' => -82.7267,
                'sort_order' => 4,
            ],
            [
                'name' => 'Punta Uva',
                'slug' => 'punta-uva',
                'latitude' => 9.6361,
                'longitude' => -82.6889,
                'sort_order' => 5,
            ],
            [
                'name' => 'Hone Creek',
                'slug' => 'hone-creek',
                'latitude' => 9.6833,
                'longitude' => -82.7833,
                'sort_order' => 6,
            ],
            [
                'name' => 'Limón',
                'slug' => 'limon',
                'latitude' => 10.0000,
                'longitude' => -83.0333,
                'sort_order' => 7,
            ],
            [
                'name' => 'Bribri',
                'slug' => 'bribri',
                'latitude' => 9.6167,
                'longitude' => -82.8500,
                'sort_order' => 8,
            ],
            [
                'name' => 'Sixaola',
                'slug' => 'sixaola',
                'latitude' => 9.4500,
                'longitude' => -82.6167,
                'sort_order' => 9,
            ],
        ];

        foreach ($towns as $town) {
            Town::updateOrCreate(
                ['slug' => $town['slug']],
                $town
            );
        }
    }
}
