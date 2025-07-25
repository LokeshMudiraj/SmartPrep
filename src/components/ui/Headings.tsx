import { cn } from "@/lib/utils"

type HeadingsProps = {
    title: string,
    description?: string,
    isSubHeading?: boolean,
}
const Headings = ({ title, description, isSubHeading = false }: HeadingsProps) => {
    return (
        <div>
            <h2 className={cn(" text-2xl  font-bold md:text-3xl text-gray-800 font-sans ", isSubHeading && "text-lg md:text-xl")}>
                {title}
            </h2>
            {description && (
                <p className="text-xs md:text-sm text-muted-foreground">
                    {description}
                </p>
            )}

        </div>
    )
}

export default Headings
