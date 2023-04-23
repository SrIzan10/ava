import { EventType, eventModule } from '@sern/handler';

export default eventModule({
	type: EventType.Discord,
	name: 'ready',
	execute() {
		console.log('Bot ready!');
	},
});
