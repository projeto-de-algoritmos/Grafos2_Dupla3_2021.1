import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Shortest Path</h1>
      <p style={{ width: '30%', minWidth: '300px', marginBottom: '5rem' }}>
        O propósito da aplicação é demonstrar visualmente a atuação do algoritmo de 
        Dijkstra num grafo direcionado com arestas ponderadas. O usuário pode escolher
        a origem e o destino do caminho e após um duplo clique no fundo branco do 
        container o programa irá destacar o trajeto mais otimizado dentre os possíveis.
      </p>
    </div>
  );
}

export default App;
