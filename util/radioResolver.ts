/**
 * It converts a radio name to a URL
 * @example
 * ```ts
 * radioResolver('KNGI')
 * ```
 * @returns {string} Radio URL
 */

export function radioResolver(radioName: 'KNGI' | 'Gensokyo Radio'): string {
	switch (radioName) {
		case 'KNGI':
			return 'https://network.kngi.org/radio/8000/stream';
		case 'Gensokyo Radio':
			return 'https://stream.gensokyoradio.net/1';
	}
}
