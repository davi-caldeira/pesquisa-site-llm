import type { DatabaseSync } from 'node:sqlite';
import { copiarEstrutura, estruturaVazia } from './estrutura.ts';
import { criarFuncao, obterFuncao } from './funcoes.ts';
import { obterModelo } from './modelos.ts';

/** Nova função em branco, a partir de um modelo ativo ou como cópia de uma função da própria loja. */
export function criarFuncaoAPartirDe(db: DatabaseSync, empresaId: string, dados: { nome?: unknown; modeloId?: unknown; copiarDe?: unknown }): string {
  const nomeInformado = typeof dados.nome === 'string' && dados.nome.trim() ? dados.nome : undefined;
  if (typeof dados.modeloId === 'string') {
    const modelo = obterModelo(db, dados.modeloId, true);
    return criarFuncao(db, empresaId, { nome: nomeInformado ?? modelo.nome, estrutura: copiarEstrutura(modelo.estrutura, 'modelo', false), origem: `modelo:${modelo.id}` });
  }
  if (typeof dados.copiarDe === 'string') {
    const original = obterFuncao(db, empresaId, dados.copiarDe);
    return criarFuncao(db, empresaId, { nome: nomeInformado ?? `${original.nome} (cópia)`.slice(0, 120), estrutura: copiarEstrutura(original.estrutura, 'copia', true), origem: `copia:${original.id}` });
  }
  return criarFuncao(db, empresaId, { nome: dados.nome, estrutura: estruturaVazia(), origem: 'branco' });
}
