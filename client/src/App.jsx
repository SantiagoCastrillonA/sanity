import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LoginPage } from './components/pages/Login'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <div>
            <section className="hero">
              <div className="hero-background"></div>
              <div className="hero-content">
                <h2>Cuida tu bienestar emocional</h2>
                <p>Un espacio seguro para expresarte, reflexionar y crecer. Con Sanity, nunca estás solo en tu viaje hacia
                  el bienestar mental.</p>
                <button className="cta-button">Comenzar ahora</button>
              </div>
            </section>
            <section className="features">
              <div className="feature">
                <h3>Diario Emocional</h3>
                <p>Registra tus pensamientos y emociones de forma segura y privada.</p>
              </div>
              <div className="feature">
                <h3>Recomendaciones Personalizadas</h3>
                <p>Recibe actividades y consejos adaptados a tu estado emocional.</p>
              </div>
              <div className="feature">
                <h3>Contacto de Emergencia</h3>
                <p>Accede rápidamente a recursos de emergencia si lo necesitas.</p>
              </div>
            </section>
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App