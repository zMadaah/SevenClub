// Decodifica só o payload de um JWT, sem verificar assinatura (não
// precisa — é o mesmo token que a API já validou do lado dela; isso só lê
// o conteúdo pra saber quem é o usuário logado sem outra chamada de rede).
// Implementado sem depender de atob/Buffer pra funcionar em qualquer
// versão do React Native.
const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  let output = '';
  let buffer = 0;
  let bits = 0;

  for (const char of base64) {
    const value = BASE64_CHARS.indexOf(char);
    if (value === -1) continue;
    buffer = (buffer << 6) | value;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      output += String.fromCharCode((buffer >> bits) & 0xff);
    }
  }

  return output;
}

export function decodeJwtUserId(token: string): string | null {
  try {
    const [, payloadSegment] = token.split('.');
    const payload = JSON.parse(base64UrlDecode(payloadSegment));
    return typeof payload.sub === 'string' ? payload.sub : null;
  } catch {
    return null;
  }
}
