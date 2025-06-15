import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_ARMAZENAMENTO = '@diario-de-leituras:desejos';

export async function obterItensDaListaDesejos() {
  try {
    const dadosArmazenados = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
    return dadosArmazenados ? JSON.parse(dadosArmazenados) : [];
  } catch (erro) {
    console.error('Erro ao buscar a lista de desejos', erro);
    return [];
  }
}

export async function adicionarItemNaListaDesejos(item) {
  try {
    const itensExistentes = await obterItensDaListaDesejos();
    const jaAdicionado = itensExistentes.some(itemExistente => itemExistente.id === item.id);
    if (jaAdicionado) {
      console.log('Item já está na lista de desejos.');
      return; 
    }
    const itensAtualizados = [...itensExistentes, item];
    await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(itensAtualizados));
  } catch (erro) {
    console.error('Erro ao adicionar à lista de desejos', erro);
  }
}

export async function atualizarItemDaListaDesejos(itemAtualizado) {
  try {
    const itensExistentes = await obterItensDaListaDesejos();
    const novaLista = itensExistentes.map(item =>
      item.id === itemAtualizado.id ? itemAtualizado : item
    );
    await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(novaLista));
  } catch (erro) {
    console.error('Erro ao atualizar item na lista de desejos', erro);
  }
}

export async function removerItemDaListaDesejos(id) {
  try {
    const itensExistentes = await obterItensDaListaDesejos();
    const itensAtualizados = itensExistentes.filter(item => item.id !== id);
    await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(itensAtualizados));
  } catch (erro) {
    console.error('Erro ao remover da lista de desejos', erro);
  }
}