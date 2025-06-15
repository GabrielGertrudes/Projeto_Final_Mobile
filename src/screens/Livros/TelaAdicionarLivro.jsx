import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Text as RNText,
  Image,
  FlatList,
} from "react-native";
import {
  TextInput,
  Button,
  IconButton,
  Modal,
  Portal,
  Text,
  List,
  Menu,
  Divider,
  Snackbar,
} from "react-native-paper";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { salvarLivro } from "../../storage/livroStorage";
import { obterTodosAutores, salvarAutor } from "../../storage/autorStorage";
import { MaskedTextInput } from "react-native-mask-text";
import * as ImagePicker from "expo-image-picker";
import { searchBooks } from "../../services/googleBooksApi";
import { adicionarItemNaListaDesejos } from "../../storage/desejosStorage";

export default function TelaAdicionarLivro() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params || {};

  const [titulo, setTitulo] = useState(params.title || "");
  const [autor, setAutor] = useState(params.author || "");
  const [anoPublicacao, setAnoPublicacao] = useState("");
  const [nota, setNota] = useState(0);
  const [description, setDescription] = useState("");
  const [coverImageUri, setCoverImageUri] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [availableAuthors, setAvailableAuthors] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadAuthors = async () => {
        const authors = await obterTodosAutores();
        setAvailableAuthors(authors);
      };
      loadAuthors();
    }, [])
  );

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  const selectAuthor = (selectedAuthor) => {
    setAutor(selectedAuthor.nome);
    closeMenu();
  };

  const pickImageFromGallery = async () => {
    const p = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!p.granted) {
      Alert.alert("Erro", "Permissão necessária!");
      return;
    }
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });
    if (!r.canceled) setCoverImageUri(r.assets[0].uri);
  };
  const takePhotoWithCamera = async () => {
    const p = await ImagePicker.requestCameraPermissionsAsync();
    if (!p.granted) {
      Alert.alert("Erro", "Permissão necessária!");
      return;
    }
    const r = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });
    if (!r.canceled) setCoverImageUri(r.assets[0].uri);
  };
  const selectImage = () =>
    Alert.alert("Selecionar Capa", "Escolha de onde quer adicionar a imagem:", [
      { text: "Tirar Foto...", onPress: takePhotoWithCamera },
      { text: "Escolher da Galeria...", onPress: pickImageFromGallery },
      { text: "Cancelar", style: "cancel" },
    ]);
  const handleSearch = async () => {
    if (!searchQuery) return;
    setIsLoading(true);
    const r = await searchBooks(searchQuery);
    setSearchResults(r);
    setIsLoading(false);
    setIsModalVisible(true);
  };

  const onBookSelect = (book) => {
    const authorName = book.authors ? book.authors[0] : "Autor Desconhecido";
    setTitulo(book.title);
    setAutor(authorName);
    setAnoPublicacao(
      book.publishedDate ? book.publishedDate.substring(0, 4) : ""
    );
    setDescription(book.description);
    setIsModalVisible(false);
  };

  const handleSaveToEstante = async () => {
    if (!titulo || !autor) {
      Alert.alert("Erro", "Título e Autor são obrigatórios.");
      return;
    }

    const allAuthors = await obterTodosAutores();
    const authorExists = allAuthors.some(
      (a) => a.nome.toLowerCase() === autor.toLowerCase()
    );
    if (!authorExists && autor !== "Autor Desconhecido") {
      const newAuthor = {
        id: Date.now().toString() + "_autor",
        nome: autor,
        nacionalidade: "N/A",
        dataNascimento: "",
        generoPrincipal: "",
        biografia: "Adicionado automaticamente via busca",
      };
      await salvarAutor(newAuthor);
      setSnackbarMessage(`Novo autor "${autor}" foi salvo!`);
      setSnackbarVisible(true);
    }

    const newBook = {
      id: Date.now().toString(),
      titulo,
      autor,
      anoPublicacao,
      nota,
      description,
      coverImageUri: coverImageUri || undefined,
    };
    await salvarLivro(newBook);
    navigation.goBack();
  };

  const handleSaveToWishlist = async () => {
    if (!titulo || !autor) {
      Alert.alert("Erro", "Título e Autor são necessários.");
      return;
    }
    const wishlistItem = { id: titulo + autor, title: titulo, author: autor };
    await adicionarItemNaListaDesejos(wishlistItem);
    setSnackbarMessage("Livro salvo na Lista de Desejos!");
    setSnackbarVisible(true);
    setTimeout(() => navigation.goBack(), 1500);
  };
  const StarRating = () => (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((s) => (
        <IconButton
          key={s}
          icon={s <= nota ? "star" : "star-outline"}
          size={32}
          onPress={() => setNota(s)}
        />
      ))}
    </View>
  );
  const handleAddToWishlistFromApi = async (book) => {
    const item = {
      id: book.title + (book.authors ? book.authors[0] : ""),
      title: book.title,
      author: book.authors ? book.authors.join(", ") : "Autor Desconhecido",
    };
    await adicionarItemNaListaDesejos(item);
    setSnackbarMessage("Livro adicionado à Lista de Desejos!");
    setSnackbarVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.searchContainer}>
          <TextInput
            label="Buscar livro online"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ flex: 1 }}
            mode="outlined"
          />
          <Button
            mode="contained"
            onPress={handleSearch}
            loading={isLoading}
            style={styles.searchButton}
          >
            Buscar
          </Button>
        </View>
        <RNText style={styles.divider}>Ou preencha manualmente abaixo</RNText>
        <View style={styles.formContainer}>
          <View style={styles.imagePickerContainer}>
            {coverImageUri ? (
              <Image
                source={{ uri: coverImageUri }}
                style={styles.coverImage}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <IconButton icon="image-plus" size={48} />
                <Text>Capa do Livro</Text>
              </View>
            )}
            <Button
              mode="outlined"
              onPress={selectImage}
              style={{ marginTop: 10 }}
            >
              Escolher Capa
            </Button>
          </View>
          <TextInput
            label="Título"
            value={titulo}
            onChangeText={setTitulo}
            mode="outlined"
            style={styles.input}
          />
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <Button
                mode="outlined"
                onPress={openMenu}
                style={styles.input}
                contentStyle={styles.menuButtonContent}
                labelStyle={{ color: "#000" }}
              >
                {autor || "Selecione um Autor"}
              </Button>
            }
          >
            {availableAuthors.map((auth) => (
              <Menu.Item
                key={auth.id}
                onPress={() => selectAuthor(auth)}
                title={auth.nome}
              />
            ))}
            <Divider />
            <Menu.Item
              onPress={() => {
                closeMenu();
                navigation.navigate("TelaAdicionarAutor");
              }}
              title="Adicionar novo autor..."
            />
          </Menu>
          <MaskedTextInput
            mask="99/99/9999"
            value={anoPublicacao}
            onChangeText={setAnoPublicacao}
            keyboardType="numeric"
            style={[styles.input, styles.maskedInput]}
            placeholder="Ano de Publicação"
          />
          <TextInput
            label="Descrição / Sinopse"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={5}
            style={styles.input}
          />
          <RNText style={styles.ratingLabel}>Nota:</RNText>
          <StarRating />
          <Button
            mode="contained"
            onPress={handleSaveToEstante}
            style={styles.button}
          >
            Salvar na Estante
          </Button>
          <Button
            mode="text"
            onPress={handleSaveToWishlist}
            style={{ marginTop: 8 }}
          >
            Salvar nos Desejos
          </Button>
        </View>
      </ScrollView>
      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <FlatList
            data={searchResults}
            keyExtractor={(item, index) => item.title + index}
            renderItem={({ item }) => (
              <List.Item
                title={item.title}
                titleNumberOfLines={2}
                description={`Por ${
                  item.authors ? item.authors.join(", ") : "N/A"
                }`}
                onPress={() => onBookSelect(item)}
                right={() => (
                  <IconButton
                    icon="heart-plus-outline"
                    onPress={() => handleAddToWishlistFromApi(item)}
                  />
                )}
              />
            )}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", padding: 20 }}>
                Nenhum resultado encontrado.
              </Text>
            }
          />
        </Modal>
      </Portal>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchButton: { marginLeft: 10, alignSelf: "center" },
  divider: {
    textAlign: "center",
    color: "gray",
    marginVertical: 10,
    fontSize: 12,
  },
  formContainer: { padding: 20, paddingTop: 10 },
  input: { marginBottom: 16 },
  maskedInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    padding: 14,
    backgroundColor: "#f6f6f6",
    fontSize: 16,
    height: 56,
    justifyContent: "center",
  },
  button: { marginTop: 16, paddingTop: 8, paddingBottom: 8 },
  ratingLabel: {
    fontSize: 16,
    color: "gray",
    marginBottom: 8,
    textAlign: "center",
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  imagePickerContainer: { alignItems: "center", marginBottom: 20 },
  imagePlaceholder: {
    width: 150,
    height: 200,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "gray",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  coverImage: {
    width: 150,
    height: 200,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 5,
    maxHeight: "80%",
  },
  menuButtonContent: { height: 40, justifyContent: "center" },
});
