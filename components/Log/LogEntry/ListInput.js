import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

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
			<div className="input-group">
				<input
					type="number"
					className="form-control"
					min="1"
					value={arrayElement}
					onChange={(e) => setArrayElement(parseInt(e.target.value))}
				/>
				<button
					className="btn btn-outline-secondary"
					type="button"
					onClick={addToArray}
				>
					+
				</button>
				<button
					className="btn btn-outline-secondary"
					type="button"
					onClick={removeFromArray}
				>
					-
				</button>
			</div>
			{array.join(", ")}
		</>
	);
};

ListInput.propTypes = {
	initialArray: PropTypes.array.isRequired,
	onArrayChange: PropTypes.func,
};

export default ListInput;
