import NovaFuncao from '@/components/loja/NovaFuncao';
import { db } from '@/lib/db';
import { listarFuncoes } from '@/lib/funcoes';
import { listarModelos } from '@/lib/modelos';
import { exigirPaginaGestor } from '@/lib/sessao-web';

export default async function PaginaNovaFuncao() {
  const gestor = await exigirPaginaGestor();
  const funcoes = listarFuncoes(db(), gestor.empresaId).map(f => ({ id: f.id, nome: f.nome }));
  return <NovaFuncao modelos={listarModelos(db(), false)} funcoes={funcoes} />;
}
