import { create } from 'zustand';

export type UploadStatus = 'idle' | 'validating' | 'uploading' | 'success' | 'error';

interface UploadState {
  status: UploadStatus;
  file: File | null;
  previewUrl: string | null;
  progress: number;
  error: string | null;
  jobId: string | null;
}

interface UploadActions {
  setFile: (file: File, previewUrl: string) => void;
  setStatus: (status: UploadStatus) => void;
  setProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  setJobId: (jobId: string) => void;
  reset: () => void;
}

type UploadStore = UploadState & UploadActions;

const initialState: UploadState = {
  status: 'idle',
  file: null,
  previewUrl: null,
  progress: 0,
  error: null,
  jobId: null,
};

export const useUploadStore = create<UploadStore>()((set) => ({
  ...initialState,

  setFile: (file, previewUrl) => set({ file, previewUrl, status: 'idle', error: null }),
  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
  setError: (error) => set({ error, status: 'error' }),
  setJobId: (jobId) => set({ jobId }),
  reset: () => set(initialState),
}));
