import { format } from 'date-fns';
import css from '../styles/chat.module.css';

function InfoMessage({ message }) {
	let infotype = message.message.includes(' joined the chat') ? 'joined' : 'left';
	return (
		<div className={css.info_message_wrapper}>
			<div className={`${css[message.type]} ${css[infotype]}`}>
				{message.message + ' @ ' + format(new Date(message.time), "kk':'mm")}
			</div>
		</div>
	);
}

export default InfoMessage;
