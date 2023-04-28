import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { scrolled } from 'store/features/chat';
import UserMessage from './user-message';
import css from '../styles/chat.module.css';
import InfoMessage from './info-message';

function ChatBody({ username }) {
	const chatBodyRef = useRef();
	const messages = useSelector(state => state.chat.messages);
	const isChatScrolled = useSelector(state => state.chat.isChatScrolled);
	const dispatch = useDispatch();

	// check if the chatbody has been scrolled
	// and update state
	const checkScrollDistance = () => {
		let isAtBottom =
			chatBodyRef.current.scrollHeight - Math.abs(chatBodyRef.current.scrollTop) ===
			chatBodyRef.current.clientHeight;
		if (!isChatScrolled && !isAtBottom) {
			dispatch(scrolled(true));
		}
		if (isChatScrolled && isAtBottom) {
			dispatch(scrolled(false));
		}
	};

	// check if the next message should cause a scroll to bottom
	// reassign ref when isChatScrolled changes
	// using ref to avoid react's annoying warning.
	const shouldBodyScroll = useRef();
	useEffect(() => {
		shouldBodyScroll.current = () => !isChatScrolled;
	}, [isChatScrolled]);

	// scroll to the bottom when a new message arrives.
	// only if we are already at the bottom.
	useEffect(() => {
		if (shouldBodyScroll.current()) {
			chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<div ref={chatBodyRef} className={css.chat_body} onScroll={checkScrollDistance}>
			{messages.map(m => {
				if (m.type === 'info') return <InfoMessage key={m.id} message={m} />;
				if (m.type === 'message') return <UserMessage key={m.id} message={m} username={username} />;
			})}
		</div>
	);
}

export default ChatBody;
