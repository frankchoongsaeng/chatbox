import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { recieve, loadHistory } from 'store/features/chat';
import _ from 'lodash';
import io from 'socket.io-client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Container from 'components/container';
import MessageBox from 'components/message-box';

import ChatBody from 'components/chat-body';
import { logout } from 'store/features/user';
import { useCookies } from 'react-cookie';

import css from 'styles/Chat.module.css';

export default function Chat({ username }) {
	const dispatch = useDispatch();
	const ioRef = useRef();
	const [usernameCookie, , removeCookie] = useCookies(['username']);
	const router = useRouter();

	const sendMessage = message => {
		ioRef.current.emit('message', { message, user: username });
	};

	const leaveChat = () => {
		ioRef.current.disconnect();
		removeCookie('username');
		router.replace('/join');
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
		console.log(usernameCookie);
		if (!usernameCookie.username) {
			router.push('/join');
		}
	}, [usernameCookie, router]);

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

// utility function to parse cookies
const parseCookies = req => {
	if (!req.headers.cookie) return {};
	let cookies = req.headers.cookie.split(';').map(c_str => {
		let pair = c_str.trim().split('=');
		return { [pair[0]]: pair[1] };
	});
	return cookies.reduce((prev, curr) => ({ ...prev, ...curr }), {});
};

//TODO implement reroute back to home page when cookie not set
export const getServerSideProps = async ({ req, query }) => {
	// redirect back to the join page if cookie was not set
	const cookies = parseCookies(req);
	if (!cookies.username) {
		return {
			redirect: {
				destination: `/join`,
				permanent: false,
			},
		};
	}

	// if cookie is set, but query is not, build query
	if (_.isEmpty(query) || !query.username) {
		return {
			redirect: {
				destination: `/chat?username=${query.username}`,
				permanent: false,
			},
		};
	}

	// otherwise, return the username to the component
	return {
		props: { username: query.username },
	};
};
