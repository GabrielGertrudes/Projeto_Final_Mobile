import React, { useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { Button, TextInput, Menu, Divider } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { salvarCitacao } from "../../storage/citacaoStorage";

export default function TelaAdicionarCitacao() {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookId } = route.params;

  const [texto, setTexto] = useState("");
  const [pagina, setPagina] = useState("");
  const [capitulo, setCapitulo] = useState("");
  const [personagem, setPersonagem] = useState("");
  const [sentimento, setSentimento] = useState("");

  const [menuVisivel, setMenuVisivel] = useState(false);
  const abrirMenu = () => setMenuVisivel(true);
  const fecharMenu = () => setMenuVisivel(false);

  const selecionarSentimento = (sentimentoSelecionado) => {
    setSentimento(sentimentoSelecionado);
    fecharMenu();
  };

  const handleSave = async () => {
    if (!texto) {
      Alert.alert("Erro", "O texto da citação é obrigatório.");
      return;
    }
    const newQuote = {
      id: Date.now().toString(),
      bookId,
      texto,
      pagina,
      capitulo,
      personagem,
      sentimento,
    };
    await salvarCitacao(newQuote);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.formContainer}>
          <TextInput
            label="Texto da Citação"
            value={texto}
            onChangeText={setTexto}
            multiline
            numberOfLines={5}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Página"
            value={pagina}
            onChangeText={setPagina}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Capítulo (opcional)"
            value={capitulo}
            onChangeText={setCapitulo}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Personagem (opcional)"
            value={personagem}
            onChangeText={setPersonagem}
            mode="outlined"
            style={styles.input}
          />

          <Menu
            visible={menuVisivel}
            onDismiss={fecharMenu}
            anchor={
              <Button
                mode="outlined"
                onPress={abrirMenu}
                style={styles.input}
                contentStyle={styles.menuButtonContent}
              >
                {sentimento || "Selecione um Sentimento"}
              </Button>
            }
          >
            <Menu.Item
              onPress={() => selecionarSentimento("Inspirador")}
              title="Inspirador"
            />
            <Menu.Item
              onPress={() => selecionarSentimento("Reflexivo")}
              title="Reflexivo"
            />
            <Menu.Item
              onPress={() => selecionarSentimento("Engraçado")}
              title="Engraçado"
            />
            <Menu.Item
              onPress={() => selecionarSentimento("Nostálgico")}
              title="Nostálgico"
            />
            <Menu.Item
              onPress={() => selecionarSentimento("Impactante")}
              title="Impactante"
            />
            <Menu.Item
              onPress={() => selecionarSentimento("Poético")}
              title="Poético"
            />
            <Menu.Item
              onPress={() => selecionarSentimento("Triste")}
              title="Triste"
            />
            <Divider />
            <Menu.Item
              onPress={() => selecionarSentimento("")}
              title="Nenhum"
            />
          </Menu>

          <Button mode="contained" onPress={handleSave} style={styles.button}>
            Salvar Citação
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  formContainer: { padding: 20 },
  input: { marginBottom: 16 },
  menuButtonContent: {
    height: 50,
    justifyContent: "center",
  },
  button: { marginTop: 8, paddingTop: 8, paddingBottom: 8 },
});
