export function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/plain" });
  downloadBlobFile(blob, filename);
}

export function downloadBlobFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}
