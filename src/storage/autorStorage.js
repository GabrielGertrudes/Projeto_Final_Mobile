import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_ARMAZENAMENTO = '@diario-de-leituras:autores';

export async function obterTodosAutores() {
  try {
    const dadosArmazenados = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
    return dadosArmazenados ? JSON.parse(dadosArmazenados) : [];
  } catch (erro) {
    console.error('Erro ao buscar os autores', erro);
    return [];
  }
}

export async function salvarAutor(autor) {
  try {
    const autoresExistentes = await obterTodosAutores();
    const autoresAtualizados = [...autoresExistentes, autor];
    await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(autoresAtualizados));
  } catch (erro) {
    console.error('Erro ao salvar o autor', erro);
  }
}

export async function atualizarAutor(autorAtualizado) {
  try {
    const autoresExistentes = await obterTodosAutores();
    const novaListaDeAutores = autoresExistentes.map(autor =>
      autor.id === autorAtualizado.id ? autorAtualizado : autor
    );
    await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(novaListaDeAutores));
  } catch (erro) { 
    console.error('Erro ao atualizar o autor', erro); 
  }
} 

export async function excluirAutor(id) {
  try {
    const autoresExistentes = await obterTodosAutores();
    const novaListaDeAutores = autoresExistentes.filter(autor => autor.id !== id);
    await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(novaListaDeAutores));
  } catch (erro) {
    console.error('Erro ao excluir o autor', erro);
  }
}
