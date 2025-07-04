// components/ui/controlled-date-picker-input.tsx
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { DatePickerInput } from './date-picker-input';

interface ControlledDatePickerInputProps {
    name: string;
    control: Control<any>;
    label: string;
    error?: string;
}

export default function ControlledDatePickerInput({
    name,
    control,
    label,
    error,
}: ControlledDatePickerInputProps) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => {
                const safeDate =
                    field.value instanceof Date && !isNaN(field.value.getTime())
                        ? field.value
                        : undefined;

                return (
                    <DatePickerInput
                        label={label}
                        value={safeDate}
                        onChange={field.onChange}
                        error={error}
                    />
                );
            }}
        />
    );
}

