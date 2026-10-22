import NovaFuncao from '@/components/loja/NovaFuncao';
import { exigirPaginaGestor } from '@/lib/sessao-web';

export default async function PaginaNovaFuncao() {
  await exigirPaginaGestor();
  return <NovaFuncao />;
}
