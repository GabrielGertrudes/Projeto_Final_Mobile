import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Text as RNText,
  Image,
} from "react-native";
import {
  TextInput,
  Button,
  IconButton,
  Text,
  Menu,
  Divider,
} from "react-native-paper";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { obterTodosLivros, atualizarLivro } from "../../storage/livroStorage";
import { obterTodosAutores } from "../../storage/autorStorage";
import { MaskedTextInput } from "react-native-mask-text";
import * as ImagePicker from "expo-image-picker";

export default function TelaEditarLivro() {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookId } = route.params;

  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [anoPublicacao, setAnoPublicacao] = useState("");
  const [nota, setNota] = useState(0);
  const [description, setDescription] = useState("");
  const [coverImageUri, setCoverImageUri] = useState(null);

  const [availableAuthors, setAvailableAuthors] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const allAuthors = await obterTodosAutores();
        setAvailableAuthors(allAuthors);

        const allBooks = await obterTodosLivros();
        const currentBook = allBooks.find((b) => b.id === bookId);
        if (currentBook) {
          setTitulo(currentBook.titulo);
          setAutor(currentBook.autor);
          setAnoPublicacao(currentBook.anoPublicacao);
          setNota(currentBook.nota);
          setDescription(currentBook.description || "");
          setCoverImageUri(currentBook.coverImageUri || null);
        }
      };
      if (bookId) {
        loadData();
      }
    }, [bookId])
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

  const handleUpdate = async () => {
    if (!titulo || !autor) {
      Alert.alert("Erro", "Título e Autor são obrigatórios.");
      return;
    }
    const updatedBook = {
      id: bookId,
      titulo,
      autor,
      anoPublicacao,
      nota,
      description,
      coverImageUri: coverImageUri || undefined,
    };
    await atualizarLivro(updatedBook);
    navigation.goBack();
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

  return (
    <View style={styles.container}>
      <ScrollView>
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
              Alterar Capa
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
                contentStyle={{ height: 40 }}
                labelStyle={{ fontSize: 16 }}
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
            mask="9999"
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
          <Button mode="contained" onPress={handleUpdate} style={styles.button}>
            Salvar Alterações
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
});
