"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, Check } from "lucide-react";
import { postApiMember } from "@/actions/upwithcrowd/member/post-action";
import { toast } from "@/components/ui/sonner";
import {
  UpwithCrowd_Members_IdType,
  UpwithCrowd_Members_SaveMemberDto,
} from "@ayasofyazilim/upwithcrowd-saas/UPWCService";
import {
  FormMessage,
  FormControl,
  FormItem,
  FormLabel,
  FormField,
} from "@/components/ui/form";
import { Form } from "@/components/ui/form";
import { putMyProfileApi } from "@/actions/upwithcrowd/my-profile/put-action";
import { postUserMembersApi } from "@/actions/upwithcrowd/user-members/post-action";
import { useSession } from "@repo/utils/auth";
import { getApiMemberApi } from "@/actions/upwithcrowd/member/actions";
import { useMember } from "@/app/providers/member";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "İsim en az 2 karakter olmalıdır.")
    .regex(/^[a-zA-ZığüşöçİĞÜŞÖÇ\s]+$/, "İsim yalnızca harf içermelidir."),
  surname: z
    .string()
    .min(2, "Soyisim en az 2 karakter olmalıdır.")
    .regex(/^[a-zA-ZığüşöçİĞÜŞÖÇ\s]+$/, "Soyisim yalnızca harf içermelidir."),
  email: z.string().email("Geçerli bir e-posta adresi giriniz."),
  idType: z.enum(["NONE", "TCKN", "YKN", "MKN"]),
  identifier: z
    .string()
    .min(11, "Kimlik numarası 11 haneli olmalıdır.")
    .max(11, "Kimlik numarası 11 haneli olmalıdır.")
    .regex(/^\d{11}$/, "Kimlik numarası sadece rakam içermelidir."),
  mobile: z
    .string()
    .regex(/^\+?[1-9]\d{9,14}$/, "Geçerli bir telefon numarası giriniz."),
  annualIncome: z
    .string()
    .regex(/^\d+$/, "Yıllık gelir sadece rakam içermelidir."),
  title: z.string().optional(),
});

export default function NewPersonalAccount() {
  const { setMembers, setCurrentMember } = useMember();
  const currentUser = useSession()?.session?.user?.sub;
  const userName = useSession()?.session?.user?.userName || "";
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      idType: "NONE",
      identifier: "",
      mobile: "",
      annualIncome: "0",
      title: "",
    },
  });

  const canStartVerification = () => {
    const values = form.getValues();
    return (
      values.idType !== "NONE" &&
      values.identifier &&
      values.name &&
      values.surname
    );
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const requestBody: UpwithCrowd_Members_SaveMemberDto = {
        type: "Individual",
        idType: values.idType as UpwithCrowd_Members_IdType,
        identifier: values.identifier,
        name: values.name,
        surname: values.surname,
        title: values.title,
        tel: "", // Set tel as empty string
        mail: values.email,
        annualIncome: parseInt(values.annualIncome),
        mobile: values.mobile,
        isValidated: isVerified, // Change this line to use the isVerified state
      };

      const memberResult = await postApiMember({ requestBody });
      if (memberResult.type === "success") {
        await putMyProfileApi({
          requestBody: {
            name: values.name,
            surname: values.surname,
            userName: userName,
          },
        });
        await postUserMembersApi({
          requestBody: {
            memberId: memberResult.data.memberID || "",
            userId: currentUser || "",
          },
        });
        const memberResponse = await getApiMemberApi();
        if (memberResponse.type !== "success") {
          return;
        }
        const memberList = memberResponse.data.items || [];
        const memberIndex = memberList.findIndex(
          (x) => x?.id === memberResult.data.memberID,
        );

        if (memberList.length == 0 || memberIndex == -1) {
          return;
        }
        setMembers(memberResponse.data.items || []);
        setCurrentMember(memberList[memberIndex]);
      }

      if (memberResult.type === "success") {
        toast.success("Your personal account has been created successfully.");
      } else {
        try {
          const errorMessage = memberResult.message || "";
          // First try to parse as JSON
          try {
            const errorMessages = JSON.parse(errorMessage);
            Object.keys(errorMessages).forEach((key) => {
              if (key in form.getValues()) {
                form.setError(key as keyof z.infer<typeof formSchema>, {
                  message: errorMessages[key],
                });
              }
            });
          } catch {
            // If not JSON, check if it's a simple string message
            if (errorMessage.toLowerCase().includes("identifier")) {
              form.setError("identifier", {
                message: errorMessage,
              });
            } else {
              // If we can't determine the specific field, show a toast
              toast.error(errorMessage);
            }
          }
        } catch (errorMessage) {
          toast.error(String(errorMessage));
        }
        return;
      }
    } catch (error) {
      console.error("Error creating personal account:", error);
      toast.error(
        "There was an error creating your personal account. Please try again.",
      );
    }
  }

  const startVerification = async () => {
    setIsVerifying(true);
    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsVerifying(false);
    setIsVerified(true); // This will now control both the UI state and the isValidated value in the request
  };

  return (
    <Card className="mx-auto w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          Create Your Personal Account
        </CardTitle>
        <CardDescription>
          Enter your personal account details below to get started.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="idType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NONE">NONE</SelectItem>
                        <SelectItem value="TCKN">TCKN</SelectItem>
                        <SelectItem value="YKN">YKN</SelectItem>
                        <SelectItem value="MKN">MKN</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identifier</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter identifier" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surname</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter surname" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>E-Devlet Verification</Label>
              <div className="flex flex-col gap-4">
                {!isVerifying && !isVerified && (
                  <Button
                    onClick={startVerification}
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={!canStartVerification()}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    {canStartVerification()
                      ? "Start E-Devlet Verification"
                      : "Please fill required fields first"}
                  </Button>
                )}

                {isVerifying && (
                  <Button disabled className="w-full" variant="outline">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </Button>
                )}

                {isVerified && (
                  <div className="bg-primary text-muted flex items-center justify-center rounded-md p-2 text-center">
                    <Check className="mr-2 h-5 w-5" />
                    <span>E-Devlet Verification Successful!</span>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+12345678901" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="annualIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Income</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Enter annual income"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              type="submit"
              disabled={form.formState.isSubmitting || !isVerified}
            >
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {form.formState.isSubmitting
                ? "Submitting..."
                : !isVerified
                  ? "E-Devlet Verification Required"
                  : "Create Personal Account"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
