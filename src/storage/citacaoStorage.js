import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_ARMAZENAMENTO = '@diario-de-leituras:citacoes';

export async function obterCitacoesDoLivro(bookId) {
  try {
    const todasCitacoesJson = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
    const todasCitacoes = todasCitacoesJson ? JSON.parse(todasCitacoesJson) : [];

    return todasCitacoes.filter(citacao => citacao.bookId === bookId);
  } catch (erro) {
    console.error('Erro ao buscar as citações', erro);
    return [];
  }
}

export async function salvarCitacao(citacao) {
  try {
    const todasCitacoesJson = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
    const todasCitacoes = todasCitacoesJson ? JSON.parse(todasCitacoesJson) : [];
    const citacoesAtualizadas = [...todasCitacoes, citacao];
    await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(citacoesAtualizadas));
  } catch (erro) {
    console.error('Erro ao salvar a citação', erro);
  }
}

export async function atualizarCitacao(citacaoAtualizada) {
  try {
    const todasCitacoesJson = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
    const todasCitacoes = todasCitacoesJson ? JSON.parse(todasCitacoesJson) : [];
    const novaListaDeCitacoes = todasCitacoes.map(citacao =>
      citacao.id === citacaoAtualizada.id ? citacaoAtualizada : citacao
    );
    await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(novaListaDeCitacoes));
  } catch (erro) {
    console.error('Erro ao atualizar a citação', erro);
  }
}

export async function excluirCitacao(id) {
  try {
    const todasCitacoesJson = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
    const todasCitacoes = todasCitacoesJson ? JSON.parse(todasCitacoesJson) : [];
    const novaListaDeCitacoes = todasCitacoes.filter(citacao => citacao.id !== id);
    await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(novaListaDeCitacoes));
  } catch (erro) {
    console.error('Erro ao excluir a citação', erro);
  }
}