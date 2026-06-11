import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Skia, ImageFormat, TileMode } from '@shopify/react-native-skia';
import { useAppStore } from '../store/useAppStore';

// --- Color Matrices for Styles ---

const grayscaleMatrix = [
  0.2126, 0.7152, 0.0722, 0, 0,
  0.2126, 0.7152, 0.0722, 0, 0,
  0.2126, 0.7152, 0.0722, 0, 0,
  0,      0,      0,      1, 0,
];

const highContrastMatrix = [
  2.0, 0,   0,   0, -50,
  0,   2.0, 0,   0, -50,
  0,   0,   2.0, 0, -50,
  0,   0,   0,   1, 0,
];

const cartoonMatrix = [
  1.5, 0,   0,   0, -20,
  0,   1.5, 0,   0, -20,
  0,   0,   1.5, 0, -20,
  0,   0,   0,   1, 0,
];

const animeMatrix = [
  1.2, 0.1, 0,   0, 10,
  0,   1.2, 0,   0, 10,
  0,   0.1, 1.2, 0, 10,
  0,   0,   0,   1, 0,
];

export const useOfflineClipartGeneration = () => {
  const { uploadedImage, setIsGenerating, setResults, clearResults } = useAppStore();

  const generate = async () => {
    if (!uploadedImage) {
      Alert.alert('Error', 'Upload an image first!');
      return false;
    }

    clearResults();
    setIsGenerating(true);

    try {
      // 1. Read file as Base64 to give to Skia
      const base64Data = await FileSystem.readAsStringAsync(uploadedImage, { 
        encoding: 'base64'
      });
      const skData = Skia.Data.fromBase64(base64Data);
      const skImage = Skia.Image.MakeImageFromEncoded(skData);
      
      if (!skImage) {
        throw new Error('Failed to decode image');
      }

      const imgWidth = skImage.width();
      const imgHeight = skImage.height();
      
      // Scale down if image is massive to save memory
      const maxDim = 800;
      let targetW = imgWidth;
      let targetH = imgHeight;
      if (Math.max(imgWidth, imgHeight) > maxDim) {
         const scale = maxDim / Math.max(imgWidth, imgHeight);
         targetW = Math.floor(imgWidth * scale);
         targetH = Math.floor(imgHeight * scale);
      }
      
      // Helper to render an image style
      const renderStyle = async (styleName: string, paintSetup: (paint: any) => void) => {
        return new Promise<any>((resolve) => {
          setTimeout(() => {
            const surface = Skia.Surface.Make(targetW, targetH);
            if (!surface) return resolve({ style: styleName, image: null });

            const canvas = surface.getCanvas();
            const paint = Skia.Paint();
            paintSetup(paint);

            const src = Skia.XYWHRect(0, 0, imgWidth, imgHeight);
            const dst = Skia.XYWHRect(0, 0, targetW, targetH);
            
            canvas.drawImageRect(skImage, src, dst, paint);

            const snap = surface.makeImageSnapshot();
            const b64 = snap.encodeToBase64(ImageFormat.JPEG, 90);
            
            resolve({ style: styleName, image: `data:image/jpeg;base64,${b64}` });
          }, 0);
        });
      };
      
      // 1. Cartoon
      const cartoonPaint = (paint: any) => {
        paint.setColorFilter(Skia.ColorFilter.MakeMatrix(cartoonMatrix));
        paint.setImageFilter(Skia.ImageFilter.MakeBlur(1, 1, TileMode.Clamp, null));
      };

      // 2. Sketch
      const sketchPaint = (paint: any) => {
        const grayscale = Skia.ColorFilter.MakeMatrix(grayscaleMatrix);
        const contrast = Skia.ColorFilter.MakeMatrix(highContrastMatrix);
        paint.setColorFilter(Skia.ColorFilter.MakeCompose(contrast, grayscale));
      };
      
      // 3. Flat Illustration
      const flatPaint = (paint: any) => {
        paint.setImageFilter(Skia.ImageFilter.MakeBlur(3, 3, TileMode.Clamp, null));
        paint.setColorFilter(Skia.ColorFilter.MakeMatrix(highContrastMatrix));
      };

      // 4. Pixel Art
      const pixelArtPaint = (paint: any) => {
         // Mimic pixelation by heavily posterizing
         const posterize = [
            2.5, 0, 0, 0, -80,
            0, 2.5, 0, 0, -80,
            0, 0, 2.5, 0, -80,
            0, 0, 0, 1, 0,
         ];
         paint.setColorFilter(Skia.ColorFilter.MakeMatrix(posterize));
      };

      // 5. Anime Look
      const animeStylePaint = (paint: any) => {
        paint.setColorFilter(Skia.ColorFilter.MakeMatrix(animeMatrix));
        paint.setImageFilter(Skia.ImageFilter.MakeBlur(0.5, 0.5, TileMode.Clamp, null));
      };

      const promises = [
        renderStyle('Cartoon', cartoonPaint),
        renderStyle('Sketch', sketchPaint),
        renderStyle('Flat Illustration', flatPaint),
        renderStyle('Pixel Art', pixelArtPaint),
        renderStyle('Anime Look', animeStylePaint)
      ];

      const results = await Promise.all(promises);
      setResults(results);
      return true;

    } catch (err: any) {
      Alert.alert('Generation failed', err.message);
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generate };
};