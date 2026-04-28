import {Link} from "expo-router"
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View
      style={styles.container}>
        
      <Text style = {styles.text}>
        HelloSYD!
      </Text>

      <Text style = {styles.text}> 
        Let's explore SYDNEY
      </Text>

      <Link href = "/profile" style = {styles.button}>
      <View>
        <Text style = {styles.buttonText}>Continue with Email</Text>    
        </View>
            </Link>
            <Text style = {{marginBottom:5}}>OR</Text>
          <Link href = "/profile" style = {styles.button}>
         <Text style = {styles.buttonText}>Continue with Google</Text>  
               </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "rgb(93, 131, 181)"
  },
  text: {
    color: "white",
    fontSize: 60,
    // textAlign: "left",
    marginBottom: 15,
  },

  button: {
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "white",
        width: "20%",
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row", 
    },

  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    
    color: "black",
  
    
  },

});
