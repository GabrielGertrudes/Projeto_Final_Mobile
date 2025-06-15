import React, { useState, useCallback } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import {
  Appbar,
  FAB,
  List,
  IconButton,
  Text,
  Chip,
  useTheme,
} from "react-native-paper";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { obterCitacoesDoLivro, excluirCitacao } from "../../storage/citacaoStorage";

export default function TelaCitacoes() {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  const { bookId, bookTitle } = route.params;
  const [quotes, setQuotes] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadQuotes = async () => {
        if (bookId) {
          setQuotes(await obterCitacoesDoLivro(bookId));
        }
      };
      loadQuotes();
    }, [bookId])
  );

  const handleDelete = (id) => {
    Alert.alert("Confirmar Exclusão", "Deseja excluir esta citação?", [
      { text: "Cancelar" },
      {
        text: "Sim",
        onPress: async () => {
          await excluirCitacao(id);
          const updatedQuotes = await obterCitacoesDoLivro(bookId);
          setQuotes(updatedQuotes);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={`Citações de "${bookTitle}"`} />
      </Appbar.Header>
      <FlatList
        data={quotes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.quoteText}>"{item.texto}"</Text>
            <Text style={styles.detailsText}>
              {item.personagem && `${item.personagem}, `}
              {item.capitulo && `Cap. ${item.capitulo}, `}
              {item.pagina && `Pág. ${item.pagina}`}
            </Text>
            <View style={styles.footer}>
              {item.sentimento && (
                <Chip icon="heart" style={styles.chip}>
                  {item.sentimento}
                </Chip>
              )}
              <View style={styles.actions}>
                <IconButton
                  icon="pencil-outline"
                  size={20}
                  onPress={() =>
                    navigation.navigate("TelaEditarCitacao", {
                      quoteId: item.id,
                    })
                  }
                />
                <IconButton
                  icon="delete-outline"
                  iconColor={theme.colors.error}
                  size={20}
                  onPress={() => handleDelete(item.id)}
                />
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text variant="headlineSmall">Nenhuma citação.</Text>
            <Text>Adicione a sua primeira frase favorita!</Text>
          </View>
        }
      />
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() =>
          navigation.navigate("TelaAdicionarCitacao", { bookId: bookId })
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0" },
  listContainer: { padding: 8, paddingBottom: 80 },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 8,
    elevation: 2,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: "italic",
    lineHeight: 22,
  },
  detailsText: {
    fontSize: 14,
    color: "#555",
    marginTop: 12,
    textAlign: "right",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  chip: {
    backgroundColor: "#e0e0e0",
  },
  actions: {
    flexDirection: "row",
  },
  fab: { position: "absolute", margin: 16, right: 0, bottom: 0 },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
});
