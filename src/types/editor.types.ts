export type EditorTab = 'cutout' | 'background' | 'effects' | 'adjust' | 'design';

export interface EditorState {
  originalImageUrl: string | null;
  resultImageUrl: string | null;
  activeTab: EditorTab;
  zoom: number;
  isComparing: boolean;
  history: EditorHistoryEntry[];
  historyIndex: number;
}

export interface EditorHistoryEntry {
  imageUrl: string;
  timestamp: number;
  action: string;
}

export interface DownloadOption {
  label: string;
  format: 'png' | 'jpg' | 'webp';
  quality?: number;
}
