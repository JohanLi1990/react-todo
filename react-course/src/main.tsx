import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Day5 from './Day5'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <Day5 />
  </StrictMode>,
)
