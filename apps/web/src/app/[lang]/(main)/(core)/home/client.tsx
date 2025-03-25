"use client";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import type {
  PagedResultDto_ListMemberResponseDto,
  UpwithCrowd_Members_ListMemberResponseDto,
  UpwithCrowd_Projects_ListProjectsResponseDto,
} from "@ayasofyazilim/upwithcrowd-saas/UPWCService";
import PageHeader from "@repo/ui/upwithcrowd/theme/header";
import {AlertCircle, Building2, Combine, PieChartIcon, Receipt, UserRound, Users} from "lucide-react";
import React, {useEffect, useState} from "react";
import {Cell, Pie, PieChart, ResponsiveContainer} from "recharts";

// Update the chartColors object to have more harmonious colors
const chartColors = {
  share: "#FADFA1", // Indigo
  debt: "#116A7B", // Sky blue
  shareDept: "#DEAC80", // Cyan
  individual: "#597445", // Violet
  organization: "#B06161", // Indigo
  total: "#3B82F6", // Blue
};

const chartConfig: Record<string, {label: string; color?: string}> = {
  count: {
    label: "Proje Sayısı",
  },
  share: {
    label: "Paya Dayalı",
    color: chartColors.share,
  },
  debt: {
    label: "Borca Dayalı",
    color: chartColors.debt,
  },
  shareDept: {
    label: "Pay/Borç Karma",
    color: chartColors.shareDept,
  },
  individual: {
    label: "Bireysel Üyeler",
    color: chartColors.individual,
  },
  organization: {
    label: "Kurumsal Üyeler",
    color: chartColors.organization,
  },
  total: {
    label: "Toplam Üye",
    color: chartColors.total,
  },
};

function ChartLegend({items}: {items: string[]}) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-4 sm:text-sm">
      {Object.entries(chartConfig)
        .filter(([key]) => items.includes(key))
        .map(([key, value]) => (
          <div className="flex items-center gap-2" key={key}>
            <div
              className="h-2 w-2 rounded-full sm:h-3"
              style={{backgroundColor: chartColors[key as keyof typeof chartColors]}}
            />
            <span className="text-muted-foreground text-xs sm:text-sm">{value.label}</span>
          </div>
        ))}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-card relative rounded-xl border p-3 shadow-sm transition-all hover:shadow-md sm:p-4">
      <div
        className="absolute -left-3 -top-3 rounded-full p-1.5 sm:-left-4 sm:-top-4 sm:p-2"
        style={{backgroundColor: `${color}30`}}>
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" style={{color}} />
      </div>
      <div className="flex flex-col items-center">
        <p className="text-muted-foreground text-xs sm:text-sm">{title}</p>
        <h3 className="mt-1 text-xl font-bold sm:text-2xl">{value}</h3>
      </div>
    </div>
  );
}

export interface DashboardProps {
  data: {
    filteredProjects: {
      debt: UpwithCrowd_Projects_ListProjectsResponseDto[];
      share: UpwithCrowd_Projects_ListProjectsResponseDto[];
      shareDept: UpwithCrowd_Projects_ListProjectsResponseDto[];
    };
    filteredMembers: {
      individual: UpwithCrowd_Members_ListMemberResponseDto[];
      organization: UpwithCrowd_Members_ListMemberResponseDto[];
    };
    projects: UpwithCrowd_Projects_ListProjectsResponseDto[];
    membersResponse: PagedResultDto_ListMemberResponseDto;
  };
}

