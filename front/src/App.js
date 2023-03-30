import { useEffect, useState } from 'react';
import './App.css';
import Formulario from './Formulario';
import Tabela from './Tabela';

function App() {

  // Objeto produto
  const produto = {
    codigo: 0,
    nome: '',
    marca: ''
  }

  //useState
  const [btnCadastrar, setBtnCadastrar] = useState(true);
  const [produtos, setProdutos] = useState([]);
  const [objProduto, setObjProduto] = useState(produto);

  //useEffect
  useEffect(() => {
    fetch("http://localhost:8080/listar")
    .then(retorno => retorno.json())
    .then(retorno_convertido => setProdutos(retorno_convertido));
  }, []);

  //OBTENDO OS DADOS DO FORMULARIO
  const aoDigitar = (e) => {
    setObjProduto({...objProduto, [e.target.name]: e.target.value});
  }

  //CADASTRAR PRODUTO
  const cadastrar = () => {
    fetch('http://localhost:8080/cadastrar', {
      method:'post',
      body:JSON.stringify(objProduto),
      headers:{
        'Content-type':'application/json',
        'Accept':'application/json'
      }
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido => {
      if(retorno_convertido.mensagem !== undefined){
        alert(retorno_convertido.mensagem);
      }
      else{
        setProdutos([...produtos, retorno_convertido])
        alert('Produto cadastrado com sucesso!');
        limparFormulario();
      }
    })
  }

  //ALTERAR PRODUTO
  const alterar = () => {
    fetch('http://localhost:8080/alterar', {
      method:'put',
      body:JSON.stringify(objProduto),
      headers:{
        'Content-type':'application/json',
        'Accept':'application/json'
      }
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido => {
      if(retorno_convertido.mensagem !== undefined){
        alert(retorno_convertido.mensagem);
      }
      else{
        //mensagem
        alert('Produto alterado com sucesso!');

        //COPIA DO VETOR DE PRODUTOS

        let vetorTemp = [...produtos];

        //INDICE
        let indice = vetorTemp.findIndex((p) => {
          return p.codigo === objProduto.codigo;
        });
        //alterar produto do vetor temp
        vetorTemp[indice] = objProduto;

        //ATUALIZAR O VETOR DE PRODUTOS
        setProdutos(vetorTemp);

        limparFormulario();
      }
    })
  }


  //REMOVER PRODUTO
  const remover = () => {
    fetch('http://localhost:8080/remover/'+objProduto.codigo, {
      method:'delete',
      headers:{
        'Content-type':'application/json',
        'Accept':'application/json'
      }
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido => {
      
      // MENSAGEM
      alert(retorno_convertido.mensagem);

      //COPIA DO VETOR DE PRODUTOS

      let vetorTemp = [...produtos];

      //INDICE
      let indice = vetorTemp.findIndex((p) => {
        return p.codigo === objProduto.codigo;
      });
      //remover produto do vetor temp
      vetorTemp.splice(indice, 1);

      //ATUALIZAR O VETOR DE PRODUTOS
      setProdutos(vetorTemp);

      //LIMPAR FORMULARIO
      limparFormulario();

    })
  }

  //LIMPAR FOMULARIO
  const limparFormulario = () => {
    setObjProduto(produto);
    setBtnCadastrar(true);
  }

  //SELECIONAR PRODUTO
  const selecionarProduto = (indice) => {
    setObjProduto(produtos[indice]);
    setBtnCadastrar(false);
  }

  //retorno
  return (
    <div>
      <Formulario botao={btnCadastrar} eventoTeclado={aoDigitar} cadastrar={cadastrar} obj={objProduto} selecionar={selecionarProduto} cancelar={limparFormulario} remover={remover} alterar={alterar}></Formulario>
      <Tabela vetor={produtos} selecionar={selecionarProduto}/>
    </div>
  );
}

export default App;
