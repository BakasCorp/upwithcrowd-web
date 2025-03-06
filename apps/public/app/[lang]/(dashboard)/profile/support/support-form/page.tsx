"use client";

import {useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {toast} from "@/components/ui/sonner";
import Link from "next/link";
import {Info} from "lucide-react";
import {postTasksApi} from "@/actions/upwithcrowd/tasks/post-action";

const formSchema = z.object({
  tasksType: z.enum(["Issue", "Support"], {
    required_error: "Lütfen bir talep türü seçin",
  }),
  projectUrl: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return /\/projects\/[0-9a-f-]+$/i.exec(val) !== null;
    }, "Geçersiz proje URL formatı"),
  memberId: z.string().optional(),
  summary: z.string().min(5, "Özet en az 5 karakter olmalıdır").max(100, "Özet 100 karakteri geçmemelidir"),
  description: z
    .string()
    .min(10, "Açıklama en az 10 karakter olmalıdır")
    .max(500, "Açıklama 500 karakteri geçmemelidir"),
});

type FormValues = z.infer<typeof formSchema>;

export default function SupportFormClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tasksType: undefined,
      projectUrl: "",
      summary: "",
      description: "",
    },
  });

  const extractProjectId = (url: string): string | undefined => {
    const match = /\/projects\/(?:[0-9a-f-]+)$/i.exec(url);
    return match ? match[0].split("/").pop() : undefined;
  };

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true);
      const projectId = values.projectUrl ? extractProjectId(values.projectUrl) : undefined;

      const response = await postTasksApi({
        requestBody: {
          tasksType: values.tasksType,
          roleType: "Tenant",
          projectId,
          summary: values.summary,
          description: values.description,
        },
      });
      if (response.type === "success") {
        toast.success(response.message);
        form.reset();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader className="px-4 sm:px-6">
        <div className="flex w-full items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg">Yeni Talep Oluştur</CardTitle>
            <CardDescription className="text-sm">
              Talebinizi oluşturun ve destek ekibimizden yardım alın.
            </CardDescription>
          </div>
          <Link href="/profile/support">
            <Button className="flex items-center gap-2" variant="default">
              Taleplerimi Görüntüle <Info className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              void form.handleSubmit(onSubmit)(e); // void kullanımı
            }}>
            <FormField
              control={form.control}
              name="tasksType"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Talep Türü</FormLabel>
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Talep türü seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Issue">Sorun</SelectItem>
                      <SelectItem value="Support">Destek</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectUrl"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Proje URL (İsteğe Bağlı)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Proje URL'sini girin (örn: http://localhost:3000/en/projects/your-project-id)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Eğer belirli bir projeyle ilgiliyse, proje URL sini girin.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Özet</FormLabel>
                  <FormControl>
                    <Input placeholder="Sorununuzun kısa özeti" {...field} />
                  </FormControl>
                  <FormDescription>Sorununuzun kısa bir özetini girin.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[120px]"
                      placeholder="Lütfen sorununuzu detaylı bir şekilde açıklayın"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Sorununuzun detaylı bir açıklamasını yapın.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Gönderiliyor..." : "Talebi Gönder"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
