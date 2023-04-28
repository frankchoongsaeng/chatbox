import { useState, useRef } from 'react';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import css from 'styles/chat.module.css';

function MessageBox({ onSend }) {
	const [message, setMessage] = useState('');
	const [showEmojis, setShowEmojis] = useState(false);
	const messageBoxRef = useRef();

	const sendMessage = () => {
		if (!message) return;
		onSend(message);
		setMessage('');
	};

	const checkKeys = e => {
		// make sure the emoji

		if (!message) return;
		if (e.key === 'Enter') {
			sendMessage();
		}
	};

	const addEmoji = emoji => setMessage(message => `${message} ${emoji.native}`);

	return (
		<div className={css.chat_message_area}>
			{showEmojis && (
				<div className={`${css.picker_drawer}`}>
					<Picker
						set='apple'
						title=''
						emoji=''
						onSelect={addEmoji}
						showPreview={false}
						style={{ width: '100%' }}
					/>
				</div>
			)}
			<button onClick={() => setShowEmojis(canShow => !canShow)} className={css.picker}>
				😃
			</button>
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
