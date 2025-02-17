"use client";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import type {UpwithCrowd_Projects_UpdateProjectFundingDto} from "@ayasofyazilim/upwithcrowd-saas/UPWCService";
import {$UpwithCrowd_Projects_FundCollectionType} from "@ayasofyazilim/upwithcrowd-saas/UPWCService";
import {useParams, useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {toast} from "@/components/ui/sonner";
import {DatePicker} from "@/components/ui/date-picker";
import {Label} from "@/components/ui/label";
import {useState, useEffect} from "react";
import {putProjectFundingByIdApi} from "@/actions/upwithcrowd/project/put-action";
import TextWithTitle from "../../new/_components/text-with-title";
import {Section} from "../../new/_components/section";
import {FormContainer} from "../../new/_components/form";
import BudgetCard from "../../new/_components/budget-card";

const fundingSchema = z.object({
  fundCollectionType: z.enum($UpwithCrowd_Projects_FundCollectionType.enum).optional(),
  fundNominalAmount: z.coerce.number().min(0, "Amount must be greater than or equal to 0"),
  fundableAmount: z.coerce.number().min(0, "Amount must be greater than or equal to 0"),
  additionalFundRate: z.string(),
  qualifiedFundRate: z.string(),
  overFunding: z.boolean().optional().nullable(),
  minimumFundAmount: z.number().nullable(),
  privilege: z.string().max(135, "Privilege must be less than 135 characters").optional().nullable(),
  projectStartDate: z.string(),
  projectEndDate: z.string().optional(),
  cashValue: z.coerce.number().min(0, "Cash value must be greater than or equal to 0"),
});

export type FundingFormValues = z.infer<typeof fundingSchema>;
export default function ClientFunding({fundingDetail}: {fundingDetail: UpwithCrowd_Projects_UpdateProjectFundingDto}) {
  const {id: projectId} = useParams<{id: string}>();

  const router = useRouter();

  const form = useForm<FundingFormValues>({
    resolver: zodResolver(fundingSchema),
    defaultValues: {
      ...fundingDetail,
      cashValue: fundingDetail.cashValue ?? 0,
    },
  });

  const [spesifDate, setSpesifDate] = useState(false);

  const fundCollectionType = form.watch("fundCollectionType");
  const showCashValue = fundCollectionType === "DBIT" || fundCollectionType === "SHRE_DBIT";

  useEffect(() => {
    if (!spesifDate) {
      const startDate = form.getValues("projectStartDate");
      if (!startDate) {
        // Set current date as start date
        const currentDate = new Date();
        form.setValue("projectStartDate", currentDate.toISOString());

        // Set end date as 30 days from now
        const endDate = new Date(currentDate);
        endDate.setDate(endDate.getDate() + 30);
        form.setValue("projectEndDate", endDate.toISOString());
      } else {
        const startDateTime = new Date(startDate);
        if (!isNaN(startDateTime.getTime())) {
          const endDate = new Date(startDateTime);
          endDate.setDate(endDate.getDate() + 60);
          form.setValue("projectEndDate", endDate.toISOString());
        }
      }
    }
  }, [spesifDate, form]);

  useEffect(() => {
    if (!showCashValue) {
      form.setValue("cashValue", 1000);
    }
  }, [showCashValue, form]);

  const onSubmit = (data: FundingFormValues) => {
    try {
      // The values are already converted to numbers by the schema
      const formattedData = {
        ...data,
        overFunding: Boolean(data.overFunding),
      };

      void putProjectFundingByIdApi({
        requestBody: formattedData,
        id: projectId,
      }).then((response) => {
        if (response.type === "success") {
          toast.success("Funding details updated successfully");
          router.push(`/projects/${projectId}`);
        } else {
          toast.error("An unexpected error occurred");
        }
      });
      // ...rest of the code...
    } catch (error) {
      toast.error("An unexpected error occurred");
      return error;
    }
  };

  return (
    <div className="bg-muted w-full">
      <section className="mx-auto w-full max-w-7xl p-4 md:p-8">
        <TextWithTitle
          classNames={{
            container: "mb-8",
            title: "text-2xl font-medium",
            text: "text-lg",
          }}
          text="Plan and manage your project's finances."
          title="Let's talk about money"
        />

        <Form {...form}>
          <form
            className="space-y-8"
            onSubmit={(e) => {
              void form.handleSubmit(onSubmit)(e);
            }}>
            {/* Privilege Section */}

            {/* Fund Collection Type Section */}
            <Section text={["Select the funding type"]} title="Fund Collection Type">
              <FormContainer>
                <FormField
                  control={form.control}
                  name="fundCollectionType"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Fund Collection Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fund collection type" />
                        </SelectTrigger>
                        <SelectContent>
                          {$UpwithCrowd_Projects_FundCollectionType.enum.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormContainer>
            </Section>

            <Section text="Projenizin başlangıç ve bitiş tarihlerini seçin." title="Proje tarihleri">
              <FormContainer>
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="projectStartDate"
                    render={({field}) => (
                      <FormItem className="flex-1">
                        <FormLabel>Başlangıç Tarihi</FormLabel>
                        <FormControl>
                          <DatePicker
                            date={field.value ? new Date(field.value) : undefined}
                            setDate={(date?: Date) => {
                              field.onChange(date?.toISOString() || "");
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={spesifDate}
                      id="spesificDate"
                      onCheckedChange={(checked) => {
                        setSpesifDate(checked as boolean);
                      }}
                    />
                    <Label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="spesificDate">
                      End Spesific Date
                    </Label>
                  </div>

                  <FormField
                    control={form.control}
                    name="projectEndDate"
                    render={({field}) => (
                      <FormItem className="flex-1">
                        <FormLabel>Bitiş Tarihi</FormLabel>
                        <FormControl>
                          <DatePicker
                            date={field.value ? new Date(field.value) : undefined}
                            disabled={!spesifDate}
                            setDate={(date?: Date) => {
                              field.onChange(date?.toISOString() || "");
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </FormContainer>
            </Section>

            {showCashValue ? (
              <Section className="border-b-0" text={["Enter the cash value for the debit type."]} title="Cash Value">
                <FormContainer className="">
                  <FormField
                    control={form.control}
                    name="cashValue"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Cash Value</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                            <Input
                              className="pl-7"
                              min="0"
                              placeholder="0"
                              type="number"
                              {...field}
                              value={field.value.toString()}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormContainer>
              </Section>
            ) : null}

            {/* Continue with other form fields similarly... */}

            {/* Funding Goals Section Begin */}
            <Section
              className="border-b-0"
              text={[
                "The minimum required funding amount for the project. This represents the base level of financing needed.",
              ]}
              title="Fundable Amount">
              <FormContainer className="">
                <FormField
                  control={form.control}
                  name="fundableAmount"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Fundable Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                          <Input
                            className="pl-7"
                            min="0"
                            placeholder="0"
                            type="number"
                            {...field}
                            value={field.value.toString()}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormContainer>
            </Section>

            <Section
              className="border-b-0"
              text={["The minimum amount an investor can contribute to the project."]}
              title="Min Fund Amount">
              <FormContainer className="">
                <FormField
                  control={form.control}
                  name="minimumFundAmount"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Min Fund Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                          <Input
                            className="pl-7"
                            min="0"
                            placeholder="0"
                            type="number"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.valueAsNumber);
                            }}
                            value={field.value ?? ""}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormContainer>
            </Section>

            <Section
              className="border-b-0"
              text={[
                "The minimum required funding amount for the project. This represents the base level of financing needed.",
              ]}
              title="Nominal Amount">
              <FormContainer className="">
                <FormField
                  control={form.control}
                  name="fundNominalAmount"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Nominal Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                          <Input
                            className="pl-7"
                            min="0"
                            placeholder="0"
                            type="number"
                            {...field}
                            value={field.value.toString()}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormContainer>
            </Section>

            <Section
              className="border-b-0"
              text={["If checked, the project can exceed its target funding amount."]}
              title="Over Funding">
              <FormContainer className="">
                <FormField
                  control={form.control}
                  name="overFunding"
                  render={({field}) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value || false} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Allow over funding</FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormContainer>
            </Section>

            <Section
              className="border-b-0"
              text={[
                "Additional funding rate. Defines the extra percentage that can be added to the total fundable amount.",
              ]}
              title="Additional Funds Rate">
              <FormContainer className="">
                <FormField
                  control={form.control}
                  name="additionalFundRate"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Additional Fund Rate</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                          <Input className="pl-7" placeholder="0" type="text" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormContainer>
            </Section>
            <Section
              className="border-b-0"
              text={["Qualified funding rate for qualified investors who are allowed to invest in the project."]}
              title="Qualified Funds Rate">
              <FormContainer className="">
                <FormField
                  control={form.control}
                  name="qualifiedFundRate"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Qualified Fund Rate</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                          <Input className="pl-7" placeholder="0" type="text" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormContainer>
            </Section>

            <Section text={["Write a clear, brief description of the privileges."]} title="Privilege">
              <FormContainer>
                <FormField
                  control={form.control}
                  name="privilege"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Privilege</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormContainer>
            </Section>

            <Section
              text={[
                "Determine the various costs to bring your project to life with our Google Sheets template.",
                "We’ll have access to your document, but we will never share your information with others.",
              ]}
              title="Project budget BETA(optional)">
              <FormContainer className="">
                <BudgetCard />
              </FormContainer>
            </Section>
            <Button className="w-full" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </section>
    </div>
  );
}
