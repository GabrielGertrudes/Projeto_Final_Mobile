import React, { useState, useCallback } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { FAB, List, Text, IconButton, useTheme } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { obterTodosAutores, excluirAutor } from "../../storage/autorStorage";

export default function TelaAutores() {
  const navegacao = useNavigation();
  const tema = useTheme();
  const [autores, setAutores] = useState([]);

  const carregarAutores = async () => {
    setAutores(await obterTodosAutores());
  };

  useFocusEffect(
    useCallback(() => {
      carregarAutores();
    }, [])
  );

  const lidarComExclusao = (id) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Deseja excluir este autor? Isso não afetará os livros já cadastrados.",
      [
        { text: "Cancelar" },
        {
          text: "Sim",
          onPress: async () => {
            await excluirAutor(id);
            carregarAutores();
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View
      style={[estilos.container, { backgroundColor: tema.colors.background }]}
    >
      <FlatList
        data={autores}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <List.Item
            title={item.nome}
            description={`${item.nacionalidade || "N/A"} - ${
              item.generoPrincipal || "Não especificado"
            }`}
            titleStyle={estilos.tituloItem}
            style={estilos.itemDaLista}
            left={(props) => (
              <List.Icon
                {...props}
                icon="account-edit"
                color={tema.colors.primary}
              />
            )}
            right={() => (
              <View style={estilos.containerAcoes}>
                <IconButton
                  icon="pencil-outline"
                  size={22}
                  onPress={() =>
                    navegacao.navigate("TelaEditarAutor", {
                      authorId: item.id,
                    })
                  }
                />
                <IconButton
                  icon="delete-outline"
                  iconColor={tema.colors.error}
                  size={22}
                  onPress={() => lidarComExclusao(item.id)}
                />
              </View>
            )}
          />
        )}
        ListEmptyComponent={
          <View style={estilos.containerVazio}>
            <Text
              variant="headlineSmall"
              style={{ fontFamily: "Lora-Regular" }}
            >
              Nenhum autor cadastrado.
            </Text>
            <Text variant="bodyMedium">Adicione autores usando o botão +</Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={[estilos.fab, { backgroundColor: tema.colors.primary }]}
        onPress={() => navegacao.navigate("TelaAdicionarAutor")}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1 },
  fab: { position: "absolute", margin: 16, right: 0, bottom: 0 },
  containerVazio: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemDaLista: {
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 2,
  },
  tituloItem: {
    fontFamily: "Lora-Regular",
    fontWeight: "bold",
  },
  containerAcoes: {
    flexDirection: "row",
  },
});
