import Link from "next/link";
import { FileText, MessageSquare, History, ArrowRight, Upload, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center">
              <FileText className="h-4 w-4 text-background" />
            </div>
            <span className="font-semibold text-lg">DocChat</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/signin">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-muted/50 text-sm text-muted-foreground mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            <span>Powered by advanced AI</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 animate-fade-in delay-100">
            Have a conversation
            <br />
            <span className="text-muted-foreground">with your documents</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in delay-200">
            Upload any document and start chatting instantly. Get insights, summaries, 
            and answers without reading through pages of content.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-300">
            <Link href="/signup">
              <Button size="lg" className="min-w-[180px]">
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="outline" size="lg" className="min-w-[180px]">
                Sign in to continue
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Supported Formats */}
      <section className="py-12 px-6 border-y bg-muted/30">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Works with your favorite document formats
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              { name: "PDF", icon: "📄" },
              { name: "Word", icon: "📝" },
              { name: "Markdown", icon: "📋" },
              { name: "Text", icon: "📃" },
            ].map((format) => (
              <div
                key={format.name}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background border shadow-sm"
              >
                <span className="text-xl">{format.icon}</span>
                <span className="font-medium">{format.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Three simple steps
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              From upload to insights in seconds. No complicated setup required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Upload,
                title: "Upload your document",
                description:
                  "Drag and drop or browse to upload your PDF, Word document, Markdown, or text file.",
              },
              {
                step: "02",
                icon: MessageSquare,
                title: "Start a conversation",
                description:
                  "Ask questions, request summaries, or explore specific topics from your document.",
              },
              {
                step: "03",
                icon: Sparkles,
                title: "Get instant answers",
                description:
                  "Receive accurate, context-aware responses based on your document's content.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative p-8 rounded-2xl border bg-background hover:shadow-lg transition-shadow duration-300"
              >
                <span className="absolute top-6 right-6 text-5xl font-bold text-muted/50">
                  {item.step}
                </span>
                <div className="h-12 w-12 rounded-xl bg-foreground flex items-center justify-center mb-6">
                  <item.icon className="h-6 w-6 text-background" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for productivity
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Everything you need to work smarter with your documents.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: MessageSquare,
                title: "Natural conversations",
                description: "Chat naturally as if you were talking to a colleague who read the entire document.",
              },
              {
                icon: History,
                title: "Chat history",
                description: "Access all your previous conversations. Pick up right where you left off.",
              },
              {
                icon: Shield,
                title: "Private & secure",
                description: "Your documents are processed securely and never shared with third parties.",
              },
              {
                icon: Sparkles,
                title: "Smart context",
                description: "AI understands the full context of your document for accurate responses.",
              },
              {
                icon: FileText,
                title: "Multiple formats",
                description: "Support for PDF, DOCX, Markdown, and plain text files out of the box.",
              },
              {
                icon: ArrowRight,
                title: "Instant processing",
                description: "Documents are processed in seconds, ready for conversation immediately.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border bg-background hover:shadow-md transition-shadow duration-300"
              >
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to chat with your documents?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users who are already saving hours of reading time.
          </p>
          <Link href="/signup">
            <Button size="lg" className="min-w-[200px]">
              Get started for free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-foreground flex items-center justify-center">
              <FileText className="h-3 w-3 text-background" />
            </div>
            <span className="font-medium">DocChat</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 DocChat. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
