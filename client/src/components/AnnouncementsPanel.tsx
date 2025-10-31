import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { type Announcement } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Pin, Trash2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function AnnouncementsPanel() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser = auth.currentUser;
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "announcements"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const announcementsData: Announcement[] = [];
        snapshot.forEach((doc) => {
          announcementsData.push({ id: doc.id, ...doc.data() } as Announcement);
        });
        setAnnouncements(announcementsData);
      },
      (error) => {
        console.error("Error fetching announcements:", error);
        toast({
          title: "Error loading announcements",
          description: "Failed to fetch announcements. Please refresh.",
          variant: "destructive",
        });
      }
    );

    return () => unsubscribe();
  }, [toast]);

  const handleSubmit = async () => {
    if (!currentUser || !newMessage.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "announcements"), {
        authorId: currentUser.uid,
        authorName: currentUser.displayName || "Unknown User",
        authorPhoto: currentUser.photoURL || null,
        message: newMessage.trim(),
        timestamp: Date.now(),
        pinned: false,
      });
      setNewMessage("");
      toast({
        title: "Announcement posted",
        description: "Your announcement has been shared with the team.",
      });
    } catch (error) {
      console.error("Error posting announcement:", error);
      toast({
        title: "Error posting announcement",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "announcements", id));
      toast({
        title: "Announcement deleted",
      });
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast({
        title: "Error deleting announcement",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTogglePin = async (id: string, currentPinned: boolean) => {
    try {
      await updateDoc(doc(db, "announcements", id), {
        pinned: !currentPinned,
      });
    } catch (error) {
      console.error("Error pinning announcement:", error);
      toast({
        title: "Error updating announcement",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.timestamp - a.timestamp;
  });

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Megaphone className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-medium">Team Announcements</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Share an announcement with the team..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            maxLength={500}
            className="resize-none min-h-20"
            data-testid="input-announcement"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {newMessage.length}/500 characters
            </p>
            <Button
              onClick={handleSubmit}
              disabled={!newMessage.trim() || isSubmitting}
              size="sm"
              className="gap-2"
              data-testid="button-post-announcement"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sortedAnnouncements.length === 0 ? (
            <div className="text-center py-8">
              <Megaphone className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No announcements yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Be the first to share something with the team!
              </p>
            </div>
          ) : (
            sortedAnnouncements.map((announcement) => {
              const isAuthor = announcement.authorId === currentUser?.uid;
              const initials = announcement.authorName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <div
                  key={announcement.id}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    announcement.pinned ? "bg-accent/20 border-primary/30" : "bg-card border-border"
                  }`}
                  data-testid={`announcement-${announcement.id}`}
                >
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage
                        src={announcement.authorPhoto || undefined}
                        alt={announcement.authorName}
                      />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium">{announcement.authorName}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimeAgo(announcement.timestamp)}
                          </p>
                          {announcement.pinned && (
                            <Badge variant="secondary" className="text-xs gap-1">
                              <Pin className="w-3 h-3" />
                              Pinned
                            </Badge>
                          )}
                        </div>

                        {isAuthor && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleTogglePin(announcement.id, announcement.pinned)}
                              data-testid={`button-pin-${announcement.id}`}
                            >
                              <Pin
                                className={`w-3 h-3 ${announcement.pinned ? "fill-current" : ""}`}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(announcement.id)}
                              data-testid={`button-delete-${announcement.id}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>

                      <p className="text-sm whitespace-pre-wrap break-words">
                        {announcement.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Card>
  );
}
