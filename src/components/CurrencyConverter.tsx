import { useState, useEffect } from "react";
import { ArrowRightLeft, RefreshCw, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const currencies = [
  { code: "NPR", name: "Nepalese Rupee", flag: "🇳🇵" },
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "THB", name: "Thai Baht", flag: "🇹🇭" },
];

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("NPR");
  const [result, setResult] = useState<string | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const convert = async () => {
    if (!amount || isNaN(Number(amount))) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("currency-converter", {
        body: { from, to, amount: Number(amount) },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setResult(data.converted);
      setRate(data.rate);
    } catch (err: any) {
      toast({ title: "Conversion failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    convert();
  }, [from, to]);

  const swap = () => {
    setFrom(to);
    setTo(from);
    setResult(null);
  };

  const fromCurrency = currencies.find((c) => c.code === from);
  const toCurrency = currencies.find((c) => c.code === to);

  return (
    <section className="section-padding bg-gradient-to-b from-secondary/50 to-background">
      <div className="container-wide">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <TrendingUp className="h-4 w-4" />
            Live Exchange Rates
          </span>
          <h2 className="heading-section text-foreground">Currency Converter</h2>
          <p className="text-body-large text-muted-foreground mt-3 max-w-2xl mx-auto">
            Convert your currency to Nepalese Rupees instantly for your trip planning
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="glass-effect rounded-2xl p-6 md:p-8 shadow-card">
            {/* Amount Input */}
            <div className="mb-6">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Amount</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-2xl font-semibold h-14 bg-background/50 border-border"
                min="0"
                step="any"
              />
            </div>

            {/* Currency Selectors */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">From</label>
                <Select value={from} onValueChange={setFrom}>
                  <SelectTrigger className="h-12 bg-background/50">
                    <SelectValue>
                      <span className="flex items-center gap-2">
                        {fromCurrency?.flag} {from}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        <span className="flex items-center gap-2">
                          {c.flag} {c.code} — {c.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={swap}
                className="mt-6 rounded-full h-10 w-10 border-accent/30 hover:bg-accent/10 hover:border-accent shrink-0"
              >
                <ArrowRightLeft className="h-4 w-4 text-accent" />
              </Button>

              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">To</label>
                <Select value={to} onValueChange={setTo}>
                  <SelectTrigger className="h-12 bg-background/50">
                    <SelectValue>
                      <span className="flex items-center gap-2">
                        {toCurrency?.flag} {to}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        <span className="flex items-center gap-2">
                          {c.flag} {c.code} — {c.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Convert Button */}
            <Button
              onClick={convert}
              disabled={loading}
              className="w-full h-12 btn-accent text-lg font-semibold rounded-xl"
            >
              {loading ? (
                <RefreshCw className="h-5 w-5 animate-spin mr-2" />
              ) : null}
              {loading ? "Converting..." : "Convert"}
            </Button>

            {/* Result */}
            {result && rate && (
              <div className="mt-6 p-5 rounded-xl bg-primary/5 border border-primary/10">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    {fromCurrency?.flag} {amount} {from} =
                  </p>
                  <p className="text-3xl md:text-4xl font-bold text-foreground font-display">
                    {toCurrency?.flag} {Number(result).toLocaleString()} {to}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    1 {from} = {rate.toFixed(4)} {to}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrencyConverter;
