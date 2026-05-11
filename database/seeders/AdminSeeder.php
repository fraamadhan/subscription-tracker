<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('P@ssword'),
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );
        
        // Ensure the existing one is marked as admin if it was already created
        if (!$admin->is_admin) {
            $admin->update(['is_admin' => true]);
        }
    }
}
