import { db } from '@/lib/db';
import { estruturaVazia } from '@/lib/estrutura';
import { criarFuncao } from '@/lib/funcoes';
import { errorResponse, lerJson, sameOrigin } from '@/lib/http';
import { exigirGestor } from '@/lib/sessao-web';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const gestor = await exigirGestor();
    const corpo = await lerJson(request, 2000);
    const id = criarFuncao(db(), gestor.empresaId, { nome: corpo.nome, estrutura: estruturaVazia(), origem: 'branco' });
    return Response.json({ id }, { status: 201 });
  } catch (e) {
    return errorResponse(e);
  }
}
