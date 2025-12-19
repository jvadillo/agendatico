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
            'is_recurring' => ['nullable', 'boolean'],
            'recurrence_frequency' => ['nullable', 'required_if:is_recurring,true', 'in:weekly,monthly'],
            'recurrence_end_date' => ['nullable', 'required_if:is_recurring,true', 'date', 'after:starts_at'],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        if ($this->boolean('is_recurring')) {
            $count = $this->calculateEventCount();
            if ($count > 20) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'is_recurring' => "No se pueden crear más de 20 eventos de forma periódica. Esta configuración crearía {$count} eventos."
                ]);
            }
        }
    }

    /**
     * Calculate the number of events that would be created.
     */
    private function calculateEventCount(): int
    {
        if (!$this->starts_at || !$this->recurrence_end_date || !$this->recurrence_frequency) {
            return 0;
        }
        
        try {
            $start = new \DateTime($this->starts_at);
            $end = new \DateTime($this->recurrence_end_date);
        } catch (\Exception $e) {
            return 0;
        }
        
        if ($end <= $start) return 0;
        
        $count = 0;
        $current = clone $start;
        
        while ($current <= $end && $count <= 30) {
            $count++;
            if ($this->recurrence_frequency === 'weekly') {
                $current->modify('+7 days');
            } elseif ($this->recurrence_frequency === 'monthly') {
                $current->modify('+1 month');
            }
        }
        
        return $count;
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
