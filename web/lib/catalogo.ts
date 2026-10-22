import type { DatabaseSync } from 'node:sqlite';
import type { AcaoCatalogo } from './seed.ts';

export function listarCatalogoAtivo(db: DatabaseSync, empresaId: string): AcaoCatalogo[] {
  const linhas = db.prepare(`SELECT eixo, acao, recurso, custo FROM catalogo_acoes
    WHERE ativa = 1 AND (empresa_id IS NULL OR empresa_id = ?)
    ORDER BY empresa_id IS NOT NULL, criada_em, rowid`).all(empresaId) as AcaoCatalogo[];
  return linhas.map(l => ({ eixo: l.eixo, acao: l.acao, recurso: l.recurso, custo: l.custo }));
}
