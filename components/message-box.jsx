import { useState, useRef } from 'react';
import css from 'styles/Chat.module.css';

function MessageBox({ onSend }) {
	const [message, setMessage] = useState('');
	const messageBoxRef = useRef();

	const sendMessage = () => {
		onSend(message);
		setMessage('');
	};

	const checkKeys = e => {
		if (e.key === 'Enter') {
			sendMessage();
		}
	};

	return (
		<div className={css.chat_message_area}>
			<input
				className={css.message_box}
				type='text'
				value={message}
				onChange={e => setMessage(e.target.value)}
				onKeyUp={checkKeys}
				placeholder='Start typing your message...'
				autoFocus
				ref={messageBoxRef}
			/>
			<button className={css.send_button} onClick={sendMessage}>
				<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
					/>
				</svg>
			</button>
		</div>
	);
}

export default MessageBox;
