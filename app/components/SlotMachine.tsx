'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Símbolos del tragaperras
const symbols = ['🍒', '🍋', '🍊', '🍎', '🍇', '💎', '⭐', '🔔']

interface ReelProps {
  symbols: string[]
  isSpinning: boolean
  finalSymbol: string
  delay: number
}

const Reel: React.FC<ReelProps> = ({ symbols, isSpinning, finalSymbol, delay }) => {
  const [reelSymbols, setReelSymbols] = useState<string[]>([])
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    // Crear una lista extendida de símbolos para la animación continua
    const generateReelSymbols = () => {
      const extendedSymbols = []
      
      // Agregar símbolos aleatorios para el giro
      for (let i = 0; i < 15; i++) {
        extendedSymbols.push(symbols[Math.floor(Math.random() * symbols.length)])
      }
      
      // Agregar el símbolo final al final para que termine ahí
      extendedSymbols.push(finalSymbol)
      
      // Agregar símbolos adicionales visibles
      extendedSymbols.push(symbols[Math.floor(Math.random() * symbols.length)])
      extendedSymbols.push(symbols[Math.floor(Math.random() * symbols.length)])
      
      return extendedSymbols
    }

    if (isSpinning) {
      setReelSymbols(generateReelSymbols())
      setAnimationKey(prev => prev + 1)
    }
  }, [isSpinning, finalSymbol, symbols])

  // Inicializar con símbolos por defecto
  useEffect(() => {
    if (reelSymbols.length === 0) {
      setReelSymbols([finalSymbol, symbols[0], symbols[1]])
    }
  }, [finalSymbol, symbols, reelSymbols.length])

  const symbolHeight = 100 // altura de cada símbolo en px
  const visibleSymbols = 3 // número de símbolos visibles
  const spinDuration = 2 + delay / 1000 // duración del giro
  
  return (
    <div className="reel">
      <div className="reel-window">
        <motion.div
          key={animationKey}
          className="reel-strip"
          initial={{ y: 0 }}
          animate={{
            y: isSpinning 
              ? [0, -(reelSymbols.length - visibleSymbols) * symbolHeight]
              : 0
          }}
          transition={{
            duration: isSpinning ? spinDuration : 0,
            ease: isSpinning ? [0.25, 0.1, 0.25, 1] : "linear",
            times: isSpinning ? [0, 1] : [0]
          }}
          style={{
            position: 'absolute',
            width: '100%',
            top: isSpinning ? 0 : -((reelSymbols.length - visibleSymbols) * symbolHeight)
          }}
        >
          {reelSymbols.map((symbol, index) => (
            <motion.div 
              key={`${animationKey}-${index}`}
              className="symbol"
              style={{ 
                height: `${symbolHeight}px`,
                filter: isSpinning && index < reelSymbols.length - 3 ? 'blur(2px)' : 'none'
              }}
              animate={{
                filter: isSpinning && index < reelSymbols.length - 3 
                  ? ['blur(1px)', 'blur(3px)', 'blur(1px)']
                  : 'blur(0px)'
              }}
              transition={{
                duration: 0.1,
                repeat: isSpinning ? Infinity : 0,
                repeatType: "reverse"
              }}
            >
              {symbol}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

const SlotMachine: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false)
  const [reels, setReels] = useState<string[]>(['🍒', '🍒', '🍒'])
  const [credits, setCredits] = useState(100)
  const [result, setResult] = useState('')
  const [isWin, setIsWin] = useState(false)

  const spin = () => {
    if (isSpinning || credits <= 0) return

    setIsSpinning(true)
    setResult('')
    setCredits(prev => prev - 10) // Cuesta 10 créditos por giro

    // Generar resultados aleatorios para cada carrete
    const newReels = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ]

    // Simular diferentes tiempos de parada para cada carrete (más realista)
    setTimeout(() => {
      setReels(newReels)
      setIsSpinning(false)
      checkWin(newReels)
    }, 4000) // Duración total del giro aumentada
  }

  const checkWin = (currentReels: string[]) => {
    const [reel1, reel2, reel3] = currentReels

    if (reel1 === reel2 && reel2 === reel3) {
      // Tres iguales - gran premio
      let winAmount = 0
      switch (reel1) {
        case '💎':
          winAmount = 500
          break
        case '⭐':
          winAmount = 300
          break
        case '🔔':
          winAmount = 200
          break
        default:
          winAmount = 100
      }
      setCredits(prev => prev + winAmount)
      setResult(`¡JACKPOT! +${winAmount} créditos`)
      setIsWin(true)
    } else if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
      // Dos iguales - premio menor
      const winAmount = 30
      setCredits(prev => prev + winAmount)
      setResult(`¡Ganaste! +${winAmount} créditos`)
      setIsWin(true)
    } else {
      setResult('Inténtalo de nuevo')
      setIsWin(false)
    }
  }

  const resetGame = () => {
    setCredits(100)
    setResult('')
    setReels(['🍒', '🍒', '🍒'])
    setIsWin(false)
  }

  return (
    <div className="slot-machine">
      <motion.h1 
        className="title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        🎰 TRAGAPERRAS 🎰
      </motion.h1>

      <div className="credits">
        Créditos: {credits}
      </div>

      <motion.div 
        className="reels-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <Reel
          symbols={symbols}
          isSpinning={isSpinning}
          finalSymbol={reels[0]}
          delay={0}
        />
        <Reel
          symbols={symbols}
          isSpinning={isSpinning}
          finalSymbol={reels[1]}
          delay={800}
        />
        <Reel
          symbols={symbols}
          isSpinning={isSpinning}
          finalSymbol={reels[2]}
          delay={1600}
        />
      </motion.div>

      <motion.button
        className={`spin-button ${isSpinning ? 'spinning' : ''}`}
        onClick={spin}
        disabled={isSpinning || credits < 10}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isSpinning ? { 
          boxShadow: [
            "0 10px 20px rgba(255, 107, 107, 0.3)",
            "0 15px 30px rgba(255, 107, 107, 0.6)",
            "0 10px 20px rgba(255, 107, 107, 0.3)"
          ]
        } : {}}
        transition={{ duration: 0.5, repeat: isSpinning ? Infinity : 0 }}
      >
        {isSpinning ? 'GIRANDO...' : credits < 10 ? 'SIN CRÉDITOS' : 'GIRAR'}
      </motion.button>

      <motion.div 
        className={`result ${isWin ? 'win' : 'lose'}`}
        key={result}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {result}
      </motion.div>

      {credits < 10 && (
        <motion.button
          className="spin-button"
          onClick={resetGame}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ 
            background: 'linear-gradient(145deg, #2ecc71 0%, #27ae60 100%)',
            marginTop: '10px'
          }}
        >
          REINICIAR JUEGO
        </motion.button>
      )}

      <div style={{ 
        textAlign: 'center', 
        marginTop: '20px', 
        fontSize: '0.9rem',
        color: '#bbb'
      }}>
        <p>💎 = 500 pts | ⭐ = 300 pts | 🔔 = 200 pts | Otros = 100 pts</p>
        <p>Dos iguales = 30 pts | Costo por giro = 10 pts</p>
      </div>
    </div>
  )
}

export default SlotMachine
