// __tests__/ListaProductos.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import ListaProductos from '../components/ListaProductos';
import { BrowserRouter } from 'react-router-dom';

const mockProducts = [
  {
    id: 1,
    nombre: "Manzanas Fuji",
    precio: 2.99,
    imagen: "https://example.com/manzanas.jpg",
    categoria: "frutas"
  }
];

const mockAgregarAlCarrito = jest.fn();

describe('ListaProductos Component', () => {
  test('renderiza la lista de productos correctamente', () => {
    render(
      <BrowserRouter>
        <ListaProductos productos={mockProducts} agregarAlCarrito={mockAgregarAlCarrito} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Manzanas Fuji')).toBeInTheDocument();
    expect(screen.getByText('$2.99')).toBeInTheDocument();
  });

  test('llama a agregarAlCarrito cuando se hace clic en el botón Añadir', () => {
    render(
      <BrowserRouter>
        <ListaProductos productos={mockProducts} agregarAlCarrito={mockAgregarAlCarrito} />
      </BrowserRouter>
    );
    
    // Simular hover sobre el producto para que aparezca el botón
    fireEvent.mouseEnter(screen.getByAltText('Manzanas Fuji'));
    
    // Encontrar y hacer clic en el botón de añadir al carrito
    const addButton = screen.getByText('Añadir');
    fireEvent.click(addButton);
    
    expect(mockAgregarAlCarrito).toHaveBeenCalledWith(mockProducts[0]);
  });
});