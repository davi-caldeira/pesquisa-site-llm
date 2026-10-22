import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bancoDeTeste, inserirEmpresa } from './apoio-testes.ts';
import { listarCatalogoAtivo } from './catalogo.ts';
import { CATALOGO_BASE } from './seed.ts';

test('lista catálogo global ativo mais as ações da própria empresa', () => {
  const db = bancoDeTeste();
  const a = inserirEmpresa(db, 'A');
  const b = inserirEmpresa(db, 'B');
  const inserir = (empresa: string, acao: string, ativa: number) =>
    db.prepare("INSERT INTO catalogo_acoes (id, empresa_id, eixo, acao, recurso, custo, ativa, criada_em) VALUES (?, ?, 'Geral', ?, 'Interno', 'R$ 0', ?, '2026-10-15')").run(crypto.randomUUID(), empresa, acao, ativa);
  inserir(a, 'Ação da loja A', 1);
  inserir(a, 'Ação desativada', 0);
  inserir(b, 'Ação da loja B', 1);
  const lista = listarCatalogoAtivo(db, a);
  assert.equal(lista.length, CATALOGO_BASE.length + 1);
  assert.deepEqual(lista.slice(0, CATALOGO_BASE.length), CATALOGO_BASE);
  assert.deepEqual(lista.at(-1), { eixo: 'Geral', acao: 'Ação da loja A', recurso: 'Interno', custo: 'R$ 0' });
});
