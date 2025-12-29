
import React, { useState, useCallback } from 'react';
import { QuizMode, QuizData, UserAnswer, AnswerType } from './types';
import { generateQuiz } from './services/geminiService';
import { Button } from './components/Button';
import { QuestionCard } from './components/QuestionCard';
import { QuizSummary } from './components/QuizSummary';

type ScreenState = 'CONFIG' | 'LOADING' | 'QUIZ' | 'RESULTS';

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('CONFIG');
  const [mode, setMode] = useState<QuizMode>(QuizMode.TREINO);
  const [numQuestions, setNumQuestions] = useState<number>(20);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [error, setError] = useState<string | null>(null);

  const startQuiz = async () => {
    setError(null);
    setScreen('LOADING');
    try {
      const data = await generateQuiz(numQuestions, mode);
      setQuizData(data);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setScreen('QUIZ');
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
      setScreen('CONFIG');
    }
  };

  const handleSelectAnswer = (answer: AnswerType) => {
    if (!quizData) return;
    const currentQuestion = quizData.questoes[currentQuestionIndex];
    
    setUserAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== currentQuestion.id);
      return [...filtered, { questionId: currentQuestion.id, answer }];
    });
  };

  const handleNext = () => {
    if (!quizData) return;
    if (currentQuestionIndex < quizData.questoes.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setScreen('RESULTS');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const resetQuiz = () => {
    setScreen('CONFIG');
    setQuizData(null);
  };

  const renderConfig = () => (
    <div className="max-w-xl mx-auto space-y-8 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-3xl mb-6 shadow-xl shadow-blue-200">
           <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
           </svg>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Simulador INSS</h1>
        <p className="text-slate-500 font-medium mt-2">Padrão Oficial CEBRASPE (Certo/Errado)</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-8">
        <div>
          <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest mb-4">Número de Questões</label>
          <div className="grid grid-cols-2 gap-3">
            {[10, 20, 50, 120].map((num) => (
              <button
                key={num}
                onClick={() => setNumQuestions(num)}
                className={`py-3 rounded-xl border-2 font-bold transition-all ${
                  numQuestions === num 
                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200" 
                    : "border-slate-200 text-slate-600 hover:border-blue-200"
                }`}
              >
                {num} Questões
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest mb-4">Modo de Estudo</label>
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => setMode(QuizMode.TREINO)}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all ${
                mode === QuizMode.TREINO 
                  ? "bg-emerald-50 border-emerald-500 shadow-sm" 
                  : "border-slate-200 hover:border-emerald-200"
              }`}
            >
              <div className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                mode === QuizMode.TREINO ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
              }`}>
                {mode === QuizMode.TREINO && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <div className="text-left">
                <p className={`font-bold ${mode === QuizMode.TREINO ? "text-emerald-700" : "text-slate-700"}`}>Modo TREINO</p>
                <p className="text-xs text-slate-500 mt-1">Gabarito e comentários detalhados aparecem após a finalização do simulado.</p>
              </div>
            </button>

            <button
              onClick={() => setMode(QuizMode.PROVA)}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all ${
                mode === QuizMode.PROVA 
                  ? "bg-slate-900 border-slate-900 shadow-sm" 
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                mode === QuizMode.PROVA ? "border-white bg-white" : "border-slate-300"
              }`}>
                {mode === QuizMode.PROVA && <div className="w-2 h-2 bg-slate-900 rounded-full"></div>}
              </div>
              <div className="text-left">
                <p className={`font-bold ${mode === QuizMode.PROVA ? "text-white" : "text-slate-700"}`}>Modo PROVA</p>
                <p className={`text-xs mt-1 ${mode === QuizMode.PROVA ? "text-slate-400" : "text-slate-500"}`}>Apenas a nota final e acertos/erros. Sem comentários explicativos.</p>
              </div>
            </button>
          </div>
        </div>

        <Button size="lg" className="w-full" onClick={startQuiz}>
          Iniciar Simulado
        </Button>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
      <div className="relative mb-8">
        <div className="w-24 h-24 border-8 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
           <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        </div>
      </div>
      <h2 className="text-2xl font-black text-slate-800 mb-2">Elaborando seu Simulado...</h2>
      <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
        Estamos utilizando Inteligência Artificial para gerar questões inéditas no padrão CEBRASPE para o concurso do INSS. Aguarde um instante.
      </p>
    </div>
  );

  const renderQuiz = () => {
    if (!quizData) return null;
    const currentQuestion = quizData.questoes[currentQuestionIndex];
    const userAns = userAnswers.find(a => a.questionId === currentQuestion.id)?.answer || null;
    const progress = ((currentQuestionIndex + 1) / quizData.questoes.length) * 100;

    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-8">
          <div className="flex justify-between items-end mb-3">
             <div className="flex items-center gap-3">
               <div className="bg-slate-900 text-white font-black px-3 py-1 rounded text-sm">INSS</div>
               <h2 className="font-bold text-slate-700">Técnico do Seguro Social</h2>
             </div>
             <div className="text-right">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Progresso</span>
                <span className="text-sm font-black text-blue-600">{Math.round(progress)}%</span>
             </div>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <QuestionCard 
          question={currentQuestion}
          selectedAnswer={userAns}
          onSelect={handleSelectAnswer}
          index={currentQuestionIndex}
          total={quizData.questoes.length}
        />

        <div className="mt-8 flex justify-between items-center bg-white p-4 rounded-2xl shadow-lg border border-slate-100 sticky bottom-6">
          <Button 
            variant="outline" 
            onClick={handlePrevious} 
            disabled={currentQuestionIndex === 0}
            className="w-32"
          >
            Anterior
          </Button>
          
          <div className="hidden md:flex gap-2">
            {quizData.questoes.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-2 h-2 rounded-full ${
                  idx === currentQuestionIndex 
                  ? 'bg-blue-600 w-4' 
                  : userAnswers.some(a => a.questionId === quizData.questoes[idx].id) 
                    ? 'bg-slate-400' 
                    : 'bg-slate-200'
                } transition-all`}
              />
            ))}
          </div>

          <Button 
            variant={currentQuestionIndex === quizData.questoes.length - 1 ? "success" : "primary"}
            onClick={handleNext}
            className="w-32"
          >
            {currentQuestionIndex === quizData.questoes.length - 1 ? "Finalizar" : "Próxima"}
          </Button>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!quizData) return null;
    return (
      <QuizSummary 
        quizData={quizData} 
        answers={userAnswers} 
        onRestart={resetQuiz} 
      />
    );
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto">
        {screen === 'CONFIG' && renderConfig()}
        {screen === 'LOADING' && renderLoading()}
        {screen === 'QUIZ' && renderQuiz()}
        {screen === 'RESULTS' && renderResults()}
      </div>
    </div>
  );
};

export default App;
