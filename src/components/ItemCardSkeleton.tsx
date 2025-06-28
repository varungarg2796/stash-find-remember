
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ItemCardSkeletonProps {
  viewMode?: "grid" | "list";
  index?: number;
}

const ItemCardSkeleton = ({ viewMode = "grid", index = 0 }: ItemCardSkeletonProps) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2 + (index * 0.1),
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  if (viewMode === "list") {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <motion.div 
              className="flex items-start gap-4"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Skeleton className="w-16 h-16 rounded flex-shrink-0" />
              </motion.div>
              <div className="flex-1 space-y-2">
                <motion.div variants={itemVariants}>
                  <Skeleton className="h-5 w-3/4" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Skeleton className="h-4 w-1/2" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Skeleton className="h-3 w-full" />
                </motion.div>
                <motion.div variants={itemVariants} className="flex gap-2 mt-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </motion.div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="overflow-hidden">
        <motion.div 
          className="relative"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <Skeleton className="w-full h-48 rounded-t-lg" />
        </motion.div>
        <CardContent className="p-4">
          <motion.div 
            className="space-y-3"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="flex items-start justify-between">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-8 w-8 rounded" />
            </motion.div>
            <div className="space-y-2">
              <motion.div variants={itemVariants}>
                <Skeleton className="h-4 w-1/2" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Skeleton className="h-4 w-2/3" />
              </motion.div>
              <motion.div variants={itemVariants} className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </motion.div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ItemCardSkeleton;
