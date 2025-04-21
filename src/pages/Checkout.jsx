import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Checkout.css";

const Checkout = () => {
  const { cartItems, getTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: currentUser?.nombre || "",
    apellidos: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    telefono: "",
    metodoPago: "tarjeta",
    numeroTarjeta: "",
    fechaExpiracion: "",
    cvv: ""
  });
  
  const [step, setStep] = useState(1); // 1: Dirección, 2: Pago, 3: Confirmación
  const [envioProcesado, setEnvioProcesado] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const validarDireccion = () => {
    // Validación básica - en producción sería más completa
    const { nombre, apellidos, direccion, ciudad, codigoPostal, telefono } = formData;
    return nombre && apellidos && direccion && ciudad && codigoPostal && telefono;
  };
  
  const validarPago = () => {
    // Validación básica - en producción sería más completa
    if (formData.metodoPago === "tarjeta") {
      return formData.numeroTarjeta && formData.fechaExpiracion && formData.cvv;
    }
    return true;
  };
  
  const handleSubmitDireccion = (e) => {
    e.preventDefault();
    if (validarDireccion()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSubmitPago = (e) => {
    e.preventDefault();
    if (validarPago()) {
      // Simulación de procesamiento de pago
      setEnvioProcesado(true);
      setStep(3);
      window.scrollTo(0, 0);
      
      // En un escenario real, aquí harías la llamada a la API
      setTimeout(() => {
        clearCart();
      }, 1000);
    }
  };
  
  const handleFinalizarCompra = () => {
    navigate("/historial");
  };

  return (
    <div className="checkout-container">
      <div className="checkout-steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <span>Dirección de envío</span>
        </div>
        <div className="step-separator"></div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <span>Método de pago</span>
        </div>
        <div className="step-separator"></div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <span>Confirmación</span>
        </div>
      </div>
      
      <div className="checkout-content">
        {step === 1 && (
          <div className="checkout-direccion">
            <h2>Dirección de Envío</h2>
            <form onSubmit={handleSubmitDireccion}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="apellidos">Apellidos</label>
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="direccion">Dirección</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ciudad">Ciudad</label>
                  <input
                    type="text"
                    id="ciudad"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="codigoPostal">Código Postal</label>
                  <input
                    type="text"
                    id="codigoPostal"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="checkout-actions">
                <button type="button" onClick={() => navigate("/carrito")}>Volver al carrito</button>
                <button type="submit" className="btn-continuar">Continuar</button>
              </div>
            </form>
          </div>
        )}
        
        {step === 2 && (
          <div className="checkout-pago">
            <h2>Método de Pago</h2>
            <form onSubmit={handleSubmitPago}>
              <div className="form-group metodo-pago">
                <label>Selecciona tu método de pago</label>
                <div className="metodos-pago-options">
                  <div className="metodo-pago-option">
                    <input
                      type="radio"
                      id="tarjeta"
                      name="metodoPago"
                      value="tarjeta"
                      checked={formData.metodoPago === "tarjeta"}
                      onChange={handleChange}
                    />
                    <label htmlFor="tarjeta">
                      <i className="fas fa-credit-card"></i> Tarjeta de crédito/débito
                    </label>
                  </div>
                  <div className="metodo-pago-option">
                    <input
                      type="radio"
                      id="paypal"
                      name="metodoPago"
                      value="paypal"
                      checked={formData.metodoPago === "paypal"}
                      onChange={handleChange}
                    />
                    <label htmlFor="paypal">
                      <i className="fab fa-paypal"></i> PayPal
                    </label>
                  </div>
                  <div className="metodo-pago-option">
                    <input
                      type="radio"
                      id="efectivo"
                      name="metodoPago"
                      value="efectivo"
                      checked={formData.metodoPago === "efectivo"}
                      onChange={handleChange}
                    />
                    <label htmlFor="efectivo">
                      <i className="fas fa-money-bill-wave"></i> Pago en efectivo
                    </label>
                  </div>
                </div>
              </div>
              
              {formData.metodoPago === "tarjeta" && (
                <>
                  <div className="form-group">
                    <label htmlFor="numeroTarjeta">Número de tarjeta</label>
                    <input
                      type="text"
                      id="numeroTarjeta"
                      name="numeroTarjeta"
                      value={formData.numeroTarjeta}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fechaExpiracion">Fecha de expiración</label>
                      <input
                        type="text"
                        id="fechaExpiracion"
                        name="fechaExpiracion"
                        value={formData.fechaExpiracion}
                        onChange={handleChange}
                        placeholder="MM/AA"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cvv">CVV</label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="checkout-actions">
                <button type="button" onClick={() => setStep(1)}>Volver</button>
                <button type="submit" className="btn-continuar">Confirmar pedido</button>
              </div>
            </form>
          </div>
        )}
        
        {step === 3 && (
          <div className="checkout-confirmacion">
            <div className="confirmacion-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>¡Pedido Confirmado!</h2>
            <p>Gracias por tu compra. Hemos recibido tu pedido y está siendo procesado.</p>
            <p>Te enviaremos un correo electrónico con los detalles de tu pedido y el número de seguimiento.</p>
            
            <div className="detalles-pedido">
              <h3>Resumen del pedido</h3>
              <div className="detalles-pedido-info">
                <div className="detalles-info-grupo">
                  <h4>Dirección de envío</h4>
                  <p>{formData.nombre} {formData.apellidos}</p>
                  <p>{formData.direccion}</p>
                  <p>{formData.ciudad}, {formData.codigoPostal}</p>
                  <p>Tel: {formData.telefono}</p>
                </div>
                <div className="detalles-info-grupo">
                  <h4>Método de pago</h4>
                  <p>
                    {formData.metodoPago === "tarjeta" && "Tarjeta de crédito/débito"}
                    {formData.metodoPago === "paypal" && "PayPal"}
                    {formData.metodoPago === "efectivo" && "Pago en efectivo"}
                  </p>
                  {formData.metodoPago === "tarjeta" && (
                    <p>Tarjeta terminada en {formData.numeroTarjeta.slice(-4)}</p>
                  )}
                </div>
              </div>
            </div>
            
            <button onClick={handleFinalizarCompra} className="btn-finalizar">
              Ver mis pedidos
            </button>
          </div>
        )}
      </div>
      
      <div className="checkout-resumen">
        <h3>Resumen del Pedido</h3>
        <div className="resumen-items">
          {cartItems.map(item => (
            <div key={item.id} className="resumen-item">
              <div className="resumen-item-info">
                <img src={item.imagen} alt={item.nombre} />
                <div>
                  <p className="item-nombre">{item.nombre}</p>
                  <p className="item-cantidad">Cantidad: {item.quantity}</p>
                </div>
              </div>
              <p className="item-precio">${(item.precio * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="resumen-totales">
          <div className="resumen-linea">
            <span>Subtotal</span>
            <span>${getTotal().toFixed(2)}</span>
          </div>
          <div className="resumen-linea">
            <span>Envío</span>
            <span>Gratis</span>
          </div>
          {getTotal() < 30 && (
            <div className="resumen-linea">
              <span>Cargo por pedido mínimo</span>
              <span>$2.00</span>
            </div>
          )}
          <div className="resumen-linea total">
            <span>Total</span>
            <span>${(getTotal() < 30 ? getTotal() + 2 : getTotal()).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;