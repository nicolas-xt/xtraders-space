import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { collection, onSnapshot, query, doc, setDoc } from "firebase/firestore";
import { type TeamMember, type UserStatus } from "@shared/schema";
import { usePresence } from "@/hooks/usePresence";
import { TeamMemberCard } from "@/components/TeamMemberCard";
import { TeamMemberSkeleton } from "@/components/TeamMemberSkeleton";
import { TeamChat } from "@/components/TeamChat";
import { StatusMessageDialog } from "@/components/StatusMessageDialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Video, ExternalLink, LogOut, Users, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// 🔗 Link fixo do Google Meet da equipe
const MEET_ROOM_URL = "https://meet.google.com/ers-kcmp-bnf";

export default function Dashboard() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoiningMeet, setIsJoiningMeet] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const currentUser = auth.currentUser;
  const { updateStatus, updateCustomStatus } = usePresence();
  const { toast } = useToast();
  
  const currentUserData = teamMembers.find(m => m.uid === currentUser?.uid);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const members: TeamMember[] = [];
        snapshot.forEach((doc) => {
          members.push(doc.data() as TeamMember);
        });
        setTeamMembers(members);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching team members:", error);
        setIsLoading(false);
        toast({
          title: "Error loading team",
          description: "Failed to fetch team members. Please refresh the page.",
          variant: "destructive",
        });
      }
    );

    return () => unsubscribe();
  }, [currentUser, toast]);

  const handleSignOut = async () => {
    try {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        await setDoc(
          userRef,
          {
            status: "Offline" as UserStatus,
            lastSeen: Date.now(),
          },
          { merge: true }
        );
      }
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleJoinMeet = async () => {
    if (!currentUser) return;
    
    setIsJoiningMeet(true);
    
    try {
      // Abrir o Google Meet primeiro
      const meetWindow = window.open(MEET_ROOM_URL, "_blank");
      
      if (!meetWindow) {
        toast({
          title: "Popup bloqueado",
          description: "Por favor, permita popups para este site.",
          variant: "destructive",
        });
        setIsJoiningMeet(false);
        return;
      }
      
      // Atualizar o status para "In Call"
      await updateStatus("In Call");
      
      toast({
        title: "Entrando na reunião",
        description: "Você foi marcado como 'In Call'",
      });
    } catch (error) {
      console.error("Error joining meet:", error);
      toast({
        title: "Erro ao entrar na reunião",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    }
    
    // Resetar o estado após 1 segundo
    setTimeout(() => {
      setIsJoiningMeet(false);
    }, 1000);
  };

  const handleSaveStatus = async (status: string) => {
    await updateCustomStatus(status);
    toast({
      title: "Status updated",
      description: status ? `Your status is now: "${status}"` : "Status cleared",
    });
  };

  if (!currentUser) return null;

  const currentUserInitials = currentUser.displayName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  const onlineCount = teamMembers.filter((m) => m.status === "Online").length;
  const inCallCount = teamMembers.filter((m) => m.status === "In Call").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-semibold" data-testid="text-app-title">
              Work Hub
            </h1>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full"
                data-testid="button-user-menu"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || "User"} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {currentUserInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none" data-testid="text-user-name">
                    {currentUser.displayName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground" data-testid="text-user-email">
                    {currentUser.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowStatusDialog(true)} data-testid="button-set-status">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Set status message</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} data-testid="button-signout">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <StatusMessageDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        currentStatus={currentUserData?.customStatus}
        onSave={handleSaveStatus}
      />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold" data-testid="text-welcome">
              Welcome back, {currentUser.displayName?.split(" ")[0]}
            </h2>
            <p className="text-muted-foreground">
              {onlineCount} team member{onlineCount !== 1 ? "s" : ""} online
              {inCallCount > 0 && ` · ${inCallCount} in call`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              onClick={handleJoinMeet}
              disabled={isJoiningMeet}
              className="gap-2 px-6 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              data-testid="button-join-meet"
            >
              <Video className="w-5 h-5" />
              {isJoiningMeet ? "Joining..." : "Join Team Meeting"}
              <ExternalLink className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Team Members</h3>
                <p className="text-sm text-muted-foreground" data-testid="text-team-count">
                  {teamMembers.length} member{teamMembers.length !== 1 ? "s" : ""}
                </p>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <TeamMemberSkeleton key={i} />
                  ))}
                </div>
              ) : teamMembers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No team members yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                  {teamMembers
                    .sort((a, b) => {
                      if (a.uid === currentUser.uid) return -1;
                      if (b.uid === currentUser.uid) return 1;
                      const statusOrder = { "In Call": 0, Online: 1, Offline: 2 };
                      return statusOrder[a.status] - statusOrder[b.status];
                    })
                    .map((member) => (
                      <TeamMemberCard
                        key={member.uid}
                        member={member}
                        isCurrentUser={member.uid === currentUser.uid}
                      />
                    ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <TeamChat />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
