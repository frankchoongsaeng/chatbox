import { format } from 'date-fns';
import css from 'styles/Chat.module.css';

function UserMessage({ message, username }) {
	return (
		<div
			className={`${css.message_wrapper} ${
				message.user === username && css.current_user_chat
			}`}
			key={message.id}
		>
			<div className={`${css.user_info}`}>
				{message.type !== 'info' &&
					message.user +
						' @' +
						format(new Date(message.time), "kk':'mm")}
			</div>
			<div className={`${css[message.type]} `}>
				{message.type === 'info'
					? message.message +
					  ' @ ' +
					  format(new Date(message.time), "kk':'mm")
					: message.message}
			</div>
		</div>
	);
}

export default UserMessage;
