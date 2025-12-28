/**
 * Gravatar utility functions
 *
 * Gravatar URLs are generated from MD5 hashes of email addresses.
 * See: https://gravatar.com/site/implement/
 */

/**
 * Generate a Gravatar URL from an email address
 * @param email - The email address to generate the avatar for
 * @param size - The size of the avatar in pixels (default: 80)
 * @param defaultImage - The default image style if no Gravatar exists
 *   Options: 'mp' (mystery person), 'identicon', 'retro', 'robohash', 'wavatar', 'blank'
 * @returns The Gravatar URL
 */
export function getGravatarUrl(
	email: string | null | undefined,
	size: number = 80,
	defaultImage: "mp" | "identicon" | "retro" | "robohash" | "wavatar" | "blank" = "mp"
): string {
	if (!email) {
		return `https://www.gravatar.com/avatar/00000000000000000000000000000000?s=${size}&d=${defaultImage}`;
	}

	const hash = md5(email.toLowerCase().trim());
	return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}`;
}

/**
 * Simple MD5 implementation for Gravatar
 * Based on the algorithm described in RFC 1321
 */
function md5(str: string): string {
	// Convert string to UTF-8 encoded byte array
	const bytes = new TextEncoder().encode(str);
	const message = new Uint8Array(bytes);

	// Pre-processing: adding padding bits
	const messageLenBits = message.length * 8;
	let padLen = 64 - ((message.length + 8) % 64);
	if (padLen === 0) padLen = 64;

	const paddedMessage = new Uint8Array(message.length + padLen + 8);
	paddedMessage.set(message);
	paddedMessage[message.length] = 0x80;

	// Append original length in bits as 64-bit little-endian
	const view = new DataView(paddedMessage.buffer);
	view.setUint32(paddedMessage.length - 8, messageLenBits, true);
	view.setUint32(paddedMessage.length - 4, 0, true);

	// Initialize hash values
	let a0 = 0x67452301;
	let b0 = 0xefcdab89;
	let c0 = 0x98badcfe;
	let d0 = 0x10325476;

	// Pre-computed table of constants
	const K = [
		0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a,
		0xa8304613, 0xfd469501, 0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
		0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821, 0xf61e2562, 0xc040b340,
		0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
		0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8,
		0x676f02d9, 0x8d2a4c8a, 0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
		0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70, 0x289b7ec6, 0xeaa127fa,
		0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
		0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92,
		0xffeff47d, 0x85845dd1, 0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
		0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391,
	];

	const s = [
		7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5,
		9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11,
		16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10,
		15, 21,
	];

	// Process each 64-byte chunk
	for (let i = 0; i < paddedMessage.length; i += 64) {
		const chunk = paddedMessage.slice(i, i + 64);
		const M = new Uint32Array(16);
		for (let j = 0; j < 16; j++) {
			M[j] =
				chunk[j * 4] |
				(chunk[j * 4 + 1] << 8) |
				(chunk[j * 4 + 2] << 16) |
				(chunk[j * 4 + 3] << 24);
		}

		let A = a0;
		let B = b0;
		let C = c0;
		let D = d0;

		for (let j = 0; j < 64; j++) {
			let F: number, g: number;

			if (j < 16) {
				F = (B & C) | (~B & D);
				g = j;
			} else if (j < 32) {
				F = (D & B) | (~D & C);
				g = (5 * j + 1) % 16;
			} else if (j < 48) {
				F = B ^ C ^ D;
				g = (3 * j + 5) % 16;
			} else {
				F = C ^ (B | ~D);
				g = (7 * j) % 16;
			}

			F = (F + A + K[j] + M[g]) >>> 0;
			A = D;
			D = C;
			C = B;
			B = (B + ((F << s[j]) | (F >>> (32 - s[j])))) >>> 0;
		}

		a0 = (a0 + A) >>> 0;
		b0 = (b0 + B) >>> 0;
		c0 = (c0 + C) >>> 0;
		d0 = (d0 + D) >>> 0;
	}

	// Convert to hex string
	const toHex = (n: number) =>
		n
			.toString(16)
			.padStart(8, "0")
			.match(/.{2}/g)!
			.reverse()
			.join("");

	return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
}
