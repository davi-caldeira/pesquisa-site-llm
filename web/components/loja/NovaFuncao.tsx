'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { chamarApi } from '@/components/api';
import { Campo } from '@/components/Campo';

export default function NovaFuncao() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const arquivo = useRef<HTMLInputElement>(null);
  const executar = async (criar: () => Promise<string>) => {
    setErro('');
    setOcupado(true);
    try {
      router.push(`/funcoes/${await criar()}`);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível criar a função.');
      setOcupado(false);
    }
  };
  const emBranco = (e: React.FormEvent) => {
    e.preventDefault();
    void executar(async () => (await chamarApi<{ id: string }>('/api/funcoes', { method: 'POST', json: { nome } })).id);
  };
  const importar = (selecionado?: File) => {
    if (!selecionado) return;
    const corpo = new FormData();
    corpo.set('file', selecionado);
    void executar(async () => (await chamarApi<{ funcaoId: string }>('/api/import', { method: 'POST', body: corpo })).funcaoId)
      .finally(() => { if (arquivo.current) arquivo.current.value = ''; });
  };
  return (
    <main className="page narrow">
      <a className="text-button" href="/">← Painel da loja</a>
      <div className="page-heading"><div><p className="eyebrow">NOVA FUNÇÃO</p><h1>Qual função vamos analisar?</h1><p>Comece pela função em que a IA mais mudou o trabalho. Você pode ajustar tudo depois.</p></div></div>
      {erro && <div className="alert error" role="alert">{erro}</div>}
      <form className="panel" onSubmit={emBranco}>
        <Campo rotulo="Nome da função"><input required maxLength={120} value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex.: Atendente de balcão" /></Campo>
        <div><button className="button primary" disabled={ocupado}>Começar em branco</button></div>
      </form>
      <p className="helper">Já tem a planilha MRCC-PV preenchida? <button type="button" className="text-button" disabled={ocupado} onClick={() => arquivo.current?.click()}>Importar planilha (.xlsx)</button></p>
      <input ref={arquivo} type="file" accept=".xlsx" hidden onChange={e => importar(e.target.files?.[0])} />
    </main>
  );
}
