
import React from 'react';
import { Question, AnswerType } from '../types';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: AnswerType;
  onSelect: (answer: AnswerType) => void;
  index: number;
  total: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  selectedAnswer, 
  onSelect,
  index,
  total
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider">
          {question.area}
        </span>
        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider">
          {question.disciplina}
        </span>
        <span className="ml-auto text-slate-400 text-sm font-medium">
          Questão {index + 1} de {total}
        </span>
      </div>

      <div className="mb-6">
        <h3 className="text-slate-500 text-xs font-semibold mb-2 uppercase tracking-tight">Assunto: {question.assunto}</h3>
        <p className="text-slate-800 text-lg md:text-xl leading-relaxed font-medium">
          {question.enunciado}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onSelect(selectedAnswer === "C" ? null : "C")}
          className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-lg font-bold
            ${selectedAnswer === "C" 
              ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-inner" 
              : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/50"}`}
        >
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
            ${selectedAnswer === "C" ? "border-emerald-500 bg-emerald-500" : "border-slate-300"}`}>
            {selectedAnswer === "C" && <span className="text-white text-sm">✓</span>}
          </div>
          CERTO (C)
        </button>

        <button
          onClick={() => onSelect(selectedAnswer === "E" ? null : "E")}
          className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-lg font-bold
            ${selectedAnswer === "E" 
              ? "bg-red-50 border-red-500 text-red-700 shadow-inner" 
              : "bg-white border-slate-200 text-slate-600 hover:border-red-300 hover:bg-red-50/50"}`}
        >
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
            ${selectedAnswer === "E" ? "border-red-500 bg-red-500" : "border-slate-300"}`}>
            {selectedAnswer === "E" && <span className="text-white text-sm">✓</span>}
          </div>
          ERRADO (E)
        </button>
      </div>

      <div className="mt-6 flex justify-center">
        <button 
          onClick={() => onSelect(null)}
          className={`text-sm font-semibold transition-colors ${selectedAnswer === null ? 'text-slate-300 cursor-default' : 'text-slate-500 hover:text-slate-800 underline'}`}
          disabled={selectedAnswer === null}
        >
          Deixar em branco
        </button>
      </div>
    </div>
  );
};
