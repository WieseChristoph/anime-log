import { useState, useEffect, useRef } from "react";

import { FaPlus, FaMinus } from "react-icons/fa";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

interface Props {
    initialArray: number[];
    onArrayChange: (changedArray: number[]) => void;
}

const AnimeListInput: React.FC<Props> = ({ initialArray, onArrayChange }) => {
    const [array, setArray] = useState(initialArray);
    const [arrayElement, setArrayElement] = useState((array.at(-1) || 0) + 1);

    // use ref of onArrayChange to avoid call of useEffect on every rerender
    const onArrayChangeRef = useRef(onArrayChange);

    // call event on every render, because 'array' only changes after the next render when calling setArray
    useEffect(() => onArrayChangeRef.current(array), [onArrayChangeRef, array]);

    function addToArray() {
        // add element to array
        setArray(
            array.includes(arrayElement)
                ? array
                : [...array, arrayElement].sort((a, b) => a - b)
        );

        setArrayElement(arrayElement + 1);
    }

    function removeFromArray() {
        // remove element
        setArray(array.filter((s) => s !== arrayElement));

        // sub 1 from element if value is greater than 1
        if (arrayElement > 1) setArrayElement(arrayElement - 1);
    }

    return (
        <>
            <div className="flex flex-row">
                <input
                    type="number"
                    className="w-12 rounded-l-md border border-gray-300 bg-gray-50 p-1 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-gray-400"
                    min="1"
                    value={arrayElement}
                    onChange={(e) => setArrayElement(parseInt(e.target.value))}
                />
                <Tippy content={`Add ${arrayElement} to list`}>
                    <button
                        className="border border-r-0 border-gray-300 bg-gray-300 p-2 text-xs dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        type="button"
                        onClick={addToArray}
                        aria-label="Add"
                    >
                        <FaPlus />
                    </button>
                </Tippy>
                <Tippy content={`Remove ${arrayElement} from list`}>
                    <button
                        className="rounded-r-md border border-r-0 border-gray-300 bg-gray-300 p-2 text-xs dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        type="button"
                        onClick={removeFromArray}
                        aria-label="Remove"
                    >
                        <FaMinus />
                    </button>
                </Tippy>
            </div>
            <hr className="my-2 border-dotted border-black dark:border-white" />
            <span>{array.join(", ") || "-"}</span>
        </>
    );
};

export default AnimeListInput;
