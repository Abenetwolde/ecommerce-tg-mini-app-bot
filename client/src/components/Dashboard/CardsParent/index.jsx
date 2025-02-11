import React from "react";
import UniqueVisitorsCard from "./UniqueVisitorsCard";
import ViewsCard from "./ViewsCard";
import AverageTimeCard from "./AverageTimeCard";
import BounceRateCard from "./BounceRateCard";

const CardsParent = ({data}) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
     <UniqueVisitorsCard data={data?.uniqueVisitors} />
            <ViewsCard data={data?.totalPageViews} />
            <AverageTimeCard data={data?.averageTime} />
            <BounceRateCard data={data?.bounceRate} />
    </div>
  );
};

export default CardsParent;