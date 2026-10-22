import { DatabaseSync } from 'node:sqlite';
import { prepararBanco } from './db.ts';

/** Utilitários usados só pelos testes (`*.test.ts`). */
export const bancoDeTeste = (): DatabaseSync => prepararBanco(new DatabaseSync(':memory:'));

export const ID = (n: number): string => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;

export function inserirEmpresa(db: DatabaseSync, nome = 'Loja Teste', ativa = true): string {
  const id = crypto.randomUUID();
  db.prepare('INSERT INTO empresas (id, nome, ativa, criada_em) VALUES (?, ?, ?, ?)').run(id, nome, ativa ? 1 : 0, new Date().toISOString());
  return id;
}
