<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Hotel;
use App\Models\HotelImage;
use App\Models\Review;
use App\Models\User;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::factory(10)->create();

        Hotel::factory(10)->create()->each(function ($hotel) {
            HotelImage::factory()->count(9)->create([
                'hotel_id' => $hotel->id,
                'is_main' => false,
            ]);

            HotelImage::factory()->create([
                'hotel_id' => $hotel->id,
                'is_main' => true,
            ]);

            Booking::factory()->create([
                'hotel_id' => $hotel->id,
            ]);

            Review::factory(10)->create([
                'hotel_id' => $hotel->id,
            ]);
        });


        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@test.com',
            'password' => 'password',
        ]);
    }
}
