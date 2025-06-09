class VoiceTrainer:
    def __init__(self, model=None, dataset=None):
        """
        Initialize VoiceTrainer with a model and dataset.
        """
        self.model = model or VoiceModel()
        self.dataset = dataset or VoiceDataset()

    def train_from_audio(self, audio_files, epochs=100):
        """
        Train the voice model from raw audio files.

        :param audio_files: List of paths or audio buffers
        :param epochs: Number of training epochs
        :return: Exported trained model
        """
        try:
            spectrograms = self.preprocess(audio_files)
            self.model.train(spectrograms, epochs=epochs)
            return self.export_model()
        except Exception as e:
            print(f"Training failed: {e}")
            raise

    def preprocess(self, files):
        """
        Convert raw audio files to mel-spectrograms.

        :param files: List of audio file paths or buffers
        :return: List of mel-spectrogram arrays
        """
        spectrograms = []
        for file in files:
            try:
                melspec = compute_melspec(file)
                spectrograms.append(melspec)
            except Exception as e:
                print(f"Failed to process file {file}: {e}")
        return spectrograms

    def export_model(self, path="trained_model.pth"):
        """
        Export the trained model to a file.

        :param path: File path to save the model
        :return: Path of saved model
        """
        self.model.save(path)
        print(f"Model saved to {path}")
        return path
