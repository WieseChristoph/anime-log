import { useState } from 'react';
import { Field, Label, Switch } from '@headlessui/react';
import { cn } from '@/utils/helper';

type ToggleButtonPropsType = {
    initialValue: boolean;
    onValueChange: (newValue: boolean) => void;
    label: string;
    valueLeft: string;
    valueRight: string;
};

const ToggleButton = ({ initialValue = false, onValueChange, label, valueLeft, valueRight }: ToggleButtonPropsType) => {
    const [value, setValue] = useState(initialValue);

    function handleChange(newValue: boolean) {
        setValue(newValue);
        onValueChange(newValue);
    }

    return (
        <Field>
            <Label className="mb-2 block font-medium text-(--text) text-sm">{label}</Label>
            <div className="mb-4 flex items-center">
                <Switch
                    checked={value}
                    onChange={handleChange}
                    className="relative inline-flex w-full items-center overflow-hidden rounded-lg border border-(--border) bg-(--surface-muted) text-center text-sm transition-colors focus:border-(--accent) focus:ring-(--accent) focus:ring-offset-(--bg)"
                >
                    <span
                        className={cn(
                            'absolute h-full w-1/2 transform bg-blue-600 transition-transform',
                            value ? 'translate-x-full' : 'translate-x-0',
                        )}
                    />
                    <Label className="z-10 w-full p-2.5 hover:cursor-pointer">{valueLeft}</Label>
                    <Label className="z-10 w-full p-2.5 hover:cursor-pointer">{valueRight}</Label>
                </Switch>
            </div>
        </Field>
    );
};

export default ToggleButton;
