<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'category_id' => ['required', 'exists:categories,id'],
            'town_id' => ['required', 'exists:towns,id'],
            'place_id' => ['nullable', 'exists:places,id'],
            'starts_at' => ['required', 'date', 'after_or_equal:now'],
            'ends_at' => ['nullable', 'date', 'after:starts_at'],
            'address' => ['nullable', 'string', 'max:500'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'organizer_name' => ['nullable', 'string', 'max:255'],
            'price_type' => ['required', 'in:free,donation,paid'],
            'price_amount' => ['nullable', 'required_if:price_type,paid', 'string', 'max:100'],
            'image' => ['nullable', 'image', 'max:5120'], // 5MB max
            'instagram_url' => ['nullable', 'string', 'max:255'],
            'whatsapp_url' => ['nullable', 'string', 'max:255'],
            'website_url' => ['nullable', 'url', 'max:255'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'El título es obligatorio.',
            'description.required' => 'La descripción es obligatoria.',
            'category_id.required' => 'Selecciona una categoría.',
            'town_id.required' => 'Selecciona un pueblo.',
            'starts_at.required' => 'La fecha de inicio es obligatoria.',
            'starts_at.after_or_equal' => 'La fecha debe ser futura.',
            'ends_at.after' => 'La fecha de fin debe ser posterior al inicio.',
            'image.max' => 'La imagen no puede superar 5MB.',
            'price_amount.required_if' => 'Indica el precio del evento.',
        ];
    }
}
