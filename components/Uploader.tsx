import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
	Image,
	Platform,
} from "react-native";
import { pinataService } from "../services/pinata";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export function PinataUploader() {
	const [uploading, setUploading] = useState(false);
	const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const pickAndUploadImage = async () => {
		try {
			setError(null);
			setUploadedUrl(null);

			// Request permission
			const permissionResult =
				await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (!permissionResult.granted) {
				setError("Permission to access camera roll is required!");
				return;
			}

			// Pick the image
			const pickerResult = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				quality: 1,
			});

			if (pickerResult.canceled) {
				return;
			}

			setUploading(true);

			const { uri, mimeType } = pickerResult.assets[0];

			// Generate a filename
			const filename = `upload-${Date.now()}${Platform.OS === "ios" ? ".jpg" : ""}`;

			// Upload to Pinata
			const result = await pinataService.uploadFile(
				uri,
				filename,
				mimeType || "image/jpeg",
			);

			setUploadedUrl(result.pinataUrl);
		} catch (e) {
			console.error("Upload error:", e);
			setError(
				e instanceof Error ? e.message : "An error occurred during upload",
			);
		} finally {
			setUploading(false);
		}
	};

	return (
		<ThemedView style={styles.container}>
			<TouchableOpacity
				onPress={pickAndUploadImage}
				disabled={uploading}
				style={styles.button}
			>
				<ThemedText style={styles.buttonText}>
					{uploading ? "Uploading..." : "Pick and Upload Image"}
				</ThemedText>
			</TouchableOpacity>

			{uploading && <ActivityIndicator size="large" color="#0a7ea4" />}

			{error && <ThemedText style={styles.error}>Error: {error}</ThemedText>}

			{uploadedUrl && (
				<ThemedView style={styles.resultContainer}>
					<ThemedText style={styles.success}>Upload successful!</ThemedText>
					<Image
						source={{ uri: uploadedUrl }}
						style={styles.previewImage}
						resizeMode="contain"
					/>
					<ThemedText style={styles.url}>{uploadedUrl}</ThemedText>
				</ThemedView>
			)}
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
		alignItems: "center",
	},
	button: {
		padding: 15,
		backgroundColor: "#0a7ea4",
		borderRadius: 5,
		marginBottom: 20,
		minWidth: 200,
		alignItems: "center",
	},
	buttonText: {
		color: "white",
		fontSize: 16,
	},
	error: {
		color: "red",
		marginTop: 10,
		textAlign: "center",
	},
	success: {
		color: "green",
		marginTop: 10,
		marginBottom: 10,
	},
	resultContainer: {
		alignItems: "center",
		marginTop: 20,
		width: "100%",
	},
	previewImage: {
		width: 200,
		height: 200,
		borderRadius: 10,
		marginVertical: 10,
		backgroundColor: "#f0f0f0",
	},
	url: {
		fontSize: 12,
		textAlign: "center",
		marginTop: 10,
		paddingHorizontal: 20,
	},
});
