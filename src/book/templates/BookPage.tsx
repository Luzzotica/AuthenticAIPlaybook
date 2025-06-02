"use client";

interface BookPageProps {
  backgroundImage?: string;
  backgroundAnimation?: React.ReactNode;
  children: React.ReactNode;
}

export default function BookPage({
  backgroundImage,
  backgroundAnimation,
  children,
}: BookPageProps) {
  return (
    <div className="relative w-full min-h-screen">
      {/* Parallax Background */}
      {backgroundImage && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center -z-10"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundAttachment: "fixed",
          }}
        />
      )}
      {/* Background Animation */}
      {backgroundAnimation && (
        <div className="absolute inset-0 pointer-events-none -z-10">
          {backgroundAnimation}
        </div>
      )}
      {/* Scrollable Text Area */}
      <div className="relative z-10 max-w-2xl mx-auto py-16 px-4 min-h-screen">
        {children}
      </div>
    </div>
  );
}
