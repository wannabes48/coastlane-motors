import AnimatedLoadingSkeleton from "@/components/ui/animated-loading-skeleton";

export default function Loading() {
    return (
        <div className="bg-[#F0F6FF] min-h-screen py-16 flex items-center justify-center">
            <AnimatedLoadingSkeleton />
        </div>
    );
}
