import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { format } from 'date-fns';
import io from 'socket.io-client';
import Head from 'next/head';
import Container from 'components/container';
import UserMessage from 'components/user-message';
import MessageBox from 'components/message-box';

import css from '../styles/Chat.module.css';

class Message {
	constructor({ message, user, joined = false }) {
		this.message = message;
		this.id = uuidv4();
		this.type = joined ? 'info' : 'message';
		this.time = new Date().toISOString();
		this.user = user;
	}
}

export default function Chat({ username }) {
	const [messages, setMessages] = useState([]);
	// const username = useCookies(['username']);
	const ioRef = useRef();

	const sendMessage = message => {
		const m = new Message({ message, user: username });
		ioRef.current.emit('message', m);
	};

	const leaveChat = () => {};

	useEffect(() => {
		ioRef.current = io();

		ioRef.current.on('joined', message => {
			setMessages(existingMessages => [
				...existingMessages,
				new Message({
					message,
					joined: true,
					user: username,
				}),
			]);
		});

		ioRef.current.on('message', message => {
			setMessages(existingMessages => [
				...existingMessages,
				message,
			]);
		});

		ioRef.current.emit('user-joined', { user: username });

		// autofocus the message box

		return () => {
			ioRef.current.emit('left', { user: username });
			ioRef.current.disconnect();
		};
	}, [username]);

	return (
		<>
			<Head>
				<title>Chatbox</title>
				<meta
					name='description'
					content='a general chat room for hackers'
				/>
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
						<button
							className='regular'
							onClick={leaveChat}
						>
							Leave
						</button>
					</div>
					<div className={css.chat_body}>
						{messages.map(m => {
							if (m.type === 'info')
								return (
									<div key={m.id}>
										<div
											className={`${
												css[m.type]
											} `}
										>
											{m.type === 'info'
												? m.message +
												  ' @ ' +
												  format(
														new Date(
															m.time
														),
														"kk':'mm"
												  )
												: m.message}
										</div>
									</div>
								);

							if (m.type === 'message')
								return (
									<UserMessage
										key={m.id}
										message={m}
										username={username}
									/>
								);
						})}
					</div>
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
