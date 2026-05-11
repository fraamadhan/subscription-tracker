<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    public function index()
    {
        if (!Auth::user()->is_admin) {
            abort(403);
        }

        $feedbacks = Feedback::with('user:id,name,email')->latest()->paginate(20);

        return Inertia::render('Admin/Feedbacks', [
            'feedbacks' => $feedbacks
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        Feedback::create([
            'user_id' => Auth::id(),
            'message' => $request->message,
        ]);

        return back()->with('success', 'Thank you for your feedback!');
    }
}
