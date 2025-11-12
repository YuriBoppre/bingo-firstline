'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

export default function Home() {
  const [number, setNumber] = useState<string>('')
  const [selectedLetter, setSelectedLetter] = useState<string>('B')
  const [displayedValue, setDisplayedValue] = useState<string | null>(null)
  const [drawnNumbers, setDrawnNumbers] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [showAllModal, setShowAllModal] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const announcementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('bingo-history')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setDrawnNumbers(parsed.numbers || [])
      } catch (e) {
        console.error('Erro ao carregar histórico:', e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('bingo-history', JSON.stringify({
      numbers: drawnNumbers
    }))
    window.dispatchEvent(new Event('storage'))
  }, [drawnNumbers])

  useEffect(() => {
    if (showAllModal) {
      document.body.style.overflow = 'hidden'
      document.body.classList.add('modal-open')
    } else {
      document.body.style.overflow = 'unset'
      document.body.classList.remove('modal-open')
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.body.classList.remove('modal-open')
    }
  }, [showAllModal])

  const handleShow = () => {
    const num = parseInt(number)

    if (isNaN(num) || num < 1) {
      return
    }

    const bingoValue = `${selectedLetter}${num}`

    if (drawnNumbers.includes(bingoValue)) {
      alert('Esta combinação já foi sorteada!')
      return
    }

    setDisplayedValue(null)
    setIsAnimating(true)

    setTimeout(() => {
      setDisplayedValue(bingoValue)
      setDrawnNumbers(prev => [...prev, bingoValue])
      setNumber('')

      if (announcementRef.current) {
        announcementRef.current.textContent = `Sorteado: ${bingoValue}`
      }

      setTimeout(() => {
        inputRef.current?.focus()
        setIsAnimating(false)
      }, 500)
    }, 100)
  }

  const handleClear = () => {
    if (window.confirm('Tem certeza que deseja limpar toda a lista de números sorteados?')) {
      setDrawnNumbers([])
      setDisplayedValue(null)
      if (announcementRef.current) {
        announcementRef.current.textContent = 'Lista de números sorteados foi limpa'
      }
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleShow()
    }
  }

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
        <header className="w-full py-3 px-4 bg-soccer-dark/80 backdrop-blur-sm border-b-2 border-soccer-blue flex-shrink-0">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-xl md:text-2xl font-bold text-soccer-gold mb-1">
              BINGO ASSOCIAÇÃO
            </h1>
            <p className="text-xs md:text-sm text-blue-300">
              Master 1ª Linha - 1988
            </p>
          </div>
        </header>

        <div
          ref={announcementRef}
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />

        <div className="max-w-7xl mx-auto px-4 py-4 flex-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-soccer-dark/60 backdrop-blur-sm rounded-lg p-5 border-2 border-soccer-blue shadow-lg max-w-sm mx-auto lg:max-w-none">
                <h2 className="text-xl font-bold text-soccer-gold mb-4 text-center">
                  Controle
                </h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="number-input" className="block text-sm font-medium text-blue-200 mb-2">
                      Digite o número:
                    </label>
                    <div className="flex gap-2">
                      <select
                        id="letter-select"
                        value={selectedLetter}
                        onChange={(e) => setSelectedLetter(e.target.value)}
                        className="w-16 px-2 py-3 bg-soccer-dark border-2 border-soccer-blue rounded-lg text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-soccer-gold focus:border-transparent text-center"
                      >
                        <option value="B">B</option>
                        <option value="I">I</option>
                        <option value="N">N</option>
                        <option value="G">G</option>
                        <option value="O">O</option>
                      </select>
                      <input
                        ref={inputRef}
                        id="number-input"
                        type="number"
                        min="1"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 min-w-0 px-3 py-3 bg-soccer-dark border-2 border-soccer-blue rounded-lg text-white text-lg font-bold focus:outline-none focus:ring-2 focus:ring-soccer-gold focus:border-transparent"
                        placeholder="Ex: 42"
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleShow}
                    disabled={!number || isAnimating}
                    className="w-full py-2.5 bg-gradient-to-r from-soccer-gold to-yellow-500 text-soccer-dark font-bold text-base rounded-lg hover:from-yellow-400 hover:to-soccer-gold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Mostrar
                  </button>

                  <button
                    onClick={handleClear}
                    disabled={drawnNumbers.length === 0}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Limpar Lista
                  </button>
                </div>
              </div>

              <div className="bg-soccer-dark/60 backdrop-blur-sm rounded-lg p-5 border-2 border-soccer-blue shadow-lg max-w-sm mx-auto lg:max-w-none">
                <h3 className="text-lg font-bold text-soccer-gold mb-3 text-center">
                  Estatísticas
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Total sorteados:</span>
                    <span className="font-bold text-white">{drawnNumbers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Último número:</span>
                    <span className="font-bold text-white">
                      {drawnNumbers.length > 0 ? drawnNumbers[drawnNumbers.length - 1] : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 flex items-center justify-center min-h-[400px]">
              {displayedValue !== null && (
                <div
                  className={`relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center ${isAnimating ? 'animate-pop' : 'animate-oscillate'
                    }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-soccer-gold via-yellow-400 to-soccer-gold rounded-full shadow-2xl border-4 border-yellow-600"></div>
                  <div className="absolute inset-2 bg-gradient-to-tr from-yellow-300 to-soccer-gold rounded-full"></div>
                  <span className="relative z-10 text-6xl md:text-7xl font-black text-soccer-dark drop-shadow-lg flex items-center gap-2" style={{ textShadow: '0 3px 6px rgba(0,0,0,0.5), 0 0 10px rgba(0,0,0,0.3)' }}>
                    <span className="text-4xl md:text-5xl">{displayedValue[0]}</span>
                    <span className="text-5xl md:text-6xl">-</span>
                    <span>{displayedValue.substring(1)}</span>
                  </span>
                </div>
              )}
              {displayedValue === null && (
                <div className="text-center text-blue-300 text-lg">
                  Selecione a letra, digite um número e clique em "Mostrar"
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="py-2 px-4 text-center text-blue-300 text-xs border-t border-soccer-blue/30 flex-shrink-0">
          <p>Master 1ª Linha - 1988 © {new Date().getFullYear()}</p>
        </footer>
      </div>

      {showAllModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={() => setShowAllModal(false)}
          style={{ pointerEvents: 'auto' }}
        >
          <div
            className="bg-soccer-dark border-2 border-soccer-blue rounded-lg shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-soccer-blue to-blue-600 p-5 border-b-2 border-soccer-blue">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Todos os Números
                </h2>
                <button
                  onClick={() => setShowAllModal(false)}
                  className="text-white hover:text-soccer-gold transition-colors text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
                  aria-label="Fechar modal"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto flex-1">
              {drawnNumbers.length === 0 ? (
                <p className="text-center text-blue-300 py-8">
                  Nenhum número sorteado ainda
                </p>
              ) : (
                <div className="space-y-6">
                  {['B', 'I', 'N', 'G', 'O'].map((letter) => {
                    const letterNumbers = drawnNumbers
                      .filter(num => num.startsWith(letter))
                      .map(num => num.substring(1))
                    
                    return (
                      <div key={letter} className="space-y-3">
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-soccer-gold to-yellow-500 rounded-full text-soccer-dark font-bold text-xl shadow-lg flex-shrink-0">
                            {letter}
                          </div>
                          
                          <div className="h-12 w-px bg-soccer-blue/40 flex-shrink-0"></div>
                          
                          <div className="flex flex-wrap gap-2 flex-1">
                            {letterNumbers.length > 0 ? (
                              letterNumbers.map((num, idx) => (
                                <div
                                  key={`${letter}-${num}-${idx}`}
                                  className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-soccer-gold to-yellow-500 rounded-full text-soccer-dark font-bold text-sm shadow-md hover:scale-110 transition-transform"
                                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                                >
                                  {num}
                                </div>
                              ))
                            ) : (
                              <div className="text-blue-400/40 text-sm py-2 px-4">
                                Nenhum número sorteado
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {letter !== 'O' && (
                          <div className="h-px bg-soccer-blue/20"></div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

