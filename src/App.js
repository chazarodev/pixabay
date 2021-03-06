import React, {useState, useEffect} from 'react';
import Formulario from './components/Formulario.jsx';
import ListadoImagenes from './components/ListadoImagenes.jsx';


function App() {

  //state de la app
  const [busqueda, guardarBusqueda] = useState('');
  const [imagenes, guardarImagenes] = useState([]);
  const [paginaactual, guardarPaginaActual] = useState(1);
  const [totalPaginas, guardarTotalPaginas] = useState(1);

  useEffect(() => {
    const consultarAPI = async () => {
      if(busqueda === '') return;

      const imagenesPorPagina = 30;
      const key = '21259195-98bbf806073cacf06146e5678';
      const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imagenesPorPagina}&page=${paginaactual}`;
      
      const respuesta = await fetch(url);
      const resultado = await respuesta.json();

      guardarImagenes(resultado.hits);

      //Calcular el total de páginaa
      const calcularTotalPaginas = Math.ceil(resultado.totalHits / imagenesPorPagina);
      guardarTotalPaginas(calcularTotalPaginas);

      //Mover la pantalla hacia arriba
      const jumbotron = document.querySelector('.jumbotron');
      jumbotron.scrollIntoView({behavior: 'smooth'});

    }
    consultarAPI();
  }, [busqueda, paginaactual]);

  //Definir la página anterior
  const paginaAnterior = () => {
    const nuevaPaginaActual = paginaactual - 1;

    if(nuevaPaginaActual === 0) return;

    guardarPaginaActual(nuevaPaginaActual);
  }
  
  //Definir la página Siguiente
  const paginaSiguiente = () => {
    const nuevaPaginaActual = paginaactual + 1;

    if(nuevaPaginaActual > totalPaginas) return;
  
    guardarPaginaActual(nuevaPaginaActual);
  }

  return (
    <div className="container">
      <div className="jumbotron">
        <p className="lead text-center">Buscador de imagenes</p>
        <Formulario 
          guardarBusqueda={guardarBusqueda}
        />
      </div>
      <div className="row justify-content-center">
        <ListadoImagenes 
          imagenes={imagenes}
        />
        {(paginaactual === 1) ? null : (
          <button 
            type="button"
            className="btn btn-info mr-1 mb-2"
            onClick={paginaAnterior}
          >&laquo; Anterior</button>
        )}
        {(paginaactual === totalPaginas) ? null : (
          <button 
            type="button"
            className="btn btn-info mb-2"
            onClick={paginaSiguiente}
          >Siguiente &raquo;</button>
        )}
      </div>
    </div>
  );
}

export default App;
