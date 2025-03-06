const CardCampaignRowLoading = ({ isShowStatistics = false }) => {
  return (
    <>
      <div className="card p-5 lg:p-7.5">
        <div className="flex items-center flex-wrap justify-between gap-5 animate-pulse">
          {/* Logo Placeholder */}
          <div className="flex items-center gap-3.5">
            <div className="flex items-center justify-center w-[50px] h-[50px] bg-gray-300 rounded-full"></div>

            <div className="">
              {/* Title Placeholder */}
              <div className="h-5 w-36 bg-gray-300 rounded mb-2"></div>
              {/* Description Placeholder */}
              <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
          </div>

          <div className="flex items-center flex-wrap justify-between gap-5 lg:gap-12">
            {/* Statistics Placeholder */}
            {isShowStatistics ? (
              <div className="flex items-center flex-wrap gap-2 lg:gap-5">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="h-4 w-16 bg-gray-300 rounded"></div>
                ))}
              </div>
            ) : null}

            {/* Badge Placeholder */}
            <div className="flex justify-center w-20">
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardCampaignRowLoading;
