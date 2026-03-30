import { MapPin, X, Filter, ChevronDown, Check, SlidersHorizontal, Sparkles, Tag } from "lucide-react";

const problemTypes = [
  "Divorce & Child Custody",
  "Property & Real Estate",
  "Cheque Bounce & Money Recovery",
  "Employment Issues",
  "Consumer Protection",
  "Civil Matters",
  "Cyber Crime",
  "Company & Start-Ups",
  "Other Legal Problem",
  "Criminal Matter",
];

export default function FilterSidebar({
  location,
  setLocation,
  selectedProblems,
  setSelectedProblems,
}) {
  const toggleProblem = (problem) => {
    if (selectedProblems.includes(problem)) {
      setSelectedProblems(selectedProblems.filter((p) => p !== problem));
    } else {
      setSelectedProblems([...selectedProblems, problem]);
    }
  };

  const clearFilters = () => {
    setLocation("");
    setSelectedProblems([]);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (location) count++;
    count += selectedProblems.length;
    return count;
  };

  return (
    <aside className="h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
              <SlidersHorizontal className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-bold text-white">Filters</h3>
          </div>
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-white/80 hover:text-white font-medium flex items-center bg-white/10 px-2 py-1 rounded-lg transition-colors"
            >
              Clear all
              <X className="h-3 w-3 ml-1" />
            </button>
          )}
        </div>
        
        {/* Active Filter Count Badge */}
        {getActiveFilterCount() > 0 && (
          <div className="mt-2 flex items-center">
            <span className="text-xs text-white/80 bg-white/10 px-2 py-1 rounded-full">
              {getActiveFilterCount()} active filter{getActiveFilterCount() > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Location Section */}
      <div className="p-4 border-b border-gray-200">
        <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center">
          <MapPin className="h-3.5 w-3.5 text-blue-600 mr-1.5" />
          Location
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Enter city or state"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 border border-gray-300 bg-white rounded-lg text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          {location && (
            <button
              onClick={() => setLocation("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-gray-100 p-1 rounded-full transition-colors"
            >
              <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        
        {/* Location Hint */}
        <p className="text-xs text-gray-400 mt-2 flex items-center">
          <Sparkles className="h-3 w-3 text-yellow-500 mr-1" />
          e.g., Mumbai, Delhi, Bangalore
        </p>
      </div>

      {/* Problem Type Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-xs font-medium text-gray-700 flex items-center">
            <Tag className="h-3.5 w-3.5 text-blue-600 mr-1.5" />
            Problem Type
          </label>
          {selectedProblems.length > 0 && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {selectedProblems.length} selected
            </span>
          )}
        </div>
        
        <div className="space-y-2 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {problemTypes.map((item, index) => {
            const isSelected = selectedProblems.includes(item);
            return (
              <label
                key={index}
                className={`flex items-center space-x-3 cursor-pointer group p-2 rounded-lg transition-all ${
                  isSelected 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleProblem(item)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'border-blue-600 bg-blue-600' 
                      : 'border-gray-300 bg-white group-hover:border-blue-400'
                  }`}>
                    {isSelected && <Check className="h-3 w-3 text-white" />}
                  </div>
                </div>
                <span className={`text-sm flex-1 ${
                  isSelected 
                    ? 'text-blue-700 font-medium' 
                    : 'text-gray-600 group-hover:text-gray-900'
                }`}>
                  {item}
                </span>
                {isSelected && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleProblem(item);
                    }}
                    className="p-1 hover:bg-blue-200 rounded-full transition-colors"
                  >
                    <X className="h-3 w-3 text-blue-600" />
                  </button>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Active Filters Summary */}
      {getActiveFilterCount() > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center">
            <Filter className="h-3.5 w-3.5 text-blue-600 mr-1.5" />
            Applied Filters
          </p>
          <div className="space-y-2">
            {location && (
              <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-blue-100 rounded">
                    <MapPin className="h-3 w-3 text-blue-600" />
                  </div>
                  <span className="text-xs text-gray-600">Location:</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-gray-900">{location}</span>
                  <button
                    onClick={() => setLocation("")}
                    className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
              </div>
            )}
            
            {selectedProblems.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-1 bg-blue-100 rounded">
                      <Tag className="h-3 w-3 text-blue-600" />
                    </div>
                    <span className="text-xs text-gray-600">Problem Types:</span>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                    {selectedProblems.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProblems.slice(0, 3).map((problem) => (
                    <span key={problem} className="inline-flex items-center px-2 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                      {problem.length > 15 ? `${problem.substring(0, 15)}...` : problem}
                      <button
                        onClick={() => toggleProblem(problem)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  ))}
                  {selectedProblems.length > 3 && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                      +{selectedProblems.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Clear Filters Button (for mobile) */}
          <button
            onClick={clearFilters}
            className="w-full mt-3 py-2.5 border border-gray-300 bg-white text-sm text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2 transition-all lg:hidden"
          >
            <X className="h-4 w-4" />
            <span>Clear all filters</span>
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="p-4 border-t border-gray-200 bg-gray-50/50">
        <div className="text-xs text-gray-500 space-y-1.5">
          <div className="flex justify-between items-center">
            <span>Total categories:</span>
            <span className="font-medium text-gray-700 bg-white px-2 py-0.5 rounded-full">
              {problemTypes.length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Active selections:</span>
            <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {selectedProblems.length}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}