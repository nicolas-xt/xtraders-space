import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Image, Film, Music, Archive, File, ExternalLink } from "lucide-react";
import { SiGoogledrive } from "react-icons/si";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  webViewLink: string;
}

const mockDriveFiles: DriveFile[] = [
  {
    id: "1",
    name: "Q4 Product Roadmap.pdf",
    mimeType: "application/pdf",
    modifiedTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    webViewLink: "https://drive.google.com/",
  },
  {
    id: "2",
    name: "Team Meeting Notes - Oct 2025",
    mimeType: "application/vnd.google-apps.document",
    modifiedTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    webViewLink: "https://drive.google.com/",
  },
  {
    id: "3",
    name: "Design Mockups.fig",
    mimeType: "application/octet-stream",
    modifiedTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    webViewLink: "https://drive.google.com/",
  },
  {
    id: "4",
    name: "Sprint Planning Sheet",
    mimeType: "application/vnd.google-apps.spreadsheet",
    modifiedTime: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    webViewLink: "https://drive.google.com/",
  },
];

function getFileIcon(mimeType: string) {
  if (mimeType.includes("document") || mimeType.includes("pdf")) {
    return FileText;
  }
  if (mimeType.includes("image")) {
    return Image;
  }
  if (mimeType.includes("video")) {
    return Film;
  }
  if (mimeType.includes("audio")) {
    return Music;
  }
  if (mimeType.includes("spreadsheet")) {
    return FileText;
  }
  if (mimeType.includes("zip") || mimeType.includes("archive")) {
    return Archive;
  }
  return File;
}

function formatTimeAgo(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diff = now - then;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString();
}

export function DriveFilesList() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Recent Files</h3>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => window.open("https://drive.google.com/", "_blank")}
          data-testid="button-view-all-drive"
        >
          <span className="text-sm">View All</span>
          <ExternalLink className="w-3 h-3" />
        </Button>
      </div>

      <div className="space-y-0">
        {mockDriveFiles.map((file, index) => {
          const Icon = getFileIcon(file.mimeType);
          const isLast = index === mockDriveFiles.length - 1;

          return (
            <a
              key={file.id}
              href={file.webViewLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 py-3 hover-elevate active-elevate-2 transition-all duration-200 rounded-md px-2 -mx-2 ${
                !isLast ? "border-b border-border" : ""
              }`}
              data-testid={`link-drive-file-${file.id}`}
            >
              <Icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-normal truncate" data-testid={`text-filename-${file.id}`}>
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground" data-testid={`text-modified-${file.id}`}>
                  {formatTimeAgo(file.modifiedTime)}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </a>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground mb-3">
          Note: Connect Google Drive API to see your actual files
        </p>
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => window.open("https://drive.google.com/", "_blank")}
          data-testid="button-open-drive-full"
        >
          <SiGoogledrive className="w-4 h-4" />
          Open Google Drive
        </Button>
      </div>
    </Card>
  );
}
