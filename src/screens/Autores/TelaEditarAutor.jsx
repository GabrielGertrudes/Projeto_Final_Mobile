import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  TextInput,
  Button,
  HelperText,
  Menu,
  Divider,
} from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { obterTodosAutores, atualizarAutor } from "../../storage/autorStorage";
import { MaskedTextInput } from "react-native-mask-text";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  nome: yup.string().required("O nome é obrigatório"),
  nacionalidade: yup.string().required("A nacionalidade é obrigatória"),
  dataNascimento: yup
    .string()
    .matches(
      /^(\d{2}\/\d{2}\/\d{4})?$/,
      "Formato de data inválido. Use DD/MM/AAAA"
    )
    .test("is-valid-date", "A data inserida não é válida", (value) => {
      if (!value) return true;
      const partes = value.split("/");
      const dia = parseInt(partes[0], 10);
      const mes = parseInt(partes[1], 10);
      const ano = parseInt(partes[2], 10);
      if (ano < 1000 || ano > 3000 || mes === 0 || mes > 12) return false;
      const diasNoMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (ano % 400 === 0 || (ano % 100 !== 0 && ano % 4 === 0))
        diasNoMes[1] = 29;
      return dia > 0 && dia <= diasNoMes[mes - 1];
    }),
  generoPrincipal: yup.string(),
  biografia: yup.string(),
});

export default function TelaEditarAutor() {
  const navigation = useNavigation();
  const route = useRoute();
  const { authorId } = route.params;

  const [menuGeneroVisivel, setMenuGeneroVisivel] = useState(false);
  const abrirMenuGenero = () => setMenuGeneroVisivel(true);
  const fecharMenuGenero = () => setMenuGeneroVisivel(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (authorId) {
      const loadAuthorData = async () => {
        const allAuthors = await obterTodosAutores();
        const currentAuthor = allAuthors.find((a) => a.id === authorId);
        if (currentAuthor) {
          setValue("nome", currentAuthor.nome);
          setValue("nacionalidade", currentAuthor.nacionalidade);
          setValue("dataNascimento", currentAuthor.dataNascimento);
          setValue("generoPrincipal", currentAuthor.generoPrincipal || "");
          setValue("biografia", currentAuthor.biografia);
        }
      };
      loadAuthorData();
    }
  }, [authorId, setValue]);

  const onSubmit = async (data) => {
    const updatedAuthor = { id: authorId, ...data };
    await atualizarAutor(updatedAuthor);
    navigation.goBack();
  };

  const selecionarGenero = (genero) => {
    setValue("generoPrincipal", genero, { shouldValidate: true });
    fecharMenuGenero();
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="nome"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Nome Completo"
                value={value || ""}
                onChangeText={onChange}
                onBlur={onBlur}
                mode="outlined"
                style={styles.input}
                error={!!errors.nome}
              />
            )}
          />
          {errors.nome && (
            <HelperText type="error">{errors.nome.message}</HelperText>
          )}

          <Controller
            control={control}
            name="nacionalidade"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Nacionalidade"
                value={value || ""}
                onChangeText={onChange}
                onBlur={onBlur}
                mode="outlined"
                style={styles.input}
                error={!!errors.nacionalidade}
              />
            )}
          />
          {errors.nacionalidade && (
            <HelperText type="error">{errors.nacionalidade.message}</HelperText>
          )}

          <Controller
            control={control}
            name="biografia"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Biografia (opcional)"
                value={value || ""}
                onChangeText={onChange}
                onBlur={onBlur}
                mode="outlined"
                style={styles.input}
                multiline
                numberOfLines={4}
              />
            )}
          />

          <Controller
            control={control}
            name="dataNascimento"
            render={({ field: { onChange, value } }) => (
              <MaskedTextInput
                mask="99/99/9999"
                value={value || ""}
                onChangeText={onChange}
                keyboardType="numeric"
                style={[
                  styles.input,
                  styles.maskedInput,
                  !!errors.dataNascimento && { borderColor: "red" },
                ]}
                placeholder="Data de Nascimento"
              />
            )}
          />
          {errors.dataNascimento && (
            <HelperText type="error">
              {errors.dataNascimento.message}
            </HelperText>
          )}

          <Controller
            control={control}
            name="generoPrincipal"
            render={({ field: { value } }) => (
              <Menu
                visible={menuGeneroVisivel}
                onDismiss={fecharMenuGenero}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={abrirMenuGenero}
                    style={styles.input}
                    contentStyle={styles.menuButtonContent}
                  >
                    {value || "Selecione um Gênero Principal"}
                  </Button>
                }
              >
                <Menu.Item
                  onPress={() => selecionarGenero("Fantasia")}
                  title="Fantasia"
                />
                <Menu.Item
                  onPress={() => selecionarGenero("Ficção Científica")}
                  title="Ficção Científica"
                />
                <Menu.Item
                  onPress={() => selecionarGenero("Romance")}
                  title="Romance"
                />
                <Menu.Item
                  onPress={() => selecionarGenero("Mistério")}
                  title="Mistério"
                />
                <Menu.Item
                  onPress={() => selecionarGenero("Terror")}
                  title="Terror"
                />
                <Menu.Item
                  onPress={() => selecionarGenero("Biografia")}
                  title="Biografia"
                />
                <Divider />
                <Menu.Item
                  onPress={() => selecionarGenero("")}
                  title="Nenhum / Outro"
                />
              </Menu>
            )}
          />

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
          >
            Salvar Alterações
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  formContainer: { padding: 20 },
  input: { marginBottom: 4 },
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
  button: { marginTop: 16 },
  menuButtonContent: {
    height: 50,
    justifyContent: "center",
  },
});
