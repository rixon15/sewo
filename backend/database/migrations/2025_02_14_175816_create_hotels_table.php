<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hotels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('address');
            $table->string('city');
            $table->string('state')->nullable();
            $table->string('zip')->nullable();
            $table->string('description');
            $table->integer('beds');
            $table->integer('baths');
            $table->integer('area');
            $table->boolean('kitchen');
            $table->boolean('balcony');
            $table->boolean('wifi');
            $table->boolean('parking_area');
            $table->boolean('smoking_area');
            $table->integer('price');
            $table->timestamps();
            $table->index(['name', 'city', 'state']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotels');
    }
};
