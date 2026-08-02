
import { useState } from 'react';
import { Switch } from '@headlessui/react';

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
        <Switch.Group>
            <Switch.Label className="mb-2 block text-sm font-medium text-(--text)">
                {label}
            </Switch.Label>
            <div className="mb-4 flex items-center">
                <Switch
                    checked={value}
                    onChange={handleChange}
                    className="relative inline-flex w-full items-center overflow-hidden rounded-lg border border-(--border) bg-(--surface-muted) text-center text-sm transition-colors focus:border-(--accent) focus:ring-(--accent) focus:ring-offset-(--bg)"
                >
                    <span
                        className={`${value ? 'translate-x-full' : 'translate-x-0'} absolute h-full w-1/2 transform bg-blue-600 transition-transform`}
                    />
                    <Switch.Label className="z-10 w-full p-2.5 hover:cursor-pointer">{valueLeft}</Switch.Label>
                    <Switch.Label className="z-10 w-full p-2.5 hover:cursor-pointer">{valueRight}</Switch.Label>
                </Switch>
            </div>
        </Switch.Group>
    );
};

export default ToggleButton;
