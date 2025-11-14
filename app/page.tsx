'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { loadBingoData, saveBingoData, subscribeToBingoData } from '@/lib/bingoService'

export default function Home() {
  const [number, setNumber] = useState<string>('')
  const [selectedLetter, setSelectedLetter] = useState<string>('B')
  const [displayedValue, setDisplayedValue] = useState<string | null>(null)
  const [drawnNumbers, setDrawnNumbers] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [showAllModal, setShowAllModal] = useState<boolean>(false)
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const announcementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true
    let initialLoadComplete = false

    loadBingoData().then((data) => {
      if (isMounted) {
        setDrawnNumbers(data.numbers || [])
        initialLoadComplete = true
        setIsInitialLoad(false)
      }
    })

    const unsubscribe = subscribeToBingoData((data) => {
      if (isMounted && initialLoadComplete) {
        setDrawnNumbers(data.numbers || [])
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!isInitialLoad && typeof window !== 'undefined') {
      saveBingoData({ numbers: drawnNumbers }).catch((error) => {
        console.error('Erro ao salvar no Firebase:', error)
      })
    }
  }, [drawnNumbers, isInitialLoad])

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

  const handleRemoveNumber = (numberToRemove: string) => {
    if (window.confirm(`Tem certeza que deseja remover o número ${numberToRemove}?`)) {
      setDrawnNumbers(prev => prev.filter(num => num !== numberToRemove))
      if (announcementRef.current) {
        announcementRef.current.textContent = `Número ${numberToRemove} removido`
      }
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
        <header className="w-full py-2 px-3 sm:py-3 sm:px-4 bg-soccer-dark/80 backdrop-blur-sm border-b-2 border-soccer-blue flex-shrink-0">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-[10px] sm:text-xs md:text-sm text-blue-300">
              Bingo - Master 1ª Linha - 1988
            </p>
          </div>
        </header>

        <div
          ref={announcementRef}
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />

        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4 flex-1 overflow-y-auto md:overflow-hidden min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {/* Coluna Esquerda - Controle e Estatísticas */}
            <div className="md:col-span-1 space-y-3 sm:space-y-4 md:space-y-6 flex flex-col justify-center">
              <div className="bg-soccer-dark/60 backdrop-blur-sm rounded-lg p-3 sm:p-4 md:p-5 border-2 border-soccer-blue shadow-lg w-full">
                <h2 className="text-lg sm:text-xl font-bold text-soccer-gold mb-3 sm:mb-4 text-center">
                  Controle
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label htmlFor="number-input" className="block text-xs sm:text-sm font-medium text-blue-200 mb-1.5 sm:mb-2">
                      Digite o número:
                    </label>
                    <div className="flex gap-2">
                      <select
                        id="letter-select"
                        value={selectedLetter}
                        onChange={(e) => setSelectedLetter(e.target.value)}
                        className="w-14 sm:w-16 px-1 sm:px-2 py-2 sm:py-3 bg-soccer-dark border-2 border-soccer-blue rounded-lg text-white text-lg sm:text-xl font-bold focus:outline-none focus:ring-2 focus:ring-soccer-gold focus:border-transparent text-center"
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
                        className="flex-1 min-w-0 px-2 sm:px-3 py-2 sm:py-3 bg-soccer-dark border-2 border-soccer-blue rounded-lg text-white text-base sm:text-lg font-bold focus:outline-none focus:ring-2 focus:ring-soccer-gold focus:border-transparent"
                        placeholder="Ex: 42"
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleShow}
                    disabled={!number || isAnimating}
                    className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-soccer-gold to-yellow-500 text-soccer-dark font-bold text-sm sm:text-base rounded-lg hover:from-yellow-400 hover:to-soccer-gold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  >
                    Mostrar
                  </button>

                  <button
                    onClick={handleClear}
                    disabled={drawnNumbers.length === 0}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    Limpar Lista
                  </button>
                </div>
              </div>

              <div className="bg-soccer-dark/60 backdrop-blur-sm rounded-lg p-3 sm:p-4 md:p-5 border-2 border-soccer-blue shadow-lg w-full">
                <h3 className="text-base sm:text-lg font-bold text-soccer-gold mb-2 sm:mb-3 text-center">
                  Estatísticas
                </h3>
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
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

            {/* Coluna Meio - Número Gerado */}
            <div className="md:col-span-1 flex items-center justify-center min-h-[250px] sm:min-h-[300px] md:min-h-[400px]">
              {displayedValue !== null && (
                <div
                  className={`relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 flex items-center justify-center ${isAnimating ? 'animate-pop' : 'animate-oscillate'
                    }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-soccer-gold via-yellow-400 to-soccer-gold rounded-full shadow-2xl border-2 sm:border-4 border-yellow-600"></div>
                  <div className="absolute inset-1 sm:inset-2 bg-gradient-to-tr from-yellow-300 to-soccer-gold rounded-full"></div>
                  <span className="relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-soccer-dark drop-shadow-lg flex items-center gap-1 sm:gap-2" style={{ textShadow: '0 3px 6px rgba(0,0,0,0.5), 0 0 10px rgba(0,0,0,0.3)' }}>
                    <span className="text-3xl sm:text-4xl md:text-5xl">{displayedValue[0]}</span>
                    <span className="text-4xl sm:text-5xl md:text-6xl">-</span>
                    <span>{displayedValue.substring(1)}</span>
                  </span>
                </div>
              )}
              {displayedValue === null && (
                <div className="text-center text-blue-300 text-sm sm:text-base md:text-lg px-4">
                  Selecione a letra, digite um número e clique em "Mostrar"
                </div>
              )}
            </div>

            {/* Coluna Direita - Ver Todos os Números */}
            <div className="md:col-span-1 flex items-center justify-center">
              <div className="bg-soccer-dark/60 backdrop-blur-sm rounded-lg p-3 sm:p-4 md:p-5 border-2 border-soccer-blue shadow-lg w-full">
                <h3 className="text-base sm:text-lg font-bold text-soccer-gold mb-3 sm:mb-4 text-center">
                  Visualização
                </h3>
                <button
                  onClick={() => setShowAllModal(true)}
                  disabled={drawnNumbers.length === 0}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-soccer-blue to-blue-600 hover:from-blue-600 hover:to-soccer-blue text-white font-bold text-sm sm:text-base rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  Ver Todos os Números Sorteados
                </button>
                {drawnNumbers.length > 0 && (
                  <p className="text-center text-blue-300 text-xs sm:text-sm mt-3">
                    {drawnNumbers.length} {drawnNumbers.length === 1 ? 'número sorteado' : 'números sorteados'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="py-1.5 sm:py-2 px-3 sm:px-4 text-center text-blue-300 text-[10px] sm:text-xs border-t border-soccer-blue/30 flex-shrink-0">
          <p>Master 1ª Linha - 1988 © {new Date().getFullYear()}</p>
        </footer>
      </div>

      {showAllModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-2 sm:p-4"
          onClick={() => setShowAllModal(false)}
          style={{ pointerEvents: 'auto' }}
        >
          <div
            className="bg-soccer-dark border-2 border-soccer-blue rounded-lg shadow-2xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] md:max-h-[85vh] lg:max-h-none lg:my-auto overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-soccer-blue to-blue-600 p-3 sm:p-4 md:p-5 border-b-2 border-soccer-blue flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Todos os Números
                </h2>
                <button
                  onClick={() => setShowAllModal(false)}
                  className="text-white hover:text-soccer-gold transition-colors text-xl sm:text-2xl font-bold w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-95"
                  aria-label="Fechar modal"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto lg:overflow-visible flex-1 lg:flex-none min-h-0">
              {drawnNumbers.length === 0 ? (
                <p className="text-center text-blue-300 py-6 sm:py-8 text-sm sm:text-base">
                  Nenhum número sorteado ainda
                </p>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {['B', 'I', 'N', 'G', 'O'].map((letter) => {
                    const letterNumbers = drawnNumbers
                      .filter(num => num.startsWith(letter))
                      .map(num => num.substring(1))

                    return (
                      <div key={letter} className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center bg-gradient-to-br from-soccer-gold to-yellow-500 rounded-full text-soccer-dark font-bold text-base sm:text-lg md:text-xl shadow-lg flex-shrink-0">
                            {letter}
                          </div>

                          <div className="h-8 sm:h-10 md:h-12 w-px bg-soccer-blue/40 flex-shrink-0 hidden sm:block"></div>

                          <div className="flex flex-wrap gap-1.5 sm:gap-2 flex-1">
                            {letterNumbers.length > 0 ? (
                              letterNumbers.map((num, idx) => {
                                const fullNumber = `${letter}${num}`
                                return (
                                  <div
                                    key={`${letter}-${num}-${idx}`}
                                    className="relative group"
                                  >
                                    <div
                                      className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center bg-gradient-to-br from-soccer-gold to-yellow-500 rounded-full text-soccer-dark font-bold text-xs sm:text-sm shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                                      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                                      title={`Clique para remover ${fullNumber}`}
                                    >
                                      {num}
                                    </div>
                                    <button
                                      onClick={() => handleRemoveNumber(fullNumber)}
                                      className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md active:scale-90"
                                      aria-label={`Remover ${fullNumber}`}
                                      title={`Remover ${fullNumber}`}
                                    >
                                      ×
                                    </button>
                                  </div>
                                )
                              })
                            ) : (
                              <div className="text-blue-400/40 text-xs sm:text-sm py-2 px-3 sm:px-4">
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

