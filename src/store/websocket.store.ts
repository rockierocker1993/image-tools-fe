import { create } from 'zustand';
import type { JobStatus } from '@/types/job.types';

export type WebSocketConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

interface WebSocketState {
  connectionState: WebSocketConnectionState;
  activeJobs: Record<string, JobStatus>;
  jobResults: Record<string, string>;
  jobErrors: Record<string, string>;
}

interface WebSocketActions {
  setConnectionState: (state: WebSocketConnectionState) => void;
  updateJobStatus: (jobId: string, status: JobStatus, resultUrl?: string, error?: string) => void;
  removeJob: (jobId: string) => void;
  reset: () => void;
}

type WebSocketStore = WebSocketState & WebSocketActions;

const initialState: WebSocketState = {
  connectionState: 'disconnected',
  activeJobs: {},
  jobResults: {},
  jobErrors: {},
};

export const useWebSocketStore = create<WebSocketStore>()((set) => ({
  ...initialState,

  setConnectionState: (connectionState) => set({ connectionState }),

  updateJobStatus: (jobId, status, resultUrl, error) =>
    set((state) => ({
      activeJobs: { ...state.activeJobs, [jobId]: status },
      jobResults: resultUrl
        ? { ...state.jobResults, [jobId]: resultUrl }
        : state.jobResults,
      jobErrors: error
        ? { ...state.jobErrors, [jobId]: error }
        : state.jobErrors,
    })),

  removeJob: (jobId) =>
    set((state) => {
      const { [jobId]: _ajob, ...activeJobs } = state.activeJobs;
      const { [jobId]: _rjob, ...jobResults } = state.jobResults;
      const { [jobId]: _ejob, ...jobErrors } = state.jobErrors;
      return { activeJobs, jobResults, jobErrors };
    }),

  reset: () => set(initialState),
}));
