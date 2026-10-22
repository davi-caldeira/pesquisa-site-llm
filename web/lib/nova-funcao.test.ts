import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bancoDeTeste, exemploAtendente, inserirEmpresa } from './apoio-testes.ts';
import { criarFuncao, obterFuncao } from './funcoes.ts';
import { listarModelos } from './modelos.ts';
import { criarFuncaoAPartirDe } from './nova-funcao.ts';

test('cria função a partir de modelo, de cópia da própria loja ou em branco', () => {
  const db = bancoDeTeste();
  const a = inserirEmpresa(db, 'A');
  const b = inserirEmpresa(db, 'B');
  const modelo = listarModelos(db, false).find(m => m.nome === 'Operador(a) de caixa');
  assert.ok(modelo);
  const doModelo = obterFuncao(db, a, criarFuncaoAPartirDe(db, a, { modeloId: modelo.id }));
  assert.deepEqual([doModelo.nome, doModelo.origem, doModelo.estrutura.tarefas[0].origem], ['Operador(a) de caixa', `modelo:${modelo.id}`, 'modelo']);
  const { estrutura } = exemploAtendente();
  const original = criarFuncao(db, a, { nome: 'Atendente', estrutura, origem: 'planilha' });
  const copia = obterFuncao(db, a, criarFuncaoAPartirDe(db, a, { copiarDe: original }));
  assert.deepEqual([copia.nome, copia.origem, copia.estrutura.salvaguardas[2].resposta], ['Atendente (cópia)', `copia:${original}`, 'Não']);
  assert.throws(() => criarFuncaoAPartirDe(db, b, { copiarDe: original }), { status: 404 });
  assert.equal(obterFuncao(db, b, criarFuncaoAPartirDe(db, b, { nome: 'Nova' })).origem, 'branco');
  assert.throws(() => criarFuncaoAPartirDe(db, b, { nome: ' ' }), { status: 400 });
});
