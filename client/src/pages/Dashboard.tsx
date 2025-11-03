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
import { Video, ExternalLink, LogOut, MessageSquare } from "lucide-react";
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
          <div className="flex items-center gap-3">
            <svg width="42" height="18" viewBox="0 0 504 216" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M503.361 6.12384V33.8438C503.361 35.451 502.722 36.9924 501.586 38.1289C500.449 39.2654 498.908 39.9038 497.301 39.9038H440.461V212.814H398.311V46.0038C398.311 44.3966 397.672 42.8552 396.536 41.7188C395.399 40.5823 393.858 39.9438 392.251 39.9438H356.051L302.281 109.464C301.591 110.346 301.161 111.403 301.041 112.517C300.921 113.63 301.115 114.755 301.601 115.764L347.771 213.004H306.611C305.455 213.003 304.323 212.672 303.349 212.051C302.375 211.429 301.598 210.542 301.111 209.494L270.571 143.494L221.761 210.494C221.198 211.264 220.463 211.89 219.613 212.323C218.764 212.756 217.824 212.982 216.871 212.984H173.801L254.071 108.264L205.401 6.12384H246.841C247.998 6.11873 249.132 6.44829 250.106 7.07283C251.08 7.69736 251.853 8.59022 252.331 9.64384L279.331 68.1238C279.778 69.0765 280.465 69.8963 281.325 70.5027C282.185 71.109 283.188 71.4809 284.236 71.5819C285.283 71.6828 286.339 71.5092 287.299 71.0782C288.259 70.6472 289.09 69.9736 289.711 69.1238L336.001 6.12384H503.361Z" fill="url(#paint0_radial_73_480)"/>
              <path d="M210.84 99.7138V143.324C210.842 147.788 209.338 152.122 206.57 155.624L173.39 197.684V168.544C173.2 169.044 172.99 169.544 172.78 170.074C170.483 175.413 167.595 180.478 164.17 185.174C160.129 190.733 155.294 195.669 149.82 199.824C136.565 209.952 120.289 215.326 103.61 215.084C89.924 215.166 76.3614 212.493 63.73 207.224C51.3275 202.052 40.0839 194.453 30.66 184.874C21.0011 175.075 13.354 163.481 8.15 150.744C2.71667 137.657 0 123.157 0 107.244C0 91.3305 2.71667 76.8305 8.15 63.7438C13.3423 51.0331 21.0686 39.5128 30.8579 29.885C40.6472 20.2573 52.2946 12.7239 65.09 7.74383C78.518 2.5122 92.8194 -0.114588 107.23 0.00383265C129.783 0.00383265 149.42 5.0905 166.14 15.2638C181.113 24.3772 192.207 37.2405 199.42 53.8538C199.747 54.6115 199.915 55.4278 199.916 56.2529C199.916 57.078 199.749 57.8945 199.423 58.6526C199.097 59.4107 198.62 60.0944 198.022 60.662C197.423 61.2296 196.714 61.6692 195.94 61.9538L178.88 68.2238C174.077 69.9552 168.84 70.0696 163.965 68.5496C159.091 67.0296 154.848 63.9585 151.88 59.8038L151.78 59.6638C148.502 55.1723 144.525 51.2357 140 48.0038C135.389 44.7484 130.289 42.2502 124.89 40.6038C119.053 38.8474 112.985 37.981 106.89 38.0338C94.3967 38.0338 83.37 40.9038 73.81 46.6438C64.197 52.4635 56.4544 60.9176 51.5 71.0038C46.1667 81.4705 43.5 93.5538 43.5 107.254C43.5 121.554 46.1667 133.937 51.5 144.404C56.5478 154.576 64.4816 163.035 74.31 168.724C84.17 174.464 95.95 177.334 109.65 177.334C117.126 177.41 124.536 175.918 131.4 172.954C137.941 170.103 143.923 166.115 149.07 161.174C154.051 156.442 158.231 150.934 161.45 144.864C163.019 141.893 164.391 138.823 165.56 135.674C165.9 134.757 166.013 133.771 165.89 132.801C165.768 131.831 165.412 130.905 164.854 130.102C164.297 129.298 163.553 128.642 162.687 128.188C161.821 127.734 160.858 127.496 159.88 127.494H105.14C103.533 127.494 101.991 126.855 100.855 125.719C99.7185 124.582 99.08 123.041 99.08 121.434V99.7138C99.08 98.1066 99.7185 96.5652 100.855 95.4288C101.991 94.2923 103.533 93.6538 105.14 93.6538H204.78C206.387 93.6538 207.929 94.2923 209.065 95.4288C210.202 96.5652 210.84 98.1066 210.84 99.7138Z" fill="url(#paint1_radial_73_480)"/>
              <defs>
                <radialGradient id="paint0_radial_73_480" cx="0" cy="0" r="1" gradientTransform="matrix(185.597 104.28 -166.118 152.284 173.801 103.084)" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#008FFF"/>
                  <stop offset="1" stopColor="#0052CC"/>
                </radialGradient>
                <radialGradient id="paint1_radial_73_480" cx="0" cy="0" r="1" gradientTransform="matrix(118.738 108.419 -106.276 158.328 -4.57836e-06 100.809)" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#008FFF"/>
                  <stop offset="1" stopColor="#0052CC"/>
                </radialGradient>
              </defs>
            </svg>
            <h1 className="text-lg font-semibold" data-testid="text-app-title">
              XTRADERS Space
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
                  <div className="flex justify-center mb-4">
                    <svg width="48" height="20" viewBox="0 0 504 216" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-50">
                      <path d="M503.361 6.12384V33.8438C503.361 35.451 502.722 36.9924 501.586 38.1289C500.449 39.2654 498.908 39.9038 497.301 39.9038H440.461V212.814H398.311V46.0038C398.311 44.3966 397.672 42.8552 396.536 41.7188C395.399 40.5823 393.858 39.9438 392.251 39.9438H356.051L302.281 109.464C301.591 110.346 301.161 111.403 301.041 112.517C300.921 113.63 301.115 114.755 301.601 115.764L347.771 213.004H306.611C305.455 213.003 304.323 212.672 303.349 212.051C302.375 211.429 301.598 210.542 301.111 209.494L270.571 143.494L221.761 210.494C221.198 211.264 220.463 211.89 219.613 212.323C218.764 212.756 217.824 212.982 216.871 212.984H173.801L254.071 108.264L205.401 6.12384H246.841C247.998 6.11873 249.132 6.44829 250.106 7.07283C251.08 7.69736 251.853 8.59022 252.331 9.64384L279.331 68.1238C279.778 69.0765 280.465 69.8963 281.325 70.5027C282.185 71.109 283.188 71.4809 284.236 71.5819C285.283 71.6828 286.339 71.5092 287.299 71.0782C288.259 70.6472 289.09 69.9736 289.711 69.1238L336.001 6.12384H503.361Z" fill="currentColor"/>
                      <path d="M210.84 99.7138V143.324C210.842 147.788 209.338 152.122 206.57 155.624L173.39 197.684V168.544C173.2 169.044 172.99 169.544 172.78 170.074C170.483 175.413 167.595 180.478 164.17 185.174C160.129 190.733 155.294 195.669 149.82 199.824C136.565 209.952 120.289 215.326 103.61 215.084C89.924 215.166 76.3614 212.493 63.73 207.224C51.3275 202.052 40.0839 194.453 30.66 184.874C21.0011 175.075 13.354 163.481 8.15 150.744C2.71667 137.657 0 123.157 0 107.244C0 91.3305 2.71667 76.8305 8.15 63.7438C13.3423 51.0331 21.0686 39.5128 30.8579 29.885C40.6472 20.2573 52.2946 12.7239 65.09 7.74383C78.518 2.5122 92.8194 -0.114588 107.23 0.00383265C129.783 0.00383265 149.42 5.0905 166.14 15.2638C181.113 24.3772 192.207 37.2405 199.42 53.8538C199.747 54.6115 199.915 55.4278 199.916 56.2529C199.916 57.078 199.749 57.8945 199.423 58.6526C199.097 59.4107 198.62 60.0944 198.022 60.662C197.423 61.2296 196.714 61.6692 195.94 61.9538L178.88 68.2238C174.077 69.9552 168.84 70.0696 163.965 68.5496C159.091 67.0296 154.848 63.9585 151.88 59.8038L151.78 59.6638C148.502 55.1723 144.525 51.2357 140 48.0038C135.389 44.7484 130.289 42.2502 124.89 40.6038C119.053 38.8474 112.985 37.981 106.89 38.0338C94.3967 38.0338 83.37 40.9038 73.81 46.6438C64.197 52.4635 56.4544 60.9176 51.5 71.0038C46.1667 81.4705 43.5 93.5538 43.5 107.254C43.5 121.554 46.1667 133.937 51.5 144.404C56.5478 154.576 64.4816 163.035 74.31 168.724C84.17 174.464 95.95 177.334 109.65 177.334C117.126 177.41 124.536 175.918 131.4 172.954C137.941 170.103 143.923 166.115 149.07 161.174C154.051 156.442 158.231 150.934 161.45 144.864C163.019 141.893 164.391 138.823 165.56 135.674C165.9 134.757 166.013 133.771 165.89 132.801C165.768 131.831 165.412 130.905 164.854 130.102C164.297 129.298 163.553 128.642 162.687 128.188C161.821 127.734 160.858 127.496 159.88 127.494H105.14C103.533 127.494 101.991 126.855 100.855 125.719C99.7185 124.582 99.08 123.041 99.08 121.434V99.7138C99.08 98.1066 99.7185 96.5652 100.855 95.4288C101.991 94.2923 103.533 93.6538 105.14 93.6538H204.78C206.387 93.6538 207.929 94.2923 209.065 95.4288C210.202 96.5652 210.84 98.1066 210.84 99.7138Z" fill="currentColor"/>
                    </svg>
                  </div>
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
