import React, { useState, useCallback } from "react";
import { View, StyleSheet, FlatList, Alert, Image } from "react-native";
import { FAB, List, Text, Button, useTheme } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { obterTodosLivros, excluirLivro } from "../../storage/livroStorage";

export default function TelaEstante() {
  const navigation = useNavigation();
  const theme = useTheme();
  const [books, setBooks] = useState([]);

  const loadBooks = async () => setBooks(await obterTodosLivros());

  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [])
  );

  const handleDelete = (id) =>
    Alert.alert("Confirmar Exclusão", "Deseja excluir este livro?", [
      { text: "Cancelar" },
      {
        text: "Sim",
        onPress: async () => {
          await excluirLivro(id);
          loadBooks();
        },
        style: "destructive",
      },
    ]);

  const renderStars = (nota) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <List.Icon
          key={i}
          icon={i <= nota ? "star" : "star-outline"}
          color="#FFC107"
        />
      );
    }
    return <View style={{ flexDirection: "row" }}>{stars}</View>;
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <List.Section style={styles.listSection}>
            <List.Accordion
              title={item.titulo}
              description={item.autor}
              titleStyle={styles.accordionTitle}
              descriptionStyle={styles.accordionDescription}
              style={{ backgroundColor: theme.colors.surface }}
              left={(props) =>
                item.coverImageUri ? (
                  <Image
                    source={{ uri: item.coverImageUri }}
                    style={styles.listImage}
                  />
                ) : (
                  <List.Icon
                    {...props}
                    icon="book-open-variant"
                    color={theme.colors.primary}
                  />
                )
              }
            >
              <List.Item
                title="Descrição"
                description={item.description}
                descriptionNumberOfLines={10}
                descriptionStyle={{ textAlign: "justify" }}
              />
              <List.Item
                title={`Ano: ${item.anoPublicacao}`}
                left={(props) => <List.Icon {...props} icon="calendar" />}
              />
              <List.Item
                title="Nota"
                left={(props) => <List.Icon {...props} icon="poll" />}
                right={() => renderStars(item.nota)}
              />
              <View style={styles.actionsContainer}>
                <Button
                  onPress={() =>
                    navigation.navigate("TelaEditarLivro", { bookId: item.id })
                  }
                >
                  Editar
                </Button>
                <Button
                  icon="comment-quote"
                  onPress={() =>
                    navigation.navigate("TelaCitacoes", {
                      bookId: item.id,
                      bookTitle: item.titulo,
                    })
                  }
                >
                  Citações
                </Button>
                <Button
                  onPress={() => handleDelete(item.id)}
                  textColor={theme.colors.error}
                >
                  Excluir
                </Button>
              </View>
            </List.Accordion>
          </List.Section>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text
              variant="headlineSmall"
              style={{ fontFamily: "Lora-Regular" }}
            >
              Nenhum livro na estante.
            </Text>
            <Text variant="bodyMedium">Adicione um livro usando o botão +</Text>
          </View>
        }
      />
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate("TelaAdicionarLivro")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listSection: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  accordionTitle: {
    fontFamily: "Lora-Regular",
    fontSize: 18,
    fontWeight: "bold",
  },
  accordionDescription: { fontFamily: "Lora-Regular", fontSize: 14 },
  fab: { position: "absolute", margin: 16, right: 0, bottom: 0 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  listImage: {
    width: 50,
    height: 75,
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 4,
  },
});
