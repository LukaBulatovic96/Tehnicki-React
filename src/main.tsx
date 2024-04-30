import ReactDOM from 'react-dom/client'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    // removed React.StrictMode because of double firing of useEffect in developement mode
    <App />
)
