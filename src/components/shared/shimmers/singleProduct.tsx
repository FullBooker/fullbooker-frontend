const SingleProductSkeleton = () => {
    return (
      <div className="max-w-sm rounded-2xl shadow-lg bg-white overflow-hidden animate-pulse">
        {/* Image Section */}
        <div className="relative bg-gray-300 h-48 w-full"></div>
  
        {/* Details Section */}
        <div className="p-4">
          <div className="w-full bg-gray-300 h-10 rounded-lg"></div>
  
          <div className="mt-4 space-y-2">
            <div className="w-3/4 bg-gray-300 h-4 rounded"></div>
            <div className="w-5/6 bg-gray-300 h-4 rounded"></div>
            <div className="w-2/3 bg-gray-300 h-4 rounded"></div>
            <div className="w-1/2 bg-gray-300 h-6 rounded mt-2"></div>
          </div>
        </div>
      </div>
    );
  };
  
  export default SingleProductSkeleton;
  