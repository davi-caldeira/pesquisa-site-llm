import EditorFuncao from '@/components/funcao/EditorFuncao';
import { db } from '@/lib/db';
import { obterFuncao } from '@/lib/funcoes';
import { listarOcupantes } from '@/lib/ocupantes';
import { exigirPaginaGestor, ou404 } from '@/lib/sessao-web';

export default async function PaginaFuncao({ params }: { params: Promise<{ id: string }> }) {
  const gestor = await exigirPaginaGestor();
  const { id } = await params;
  const funcao = ou404(() => obterFuncao(db(), gestor.empresaId, id));
  const ocupantes = listarOcupantes(db(), gestor.empresaId, id);
  return <EditorFuncao funcao={{ id: funcao.id, nome: funcao.nome, estrutura: funcao.estrutura }} ocupantes={ocupantes} />;
}
