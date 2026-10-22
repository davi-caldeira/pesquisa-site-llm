'use client';
import { Campo, Selecao } from '@/components/Campo';
import { CRITICIDADES, EFEITOS, FREQUENCIAS, LIMITES, novaTarefa, type Estrutura, type Tarefa } from '@/lib/estrutura';

const ROTULO_EFEITO: Record<string, string> = { A: 'A · A IA faz por ele', P: 'P · A IA ajuda', I: 'I · Não mudou', N: 'N · Nova por causa da IA' };

export default function EtapaTarefas({ estrutura, aoMudar }: { estrutura: Estrutura; aoMudar: (e: Estrutura) => void }) {
  const alterar = (id: string, campos: Partial<Tarefa>) =>
    aoMudar({ ...estrutura, tarefas: estrutura.tarefas.map(t => (t.id === id ? { ...t, ...campos, editada: true } : t)) });
  // Competências da tarefa removida ficam "sem tarefa" e aparecem como pendência.
  const remover = (id: string) => aoMudar({
    ...estrutura,
    tarefas: estrutura.tarefas.filter(t => t.id !== id),
    competencias: estrutura.competencias.map(c => (c.tarefa_id === id ? { ...c, tarefa_id: '' } : c)),
    perdem_centralidade: estrutura.perdem_centralidade.filter(p => p.tarefa_id !== id),
  });
  return (
    <>
      <div className="section-title">
        <h2>Mapa de tarefas <span>{estrutura.tarefas.length}</span></h2>
        <button className="button secondary small" disabled={estrutura.tarefas.length >= LIMITES.tarefas} onClick={() => aoMudar({ ...estrutura, tarefas: [...estrutura.tarefas, novaTarefa()] })}>+ Adicionar tarefa</button>
      </div>
      {estrutura.tarefas.map((t, i) => (
        <article className="entry" key={t.id}>
          <div className="entry-number">{String(i + 1).padStart(2, '0')}</div>
          <div className="entry-fields">
            <Campo rotulo="Tarefa" largo><input value={t.tarefa} maxLength={LIMITES.texto} onChange={e => alterar(t.id, { tarefa: e.target.value })} placeholder="Descreva uma atividade, começando por um verbo" /></Campo>
            <Campo rotulo="Frequência"><Selecao valor={t.frequencia} opcoes={FREQUENCIAS} aoMudar={v => alterar(t.id, { frequencia: v as Tarefa['frequencia'] })} /></Campo>
            <Campo rotulo="Criticidade"><Selecao valor={t.criticidade} opcoes={CRITICIDADES} aoMudar={v => alterar(t.id, { criticidade: v as Tarefa['criticidade'] })} /></Campo>
            <Campo rotulo="Ferramenta de IA"><input value={t.ferramenta} maxLength={LIMITES.ferramenta} onChange={e => alterar(t.id, { ferramenta: e.target.value })} placeholder="Se houver" /></Campo>
            <Campo rotulo="Efeito da IA"><Selecao valor={t.efeito_ia ?? ''} vazio="Escolha o efeito" opcoes={EFEITOS.map(e => ({ valor: e, rotulo: ROTULO_EFEITO[e] }))} aoMudar={v => alterar(t.id, { efeito_ia: v as Tarefa['efeito_ia'] })} /></Campo>
          </div>
          <button className="remove" disabled={estrutura.tarefas.length <= 1} onClick={() => remover(t.id)} aria-label={`Remover tarefa ${i + 1}`}>×</button>
        </article>
      ))}
      <div className="legend"><span><b>A</b> Automatizada</span><span><b>P</b> Aprimorada</span><span><b>I</b> Inalterada</span><span><b>N</b> Nova</span></div>
    </>
  );
}
