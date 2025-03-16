import { Link } from "react-router-dom";
import tiendaLogo from '../assets/logo.png'
import '../App.css'

function Home() {
  return (
    <>
      <div>
        <img src={tiendaLogo} className='logo' alt='Tienda logo' />
      </div>
      <h1>Tienda de Productos a Domicilio</h1>
      <div className="card">
        <Link to="/productos">
          <button>Ver Productos</button>
        </Link>
        
      </div>
      <p className="workingProgress">
        Website on progress...
      </p>
    </>
  )
}

export default Home