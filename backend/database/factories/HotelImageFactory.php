<?php

namespace Database\Factories;

use App\Models\Hotel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\HotelImage>
 */
class HotelImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'hotel_id' => Hotel::all()->random()->id,
            'url' => 'https://res.cloudinary.com/dcgceac4l/image/upload/v1741177141/hotel_stock_image_nc4rip.jpg',
            'is_main' => $this->faker->boolean(20),
        ];
    }

    public function main(): self
    {
        return $this->state(fn(array $attributes) => [
            'is_main' => true,
        ]);
    }
}
