'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

// Tipos de símbolos
interface SymbolData {
  id: string
  type: 'emoji' | 'image'
  content: string
  value?: number // Valor para premios
}

// Símbolos del tragaperras
const symbols: SymbolData[] = [
  { id: 'cherry', type: 'emoji', content: '🍒', value: 100 },
  { id: 'lemon', type: 'emoji', content: '🍋', value: 100 },
  { id: 'orange', type: 'emoji', content: '🍊', value: 100 },
  { id: 'apple', type: 'emoji', content: '🍎', value: 100 },
  { id: 'grape', type: 'emoji', content: '🍇', value: 100 },
  { id: 'diamond', type: 'emoji', content: '💎', value: 500 },
  { id: 'star', type: 'emoji', content: '⭐', value: 300 },
  { id: 'bell', type: 'emoji', content: '🔔', value: 200 },
  { id: 'd3', type: 'image', content: '/logoD3.png', value: 1000 }
]

// Componente para renderizar símbolos
const Symbol: React.FC<{ symbol: SymbolData; size?: number }> = ({ symbol, size = 60 }) => {
  if (symbol.type === 'emoji') {
    return (
      <span style={{ fontSize: `${size}px`, lineHeight: 1, display: 'block' }}>
        {symbol.content}
      </span>
    )
  } else {
    return (
      <Image
        src={symbol.content}
        alt={symbol.id}
        width={size}
        height={size}
        style={{ 
          display: 'block', 
          margin: '0 auto',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid #2E5233',
          boxShadow: '0 2px 8px rgba(46, 82, 51, 0.3)'
        }}
      />
    )
  }
}

interface ReelProps {
  symbols: SymbolData[]
  isSpinning: boolean
  finalSymbol: SymbolData
  delay: number
  screenHeight: number
}

const Reel: React.FC<ReelProps> = ({ symbols, isSpinning, finalSymbol, delay, screenHeight }) => {
  const [reelSymbols, setReelSymbols] = useState<SymbolData[]>([])
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    // Crear una lista extendida de símbolos para la animación continua
    const generateReelSymbols = () => {
      const extendedSymbols: SymbolData[] = []
      
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

  const symbolHeight = screenHeight > 1000 ? 180 : screenHeight > 800 ? 160 : 100 // altura de cada símbolo en px
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
                filter: isSpinning && index < reelSymbols.length - 3 ? 'blur(2px)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
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
              <Symbol 
                symbol={symbol} 
                size={screenHeight > 1000 ? 120 : screenHeight > 800 ? 100 : 60} 
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

const SlotMachine: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false)
  const [reels, setReels] = useState<SymbolData[]>([symbols[0], symbols[0], symbols[0]]) // Cerezas por defecto
  const [credits, setCredits] = useState(100)
  const [result, setResult] = useState('')
  const [isWin, setIsWin] = useState(false)
  const [screenHeight, setScreenHeight] = useState(0)

  // Hook para detectar el tamaño de pantalla
  useEffect(() => {
    const updateScreenHeight = () => {
      setScreenHeight(window.innerHeight)
    }
    
    updateScreenHeight()
    window.addEventListener('resize', updateScreenHeight)
    
    return () => window.removeEventListener('resize', updateScreenHeight)
  }, [])

  const spin = () => {
    if (isSpinning || credits <= 0) return

    setIsSpinning(true)
    setResult('')
    setCredits(prev => prev - 10) // Cuesta 10 créditos por giro

    // Generar resultados aleatorios para cada carrete
    const newReels: SymbolData[] = [
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

  const checkWin = (currentReels: SymbolData[]) => {
    const [reel1, reel2, reel3] = currentReels

    if (reel1.id === reel2.id && reel2.id === reel3.id) {
      // Tres iguales - gran premio
      const winAmount = reel1.value || 100
      setCredits(prev => prev + winAmount)
      setResult(`¡JACKPOT! +${winAmount} créditos`)
      setIsWin(true)
    } else if (reel1.id === reel2.id || reel2.id === reel3.id || reel1.id === reel3.id) {
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
    setReels([symbols[0], symbols[0], symbols[0]]) // Cerezas por defecto
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
         SLOT MACHINE D3 
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
          screenHeight={screenHeight}
        />
        <Reel
          symbols={symbols}
          isSpinning={isSpinning}
          finalSymbol={reels[1]}
          delay={800}
          screenHeight={screenHeight}
        />
        <Reel
          symbols={symbols}
          isSpinning={isSpinning}
          finalSymbol={reels[2]}
          delay={1600}
          screenHeight={screenHeight}
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
        <p>
          <span style={{ display: 'inline-flex', alignItems: 'center', margin: '0 5px' }}>
            <Symbol 
              symbol={symbols.find(s => s.id === 'd3')!} 
              size={screenHeight > 1000 ? 35 : screenHeight > 800 ? 30 : 20} 
            />
            <span style={{ marginLeft: '5px' }}>= 1000 pts</span>
          </span>
          | 💎 = 500 pts | ⭐ = 300 pts | 🔔 = 200 pts | Otros = 100 pts
        </p>
        <p>Dos iguales = 30 pts | Costo por giro = 10 pts</p>
      </div>
    </div>
  )
}

export default SlotMachine
