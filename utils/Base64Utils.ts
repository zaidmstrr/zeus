const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

class Base64Utils {
    encodeStringToBase64 = (input = '') =>
        Buffer.from(input).toString('base64');
    decodeBase64ToString = (input = '') =>
        Buffer.from(input, 'base64').toString('utf8');
    btoa = (input = '') => {
        const str = input;
        let output = '';

        for (
            let block = 0, charCode, i = 0, map = chars;
            str.charAt(i | 0) || ((map = '='), i % 1);
            output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
        ) {
            charCode = str.charCodeAt((i += 3 / 4));

            if (charCode > 0xff) {
                throw new Error(
                    "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
                );
            }

            block = (block << 8) | charCode;
        }

        return output;
    };

    hexStringToByte = (str = '') => {
        if (!str) {
            return new Uint8Array();
        }

        const a = [];
        for (let i = 0, len = str.length; i < len; i += 2) {
            a.push(parseInt(str.substring(i, i + 2), 16));
        }

        return new Uint8Array(a);
    };

    byteToBase64 = (buffer: Uint8Array) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return this.btoa(binary);
    };

    hexToBase64 = (str = '') => this.byteToBase64(this.hexStringToByte(str));

    stringToUint8Array = (str: string) =>
        Uint8Array.from(str, (x) => x.charCodeAt(0));

    hexToUint8Array = (hexString: string) =>
        new Uint8Array(
            hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
        );

    bytesToHexString = (bytes: any) =>
        bytes.reduce(
            (memo: any, i: number) => memo + ('0' + i.toString(16)).slice(-2),
            ''
        );

    utf8ToHexString = (hexString: string) =>
        Buffer.from(hexString, 'utf8').toString('hex');

    base64ToHex = (base64String: string) => {
        const raw = this.decodeBase64ToString(base64String);
        let result = '';
        for (let i = 0; i < raw.length; i++) {
            const hex = raw.charCodeAt(i).toString(16);
            result += hex.length === 2 ? hex : '0' + hex;
        }
        return result;
    };

    // from https://coolaj86.com/articles/unicode-string-to-a-utf-8-typed-array-buffer-in-javascript/
    unicodeStringToUint8Array = (s: string) => {
        const escstr = encodeURIComponent(s);
        const binstr = escstr.replace(/%([0-9A-F]{2})/g, function (_, p1) {
            return String.fromCharCode(('0x' + p1) as any);
        });
        const ua = new Uint8Array(binstr.length);
        Array.prototype.forEach.call(binstr, function (ch, i) {
            ua[i] = ch.charCodeAt(0);
        });
        return ua;
    };
}

const base64Utils = new Base64Utils();
export default base64Utils;
