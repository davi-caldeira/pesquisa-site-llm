import { trocarSenha } from '@/lib/auth';
import { db } from '@/lib/db';
import { errorResponse, HttpErro, lerJson, sameOrigin } from '@/lib/http';
import { destinoInicial, exigirUsuario, tokenAtual } from '@/lib/sessao-web';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const usuario = await exigirUsuario({ permitirTrocaPendente: true });
    const corpo = await lerJson(request, 2000);
    const token = await tokenAtual();
    if (!token) throw new HttpErro(401, 'Sua sessão expirou. Entre novamente.');
    await trocarSenha(db(), usuario.id, corpo.senhaAtual, corpo.novaSenha, token);
    return Response.json({ destino: destinoInicial({ ...usuario, trocarSenha: false }) });
  } catch (e) {
    return errorResponse(e);
  }
}
