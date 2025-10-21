import React from "react";
import { Property } from "./Property";

/**
 * Properties that define an option for a {@link ComboButton}.
 */
interface ComboButtonOptionProperties
{
  /**
   * The label that will be displayed for the option.
   */
  readonly label: string;

  /**
   * {@link function} that is invoked when this option is selected (not when this option is
   * invoked).
   */
  readonly onSelected: () => (void | Promise<void>);
}

/**
 * Properties that define a {@link ComboButton}
 */
interface ComboButtonProps
{
  /**
   * The {@link Function} that is invoked when the {@link ComboButton} is clicked.
   */
  readonly onClick: () => (void | Promise<void>);
  /**
   * The options that can be selected in the {@link ComboButton}.
   */
  readonly options: ComboButtonOptionProperties[];
};

export function ComboButton(props: ComboButtonProps) {
  const dropDownOpen = Property.create(false);
  const width = Property.create<number | undefined>(undefined);
  const selectedOptionIndex = Property.create<number>(0);
  const groupRef = React.useRef<HTMLDivElement>(null);

  console.log(`selectedOptionIndex.value: ${selectedOptionIndex.value}`)

  React.useLayoutEffect(() => {
    if (groupRef.current) {
      width.set(groupRef.current.offsetWidth);
    }
  }, [dropDownOpen.value, props.options.length, width]);

  // Invoke the default option's onSelected event on first render.
  React.useEffect(() =>
  {
    props.options[selectedOptionIndex.value].onSelected();
  }, [selectedOptionIndex, props.options]);

  // Close dropdown on outside click
  React.useEffect(() =>
  {
    if (!dropDownOpen.value)
    {
      return;
    }
    function handleClick(event: MouseEvent) {
      if (groupRef.current && !groupRef.current.contains(event.target as Node)) {
        dropDownOpen.set(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropDownOpen]);

  return (
    <div className="relative inline-flex" ref={groupRef}>
      {/* Main button */}
      <button
        onClick={props.onClick}
        className="px-4 py-2 text-white bg-[#c07b29] hover:bg-[#945F21] active:bg-[#83541D] rounded-l focus:outline-none"
      >
        {props.options[selectedOptionIndex.value].label}
      </button>
      <button
        onClick={() => dropDownOpen.set((open: boolean) => !open)}
        className="w-12 px-2 text-white bg-[#c07b29] hover:bg-[#945F21] active:bg-[#83541D] border-l border-[#945F21] rounded-r focus:outline-none"
        aria-haspopup="true"
        aria-expanded={dropDownOpen.value}
      >
        ▼
      </button>
      {dropDownOpen.value && (
        <div
          className="absolute right-0 z-10 mt-10 bg-white border border-gray-400 rounded shadow-lg"
          style={width.value ? { width: width.value } : undefined}
        >
          {props.options
            .map((option: ComboButtonOptionProperties, optionIndex: number) =>
            {
              return optionIndex === selectedOptionIndex.value
                ? undefined
                : <button
                  key={optionIndex}
                  onClick={() =>
                  {
                    console.log(`Closing drop down, setting selectedOptionIndex to ${optionIndex}`)
                    dropDownOpen.set(false);
                    selectedOptionIndex.set(optionIndex);
                    option.onSelected();
                  }}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  {option.label}
                </button>;
            })
          }
        </div>
      )}
    </div>
  );
}