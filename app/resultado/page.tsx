'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { subscribeToBingoData } from '@/lib/bingoService'

export default function ViewPage() {
  const [drawnNumbers, setDrawnNumbers] = useState<string[]>([])

  useEffect(() => {
    const unsubscribe = subscribeToBingoData((data) => {
      setDrawnNumbers(data.numbers || [])
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const groupByLetter = (numbers: string[]) => {
    const grouped: { [key: string]: string[] } = { B: [], I: [], N: [], G: [], O: [] }
    numbers.forEach(num => {
      const letter = num[0]
      if (grouped[letter]) {
        grouped[letter].push(num)
      }
    })
    return grouped
  }

  const groupedNumbers = groupByLetter(drawnNumbers)

  return (
    <main className="relative h-screen bg-gradient-to-br from-soccer-dark via-blue-900 to-soccer-dark overflow-hidden flex flex-col">
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="relative w-96 h-96 md:w-[500px] md:h-[500px] opacity-[0.08]">
          <Image
            src="/imgs/logo_firstline_white.svg"
            alt="Master 1ª Linha Logo"
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </div>
      </div>

      <div className="relative z-10 flex flex-col h-full overflow-hidden">
        <header className="w-full py-4 px-6 bg-soccer-dark/80 backdrop-blur-sm border-b-2 border-soccer-blue flex-shrink-0">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-soccer-gold mb-1">
              BINGO ASSOCIAÇÃO
            </h1>
            <p className="text-sm md:text-base text-blue-300">
              Master 1ª Linha - 1988
            </p>
          </div>
        </header>

        <div className="flex-1 overflow-hidden px-4 py-4">
          <div className="grid grid-cols-5 gap-3 h-full">
            {['B', 'I', 'N', 'G', 'O'].map((letter) => {
              const letterNumbers = groupedNumbers[letter] || []

              return (
                <div key={letter} className="flex flex-col h-full border-2 border-soccer-blue/50 rounded-lg bg-soccer-dark/40 backdrop-blur-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-soccer-blue to-blue-600 py-2 px-2 flex-shrink-0">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-soccer-gold to-yellow-500 rounded-full text-soccer-dark font-black text-xl md:text-2xl shadow-md" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                        {letter}
                      </div>
                      <p className="text-white text-xs mt-1 font-semibold">
                        {letterNumbers.length} {letterNumbers.length === 1 ? 'número' : 'números'}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-2">
                    {letterNumbers.length > 0 ? (
                      <div className="grid grid-cols-3 gap-1.5">
                        {letterNumbers.map((num, idx) => {
                          const numberOnly = num.substring(1)
                          return (
                            <div
                              key={`${letter}-${num}-${idx}`}
                              className="flex items-center justify-center"
                            >
                              <div className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-gradient-to-br from-soccer-gold to-yellow-500 rounded-full text-soccer-dark font-bold text-xs md:text-sm shadow-sm" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                                {numberOnly}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-blue-400/30 text-xs">-</div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <footer className="py-3 px-6 text-center text-blue-300 text-xs md:text-sm border-t border-soccer-blue/30 flex-shrink-0">
          <p>Master 1ª Linha - 1988 © {new Date().getFullYear()}</p>
        </footer>
      </div>
    </main>
  )
}

