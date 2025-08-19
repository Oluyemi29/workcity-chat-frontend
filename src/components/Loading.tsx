import { Card, Skeleton } from "@heroui/react";

const Loading = () => {
  return (
    <div className="w-full flex flex-row justify-center mt-20">
      <Card className="w-[80%] md:w-3/6 lg:w-2/6 space-y-5 p-4" radius="lg">
        <Skeleton className="rounded-lg">
          <div className="h-[12rem] rounded-lg bg-default-300" />
        </Skeleton>
        <div className="space-y-3">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-10 w-3/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-10 w-4/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-10 w-2/5 rounded-lg bg-default-300" />
          </Skeleton>
        </div>
      </Card>
    </div>
  );
};

export default Loading;
