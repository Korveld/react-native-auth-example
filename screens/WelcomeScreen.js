import { StyleSheet, Text, View } from 'react-native';
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {AuthContext} from "../store/auth-context";
import LoadingOverlay from "../components/ui/LoadingOverlay";

function WelcomeScreen() {
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const [fetchedMessage, setFetchedMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (token) {
      axios.get(
        `https://rn-auth-example-3f0f1-default-rtdb.europe-west1.firebasedatabase.app/message.json?auth=${token}`
      ).then((response) => {
        setFetchedMessage(response.data);
      });
    }
    setIsLoading(false);
  }, [token]);

  if (isLoading) {
    return <LoadingOverlay message="Loading data..." />;
  }

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Welcome!</Text>
      <Text>You authenticated successfully!</Text>
      <Text>{fetchedMessage}</Text>
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
