import {Alert} from "react-native";
import {useContext, useState} from "react";
import {AuthContext} from "../store/auth-context";
import { createUser } from "../util/auth";
import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from "../components/ui/LoadingOverlay";

function SignupScreen() {
  const authCtx = useContext(AuthContext);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const signUpHandler = async ({ email, password }) => {
    setIsAuthenticating(true);
    try {
      const { token, expiresIn } = await createUser(email, password);
      authCtx.authenticate(token, expiresIn);
    } catch (error) {
      Alert.alert('Authentication failed!', 'Could not create user, please check your input and try again later.');
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Creating user..." />
  }

  return <AuthContent onAuthenticate={signUpHandler} />;
}

export default SignupScreen;
