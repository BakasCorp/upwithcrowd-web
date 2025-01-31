import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers/providers";
import { getApiMemberApi } from "@/actions/upwithcrowd/member/actions";
import { Member } from "./providers/member";
import { auth } from "@repo/utils/auth/next-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "UPwithCrowd",
  description: "Empowering ideas through crowdfunding",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  let member: Member | null = null;
  let members: Member[] = [];
  if (session && session?.user?.member_id) {
    const memberResponse = await getApiMemberApi();
    if (memberResponse.type === "success") {
      members = memberResponse.data.items || [];
      member = members.find((x) => x?.id === session?.user?.member_id) || null;
    }
  }

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen overflow-hidden`}>
        <Providers session={session} currentMember={member} members={members}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
