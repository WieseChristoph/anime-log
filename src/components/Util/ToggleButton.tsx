import { Switch } from "@headlessui/react";
import React, { useState } from "react";

interface Props {
    initialValue: boolean;
    onValueChange: (newValue: boolean) => void;
    label: string;
    valueLeft: string;
    valueRight: string;
}

function ToggleButton({
    initialValue = false,
    onValueChange,
    label,
    valueLeft,
    valueRight,
}: Props) {
    const [value, setValue] = useState(initialValue);

    function handleChange(newValue: boolean) {
        setValue(newValue);
        onValueChange(newValue);
    }

    return (
        <Switch.Group>
            <Switch.Label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
                {label}
            </Switch.Label>
            <div className="mb-4 flex items-center">
                <Switch
                    checked={value}
                    onChange={handleChange}
                    className={`relative inline-flex w-full items-center overflow-hidden rounded-lg border border-gray-300
bg-white text-center text-sm transition-colors focus:border-blue-500 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:focus:border-blue-500 dark:focus:ring-blue-500`}
                >
                    <span
                        className={`${
                            value ? "translate-x-full" : "translate-x-0"
                        } absolute h-full w-1/2 transform bg-blue-600 transition-transform`}
                    />
                    <Switch.Label className="z-10 w-full p-2.5 hover:cursor-pointer">
                        {valueLeft}
                    </Switch.Label>
                    <Switch.Label className="z-10 w-full p-2.5 hover:cursor-pointer">
                        {valueRight}
                    </Switch.Label>
                </Switch>
            </div>
        </Switch.Group>
    );
}

export default ToggleButton;
