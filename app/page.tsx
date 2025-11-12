'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

export default function Home() {
  const [number, setNumber] = useState<string>('')
  const [displayedNumber, setDisplayedNumber] = useState<number | null>(null)
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([])
  const [allowRepeat, setAllowRepeat] = useState<boolean>(false)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [showAllModal, setShowAllModal] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const announcementRef = useRef<HTMLDivElement>(null)

  // Carregar histórico do localStorage ao montar
  useEffect(() => {
    const saved = localStorage.getItem('bingo-history')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setDrawnNumbers(parsed.numbers || [])
        setAllowRepeat(parsed.allowRepeat || false)
      } catch (e) {
        console.error('Erro ao carregar histórico:', e)
      }
    }
  }, [])

  // Salvar histórico no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('bingo-history', JSON.stringify({
      numbers: drawnNumbers,
      allowRepeat: allowRepeat
    }))
  }, [drawnNumbers, allowRepeat])

  // Bloquear scroll e interação do body quando modal estiver aberto
  useEffect(() => {
    if (showAllModal) {
      document.body.style.overflow = 'hidden'
      document.body.classList.add('modal-open')
    } else {
      document.body.style.overflow = 'unset'
      document.body.classList.remove('modal-open')
    }
    // Cleanup ao desmontar
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

    // Verificar repetição se não permitir
    if (!allowRepeat && drawnNumbers.includes(num)) {
      alert('Este número já foi sorteado! Marque "Permitir repetição" se deseja sortear novamente.')
      return
    }

    // Limpar número anterior e iniciar animação
    setDisplayedNumber(null)
    setIsAnimating(true)

    // Pequeno delay para reiniciar animação
    setTimeout(() => {
      setDisplayedNumber(num)
      setDrawnNumbers(prev => [...prev, num])
      setNumber('')

      // Anunciar para leitores de tela
      if (announcementRef.current) {
        announcementRef.current.textContent = `Número sorteado: ${num}`
      }

      // Focar no input após animação
      setTimeout(() => {
        inputRef.current?.focus()
        setIsAnimating(false)
      }, 500)
    }, 100)
  }

  const handleClear = () => {
    if (window.confirm('Tem certeza que deseja limpar toda a lista de números sorteados?')) {
      setDrawnNumbers([])
      setDisplayedNumber(null)
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
              <div className="bg-soccer-dark/60 backdrop-blur-sm rounded-lg p-6 border-2 border-soccer-blue shadow-lg">
                <h2 className="text-xl font-bold text-soccer-gold mb-4 text-center">
                  Controle
                </h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="number-input" className="block text-sm font-medium text-blue-200 mb-2">
                      Digite o número:
                    </label>
                    <input
                      ref={inputRef}
                      id="number-input"
                      type="number"
                      min="1"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full px-4 py-3 bg-soccer-dark border-2 border-soccer-blue rounded-lg text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-soccer-gold focus:border-transparent"
                      placeholder="Ex: 42"
                      autoFocus
                    />
                  </div>

                  <button
                    onClick={handleShow}
                    disabled={!number || isAnimating}
                    className="w-full py-3 bg-gradient-to-r from-soccer-gold to-yellow-500 text-soccer-dark font-bold text-lg rounded-lg hover:from-yellow-400 hover:to-soccer-gold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Mostrar
                  </button>

                  <div className="flex items-center gap-3 p-3 bg-soccer-dark/40 rounded-lg">
                    <input
                      type="checkbox"
                      id="allow-repeat"
                      checked={allowRepeat}
                      onChange={(e) => setAllowRepeat(e.target.checked)}
                      className="w-5 h-5 text-soccer-gold focus:ring-soccer-gold rounded"
                    />
                    <label htmlFor="allow-repeat" className="text-sm text-blue-200 cursor-pointer">
                      Permitir repetição
                    </label>
                  </div>

                  <button
                    onClick={handleClear}
                    disabled={drawnNumbers.length === 0}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Limpar Lista
                  </button>
                </div>
              </div>

              <div className="bg-soccer-dark/60 backdrop-blur-sm rounded-lg p-6 border-2 border-soccer-blue shadow-lg">
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

            <div className="lg:col-span-1 flex items-center justify-center min-h-[400px]">
              {displayedNumber !== null && (
                <div
                  className={`relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center ${isAnimating ? 'animate-pop' : 'animate-oscillate'
                    }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-soccer-gold via-yellow-400 to-soccer-gold rounded-full shadow-2xl border-4 border-yellow-600"></div>
                  <div className="absolute inset-2 bg-gradient-to-tr from-yellow-300 to-soccer-gold rounded-full"></div>
                  <span className="relative z-10 text-8xl md:text-9xl font-black text-soccer-dark drop-shadow-lg">
                    {displayedNumber}
                  </span>
                </div>
              )}
              {displayedNumber === null && (
                <div className="text-center text-blue-300 text-lg">
                  Digite um número e clique em "Mostrar"
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-soccer-dark/60 backdrop-blur-sm rounded-lg p-6 border-2 border-soccer-blue shadow-lg h-full">
                <h2 className="text-xl font-bold text-soccer-gold mb-4 text-center">
                  Bolas Sorteadas
                </h2>

                {drawnNumbers.length === 0 ? (
                  <p className="text-center text-blue-300 py-8">
                    Nenhum número sorteado ainda
                  </p>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      {drawnNumbers.slice(-5).map((num, localIndex) => {
                        const globalIndex = drawnNumbers.length - 5 + localIndex
                        return (
                          <div
                            key={globalIndex}
                            className="flex items-center gap-2 p-2 bg-soccer-dark/40 rounded-lg border border-soccer-blue/50 hover:bg-soccer-dark/60 transition-colors"
                          >
                            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-soccer-gold to-yellow-500 rounded-full text-soccer-dark font-bold text-lg shadow-md">
                              {num}
                            </div>
                            <div className="flex-1">
                              <div className="text-lg font-semibold text-white">
                                Número {num}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-4 pt-4 border-t border-soccer-blue/50">
                      <button
                        onClick={() => setShowAllModal(true)}
                        className="w-full py-3 bg-gradient-to-r from-soccer-blue to-blue-600 hover:from-blue-600 hover:to-soccer-blue text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Ver Todos os Números ({drawnNumbers.length})
                      </button>
                    </div>
                  </>
                )}
              </div>
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
            className="bg-soccer-dark border-2 border-soccer-blue rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-soccer-blue to-blue-600 p-6 border-b-2 border-soccer-blue">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Todos os Números Sorteados
                </h2>
                <button
                  onClick={() => setShowAllModal(false)}
                  className="text-white hover:text-soccer-gold transition-colors text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
                  aria-label="Fechar modal"
                >
                  ×
                </button>
              </div>
              <div className="mt-2">
                <p className="text-blue-200">
                  Total: {drawnNumbers.length} número{drawnNumbers.length !== 1 ? 's' : ''}
                </p>
                <p className="text-blue-300 text-sm mt-1">
                  Ordem do primeiro sorteado para o último
                </p>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {drawnNumbers.length === 0 ? (
                <p className="text-center text-blue-300 py-8">
                  Nenhum número sorteado ainda
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {drawnNumbers.map((num, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-center p-4 bg-soccer-dark/60 rounded-lg border-2 border-soccer-blue/50 hover:border-soccer-gold transition-all hover:scale-105"
                    >
                      <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-soccer-gold to-yellow-500 rounded-full text-soccer-dark font-bold text-xl shadow-lg">
                        {num}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-soccer-dark/80 border-t border-soccer-blue/50 flex justify-end gap-3">
              <button
                onClick={() => setShowAllModal(false)}
                className="px-6 py-2 bg-soccer-blue hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

