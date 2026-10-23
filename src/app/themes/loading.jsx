export default function Loading() {
  return (
    <div className="min-h-screen bg-[#09090B] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="h-12 w-64 bg-white/5 rounded-lg mx-auto mb-6 animate-pulse"></div>
        <div className="h-6 w-96 bg-white/5 rounded-lg mx-auto mb-12 animate-pulse"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[#121214] border border-white/5 rounded-[2rem] p-3 animate-pulse">
              <div className="h-56 bg-white/5 rounded-[1.5rem] mb-4"></div>
              <div className="h-4 w-3/4 bg-white/5 rounded mb-2 px-3"></div>
              <div className="h-4 w-1/2 bg-white/5 rounded mb-4 px-3"></div>
              <div className="flex gap-2 px-3 mb-2">
                <div className="flex-1 h-10 bg-white/5 rounded-xl"></div>
                <div className="flex-1 h-10 bg-white/5 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}