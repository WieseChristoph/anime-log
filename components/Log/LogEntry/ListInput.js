import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FaPlus, FaMinus } from "react-icons/fa";

const ListInput = ({ initialArray, onArrayChange }) => {
	const [array, setArray] = useState(initialArray);
	const [arrayElement, setArrayElement] = useState(array.at(-1) + 1 || 1);

	// use ref of onArrayChange to avoid call of useEffect on every rerender
	const onArrayChangeRef = useRef();
	onArrayChangeRef.current = onArrayChange;

	// call event on every render, because 'array' only changes after the next render when calling setArray
	useEffect(() => onArrayChangeRef.current(array), [onArrayChangeRef, array]);

	let addToArray = async () => {
		// add element to array
		await setArray(
			array.includes(arrayElement)
				? array
				: [...array, arrayElement].sort((a, b) => a - b)
		);

		setArrayElement(arrayElement + 1);
	};

	let removeFromArray = () => {
		// remove element
		setArray(array.filter((s) => s !== arrayElement));

		// sub 1 from element if value is greater than 1
		if (arrayElement > 1) setArrayElement(arrayElement - 1);
	};

	return (
		<>
			<div className="flex flex-row">
				<input
					type="number"
					className="w-12 text-sm p-1 rounded-l-md bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
					min="1"
					value={arrayElement}
					onChange={(e) => setArrayElement(parseInt(e.target.value))}
				/>
				<button
					className="p-2 text-xs text-gray-900 bg-gray-200 border border-r-0 border-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-600"
					type="button"
					onClick={addToArray}
				>
					<FaPlus />
				</button>
				<button
					className="p-2 text-xs text-gray-900 bg-gray-200 rounded-r-md border border-r-0 border-gray-300 dark:bg-gray-600 dark:text-white dark:border-gray-600"
					type="button"
					onClick={removeFromArray}
				>
					<FaMinus />
				</button>
				<span className="ml-2 self-center whitespace-nowrap overflow-x-auto">
					{array.join(", ")}
				</span>
			</div>
		</>
	);
};

ListInput.propTypes = {
	initialArray: PropTypes.array.isRequired,
	onArrayChange: PropTypes.func,
};

export default ListInput;
