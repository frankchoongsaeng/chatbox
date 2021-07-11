import React from 'react';

export const InputControl = ({ children }) => {
	return (
		<div id='inputArea' className={`input-control full_width`}>
			{children}
		</div>
	);
};

export default InputControl;
