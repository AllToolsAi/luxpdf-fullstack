import argparse
import sys
import torch
from voice_models import VoiceEnhancer, StyleTransfer

def main():
    parser = argparse.ArgumentParser(description="Process and stylize audio with voice models")
    parser.add_argument('--input', required=True, help='Input audio file path')
    parser.add_argument('--output', required=True, help='Output audio file path')
    parser.add_argument('--model', default='professional-male', help='Voice style model to apply')
    parser.add_argument('--pitch', type=float, default=0, help='Pitch shift amount in semitones')
    args = parser.parse_args()

    try:
        print(f"Loading input audio from {args.input}...")
        enhancer = VoiceEnhancer()
        style_transfer = StyleTransfer(args.model)

        audio = enhancer.load_audio(args.input)
        print("Applying noise reduction and pitch shift...")
        enhanced = enhancer.process(audio, noise_reduction=True, pitch_shift=args.pitch)

        print(f"Applying style transfer model '{args.model}'...")
        styled = style_transfer.apply(enhanced)

        print(f"Saving processed audio to {args.output}...")
        enhancer.save_audio(styled, args.output)

        print("Processing completed successfully.")
    except Exception as e:
        print(f"Error during processing: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
