import {useState} from 'react'

export default function Subtitle() {
  const words: Array<string> = ["responsive", "performant", "accesible", "attractive", "functional"]
  const [indexWord, setIndexWord] = useState(0)
  
  setTimeout(() => {
    if (indexWord === words.length - 1) {
      setIndexWord(0)
    } else {
      setIndexWord(indexWord + 1)
    }      
  }, 1500)
  

  return (
    <h3 className='text-xl lg:text-2xl text-wrap max-w-[700px]'>    
    <p className='transition '>Developing <span className=' opacity-100 dark:text-primary transition-all font-secondary'>{words[indexWord]}</span> websites.</p>
    </h3>
  )
}
