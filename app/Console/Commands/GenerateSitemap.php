<?php

namespace App\Console\Commands;

use App\Models\Event;
use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class GenerateSitemap extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sitemap:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate the sitemap for the application';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Generating sitemap...');

        $sitemap = Sitemap::create();

        // Add static pages
        $sitemap->add(Url::create('/')
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
            ->setPriority(1.0));

        $sitemap->add(Url::create('/privacy')
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY)
            ->setPriority(0.3));

        $sitemap->add(Url::create('/terms')
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY)
            ->setPriority(0.3));

        // Add all published events
        $events = Event::query()
            ->whereNull('deleted_at')
            ->where('starts_at', '>=', now()->subDays(1))
            ->orderBy('starts_at', 'desc')
            ->get();

        foreach ($events as $event) {
            $sitemap->add(Url::create("/events/{$event->slug}")
                ->setLastModificationDate($event->updated_at)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                ->setPriority(0.8));
        }

        $sitemap->writeToFile(public_path('sitemap.xml'));

        $this->info("Sitemap generated successfully with " . (3 + $events->count()) . " URLs!");
        $this->info("Location: " . public_path('sitemap.xml'));

        return Command::SUCCESS;
    }
}
