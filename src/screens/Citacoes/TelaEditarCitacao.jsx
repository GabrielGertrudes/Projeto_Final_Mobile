import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, TextInput, Menu, Divider } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { atualizarCitacao } from '../../storage/citacaoStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TelaEditarCitacao() {
  const navigation = useNavigation();
  const route = useRoute();
  const { quoteId } = route.params;

  const [quote, setQuote] = useState(null);
  const [texto, setTexto] = useState('');
  const [pagina, setPagina] = useState('');
  const [capitulo, setCapitulo] = useState('');
  const [personagem, setPersonagem] = useState('');
  const [sentimento, setSentimento] = useState('');

  const [menuVisivel, setMenuVisivel] = useState(false);
  const abrirMenu = () => setMenuVisivel(true);
  const fecharMenu = () => setMenuVisivel(false);

  const selecionarSentimento = (sentimentoSelecionado) => {
    setSentimento(sentimentoSelecionado);
    fecharMenu();
  };

  useEffect(() => {
    const carregarCitacao = async () => {
      const todasAsCitacoes = await AsyncStorage.getItem('@diario-de-leituras:quotes').then(j => j ? JSON.parse(j) : []);
      const citacaoAtual = todasAsCitacoes.find((q) => q.id === quoteId);
      if(citacaoAtual) {
        setQuote(citacaoAtual);
        setTexto(citacaoAtual.texto);
        setPagina(citacaoAtual.pagina || '');
        setCapitulo(citacaoAtual.capitulo || '');
        setPersonagem(citacaoAtual.personagem || '');
        setSentimento(citacaoAtual.sentimento || '');
      }
    };
    if (quoteId) {
      carregarCitacao();
    }
  }, [quoteId]);

  const handleUpdate = async () => {
    if (!texto) { Alert.alert("Erro", "O texto da citação é obrigatório."); return; }
    if (quote) {
      const citacaoAtualizada = { ...quote, texto, pagina, capitulo, personagem, sentimento };
      await atualizarCitacao(citacaoAtualizada);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.formContainer}>
          <TextInput label="Texto da Citação" value={texto} onChangeText={setTexto} multiline numberOfLines={5} mode="outlined" style={styles.input} />
          <TextInput label="Página" value={pagina} onChangeText={setPagina} keyboardType="numeric" mode="outlined" style={styles.input} />
          <TextInput label="Capítulo (opcional)" value={capitulo} onChangeText={setCapitulo} mode="outlined" style={styles.input} />
          <TextInput label="Personagem (opcional)" value={personagem} onChangeText={setPersonagem} mode="outlined" style={styles.input} />

          <Menu
            visible={menuVisivel}
            onDismiss={fecharMenu}
            anchor={
              <Button mode="outlined" onPress={abrirMenu} style={styles.input} contentStyle={styles.menuButtonContent}>
                {sentimento || "Selecione um Sentimento"}
              </Button>
            }
          >
            <Menu.Item onPress={() => selecionarSentimento('Inspirador')} title="Inspirador" />
            <Menu.Item onPress={() => selecionarSentimento('Reflexivo')} title="Reflexivo" />
            <Menu.Item onPress={() => selecionarSentimento('Engraçado')} title="Engraçado" />
            <Menu.Item onPress={() => selecionarSentimento('Nostálgico')} title="Nostálgico" />
            <Menu.Item onPress={() => selecionarSentimento('Impactante')} title="Impactante" />
            <Menu.Item onPress={() => selecionarSentimento('Poético')} title="Poético" />
            <Menu.Item onPress={() => selecionarSentimento('Triste')} title="Triste" />
            <Divider />
            <Menu.Item onPress={() => selecionarSentimento('')} title="Nenhum" />
          </Menu>

          <Button mode="contained" onPress={handleUpdate} style={styles.button}>
            Salvar Alterações
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  formContainer: { padding: 20 },
  input: { marginBottom: 16 },
  menuButtonContent: { height: 50, justifyContent: 'center' },
  button: { marginTop: 8, paddingTop: 8, paddingBottom: 8 },
});
