import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";

function WordImagePicker({ image, enabled, onPick }) {
  const colors = useSelector((state) => state.theme.colors);
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [permission, requestPermission] =
    ImagePicker.useMediaLibraryPermissions();

  async function onPress() {
    if (!enabled) return;

    if (permission?.status !== ImagePicker.PermissionStatus.GRANTED) {
      const response = await requestPermission();
      if (!response?.granted) return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets?.length > 0) {
      onPick(result.assets[0].uri);
    }
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPress}
        style={[styles.imageContainer, !enabled && styles.disabled]}
      >
        {image ? (
          <Image style={styles.image} source={{ uri: image }} />
        ) : (
          <Text style={styles.placeholderText}>No image taken yet.</Text>
        )}
      </Pressable>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: {
      alignItems: "center",
      marginVertical: 10,
    },
    imageContainer: {
      width: 150,
      aspectRatio: 1,
      borderWidth: 1,
      borderRadius: 8,
      borderStyle: "dashed",
      borderColor: colors.primary200,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    disabled: {
      opacity: 0.5,
    },
    image: {
      width: "100%",
      height: "100%",
    },
    placeholderText: {
      color: colors.grey600,
      fontSize: 16,
      textAlign: "center",
      paddingHorizontal: 8,
    },
  });
}

export default WordImagePicker;