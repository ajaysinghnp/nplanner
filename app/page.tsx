export default function Home() {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-6">
      <section className="w-full max-w-2xl text-center">
        <p className="text-muted-foreground mb-4 text-sm font-medium tracking-[0.2em] uppercase">
          Organization Planning and Event Management
        </p>

        <h1 className="text-foreground text-5xl font-bold tracking-tight sm:text-6xl">NPlanner</h1>

        <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-lg leading-8">
          A multi-organization planning, scheduling, event management, and approval platform.
        </p>

        <div className="mt-10">
          <span className="border-border bg-muted text-muted-foreground rounded-full border px-4 py-2 text-sm">
            Project foundation is under development
          </span>
        </div>
      </section>
    </main>
  );
}
