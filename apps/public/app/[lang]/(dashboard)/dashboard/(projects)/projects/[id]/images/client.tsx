"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import type {
  GetApiFileTypeGroupRulesetResponse,
  GetApiPublicFileResponse,
  UpwithCrowd_Files_FileResponseDto,
} from "@ayasofyazilim/upwithcrowd-saas/UPWCService";
import type {FileTypeForFileCard} from "@repo/ayasofyazilim-ui/molecules/document-card";
import DocumentCard from "@repo/ayasofyazilim-ui/molecules/document-card";
import {FileUpload} from "@repo/ui/upwithcrowd/file-upload/index";
import Link from "next/link";
import {useParams} from "next/navigation";
import {useState} from "react";
import {getBaseLink} from "@/utils/lib";
import {Section} from "../../new/_components/section";
import TextWithTitle from "../../new/_components/text-with-title";
import {useProject} from "../_components/project-provider";

export default function ImagesClient({
  fileTypeGroupResponse,
  fileResponse,
  projectId,
}: {
  fileTypeGroupResponse: GetApiFileTypeGroupRulesetResponse;
  fileResponse: GetApiPublicFileResponse;
  projectId: string;
}) {
  const {lang} = useParams<{lang: string}>();

  const baseLink = getBaseLink("dashboard", lang);
  const {isProjectEditable} = useProject();

  const isFormDisabled = !isProjectEditable;
  const getFileNameFromPath = (fullPath: string): string => {
    const matches = /[^/]+$/.exec(fullPath);
    return matches ? matches[0] : fullPath;
  };

  const getFileType = (fileName: string): string => {
    const extension = fileName.split(".").pop()?.toLowerCase() || "";
    if (extension === "pdf") return "pdf";
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "image";
    return "doc";
  };

  const fileData = fileResponse.map((i) => {
    const fileName = getFileNameFromPath(i.fullPath || "");
    const fileType = getFileType(fileName);
    return {...i, fileId: i.fileId || "", fileName, fileType};
  });
  const [thumbnails, setThumbnails] = useState<FileTypeForFileCard[]>(
    fileData.filter((file) => file.fileTypeNamespace === "ProjectThumbnails"),
  );
  const [images, setImages] = useState<FileTypeForFileCard[]>(
    fileData.filter((file) => file.fileTypeNamespace === "ProjectImages"),
  );
  const [videos, setVideos] = useState<FileTypeForFileCard[]>(
    fileData.filter((file) => file.fileTypeNamespace === "ProjectVideos"),
  );

  const documentTabs = [
    {
      value: "thumbnails",
      label: "Proje Kapak Fotoğrafı",
      files: thumbnails,
    },
    {
      value: "images",
      label: "Proje Görselleri",
      files: images,
    },
    {
      value: "videos",
      label: "Proje Videoları",
      files: videos,
    },
  ];

  return (
    <div className="bg-muted min-h-screen w-full">
      <section className="mx-auto w-full max-w-7xl p-4 md:p-8">
        <TextWithTitle
          classNames={{
            container: "mb-8",
            title: "text-3xl font-bold",
            text: "text-lg",
          }}
          text="Projenize ait görselleri yükleyin."
          title="Proje Görselleri"
        />
        <Section
          className="w-full grid-cols-1"
          text="Projenizin kapak fotoğrafı, görselleri ve videolarını yükleyin ve projenizi daha çekici hale getirin."
          title="Görseller">
          <FileUpload<UpwithCrowd_Files_FileResponseDto>
            classNames={{container: "md:col-span-full ", multiSelect: "bg-white"}}
            disabled={isFormDisabled}
            onSuccess={(file) => {
              if (file.fileTypeNamespace === "ProjectThumbnails") {
                setThumbnails((prev) => [
                  ...prev,
                  {
                    ...file,
                    fileName: file.name || "",
                    fileType: file.fullPath.split(".").at(-1) || "",
                  },
                ]);
              }
              if (file.fileTypeNamespace === "ProjectImages") {
                setImages((prev) => [
                  ...prev,
                  {
                    ...file,
                    fileName: file.name || "",
                    fileType: file.fullPath.split(".").at(-1) || "",
                  },
                ]);
              }
              if (file.fileTypeNamespace === "ProjectVideos") {
                setVideos((prev) => [
                  ...prev,
                  {
                    ...file,
                    fileName: file.name || "",
                    fileType: file.fullPath.split(".").at(-1) || "",
                  },
                ]);
              }
            }}
            propertyId={projectId}
            ruleset={fileTypeGroupResponse}
          />
        </Section>
        <Card className="mb-4 mt-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold md:text-2xl">Görseller</CardTitle>
          </CardHeader>

          <CardContent>
            <DocumentCard activeDefaultTab="thumbnails" documentTabs={documentTabs} />
          </CardContent>
        </Card>

        <Link className=" w-full" href={`${baseLink}/projects/${projectId}/finish-project`}>
          <Button className="w-full">Kaydet</Button>
        </Link>
      </section>
    </div>
  );
}
