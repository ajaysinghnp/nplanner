export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <section className="w-full max-w-2xl text-center">
        <p className="mb-4 text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
          Organization Planning and Event Management
        </p>

        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          NPlanner
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
          A multi-organization planning, scheduling, event management, and
          approval platform.
        </p>

        <div className="mt-10">
          <span className="rounded-full border border-border bg-muted px-4 py-2 text-sm text-muted-foreground">
            Project foundation is under development
          </span>
        </div>
      </section>
    </main>
  );
}