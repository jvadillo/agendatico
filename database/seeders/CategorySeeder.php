<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Música en vivo',
                'slug' => 'live-music',
                'icon' => 'fa-solid fa-music',
                'color' => '#ef4444',
                'sort_order' => 1,
            ],
            [
                'name' => 'Fiestas / DJ',
                'slug' => 'parties-dj',
                'icon' => 'fa-solid fa-champagne-glasses',
                'color' => '#f97316',
                'sort_order' => 2,
            ],
            [
                'name' => 'Yoga & Bienestar',
                'slug' => 'yoga-wellness',
                'icon' => 'fa-solid fa-spa',
                'color' => '#22c55e',
                'sort_order' => 3,
            ],
            [
                'name' => 'Talleres',
                'slug' => 'workshops',
                'icon' => 'fa-solid fa-palette',
                'color' => '#a855f7',
                'sort_order' => 4,
            ],
            [
                'name' => 'Aire libre / Naturaleza',
                'slug' => 'outdoor-nature',
                'icon' => 'fa-solid fa-tree',
                'color' => '#10b981',
                'sort_order' => 5,
            ],
            [
                'name' => 'Mercados / Artesanías',
                'slug' => 'markets-crafts',
                'icon' => 'fa-solid fa-store',
                'color' => '#eab308',
                'sort_order' => 6,
            ],
            [
                'name' => 'Cultura / Comunidad',
                'slug' => 'culture-community',
                'icon' => 'fa-solid fa-users',
                'color' => '#3b82f6',
                'sort_order' => 7,
            ],
            [
                'name' => 'Niños & Familias',
                'slug' => 'kids-family',
                'icon' => 'fa-solid fa-children',
                'color' => '#ec4899',
                'sort_order' => 8,
            ],
            [
                'name' => 'Deportes',
                'slug' => 'sports',
                'icon' => 'fa-solid fa-person-running',
                'color' => '#06b6d4',
                'sort_order' => 9,
            ],
            [
                'name' => 'Otro',
                'slug' => 'other',
                'icon' => 'fa-solid fa-ellipsis',
                'color' => '#6b7280',
                'sort_order' => 99,
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
