import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { recieve, loadHistory } from 'store/features/chat';
import _ from 'lodash';
import io from 'socket.io-client';
import Head from 'next/head';
import Container from 'components/container';
import MessageBox from 'components/message-box';

import css from '../styles/Chat.module.css';
import ChatBody from 'components/chat-body';

export default function Chat({ username }) {
	const dispatch = useDispatch();
	// const _messages = useSelector(state => state.chat.messages);
	const ioRef = useRef();

	const sendMessage = message => {
		ioRef.current.emit('message', { message, user: username });
	};

	const leaveChat = () => {
		ioRef.current.emit('left', { user: username });
		ioRef.current.disconnect();
	};

	useEffect(() => {
		ioRef.current = io();

		ioRef.current.on('joined', message => {
			dispatch(recieve(message));
			// setMessages(existingMessages => [...existingMessages, message]);
		});

		ioRef.current.on('message', message => {
			dispatch(recieve(message));
			// setMessages(existingMessages => [...existingMessages, message]);
		});

		ioRef.current.emit('user-joined', { user: username }, previousMessages => {
			dispatch(loadHistory(previousMessages));
			// setMessages(previousMessages);
		});

		return () => {
			ioRef.current.emit('left', { user: username });
			ioRef.current.disconnect();
		};
	}, [username]);

	return (
		<>
			<Head>
				<title>Chatbox</title>
				<meta name='description' content='a general chat room for hackers' />
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
					{/* <div ref={chatBodyRef} className={css.chat_body}>
						{messages.map(m => {
							if (m.type === 'info')
								return (
									<div key={m.id}>
										<div className={`${css[m.type]} `}>
											{m.type === 'info'
												? m.message + ' @ ' + format(new Date(m.time), "kk':'mm")
												: m.message}
										</div>
									</div>
								);

							if (m.type === 'message') return <UserMessage key={m.id} message={m} username={username} />;
						})}
					</div> */}
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
