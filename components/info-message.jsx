import { format } from 'date-fns';
import css from '../styles/Chat.module.css';

function InfoMessage({ message }) {
	return (
		<div>
			<div className={`${css[message.type]} `}>
				{message.type === 'info'
					? message.message + ' @ ' + format(new Date(message.time), "kk':'mm")
					: message.message}
			</div>
		</div>
	);
}

export default InfoMessage;
