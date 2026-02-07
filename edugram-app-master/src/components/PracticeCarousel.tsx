import { useState } from 'react';
import type { PracticeQuestion } from '@/types';
import { CheckCircle2, HelpCircle, XCircle } from 'lucide-react';

interface PracticeCarouselProps {
  questions: PracticeQuestion[];
}

export function PracticeCarousel({ questions }: PracticeCarouselProps) {
  const [selections, setSelections] = useState<Record<string, string>>({});

  const handleSelect = (questionId: string, optionId: string) => {
    setSelections(prev => ({ ...prev, [questionId]: optionId }));
  };

  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">Practice</p>
          <h2 className="text-lg font-semibold text-[#0B0D10]">Swipeable quick checks</h2>
          <p className="text-sm text-gray-500">Answer a 10-second quiz, then explain your reasoning in comments.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <HelpCircle className="h-4 w-4" />
          Swipe to explore
        </div>
      </div>

      <div className="mt-4 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
        {questions.map((question) => {
          const selected = selections[question.id];
          const isCorrect = selected === question.correctOptionId;
          return (
            <div
              key={question.id}
              className="min-w-[280px] max-w-[320px] snap-start rounded-2xl border border-[#F2F3F5] bg-[#F9FAFB] p-4 shadow-sm"
            >
              <div className="relative h-32 w-full overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={question.image}
                  alt={question.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{question.title}</p>
                <p className="mt-1 text-sm font-semibold text-[#0B0D10]">{question.question}</p>
                <div className="mt-3 space-y-2">
                  {question.options.map((option) => {
                    const isSelected = selected === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelect(question.id, option.id)}
                        className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-medium transition-colors ${
                          isSelected
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-transparent bg-white text-gray-600 hover:border-purple-200'
                        }`}
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600">
                          {option.label}
                        </span>
                        <span className="flex-1">{option.text}</span>
                      </button>
                    );
                  })}
                </div>
                {selected && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl bg-white p-3 text-xs text-gray-600">
                    {isCorrect ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 text-rose-500" />
                    )}
                    <div>
                      <p className="font-semibold text-[#0B0D10]">
                        {isCorrect ? 'Nice work!' : 'Close — try again.'}
                      </p>
                      <p className="text-gray-500">{question.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
