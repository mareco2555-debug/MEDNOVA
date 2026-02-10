
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

// Initialize with process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// PCM Helpers
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array) {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export interface VoiceCallback {
  onTranscription: (text: string, isFinal: boolean) => void;
  onStatusChange: (status: 'connecting' | 'active' | 'closed' | 'error') => void;
}

export const voiceService = {
  async startScribeSession(callbacks: VoiceCallback) {
    let inputAudioContext: AudioContext;
    let stream: MediaStream;

    try {
      callbacks.onStatusChange('connecting');
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: 'Actúa como un escriba médico profesional de MEDNOVA Nexus. Tu tarea es transcribir la conversación entre el Médico y el Paciente. Identifica quién habla basándote en el contexto clínico. Devuelve la transcripción formateada de forma limpia. No respondas al usuario, solo transcribe.',
          inputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            callbacks.onStatusChange('active');
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.inputTranscription) {
              callbacks.onTranscription(msg.serverContent.inputTranscription.text, false);
            }
            if (msg.serverContent?.turnComplete) {
              callbacks.onTranscription('', true);
            }
          },
          onerror: (e) => {
            console.error('Nexus Live Error:', e);
            callbacks.onStatusChange('error');
          },
          onclose: () => {
            callbacks.onStatusChange('closed');
            stream.getTracks().forEach(t => t.stop());
            inputAudioContext.close();
          }
        }
      });

      return {
        stop: async () => {
          const session = await sessionPromise;
          session.close();
        }
      };
    } catch (err) {
      console.error('Failed to start scribe:', err);
      callbacks.onStatusChange('error');
      throw err;
    }
  }
};
