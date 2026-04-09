import { FileX } from 'lucide-react';

export default function PdfViewer({ url, fileName }) {
  if (!url) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 rounded-xl border"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <FileX size={40} style={{ color: 'var(--text-secondary)', marginBottom: '12px' }} />
        <p className="text-sm font-medium m-0" style={{ color: 'var(--text-secondary)' }}>
          No PDF available
        </p>
        <p className="text-xs mt-1 m-0" style={{ color: 'var(--text-secondary)' }}>
          {fileName ? `File: ${fileName}` : 'No CV has been uploaded for this candidate.'}
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: 'var(--border-color)' }}
    >
      <div
        className="px-4 py-2 text-sm font-medium border-b"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-secondary)',
        }}
      >
        {fileName || 'Document'}
      </div>
      <iframe
        src={url}
        title={fileName || 'PDF Viewer'}
        className="w-full border-0"
        style={{ height: '600px', backgroundColor: 'var(--bg-primary)' }}
      />
    </div>
  );
}
