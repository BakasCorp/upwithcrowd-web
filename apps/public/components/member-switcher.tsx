"use client";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {Drawer, DrawerContent, DrawerTrigger} from "@/components/ui/drawer";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {useMediaQuery} from "@/components/ui/useMediaQuery";
import {cn} from "@/lib/utils";
import {signOutServer, useSession} from "@repo/utils/auth";
import {BadgeCheck, LogOut, PlusCircle, UserIcon, HelpCircle} from "lucide-react";
import Link from "next/link";
import {useParams, usePathname, useRouter} from "next/navigation";
import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {getBaseLink} from "@/utils/lib";
import {useMember} from "@/app/providers/member";
import type {Member} from "@/app/providers/member";

export default function MemberSwitcher() {
  const router = useRouter();
  const path = usePathname();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);
  const {session} = useSession();
  const {currentMember} = useMember();

  const activeMember = useMemo(() => {
    if (currentMember) return currentMember;
    return {
      id: session?.user?.member_id || "",
      name: session?.user?.name || "",
      surname: session?.user?.surname || "",
      identifier: session?.user?.email || "",
      type: "Individual" as const,
      idType: "TCKN" as const,
      mail: session?.user?.email || "",
    };
  }, [currentMember, session]);

  useEffect(() => {
    if (!currentMember && path.includes("/dashboard")) {
      router.push("/dashboard/member/new/personal");
    }
  }, [currentMember, path]);

  const DesktopContent = (
    <Popover modal onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          aria-label="Üye seçin"
          className={cn("h-auto w-[200px] justify-start rounded-full border-none px-2")}
          role="combobox"
          variant="outline">
          <MemberItem member={activeMember} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="min-w-[300px] p-0">
        <Content currentMember={activeMember} setOpen={setOpen} />
      </PopoverContent>
    </Popover>
  );

  const MobileContent = (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>
        <Button
          aria-expanded={open}
          aria-label="Üye seçin"
          className={cn("h-auto w-[200px] justify-start rounded-full border-none px-2")}
          role="combobox"
          variant="outline">
          <MemberItem member={activeMember} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <Content currentMember={activeMember} setOpen={setOpen} />
        </div>
      </DrawerContent>
    </Drawer>
  );

  return isDesktop ? DesktopContent : MobileContent;
}

function Content({
  setOpen,
  currentMember,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentMember: Member | null;
}) {
  const {members} = useMember();
  const organizations = members.filter((x) => x.type === "Organization" && x.title);
  const individuals = members.filter((x) => x.type === "Individual");
  return (
    <Command>
      <CommandInput placeholder="Üye ara..." />
      {(individuals.length > 0 || organizations.length > 0) && <CommandSeparator />}
      <CommandList>
        <CommandEmpty>Üye bulunamadı.</CommandEmpty>
        {individuals.length > 0 && (
          <CommandGroup heading="Bireysel Üyeler" key="individuals">
            {currentMember
              ? individuals.map((ind) => (
                  <ListItem currentMember={currentMember} key={ind.id} member={ind} setOpen={setOpen} />
                ))
              : null}
          </CommandGroup>
        )}
        {organizations.length > 0 && (
          <CommandGroup heading="Kurumsal Üyeler" key="organizations">
            {currentMember
              ? organizations.map((org) => (
                  <ListItem currentMember={currentMember} key={org.id} member={org} setOpen={setOpen} />
                ))
              : null}
          </CommandGroup>
        )}
      </CommandList>
      <CommandSeparator />
      <Commands />
    </Command>
  );
}

function ListItem({
  member,
  currentMember,
  setOpen,
}: {
  member: Member;
  currentMember: Member;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {setCurrentMember} = useMember();

  return (
    <CommandItem
      className={cn(
        "hover:bg-primary/20 text-sm",

        member.id === currentMember.id && "bg-primary/10 aria-selected:bg-primary/20",
      )}
      key={member.id}
      onSelect={() => {
        setCurrentMember(member);
        setOpen(false);
      }}
      value={member.id}>
      <MemberItem member={member} />
    </CommandItem>
  );
}

function MemberItem({member}: {member: Partial<Member> | null}) {
  const {currentMember} = useMember();

  return (
    <React.Suspense fallback="loading">
      <>
        <Avatar className="mr-2 size-10">
          {member && currentMember?.profileImage && currentMember.id === member.id ? (
            <AvatarImage alt={member.id} src={`data:image/jpeg;base64,${currentMember.profileImage}`} />
          ) : (
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              <>{member ? member.name?.slice(0, 1).toUpperCase() : "Test"}</>
              <>{member ? member.surname?.slice(0, 1).toUpperCase() : "Test2"}</>
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex items-center gap-2 overflow-hidden text-left">
          <div className="flex flex-col overflow-hidden">
            <div className="flex items-center gap-1 overflow-hidden text-ellipsis">
              <p className="overflow-hidden text-ellipsis text-nowrap">
                {member?.type === "Organization" ? member.title : `${member?.name} ${member?.surname}`}
              </p>
              {member?.isValidated ? <BadgeCheck className="text-primary size-4 min-w-4" /> : null}
            </div>
            <span className="text-xs text-gray-500">{member?.identifier}</span>
          </div>
        </div>
      </>
    </React.Suspense>
  );
}

function Commands() {
  const {lang} = useParams<{lang: string}>();
  return (
    <CommandList>
      <CommandGroup className="p-0">
        <CommandItem className="rounded-none p-0">
          <Link
            className="flex w-full items-center gap-2 rounded-none p-2"
            href={getBaseLink("dashboard/member/new/business", lang)}>
            <PlusCircle className="size-4" />
            Kurumsal hesap oluştur
          </Link>
        </CommandItem>
        <CommandSeparator />
        <CommandItem className="rounded-none p-0">
          <Link className="flex w-full items-center gap-2 rounded-none p-2" href={getBaseLink("dashboard", lang)}>
            <UserIcon className="size-4" />
            Profil
          </Link>
        </CommandItem>
        <CommandItem className="rounded-none p-0">
          <Link
            className="flex w-full items-center gap-2 rounded-none p-2"
            href={getBaseLink("dashboard/support/support-form", lang)}>
            <HelpCircle className="size-4" />
            Destek Talebi Oluştur
          </Link>
        </CommandItem>
        <CommandItem
          className="flex h-9 items-center gap-2 rounded-none text-red-500 hover:cursor-pointer aria-selected:text-red-500"
          onSelect={() => {
            void signOutServer();
          }}>
          <LogOut className="size-4" />
          Çıkış yap
        </CommandItem>
      </CommandGroup>
    </CommandList>
  );
}
