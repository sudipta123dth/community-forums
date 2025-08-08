"use client";

import React from "react";

const FilterQuestionTags: React.FC = () => {
  return (
    <div className="rounded-md p-3 sm:p-4 lg:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto sm:mx-4 lg:mx-0 flex flex-col gap-2 sm:gap-3 lg:gap-4">
      <div>
        <label
          htmlFor="cars"
          className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
        >
          Choice By Tags
        </label>
        <select
          name="cars"
          id="cars"
          className="mt-1 sm:mt-2 p-2 sm:p-3 w-full border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm sm:text-base font-roboto"
        >
          <option>Click to open</option>
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </select>
      </div>

      <div className="mt-2 sm:mt-3 lg:mt-4 flex flex-col gap-1 sm:gap-2">
        <div className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed break-words">
          <span className="font-medium">This is  </span>
          {/* <span className="mx-1 sm:mx-2">⇒</span> */}
          <span className="text-gray-500">community section name</span>
        </div>
      </div>
    </div>
  );
};

export default FilterQuestionTags;
