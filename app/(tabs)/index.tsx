import { Image, StyleSheet, Platform } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { PinataUploader } from "@/components/Uploader";

export default function HomeScreen() {
	return (
		<ThemedView style={styles.container}>
			<ThemedText type="title">Upload to Pinata</ThemedText>
			<PinataUploader />
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		padding: 20,
	},
});
