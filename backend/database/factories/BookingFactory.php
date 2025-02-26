<?php

namespace Database\Factories;

use App\Models\Hotel;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $startDate = $this->faker->dateTimeBetween('now', '+1 year');

        return [
            'hotel_id' => Hotel::all()->random()->id,
            'user_id' => User::all()->random()->id,
            'start_date' => $startDate,
            'end_date' => $this->faker->dateTimeBetween($startDate, '+1 year'),
            'confirmed' => $this->faker->boolean(),
            'confirmed_at' => $this->faker->randomElement([$startDate, null]),
        ];
    }
}
