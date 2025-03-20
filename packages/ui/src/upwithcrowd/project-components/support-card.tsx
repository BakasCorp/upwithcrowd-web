"use client";
import {Button} from "@repo/ayasofyazilim-ui/atoms/button";
import {Card, CardContent, CardFooter} from "@repo/ayasofyazilim-ui/atoms/card";
import {Wallet} from "lucide-react";
import {Input} from "@repo/ayasofyazilim-ui/atoms/input";
import {formatCurrency} from "@repo/ui/utils";

export default function SupportCard({
  donationOptions,
  selectedDonation,
  setSelectedDonation,
  customAmount,
  handleCustomAmountChange,
  onDonate,
  isLoading,
}: {
  donationOptions: number[];
  selectedDonation: number;
  setSelectedDonation: (amount: number) => void;
  customAmount: string;
  handleCustomAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDonate: (amount: number) => Promise<void>;
  isLoading: boolean;
}) {
  return (
    <Card className="border-none bg-transparent p-0 p-4 pb-6 shadow-none md:p-0 md:pb-0">
      <CardContent className="p-0">
        <h3 className="mb-4 text-xl font-semibold">Bu projeye destek ol</h3>
        <div className="mb-4 grid grid-cols-3 gap-4">
          {donationOptions.map((amount) => (
            <Button
              key={amount}
              onClick={() => {
                setSelectedDonation(amount);
              }}
              variant={selectedDonation === amount ? "default" : "outline"}>
              {formatCurrency(amount)}
            </Button>
          ))}
        </div>
        <div className="relative mb-4">
          <Wallet className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            className="pl-9"
            onChange={handleCustomAmountChange}
            placeholder="Özel miktar girin"
            type="text"
            value={customAmount}
          />
        </div>
      </CardContent>
      <CardFooter className="p-0">
        <Button className="w-full" disabled={isLoading} onClick={() => void onDonate(selectedDonation)}>
          {isLoading ? "İşleniyor..." : `${formatCurrency(selectedDonation)} Bağış Yap`}
        </Button>
      </CardFooter>
    </Card>
  );
}
