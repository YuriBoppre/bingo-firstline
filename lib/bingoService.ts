import { db } from './firebase'
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot
} from 'firebase/firestore'

const BINGO_DOC_ID = 'bingo-data'

export interface BingoData {
  numbers: string[]
}

// Carrega os dados do Firestore
export async function loadBingoData(): Promise<BingoData> {
  if (typeof window === 'undefined' || !db) {
    return { numbers: [] }
  }

  try {
    const docRef = doc(db, 'bingo', BINGO_DOC_ID)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return docSnap.data() as BingoData
    } else {
      // Se o documento não existe, cria com dados vazios
      const initialData: BingoData = { numbers: [] }
      await setDoc(docRef, initialData)
      return initialData
    }
  } catch (error) {
    console.error('Erro ao carregar dados do Firebase:', error)
    return { numbers: [] }
  }
}

// Salva os dados no Firestore
export async function saveBingoData(data: BingoData): Promise<void> {
  if (typeof window === 'undefined' || !db) {
    return
  }

  try {
    const docRef = doc(db, 'bingo', BINGO_DOC_ID)
    await setDoc(docRef, data)
  } catch (error) {
    console.error('Erro ao salvar dados no Firebase:', error)
    throw error
  }
}

// Observa mudanças em tempo real
export function subscribeToBingoData(
  callback: (data: BingoData) => void
): () => void {
  if (typeof window === 'undefined' || !db) {
    return () => {}
  }

  try {
    const docRef = doc(db, 'bingo', BINGO_DOC_ID)
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as BingoData)
      } else {
        callback({ numbers: [] })
      }
    }, (error) => {
      console.error('Erro ao observar dados do Firebase:', error)
    })

    return unsubscribe
  } catch (error) {
    console.error('Erro ao criar subscription:', error)
    return () => {}
  }
}

