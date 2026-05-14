import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { cn } from "../../lib/utils";
import { Search, ChevronDown, Check, X } from "lucide-react";

const ComboboxContext = createContext(null);

export const Combobox = ({
  placeholder = "Search...",
  value,
  onChange,
  disabled = false,
  errored = false,
  width,
  size = "medium",
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [_value, set_value] = useState(value || "");
  const [options, setOptions] = useState([]);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsSearching(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onChangeInputValue = (val) => {
    setInputValue(val);
  };

  const onChangeValue = (val) => {
    set_value(val);
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <ComboboxContext.Provider value={{
      isOpen,
      setIsOpen,
      placeholder,
      inputValue,
      onChangeInputValue,
      isSearching,
      setIsSearching,
      disabled,
      errored,
      size,
      value: _value,
      onChangeValue,
      options,
      setOptions,
      inputRef
    }}>
      <div
        ref={containerRef}
        className="relative w-full inline-block text-sm font-sans"
        style={{ width }}
      >
        {children}
      </div>
    </ComboboxContext.Provider>
  );
};

const ComboboxInput = () => {
  const context = useContext(ComboboxContext);
  const [_errored, set_errored] = useState(context?.errored || false);

  const onFocus = () => {
    context?.setIsOpen(true);
    set_errored(false);
  };

  const onBlur = () => {
    // We delay the blur closing to allow for clicks on options
    // Actually, we use containerRef and handleClickOutside now
  };

  const onCloseClick = (e) => {
    e.stopPropagation();
    context?.onChangeInputValue("");
    context?.onChangeValue("");
    context?.setIsSearching(true);
  };

  useEffect(() => {
    const currentOption = context?.options.find((option) => option.value === context.value);
    if (currentOption) {
      context?.onChangeInputValue(currentOption.label);
    }
  }, [context?.options, context?.value]);

  useEffect(() => {
    set_errored(context?.errored || false);
  }, [context?.errored]);

  return (
    <div className="relative group">
        <Input
            prefix={<Search className="w-4 h-4 text-zinc-400" />}
            onFocus={onFocus}
            onBlur={onBlur}
            value={context?.inputValue}
            onChange={(e) => {
                context?.onChangeInputValue(e.target.value);
                context?.setIsSearching(true);
            }}
            disabled={context?.disabled}
            error={_errored}
            size={context?.size}
            ref={context?.inputRef}
            placeholder={context?.placeholder}
            className={cn(
                "pr-10 rounded-xl border-zinc-200 dark:border-zinc-800",
                context?.errored && "text-red-900 border-red-500"
            )}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {context?.inputValue && (
                <button
                    type="button"
                    onClick={onCloseClick}
                    className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                    <X className={cn("w-3 h-3 text-zinc-400", context?.errored && "text-red-900")} />
                </button>
            )}
            <ChevronDown className={cn("w-4 h-4 text-zinc-400 transition-transform duration-200", context?.isOpen && "rotate-180")} />
        </div>
    </div>
  );
};

const ComboboxList = ({ children, maxWidth, emptyMessage = "No results" }) => {
  const context = useContext(ComboboxContext);
  const menuRef = useRef(null);

  const filteredChildren = React.Children.toArray(children).filter((child) => {
    if (React.isValidElement(child)) {
      if (!context?.isSearching) return true;
      return child.props.children?.toString().toLowerCase().includes(context?.inputValue?.toLowerCase() || "");
    }
    return false;
  });

  useEffect(() => {
    const options = React.Children.toArray(children)
      .map((child) => {
        if (React.isValidElement(child)) {
          return {
            value: child.props.value,
            label: child.props.children?.toString() || ""
          };
        }
        return undefined;
      })
      .filter((option) => option !== undefined && option.label !== "");
    context?.setOptions(options);
  }, [children]);

  if (!context?.isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={cn(
        "absolute w-full z-50 left-0 top-full mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-2 max-h-[300px] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
      )}
      style={{ maxWidth }}
    >
      <ul>
        {filteredChildren.length > 0 ? filteredChildren : (
          <li className={cn(
            "flex justify-center items-center p-4 text-zinc-500",
            context?.size === "large" ? "text-base" : "text-xs italic"
          )}>
            {emptyMessage}
          </li>
        )}
      </ul>
    </div>
  );
};

const ComboboxOption = ({ value, children }) => {
  const context = useContext(ComboboxContext);

  const onClick = () => {
    context?.onChangeValue(value);
    context?.onChangeInputValue(children?.toString() || "");
    context?.setIsOpen(false);
    context?.setIsSearching(false);
  };

  const isSelected = value === context?.value;

  return (
    <li
      className={cn(
        "flex justify-between items-center gap-2 cursor-pointer px-3 py-2.5 w-full rounded-xl transition-colors",
        isSelected ? "bg-indigo-500/10 text-indigo-600 font-bold" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300",
        context?.size === "large" ? "text-base" : "text-sm"
      )}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {children}
      {isSelected && <Check className="w-4 h-4" />}
    </li>
  );
};

Combobox.Input = ComboboxInput;
Combobox.List = ComboboxList;
Combobox.Option = ComboboxOption;
