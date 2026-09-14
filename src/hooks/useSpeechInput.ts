import { useCallback, useEffect, useRef, useState } from 'react';

/** 브라우저 내장 음성 인식(Web Speech API). Chrome·Safari·Edge 지원, Firefox 미지원 */
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error: string }) => void) | null;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

type Options = {
  /** 확정된 문장이 나올 때마다 호출. 입력창에 이어 붙이면 된다 */
  onTranscript: (text: string) => void;
  /** 권한 거부 등 실패 안내 */
  onError?: (message: string) => void;
};

const ERROR_MESSAGES: Record<string, string> = {
  'not-allowed': '마이크 사용 권한이 필요해요.',
  'service-not-allowed': '마이크 사용 권한이 필요해요.',
  'audio-capture': '마이크를 찾지 못했어요.',
  network: '음성 인식 서버에 연결하지 못했어요.',
};

/**
 * 마이크 음성 입력 (한국어, 브라우저 내장 STT). 토글 — 누르면 듣기 시작, 다시 누르면 멈춤.
 * 서버 없이 브라우저(Chrome은 구글, Safari는 애플 음성인식)가 처리한다.
 * 지원 안 하는 브라우저면 isSupported=false → 버튼 비활성.
 */
export function useSpeechInput({ onTranscript, onError }: Options) {
  const [isSupported] = useState(() => getRecognitionCtor() !== null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const callbacksRef = useRef({ onTranscript, onError });

  useEffect(() => {
    callbacksRef.current = { onTranscript, onError };
  }, [onTranscript, onError]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      return;
    }
    const recognition = new Ctor();
    recognition.lang = 'ko-KR';
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) {
          callbacksRef.current.onTranscript(result[0].transcript.trim());
        }
      }
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setIsListening(false);
    };
    recognition.onerror = (event) => {
      recognitionRef.current = null;
      setIsListening(false);
      // 'no-speech'(아무 말 없음)와 'aborted'(사용자가 멈춤)는 에러로 안 보여준다
      const message = ERROR_MESSAGES[event.error];
      if (message) {
        callbacksRef.current.onError?.(message);
      }
    };
    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  }, []);

  const toggle = useCallback(() => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  }, [isListening, start, stop]);

  // 언마운트 시 마이크 끔
  useEffect(() => () => recognitionRef.current?.abort(), []);

  return { isSupported, isListening, toggle };
}
