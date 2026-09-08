import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';

export interface SelectOption {
  id: string | number;
  title: string;
  subtitle?: string;
  raw?: any;
}

interface SearchSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (option: SelectOption) => void;
  title?: string;
  placeholder?: string;
  options: SelectOption[];
  selectedValue?: string | number;
}

export const SearchSelectModal: React.FC<SearchSelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  placeholder = 'Search...',
  options,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const q = searchTerm.toLowerCase();
    return options.filter(
      opt =>
        opt.title.toLowerCase().includes(q) ||
        (opt.subtitle && opt.subtitle.toLowerCase().includes(q))
    );
  }, [options, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={placeholder}
              autoFocus
              className="w-full pl-11 pr-10 py-3 bg-white border-2 border-[#FF9800] rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none text-base"
            />
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="absolute right-3 text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Options List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onSelect(option);
                  onClose();
                }}
                className="w-full text-left px-5 py-4 hover:bg-orange-50/50 active:bg-orange-100/60 transition-colors flex flex-col gap-1"
              >
                <span className="font-bold text-gray-900 text-base uppercase tracking-wide">
                  {option.title}
                </span>
                {option.subtitle && (
                  <span className="text-xs font-medium text-gray-500 tracking-wider">
                    {option.subtitle}
                  </span>
                )}
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">
              No matching records found
            </div>
          )}

          {/* End of list text matching screenshot */}
          <div className="py-4 text-center text-xs text-gray-400 font-medium">
            No more items to load
          </div>
        </div>
      </div>
    </div>
  );
};
