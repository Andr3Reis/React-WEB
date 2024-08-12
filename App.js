import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(true);

  const handleCepChange = (text) => {
    const formattedCep = text.replace(/[^0-9]/g, "").slice(0, 8);
    setCep(formattedCep);
  };

  const fetchAddress = () => {
    if (isSearching) {
      setLoading(true);
      setError(null);
      setAddress(null);

      axios
        .get(`https://viacep.com.br/ws/${cep}/json/`)
        .then((response) => {
          if (response.data.erro) {
            setError("CEP não encontrado.");
          } else {
            setAddress(response.data);
            setIsSearching(false);
          }
          setLoading(false);
        })
        .catch((error) => {
          setError("Erro ao buscar o CEP.");
          setLoading(false);
        });
    } else {
      setCep("");
      setAddress(null);
      setError(null);
      setIsSearching(true);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.title}>Buscar Endereço pelo CEP</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o CEP"
        keyboardType="numeric"
        value={cep}
        onChangeText={handleCepChange}
        editable={isSearching}
        maxLength={8}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={fetchAddress}
        disabled={loading || cep.length !== 8}
      >
        <Text style={styles.buttonText}>
          {isSearching ? "Buscar" : "Nova Busca"}
        </Text>
      </TouchableOpacity>

      {loading && <Text style={styles.loadingText}>Carregando...</Text>}

      {error && <Text style={styles.error}>{error}</Text>}

      {address && (
        <View style={styles.addressContainer}>
          <Text style={styles.addressText}>CEP: {address.cep}</Text>
          <Text style={styles.addressText}>
            Logradouro: {address.logradouro}
          </Text>
          <Text style={styles.addressText}>Bairro: {address.bairro}</Text>
          <Text style={styles.addressText}>Cidade: {address.localidade}</Text>
          <Text style={styles.addressText}>Estado: {address.uf}</Text>
        </View>
      )}

      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 25,
    width: "10%",
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    opacity: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingText: {
    fontSize: 16,
    color: "#333",
    marginTop: 15,
  },
  error: {
    color: "red",
    marginTop: 15,
    fontSize: 16,
  },
  addressContainer: {
    marginTop: 30,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    width: "40%",
  },
  addressText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
  },
});
