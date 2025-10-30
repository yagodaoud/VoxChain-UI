const SALT = 'ELeicao2025';

async function sha256Hex(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const bytes = Array.from(new Uint8Array(digest));
    return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function hashCpf(cpf: string): Promise<string> {
    // Matches backend SecurityUtils.hash(cpf, salt)
    return sha256Hex(`${cpf}${SALT}`);
}


