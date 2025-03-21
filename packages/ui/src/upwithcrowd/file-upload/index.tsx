"use client";

import {MultiSelect} from "@repo/ayasofyazilim-ui/molecules/multi-select";
import {cn} from "../../utils";
import {FileUploadContainer, FileUploadContainerProps} from "./_components/container";
import {useState} from "react";
import {FileUploadBaseProps} from "./_components/file-upload-base";
import {Badge} from "@repo/ayasofyazilim-ui/atoms/badge";

export type Rule = {
  id: string;
  fileTypeGroupId: string;
  provider: string;
  name: string;
  containerName: string;
  filePath: string;
  namespace: string;
  isPublic: boolean;
  dateRequired: boolean;
  isMulti: boolean;
  maxFileCount?: number | null;
  isTenant: boolean;
  originatorRequired: boolean;
  descriptionRequired: boolean;
  isValidationRequired: boolean;
  numberRequired: boolean;
  isFileTypeRequired: boolean;
  mimeTypes?: Array<{
    id?: string;
    mimeTypeCode?: string | null;
    mimeTypeExtension?: string | null;
  }> | null;
  fileTypeMimeTypes?: Array<{
    id?: string;
    fileTypeId?: string;
    mimeTypeId?: string;
  }> | null;
  fileRelationsEntity?: Array<{
    id?: string;
    fileTypeId?: string;
    relatedEntityName?: string | null;
    relatedEntityProperty?: string | null;
    required?: boolean;
  }> | null;
};
export type Ruleset = Rule[];
export type FileUploadProps<T> = {
  ruleset: Ruleset;
  propertyId: string;
  classNames?: {
    container?: string;
    multiSelect?: string;
  } & FileUploadContainerProps<T>["classNames"];
  children?: React.ReactNode;
  onSuccess?: FileUploadBaseProps<T>["onSuccess"];
  disabled?: boolean;
};
export function FileUpload<T>({ruleset, propertyId, classNames, children, onSuccess, disabled}: FileUploadProps<T>) {
  const clearedRules = ruleset.filter((rule) => rule.fileRelationsEntity?.length);
  const nonRequireds = clearedRules.map((rule) => !rule.isFileTypeRequired);
  const [visibleRuleIds, setVisibleRuleIds] = useState<string[]>(
    nonRequireds.length <= 1
      ? clearedRules.map((rule) => rule.id)
      : clearedRules.filter((r) => r.isFileTypeRequired).map((r) => r.id),
  );
  if (clearedRules.length === 0)
    return <div className="flex items-center justify-center rounded-md border p-4 text-sm">No file type found</div>;
  return (
    <div className={cn("flex flex-col gap-4", classNames?.container)}>
      {nonRequireds.length > 1 && (
        <MultiSelect
          disabled={disabled}
          className={cn("min-h-16 border p-4 shadow-none", classNames?.multiSelect)}
          defaultValue={clearedRules.filter((r) => r.isFileTypeRequired).map((r) => r.id)}
          options={clearedRules.map((rule) => ({
            label: rule.name,
            value: rule.id,
            disabled: rule.isFileTypeRequired,
            children: rule.isFileTypeRequired && (
              <Badge className="ml-auto" variant="outline">
                Required
              </Badge>
            ),
          }))}
          onValueChange={setVisibleRuleIds}
          placeholder="Please select file type to upload"
        />
      )}
      {clearedRules.map((rule) => {
        if (!rule || !visibleRuleIds.includes(rule.id)) return null;
        return (
          <FileUploadContainer
            disabled={disabled}
            onSuccess={onSuccess}
            rule={rule}
            key={rule.id}
            propertyId={propertyId}
            classNames={classNames}
          />
        );
      })}
      {children}
    </div>
  );
}