export default function DashboardClient({data}: DashboardProps) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    // Check if screen is smaller than sm breakpoint (640px)
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Clean up
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const projectChartData = [
    {name: "share", value: data.filteredProjects.share.length, fill: chartColors.share},
    {name: "debt", value: data.filteredProjects.debt.length, fill: chartColors.debt},
    {name: "shareDept", value: data.filteredProjects.shareDept.length, fill: chartColors.shareDept},
  ];

  const totalProjects = data.projects.length;
  const totalMembers = data.membersResponse.totalCount || 0;
  const individualMembersCount = data.filteredMembers.individual.length;
  const organizationMembersCount = data.filteredMembers.organization.length;

  // Üye dağılımı için veri
  const memberDistributionData = [
    {name: "individual", value: individualMembersCount, fill: chartColors.individual},
    {name: "organization", value: organizationMembersCount, fill: chartColors.organization},
  ];

  return (
    <div className="space-y-6 overflow-auto sm:space-y-8">
      <PageHeader
        description="Kitle fonlaması projelerinizi yönetmek için tek platform"
        title="Upwithcrowd Admin Paneli">
        <Card className="bg-white/80 backdrop-blur">
          <CardContent className="p-3 pt-4 sm:p-6 sm:pt-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="rounded-full bg-blue-100 p-2 sm:p-3">
                <AlertCircle className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold sm:text-base">Kolay Proje Yönetimi</h3>
                <p className="text-xs text-gray-600 sm:text-sm">Pay ve borç tabanlı projeleri tek platformda yönetin</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur">
          <CardContent className="p-3 pt-4 sm:p-6 sm:pt-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="rounded-full bg-green-100 p-2 sm:p-3">
                <Users className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold sm:text-base">Üye Yönetimi</h3>
                <p className="text-xs text-gray-600 sm:text-sm">Bireysel ve kurumsal üyelerinizi kolayca takip edin</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur">
          <CardContent className="p-3 pt-4 sm:p-6 sm:pt-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="rounded-full bg-purple-100 p-2 sm:p-3">
                <PieChartIcon className="h-5 w-5 text-purple-600 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold sm:text-base">Detaylı Analizler</h3>
                <p className="text-xs text-gray-600 sm:text-sm">Projelerinizin performansını anlık olarak izleyin</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Proje Bilgileri Card'ı */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-col gap-3 p-4 sm:gap-4 sm:p-6">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <CardTitle className="text-lg sm:text-xl">Proje Bilgileri</CardTitle>
              <ChartLegend items={["share", "debt", "shareDept"]} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0 sm:space-y-6 sm:p-6 sm:pt-0">
            {/* Proje İstatistikleri */}
            <div className="xs:grid-cols-3 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
              <StatCard
                color={chartColors.share}
                icon={PieChartIcon}
                title="Paya Dayalı"
                value={data.filteredProjects.share.length}
              />
              <StatCard
                color={chartColors.debt}
                icon={Receipt}
                title="Borca Dayalı"
                value={data.filteredProjects.debt.length}
              />
              <StatCard
                color={chartColors.shareDept}
                icon={Combine}
                title="Pay/Borç Karma"
                value={data.filteredProjects.shareDept.length}
              />
            </div>

            {/* Proje Dağılımı Grafiği */}
            <div className="relative h-[180px] w-full sm:h-[220px]">
              <ResponsiveContainer height="100%" width="100%">
                <ChartContainer className="mx-auto aspect-square max-h-[180px] sm:max-h-[250px]" config={chartConfig}>
                  <PieChart>
                    <Pie
                      data={projectChartData}
                      dataKey="value"
                      innerRadius={isSmallScreen ? 40 : 60}
                      label={({value}) => {
                        const sum = projectChartData.reduce((acc, entry) => acc + entry.value, 0);
                        const percentage = ((value / sum) * 100).toFixed(0);
                        return `${percentage}%`;
                      }}
                      nameKey="name"
                      outerRadius={isSmallScreen ? 60 : 80}
                      paddingAngle={3}
                      strokeWidth={2}
                    />
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={false} />
                  </PieChart>
                </ChartContainer>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold sm:text-3xl">{totalProjects}</div>
                  <div className="text-muted-foreground text-[10px] sm:text-xs">Toplam Proje</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Üye Bilgileri Card'ı */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-col gap-3 p-4 sm:gap-4 sm:p-6">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <CardTitle className="text-lg sm:text-xl">Üye Bilgileri</CardTitle>
              <ChartLegend items={["individual", "organization"]} />
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-4 pt-0 sm:space-y-6 sm:p-6 sm:pt-0">
            {/* Üye İstatistikleri */}
            <div className="xs:grid-cols-3 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
              <StatCard
                color={chartColors.individual}
                icon={UserRound}
                title="Bireysel Üyeler"
                value={individualMembersCount}
              />
              <StatCard
                color={chartColors.organization}
                icon={Building2}
                title="Kurumsal Üyeler"
                value={organizationMembersCount}
              />
              <StatCard color={chartColors.total} icon={Users} title="Toplam Üye" value={totalMembers} />
            </div>

            {/* Üye Dağılımı Grafiği */}
            <div className="relative h-[180px] w-full sm:h-[220px]">
              <ResponsiveContainer height="100%" width="100%">
                <ChartContainer className="mx-auto aspect-square max-h-[180px] sm:max-h-[250px]" config={chartConfig}>
                  <PieChart>
                    <Pie
                      cx="50%"
                      cy="50%"
                      data={memberDistributionData}
                      dataKey="value"
                      innerRadius={isSmallScreen ? 40 : 60}
                      label={({percent}) => `${(percent * 100).toFixed(0)}%`}
                      nameKey="name"
                      outerRadius={isSmallScreen ? 60 : 80}
                      paddingAngle={3}
                      strokeWidth={2}>
                      {memberDistributionData.map((entry, index) => (
                        <Cell fill={entry.fill} key={`cell-${index}`} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={false} />
                  </PieChart>
                </ChartContainer>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold sm:text-3xl">{totalMembers}</div>
                  <div className="text-muted-foreground text-[10px] sm:text-xs">Toplam Üye</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
