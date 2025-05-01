"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";

export function MarketplaceMessageDialog({
  listing,
  seller,
  trigger = <Button>Contact Seller</Button>,
}) {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);

  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleSendMessage = async () => {
    if (!user) {
      router.push(`/auth/login?redirect=/marketplace/${listing.id}`);
      return;
    }

    if (!message.trim()) {
      setError("Please enter a message");
      return;
    }

    setSending(true);
    setError(null);

    try {
      // In a real app, we would send this to the API to create a conversation
      // For now, we'll just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // This would be the real implementation:
      // const { data, error } = await supabase
      //   .from('marketplace_conversations')
      //   .insert({
      //     listing_id: listing.id,
      //     buyer_id: user.id,
      //     seller_id: seller.id,
      //     created_at: new Date().toISOString()
      //   })
      //   .select();

      // if (error) throw error;

      // const { error: messageError } = await supabase
      //   .from('marketplace_messages')
      //   .insert({
      //     conversation_id: data[0].id,
      //     sender_id: user.id,
      //     content: message,
      //     created_at: new Date().toISOString()
      //   });

      // if (messageError) throw messageError;

      setSuccess(true);
      setMessage("");

      // Close dialog after a delay
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to send message:", err);
      setError(
        "An error occurred while sending your message. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Seller</DialogTitle>
          <DialogDescription>
            Send a message to the seller about this project
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-4 py-4">
          {seller && (
            <>
              <Avatar>
                <AvatarImage src={seller.avatar_url} alt={seller.full_name} />
                <AvatarFallback>{getInitials(seller.full_name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{seller.full_name}</p>
                <p className="text-sm text-muted-foreground">
                  {seller.sales_count
                    ? `${seller.sales_count} successful ${
                        seller.sales_count === 1 ? "sale" : "sales"
                      }`
                    : "New seller"}
                </p>
              </div>
            </>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="my-2">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 text-green-700 border-green-200 my-2">
            <AlertDescription>
              Message sent successfully! The seller will be in touch soon.
            </AlertDescription>
          </Alert>
        )}

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Hi, I'm interested in your "${
            listing.title || listing.projects?.name
          }" project. I'd like to know more about...`}
          className="min-h-32"
          disabled={sending || success}
        />

        <p className="text-xs text-muted-foreground">
          Be specific about what you'd like to know. Ask about revenue, users,
          technical details, or any other important information.
        </p>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={sending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={sending || success || !message.trim()}
          >
            {sending ? (
              "Sending..."
            ) : (
              <>
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function MarketplaceInterestedButton({ listing }) {
  const { user } = useAuth();
  const router = useRouter();
  const [interested, setInterested] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInterested = async () => {
    if (!user) {
      router.push(`/auth/login?redirect=/marketplace/${listing.id}`);
      return;
    }

    setLoading(true);

    try {
      // In a real app, we would send this to the API
      // For now, we'll just toggle the state
      await new Promise((resolve) => setTimeout(resolve, 500));

      // This would be the real implementation:
      // const supabase = createClient();
      // if (!interested) {
      //   const { error } = await supabase
      //     .from('marketplace_interests')
      //     .insert({
      //       listing_id: listing.id,
      //       user_id: user.id,
      //       created_at: new Date().toISOString()
      //     });
      //
      //   if (error) throw error;
      // } else {
      //   const { error } = await supabase
      //     .from('marketplace_interests')
      //     .delete()
      //     .eq('listing_id', listing.id)
      //     .eq('user_id', user.id);
      //
      //   if (error) throw error;
      // }

      setInterested(!interested);
    } catch (err) {
      console.error("Failed to update interest:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={interested ? "default" : "outline"}
      className="flex items-center"
      onClick={handleInterested}
      disabled={loading}
    >
      {interested ? "Interested" : "I'm Interested"}
    </Button>
  );
}
