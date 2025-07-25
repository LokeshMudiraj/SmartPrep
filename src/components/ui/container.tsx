import { cn } from "@/lib/utils"

type ContainerProps = {
  className?: string; 
  children: React.ReactNode;
};

const Container = ({ className, children }: ContainerProps)  => {
    return (
        <div
            className={cn("container mx-auto px-3 md:px-7 py-3 w-full", className)}>
         {children}
        </div>
    )
}

export default Container
