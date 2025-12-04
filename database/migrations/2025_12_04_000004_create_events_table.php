<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('restrict');
            $table->foreignId('town_id')->constrained()->onDelete('restrict');
            $table->foreignId('place_id')->nullable()->constrained()->onDelete('set null');
            
            // Date & Time
            $table->dateTime('starts_at');
            $table->dateTime('ends_at')->nullable();
            
            // Location details
            $table->string('address')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            
            // Organizer
            $table->string('organizer_name')->nullable();
            
            // Price
            $table->enum('price_type', ['free', 'donation', 'paid'])->default('free');
            $table->string('price_amount')->nullable(); // Can be "5000" or "From 2000"
            
            // Image
            $table->string('image_path')->nullable();
            
            // External links
            $table->string('instagram_url')->nullable();
            $table->string('whatsapp_url')->nullable();
            $table->string('website_url')->nullable();
            
            // Stats
            $table->unsignedInteger('views_count')->default(0);
            $table->unsignedInteger('favorites_count')->default(0);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes for filtering
            $table->index(['starts_at', 'deleted_at']);
            $table->index(['town_id', 'starts_at', 'deleted_at']);
            $table->index(['category_id', 'starts_at', 'deleted_at']);
            $table->index(['user_id', 'deleted_at']);
            $table->index('price_type');
            
            // Full-text search (only for MySQL/PostgreSQL)
            if (in_array(config('database.default'), ['mysql', 'pgsql'])) {
                $table->fullText(['title', 'description']);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
