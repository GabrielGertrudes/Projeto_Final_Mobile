import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_ARMAZENAMENTO = '@diario-de-leituras:livros';

export async function obterTodosLivros() {
  try {
    const dadosArmazenados = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
    return dadosArmazenados ? JSON.parse(dadosArmazenados) : [];
  } catch (erro) {
    console.error('Erro ao buscar os livros', erro);
    return [];
  }
}

export async function salvarLivro(livro) {
  try {
    const livrosExistentes = await obterTodosLivros();
    const livrosAtualizados = [...livrosExistentes, livro];
    await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(livrosAtualizados));
  } catch (erro) {
    console.error('Erro ao salvar o livro', erro);
  }
}

export async function atualizarLivro(livroAtualizado) {
  try {
    const livrosExistentes = await obterTodosLivros();
    const novaListaDeLivros = livrosExistentes.map(livro =>
      livro.id === livroAtualizado.id ? livroAtualizado : livro
    );
    await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(novaListaDeLivros));
  } catch (erro) {
    console.error('Erro ao atualizar o livro', erro);
  }
}

export async function excluirLivro(id) {
  try {
    const livrosExistentes = await obterTodosLivros();
    const novaListaDeLivros = livrosExistentes.filter(livro => livro.id !== id);
    await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(novaListaDeLivros));
  } catch (erro) {
    console.error('Erro ao excluir o livro', erro);
  }
}
