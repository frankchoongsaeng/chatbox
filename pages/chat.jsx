import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { recieve, loadHistory } from 'store/features/chat';
import _ from 'lodash';
import io from 'socket.io-client';
import Head from 'next/head';
import Container from 'components/container';
import MessageBox from 'components/message-box';

import css from 'styles/Chat.module.css';
import ChatBody from 'components/chat-body';
import { logout } from 'store/features/user';

export default function Chat({ username }) {
	const dispatch = useDispatch();
	const ioRef = useRef();

	const sendMessage = message => {
		ioRef.current.emit('message', { message, user: username });
	};

	const leaveChat = () => {
		// clear the cookies in the browser
		document.cookies;
		ioRef.current.emit('leave', { user: username });
		ioRef.current.disconnect();
		dispatch(logout());
	};

	const attachSocketListeners = useRef(() => {
		ioRef.current.emit('user-joined', { user: username }, previousMessages => {
			dispatch(loadHistory(previousMessages));
		});

		ioRef.current.on('joined', message => {
			dispatch(recieve(message));
		});

		ioRef.current.on('message', message => {
			dispatch(recieve(message));
		});

		// return () => {
		// 	ioRef.current.emit('leave', { user: username });
		// 	ioRef.current.disconnect();
		// };
	});

	useEffect(() => {
		ioRef.current = io();
		attachSocketListeners.current();
	}, [username]);

	return (
		<>
			<Head>
				<title>Chatbox</title>
				<meta name='description' content='a general chat room for tech gods' />
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Container>
				<div className={css.flex_layout}>
					<div className={css.chat_header}>
						<div></div>
						<h4>GENERAL GROUP</h4>
						<button className='regular' onClick={leaveChat}>
							Leave
						</button>
					</div>
					<ChatBody username={username} />
					<MessageBox onSend={sendMessage} />
				</div>
			</Container>
		</>
	);
}

//TODO implement reroute back to home page when cookie not set
export const getServerSideProps = async ({ _req, query }) => {
	if (_.isEmpty(query) || !query.username)
		return {
			redirect: {
				destination: `/join`,
				permanent: false,
			},
		};

	return {
		props: { username: query.username },
	};
};
