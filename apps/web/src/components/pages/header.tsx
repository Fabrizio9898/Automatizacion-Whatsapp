
export default function Header({title,description}:{title: string; description: string}) {
return (
  <header className="border-b border-border bg-card/50  py-5 ">
    <div className="flex flex-col gap-1">
      <h1 className="text-balance text-2xl font-semibold text-foreground sm:text-[1.65rem]">
        {title}
      </h1>
      <p className="max-w-2xl text-pretty text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  </header>
);
}
