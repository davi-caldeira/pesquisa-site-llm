'use client';
import { Campo, Selecao } from '@/components/Campo';
import { EIXOS, LIMITES, NIVEIS, ROTULOS_NIVEL, novaCompetencia, type Competencia, type Estrutura } from '@/lib/estrutura';

export default function EtapaCompetencias({ estrutura, aoMudar }: { estrutura: Estrutura; aoMudar: (e: Estrutura) => void }) {
  const alterar = (id: string, campos: Partial<Competencia>) =>
    aoMudar({ ...estrutura, competencias: estrutura.competencias.map(c => (c.id === id ? { ...c, ...campos, editada: true } : c)) });
  const tarefas = estrutura.tarefas.map((t, i) => ({ valor: t.id, rotulo: t.tarefa.trim() || `Tarefa ${i + 1} (sem descrição)` }));
  const niveis = NIVEIS.map(n => ({ valor: n, rotulo: ROTULOS_NIVEL[n] }));
  return (
    <>
      <div className="section-title">
        <h2>Perfil de competências <span>{estrutura.competencias.length}</span></h2>
        <button className="button secondary small" disabled={estrutura.competencias.length >= LIMITES.competencias}
          onClick={() => aoMudar({ ...estrutura, competencias: [...estrutura.competencias, novaCompetencia(estrutura.tarefas[0]?.id ?? '')] })}>+ Adicionar competência</button>
      </div>
      {estrutura.competencias.length === 0 && <p className="helper">Nenhuma competência ainda. Pense no que a pessoa precisa saber para executar as tarefas que a IA mudou.</p>}
      {estrutura.competencias.map((c, i) => (
        <article className="entry" key={c.id}>
          <div className="entry-number">{String(i + 1).padStart(2, '0')}</div>
          <div className="entry-fields">
            <Campo rotulo="Competência" largo><input value={c.competencia} maxLength={LIMITES.texto} onChange={e => alterar(c.id, { competencia: e.target.value })} placeholder="Ex.: Revisar o resultado da IA antes de enviar ao cliente" /></Campo>
            <Campo rotulo="Eixo"><Selecao valor={c.eixo} opcoes={EIXOS} aoMudar={v => alterar(c.id, { eixo: v as Competencia['eixo'] })} /></Campo>
            <Campo rotulo="Tarefa associada"><Selecao valor={c.tarefa_id} vazio="Escolha a tarefa" opcoes={tarefas} aoMudar={v => alterar(c.id, { tarefa_id: v })} /></Campo>
            <Campo rotulo="Nível-alvo da função"><Selecao valor={c.alvo} opcoes={niveis} aoMudar={v => alterar(c.id, { alvo: v as Competencia['alvo'] })} /></Campo>
          </div>
          <button className="remove" onClick={() => aoMudar({ ...estrutura, competencias: estrutura.competencias.filter(x => x.id !== c.id) })} aria-label={`Remover competência ${i + 1}`}>×</button>
        </article>
      ))}
      <p className="helper">O nível atual é registrado por ocupante, na última etapa. Aqui você define o nível que a função exige.</p>
    </>
  );
}
