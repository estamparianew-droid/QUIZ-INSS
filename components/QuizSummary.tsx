
import React from 'react';
import { QuizData, UserAnswer, QuizResults, QuizMode } from '../types';
import { Button } from './Button';

interface QuizSummaryProps {
  quizData: QuizData;
  answers: UserAnswer[];
  onRestart: () => void;
}

export const QuizSummary: React.FC<QuizSummaryProps> = ({ quizData, answers, onRestart }) => {
  const calculateResults = (): QuizResults => {
    let correct = 0;
    let incorrect = 0;
    let blank = 0;

    quizData.questoes.forEach((q) => {
      const userAns = answers.find(a => a.questionId === q.id)?.answer;
      if (userAns === null || userAns === undefined) {
        blank++;
      } else if (userAns === q.resposta_correta) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const rawScore = (correct * quizData.pontuacao.acerto) + (incorrect * quizData.pontuacao.erro);
    const finalScore = Math.max(0, rawScore);

    return {
      totalQuestions: quizData.questoes.length,
      correct,
      incorrect,
      blank,
      finalScore
    };
  };

  const stats = calculateResults();
  const isTreino = quizData.modo === QuizMode.TREINO;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500 pb-20">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 text-white p-8 text-center">
          <h2 className="text-3xl font-extrabold mb-2">Resultado Final</h2>
          <p className="text-slate-400 font-medium">Simulado Técnico do Seguro Social - INSS</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
              <span className="block text-slate-500 text-xs font-bold uppercase mb-1">Total</span>
              <span className="text-3xl font-black text-slate-800">{stats.totalQuestions}</span>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl text-center border border-emerald-100">
              <span className="block text-emerald-600 text-xs font-bold uppercase mb-1">Certas</span>
              <span className="text-3xl font-black text-emerald-700">{stats.correct}</span>
            </div>
            <div className="bg-red-50 p-4 rounded-xl text-center border border-red-100">
              <span className="block text-red-600 text-xs font-bold uppercase mb-1">Erradas</span>
              <span className="text-3xl font-black text-red-700">{stats.incorrect}</span>
            </div>
            <div className="bg-slate-100 p-4 rounded-xl text-center border border-slate-200">
              <span className="block text-slate-600 text-xs font-bold uppercase mb-1">Em Branco</span>
              <span className="text-3xl font-black text-slate-700">{stats.blank}</span>
            </div>
          </div>

          <div className="bg-blue-600 text-white p-8 rounded-2xl text-center shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
             </div>
             <h3 className="text-lg font-semibold uppercase tracking-widest mb-1 opacity-90">Nota Líquida</h3>
             <div className="text-6xl font-black mb-2">{stats.finalScore.toFixed(1)}</div>
             <p className="text-blue-100 text-sm max-w-xs mx-auto">
               Baseado no critério CEBRASPE: Uma resposta errada anula uma correta.
             </p>
          </div>
        </div>
      </div>

      {isTreino && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-800 px-2">Correção Comentada</h3>
          {quizData.questoes.map((q, idx) => {
            const userAns = answers.find(a => a.questionId === q.id)?.answer;
            const isCorrect = userAns === q.resposta_correta;
            const isBlank = userAns === null || userAns === undefined;

            return (
              <div key={q.id} className={`bg-white rounded-xl shadow border p-6 transition-all ${
                isBlank ? 'border-l-8 border-l-slate-400' : isCorrect ? 'border-l-8 border-l-emerald-500' : 'border-l-8 border-l-red-500'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-slate-400 font-bold text-sm">#{idx + 1}</span>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{q.disciplina}</span>
                  <div className="ml-auto flex items-center gap-2">
                    {isBlank ? (
                      <span className="text-slate-500 font-bold text-xs uppercase">EM BRANCO</span>
                    ) : isCorrect ? (
                      <span className="text-emerald-600 font-bold text-xs uppercase">ACERTOU</span>
                    ) : (
                      <span className="text-red-600 font-bold text-xs uppercase">ERROU</span>
                    )}
                  </div>
                </div>
                <p className="text-slate-800 font-medium mb-4">{q.enunciado}</p>
                <div className="bg-slate-50 rounded-lg p-4 text-sm">
                  <div className="flex gap-4 mb-2">
                    <p><span className="font-bold text-slate-500 uppercase text-[10px]">GABARITO:</span> <span className="font-black text-blue-600">{q.resposta_correta}</span></p>
                    <p><span className="font-bold text-slate-500 uppercase text-[10px]">SUA RESPOSTA:</span> <span className="font-black text-slate-700">{userAns || '—'}</span></p>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-700">Comentário:</span> {q.comentario}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-col items-center gap-4 py-8">
        <Button size="lg" onClick={onRestart} className="w-full md:w-auto min-w-[300px]">
          Fazer Novo Simulado
        </Button>
        <p className="text-slate-400 text-sm">
          Foco na missão! Sua aprovação no INSS está próxima.
        </p>
      </div>
    </div>
  );
};
