import React, { useState, useCallback } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { List, Text, IconButton, Button, useTheme } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  obterItensDaListaDesejos,
  removerItemDaListaDesejos,
} from "../../storage/desejosStorage";

export default function TelaDesejos() {
  const navigation = useNavigation();
  const theme = useTheme();
  const [wishlist, setWishlist] = useState([]);

  const loadWishlist = async () => {
    setWishlist(await obterItensDaListaDesejos());
  };

  useFocusEffect(
    useCallback(() => {
      loadWishlist();
    }, [])
  );

  const handleRemove = (id) => {
    Alert.alert(
      "Remover",
      "Deseja remover este livro da sua lista de desejos?",
      [
        { text: "Cancelar" },
        {
          text: "Sim",
          onPress: async () => {
            await removerItemDaListaDesejos(id);
            loadWishlist();
          },
        },
      ]
    );
  };

  const handleMarkAsRead = (item) => {
    removerItemDaListaDesejos(item.id);

    navigation.navigate("TelaAdicionarLivro", {
      title: item.title,
      author: item.author,
    });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          wishlist.length === 0 ? styles.emptyList : { paddingTop: 8 }
        }
        renderItem={({ item }) => (
          <List.Item
            title={item.title}
            description={item.author}
            titleStyle={styles.itemTitle}
            style={styles.listItem}
            left={(props) => (
              <List.Icon {...props} icon="heart" color={theme.colors.primary} />
            )}
            right={() => (
              <View style={styles.actionsContainer}>
                <Button
                  mode="contained-tonal"
                  onPress={() => handleMarkAsRead(item)}
                  labelStyle={{ fontSize: 12 }}
                  style={{ marginRight: 8 }}
                >
                  Já li!
                </Button>
                <IconButton
                  icon="delete-outline"
                  iconColor={theme.colors.error}
                  size={22}
                  onPress={() => handleRemove(item.id)}
                />
              </View>
            )}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text
              variant="headlineSmall"
              style={{ fontFamily: "Lora-Regular" }}
            >
              Sua lista está vazia.
            </Text>
            <Text
              variant="bodyMedium"
              style={{ textAlign: "center", marginTop: 8 }}
            >
              Adicione livros à sua lista de desejos através da busca online.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyList: {
    flex: 1,
  },
  listItem: {
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 2,
  },
  itemTitle: {
    fontFamily: "Lora-Regular",
    fontWeight: "bold",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
